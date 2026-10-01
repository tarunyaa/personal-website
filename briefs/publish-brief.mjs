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

const args = {};
const rawArgs = process.argv.slice(2);
for (let index = 0; index < rawArgs.length; index += 1) {
  const value = rawArgs[index];
  if (!value.startsWith('--')) continue;
  const next = rawArgs[index + 1];
  if (!next || next.startsWith('--')) args[value.slice(2)] = true;
  else {
    args[value.slice(2)] = next;
    index += 1;
  }
}

if (!['morning', 'midday'].includes(args.type) || !/^\d{4}-\d{2}-\d{2}$/.test(args.date || '') || !args.input) {
  console.error('Usage: node briefs/publish-brief.mjs --type morning|midday --date YYYY-MM-DD --title "Title" --input /path/to/brief.md [--publish]');
  process.exit(1);
}

if (!fs.existsSync(authPath)) throw new Error('Run briefs/setup-password.mjs first.');
if (!fs.existsSync(args.input)) throw new Error(`Input file not found: ${args.input}`);

const key = Buffer.from(execFileSync('security', ['find-generic-password', '-a', 'publisher', '-s', 'tarunyaa-private-briefs', '-w'], { encoding: 'utf8' }).trim(), 'base64url');
if (key.length !== 32) throw new Error('The publishing key in macOS Keychain is invalid.');

function decryptJson(filePath) {
  const payload = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(payload.iv, 'base64url'));
  decipher.setAuthTag(Buffer.from(payload.tag, 'base64url'));
  return JSON.parse(Buffer.concat([
    decipher.update(Buffer.from(payload.ciphertext, 'base64url')),
    decipher.final()
  ]).toString('utf8'));
}

function encryptJson(value) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(value), 'utf8'), cipher.final()]);
  return { v: 1, iv: iv.toString('base64url'), ciphertext: ciphertext.toString('base64url'), tag: cipher.getAuthTag().toString('base64url') };
}

function writeEncrypted(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(encryptJson(value), null, 2) + '\n', { mode: 0o644 });
}

const slug = `${args.date}-${args.type}`;
const markdown = fs.readFileSync(path.resolve(args.input), 'utf8')
  .replace(/<heartbeat>[\s\S]*?<\/heartbeat>/g, '')
  .trim();
const title = args.title || (args.type === 'morning' ? 'Morning Curiosity' : 'Bookmark Seminar');
const publishedAt = new Date().toISOString();

fs.mkdirSync(briefsRoot, { recursive: true });
writeEncrypted(path.join(briefsRoot, `${slug}.enc.json`), { slug, date: args.date, type: args.type, title, markdown, publishedAt });

const manifest = fs.existsSync(manifestPath) ? decryptJson(manifestPath) : { briefs: [] };
manifest.briefs = manifest.briefs.filter(item => item.slug !== slug);
manifest.briefs.push({ slug, date: args.date, type: args.type, title, publishedAt });
manifest.briefs.sort((a, b) => b.date.localeCompare(a.date) || a.type.localeCompare(b.type));
writeEncrypted(manifestPath, manifest);

if (args.publish === true) {
  const files = [
    path.relative(root, authPath),
    path.relative(root, manifestPath),
    path.relative(root, path.join(briefsRoot, `${slug}.enc.json`))
  ];
  execFileSync('git', ['add', '--', ...files], { cwd: root, stdio: 'inherit' });
  try {
    execFileSync('git', ['commit', '-m', `Publish ${args.date} ${args.type} brief`], { cwd: root, stdio: 'inherit' });
  } catch {
    console.log('No ciphertext changes needed a commit.');
  }
  execFileSync('git', ['push', 'origin', 'HEAD'], { cwd: root, stdio: 'inherit' });
}

console.log(`Encrypted ${slug}. Plaintext was not copied into the website repository.`);
