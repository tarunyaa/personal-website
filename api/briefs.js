const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const COOKIE_NAME = 'taru_briefs_key';
const DATA_ROOT = path.join(process.cwd(), 'private-data');
const AUTH_PATH = path.join(DATA_ROOT, 'auth.json');
const BRIEFS_ROOT = path.join(DATA_ROOT, 'briefs');

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
  res.end(JSON.stringify(body));
}

function readBody(req) {
  if (req.body && typeof req.body === 'object') return Promise.resolve(req.body);
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (raw.length > 16_384) reject(new Error('Request too large'));
    });
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); }
      catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}

function parseCookies(header = '') {
  return Object.fromEntries(header.split(';').map(part => {
    const index = part.indexOf('=');
    if (index < 0) return ['', ''];
    return [part.slice(0, index).trim(), decodeURIComponent(part.slice(index + 1).trim())];
  }).filter(([key]) => key));
}

function deriveKey(password, salt) {
  return crypto.scryptSync(password, Buffer.from(salt, 'base64url'), 32, {
    N: 32768,
    r: 8,
    p: 1,
    maxmem: 64 * 1024 * 1024
  });
}

function keyVerifier(key) {
  return crypto.createHmac('sha256', key)
    .update('tarunyaa-private-briefs-v1')
    .digest('base64url');
}

function safeEqual(a, b) {
  const left = Buffer.from(a || '');
  const right = Buffer.from(b || '');
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function loadAuth() {
  return JSON.parse(fs.readFileSync(AUTH_PATH, 'utf8'));
}

function verifiedCookieKey(req, auth) {
  const encoded = parseCookies(req.headers.cookie)[COOKIE_NAME];
  if (!encoded) return null;
  try {
    const key = Buffer.from(encoded, 'base64url');
    if (key.length !== 32 || !safeEqual(keyVerifier(key), auth.verifier)) return null;
    return key;
  } catch {
    return null;
  }
}

function decryptJson(filePath, key) {
  const payload = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (payload.v !== 1) throw new Error('Unsupported encrypted data version');
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    key,
    Buffer.from(payload.iv, 'base64url')
  );
  decipher.setAuthTag(Buffer.from(payload.tag, 'base64url'));
  const cleartext = Buffer.concat([
    decipher.update(Buffer.from(payload.ciphertext, 'base64url')),
    decipher.final()
  ]);
  return JSON.parse(cleartext.toString('utf8'));
}

module.exports = async function handler(req, res) {
  if (!fs.existsSync(AUTH_PATH)) {
    return send(res, 503, { error: 'Private briefs have not been initialized.' });
  }

  const auth = loadAuth();

  if (req.method === 'POST') {
    try {
      const body = await readBody(req);
      if (typeof body.password !== 'string' || body.password.length < 6) {
        return send(res, 400, { error: 'Enter the private reading-room password.' });
      }
      const key = deriveKey(body.password, auth.salt);
      if (!safeEqual(keyVerifier(key), auth.verifier)) {
        return send(res, 401, { error: 'That password did not match.' });
      }
      res.setHeader('Set-Cookie', `${COOKIE_NAME}=${encodeURIComponent(key.toString('base64url'))}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000`);
      return send(res, 200, { ok: true });
    } catch (error) {
      return send(res, 400, { error: error.message || 'Could not sign in.' });
    }
  }

  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`);
    return send(res, 200, { ok: true });
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, POST, DELETE');
    return send(res, 405, { error: 'Method not allowed.' });
  }

  const key = verifiedCookieKey(req, auth);
  if (!key) return send(res, 401, { error: 'Sign in to read private briefs.' });

  const slug = String(req.query?.slug || 'manifest');
  if (!/^(manifest|\d{4}-\d{2}-\d{2}-(morning|midday))$/.test(slug)) {
    return send(res, 400, { error: 'Invalid brief identifier.' });
  }

  const filePath = slug === 'manifest'
    ? path.join(BRIEFS_ROOT, 'manifest.enc.json')
    : path.join(BRIEFS_ROOT, `${slug}.enc.json`);

  if (!fs.existsSync(filePath)) return send(res, 404, { error: 'Brief not found.' });

  try {
    return send(res, 200, decryptJson(filePath, key));
  } catch {
    return send(res, 500, { error: 'The encrypted brief could not be opened.' });
  }
};
