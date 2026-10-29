const FACILITY_FIELDS = 'id,name,city,state,country,latitude,longitude,net_count,website';

function send(res, status, body, ttl = 300) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', `public, s-maxage=${ttl}, stale-while-revalidate=86400`);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.end(JSON.stringify(body));
}

function number(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function haversine(lat1, lon1, lat2, lon2) {
  const toRad = degrees => degrees * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function parseCsv(csv, requiredHeader) {
  const rows = csv.trim().split(/\r?\n/).map(row => row.split(','));
  const headers = rows.shift();
  const requiredIndex = requiredHeader ? headers.indexOf(requiredHeader) : -1;
  const latest = [...rows].reverse().find(row => requiredIndex >= 0
    ? row[requiredIndex] !== '' && row[requiredIndex] !== undefined
    : row.some((value, index) => index && value !== ''));
  if (!headers || !latest) throw new Error('The live feed contained no usable rows.');
  return Object.fromEntries(headers.map((header, index) => [header, latest[index] ?? '']));
}

async function facilities(req, res) {
  const lat = Math.max(-85, Math.min(85, number(req.query?.lat, 37.7749)));
  const lon = Math.max(-180, Math.min(180, number(req.query?.lon, -122.4194)));
  const radiusKm = Math.max(5, Math.min(500, number(req.query?.radiusKm, 120)));
  const latDelta = radiusKm / 111;
  const lonDelta = Math.min(30, radiusKm / (111 * Math.max(0.12, Math.cos(lat * Math.PI / 180))));
  const params = new URLSearchParams({
    latitude__gte: String(Math.max(-90, lat - latDelta)),
    latitude__lte: String(Math.min(90, lat + latDelta)),
    longitude__gte: String(Math.max(-180, lon - lonDelta)),
    longitude__lte: String(Math.min(180, lon + lonDelta)),
    limit: '250',
    fields: FACILITY_FIELDS
  });
  const response = await fetch(`https://www.peeringdb.com/api/fac?${params}`, {
    headers: { Accept: 'application/json', 'User-Agent': 'Stream-of-Taru-Infrastructure-Atlas/1.0' }
  });
  if (!response.ok) throw new Error(`PeeringDB returned ${response.status}.`);
  const payload = await response.json();
  const data = (payload.data || [])
    .filter(item => Number.isFinite(item.latitude) && Number.isFinite(item.longitude))
    .map(item => ({ ...item, distanceKm: haversine(lat, lon, item.latitude, item.longitude) }))
    .filter(item => item.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 80);
  return send(res, 200, {
    query: { lat, lon, radiusKm },
    facilities: data,
    source: { name: 'PeeringDB', url: 'https://www.peeringdb.com/apidocs/' },
    limitation: 'PeeringDB maps network interconnection facilities, not every data center or private compute site.'
  }, 3600);
}

async function caiso(res) {
  const [fuelResponse, demandResponse] = await Promise.all([
    fetch('https://www.caiso.com/outlook/current/fuelsource.csv'),
    fetch('https://www.caiso.com/outlook/current/demand.csv')
  ]);
  if (!fuelResponse.ok || !demandResponse.ok) throw new Error('CAISO live feeds were unavailable.');
  const [fuel, demand] = await Promise.all([fuelResponse.text(), demandResponse.text()]);
  const latestFuel = parseCsv(fuel, 'Natural Gas');
  const latestDemand = parseCsv(demand, 'Current demand');
  const sources = Object.entries(latestFuel)
    .filter(([name]) => name !== 'Time')
    .map(([name, value]) => ({ name, mw: number(value, 0) }));
  const positiveTotal = sources.reduce((sum, source) => sum + Math.max(0, source.mw), 0);
  sources.forEach(source => { source.share = positiveTotal ? Math.max(0, source.mw) / positiveTotal : 0; });
  return send(res, 200, {
    time: latestFuel.Time,
    demandMw: number(latestDemand['Current demand'], null),
    dayAheadMw: number(latestDemand['Day ahead forecast'], null),
    sources: sources.sort((a, b) => b.mw - a.mw),
    source: { name: 'California ISO Today’s Outlook', url: 'https://www.caiso.com/todays-outlook' },
    limitation: 'Telemetry-based balancing-area mix. Imports are measured at the CAISO boundary; their originating plants are not identified in this feed.'
  }, 240);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return send(res, 405, { error: 'Method not allowed.' }, 0);
  }
  try {
    if (req.query?.mode === 'facilities') return await facilities(req, res);
    if (req.query?.mode === 'caiso') return await caiso(res);
    return send(res, 400, { error: 'Choose mode=facilities or mode=caiso.' }, 0);
  } catch (error) {
    return send(res, 502, { error: error.message || 'The upstream data source failed.' }, 30);
  }
};
