#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataRoot = path.join(root, 'private-data');
const briefsRoot = path.join(dataRoot, 'briefs');
const authPath = path.join(dataRoot, 'auth.json');
const manifestPath = path.join(briefsRoot, 'manifest.enc.json');
const service = 'tarunyaa-private-briefs';
const account = 'publisher';

function hiddenPrompt(label) {
  return new Promise((resolve, reject) => {
    if (!process.stdin.isTTY) return reject(new Error('Run this setup in an interactive terminal.'));
    process.stdout.write(label);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    let value = '';
    const onData = char => {
      if (char === '\u0003') process.exit(130);
      if (char === '\r' || char === '\n') {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdin.off('data', onData);
        process.stdout.write('\n');
        resolve(value);
      } else if (char === '\u007f') {
        value = value.slice(0, -1);
      } else {
        value += char;
      }
    };
    process.stdin.on('data', onData);
  });
}

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

if (fs.existsSync(authPath)) {
  console.error('Private briefs are already initialized. Delete auth.json only if you intentionally want to reset the archive.');
  process.exit(1);
}

const password = await hiddenPrompt('Choose a private reading-room password (6+ characters): ');
const confirmation = await hiddenPrompt('Enter it again: ');
if (password !== confirmation) throw new Error('The passwords did not match.');
if (password.length < 6) throw new Error('Use at least 6 characters.');

const salt = crypto.randomBytes(16);
const key = deriveKey(password, salt);
fs.mkdirSync(briefsRoot, { recursive: true });
fs.writeFileSync(authPath, JSON.stringify({ v: 1, salt: salt.toString('base64url'), verifier: verifier(key) }, null, 2) + '\n', { mode: 0o644 });
fs.writeFileSync(manifestPath, JSON.stringify(encryptJson({ briefs: [] }, key), null, 2) + '\n', { mode: 0o644 });
execFileSync('security', ['add-generic-password', '-U', '-a', account, '-s', service, '-w', key.toString('base64url')], { stdio: 'ignore' });
console.log('Private reading room initialized. The publishing key is stored in macOS Keychain; the password was not saved.');
