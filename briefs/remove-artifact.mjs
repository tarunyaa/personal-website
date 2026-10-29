#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const slug = process.argv[2];
if (!/^[a-z0-9-]+$/.test(slug || '')) {
  console.error('Usage: node briefs/remove-artifact.mjs artifact-slug');
  process.exit(1);
}
const manifestPath = path.join(root, 'private-data', 'briefs', 'manifest.enc.json');
const artifactPath = path.join(root, 'private-data', 'artifacts', `${slug}.enc.json`);
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

const manifest = decryptJson(manifestPath);
const before = manifest.briefs.length;
manifest.briefs = manifest.briefs.filter(item => item.slug !== slug);
if (manifest.briefs.length === before) throw new Error(`Artifact ${slug} was not present in the manifest.`);
fs.writeFileSync(manifestPath, JSON.stringify(encryptJson(manifest), null, 2) + '\n');
if (fs.existsSync(artifactPath)) fs.unlinkSync(artifactPath);
console.log(`Removed encrypted artifact ${slug} and its manifest entry.`);
