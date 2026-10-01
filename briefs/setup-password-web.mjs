#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataRoot = path.join(root, 'private-data');
const briefsRoot = path.join(dataRoot, 'briefs');
const authPath = path.join(dataRoot, 'auth.json');
const manifestPath = path.join(briefsRoot, 'manifest.enc.json');
const token = crypto.randomBytes(24).toString('base64url');

if (fs.existsSync(authPath)) {
  console.error('Private briefs are already initialized.');
  process.exit(1);
}

const page = (message = '') => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Set private reading-room password</title>
<style>*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:#faf9f6;color:#22201d;font:16px/1.55 Georgia,serif}.card{width:min(440px,calc(100% - 40px))}h1{font-size:38px;line-height:1.1;font-weight:400;margin:0 0 14px}p{color:#746e66}label{display:block;margin:18px 0 6px;font:12px Arial,sans-serif;color:#746e66}input{width:100%;padding:13px;border:1px solid #ddd6cc;border-radius:6px;background:#fff;font:16px Arial,sans-serif}button{margin-top:20px;padding:12px 18px;border:0;border-radius:6px;background:#22201d;color:#fff;font:14px Arial,sans-serif}.note{font-size:13px}.error{color:#a3382e}</style></head>
<body><main class="card"><h1>Choose your private password.</h1><p>This page runs only on your Mac. The password will not be saved or sent to the internet.</p>
${message ? `<p class="error">${message}</p>` : ''}
<form method="post" action="/setup/${token}"><label for="password">Password or passphrase</label><input id="password" name="password" type="password" minlength="6" autocomplete="new-password" required autofocus><label for="confirmation">Enter it again</label><input id="confirmation" name="confirmation" type="password" minlength="6" autocomplete="new-password" required><button type="submit">Create private reading room</button></form><p class="note">Six characters are allowed. A longer passphrase is safer because the encrypted archive will be publicly downloadable.</p></main></body></html>`;

function deriveKey(password, salt) {
  return crypto.scryptSync(password, salt, 32, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
}

function verifier(key) {
  return crypto.createHmac('sha256', key).update('tarunyaa-private-briefs-v1').digest('base64url');
}

function encryptJson(value, key) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(value), 'utf8'), cipher.final()]);
  return { v: 1, iv: iv.toString('base64url'), ciphertext: ciphertext.toString('base64url'), tag: cipher.getAuthTag().toString('base64url') };
}

function respond(res, status, html) {
  res.writeHead(status, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
    'X-Content-Type-Options': 'nosniff'
  });
  res.end(html);
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === `/setup/${token}`) return respond(res, 200, page());
  if (req.method !== 'POST' || req.url !== `/setup/${token}`) return respond(res, 404, '<h1>Not found</h1>');

  let raw = '';
  req.on('data', chunk => {
    raw += chunk;
    if (raw.length > 8192) req.destroy();
  });
  req.on('end', () => {
    try {
      const form = new URLSearchParams(raw);
      const password = form.get('password') || '';
      const confirmation = form.get('confirmation') || '';
      if (password.length < 6) return respond(res, 400, page('Please use at least 6 characters.'));
      if (password !== confirmation) return respond(res, 400, page('The two entries did not match.'));

      const salt = crypto.randomBytes(16);
      const key = deriveKey(password, salt);
      fs.mkdirSync(briefsRoot, { recursive: true });
      fs.writeFileSync(authPath, JSON.stringify({ v: 1, salt: salt.toString('base64url'), verifier: verifier(key) }, null, 2) + '\n', { mode: 0o644 });
      fs.writeFileSync(manifestPath, JSON.stringify(encryptJson({ briefs: [] }, key), null, 2) + '\n', { mode: 0o644 });
      execFileSync('security', ['add-generic-password', '-U', '-a', 'publisher', '-s', 'tarunyaa-private-briefs', '-w', key.toString('base64url')], { stdio: 'ignore' });

      respond(res, 200, '<!doctype html><meta charset="utf-8"><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#faf9f6;color:#22201d;font:22px Georgia,serif}p{color:#746e66}</style><main><h1>Private reading room created.</h1><p>You can return to Codex. Your password was not saved.</p></main>');
      setTimeout(() => server.close(), 1500);
    } catch {
      respond(res, 500, page('Setup could not be completed. Return to Codex for help.'));
    }
  });
});

server.listen(0, '127.0.0.1', () => {
  const address = server.address();
  console.log(`http://127.0.0.1:${address.port}/setup/${token}`);
});
