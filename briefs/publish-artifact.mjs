#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const authPath = path.join(root, 'private-data', 'auth.json');
const manifestPath = path.join(root, 'private-data', 'briefs', 'manifest.enc.json');
const artifactsRoot = path.join(root, 'private-data', 'artifacts');
const args = {};

for (let index = 2; index < process.argv.length; index += 1) {
  const value = process.argv[index];
  if (!value.startsWith('--')) continue;
  const next = process.argv[index + 1];
  if (!next || next.startsWith('--')) args[value.slice(2)] = true;
  else { args[value.slice(2)] = next; index += 1; }
}

if (!/^[a-z0-9-]+$/.test(args.slug || '') || !/^\d{4}-\d{2}-\d{2}$/.test(args.date || '') || !args.title || !args.input) {
  console.error('Usage: node briefs/publish-artifact.mjs --slug slug --date YYYY-MM-DD --title "Title" --input /path/to/page.html');
  process.exit(1);
}
if (!fs.existsSync(authPath) || !fs.existsSync(manifestPath)) throw new Error('Private reading room is not initialized.');

const key = Buffer.from(execFileSync('security', ['find-generic-password', '-a', 'publisher', '-s', 'tarunyaa-private-briefs', '-w'], { encoding: 'utf8' }).trim(), 'base64url');
if (key.length !== 32) throw new Error('The publishing key in macOS Keychain is invalid.');

function decryptJson(filePath) {
  const payload = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(payload.iv, 'base64url'));
  decipher.setAuthTag(Buffer.from(payload.tag, 'base64url'));
  return JSON.parse(Buffer.concat([decipher.update(Buffer.from(payload.ciphertext, 'base64url')), decipher.final()]).toString('utf8'));
}

function encryptJson(value) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(value), 'utf8'), cipher.final()]);
  return { v: 1, iv: iv.toString('base64url'), ciphertext: ciphertext.toString('base64url'), tag: cipher.getAuthTag().toString('base64url') };
}

function writeEncrypted(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(encryptJson(value), null, 2) + '\n', { mode: 0o644 });
}

const publishedAt = new Date().toISOString();
const html = fs.readFileSync(path.resolve(args.input), 'utf8');
writeEncrypted(path.join(artifactsRoot, `${args.slug}.enc.json`), {
  slug: args.slug, date: args.date, type: 'interactive', title: args.title, html, publishedAt
});

const manifest = decryptJson(manifestPath);
manifest.briefs = manifest.briefs.filter(item => item.slug !== args.slug);
manifest.briefs.push({ slug: args.slug, date: args.date, type: 'interactive', title: args.title, publishedAt });
manifest.briefs.sort((a, b) => b.date.localeCompare(a.date) || a.type.localeCompare(b.type));
writeEncrypted(manifestPath, manifest);

console.log(`Encrypted interactive artifact ${args.slug}. Plaintext remains only at the supplied input path.`);
