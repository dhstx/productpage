#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MANUAL_ROOT = path.resolve(__dirname, '../content/manual');
const TARGET_EXTENSIONS = new Set(['.md', '.mdx']);

function listManualFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listManualFiles(fullPath));
    } else if (TARGET_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

function applyReplacements(content) {
  let next = content;
  next = next.replace(/\s—\s/g, ' → ');
  next = next.replace(/([a-z0-9\)])—([a-z0-9\(\[])/gi, '$1, $2');
  next = next.replace(/([A-Za-z0-9])—\s*(?=[A-Z])/g, '$1: ');
  next = next.replace(/—/g, ' - ');
  return next;
}

function writeAtomic(filePath, data) {
  const dir = path.dirname(filePath);
  const tempName = `${path.basename(filePath)}.${process.pid}.${Date.now()}.tmp`;
  const tempPath = path.join(dir, tempName);
  const fd = fs.openSync(tempPath, 'w');
  try {
    fs.writeFileSync(fd, data, 'utf8');
    fs.fsyncSync(fd);
  } catch (error) {
    try {
      fs.closeSync(fd);
    } catch {}
    try {
      fs.unlinkSync(tempPath);
    } catch {}
    throw error;
  }
  fs.closeSync(fd);
  fs.renameSync(tempPath, filePath);
}

function sweep() {
  if (!fs.existsSync(MANUAL_ROOT)) {
    console.error('No manual content directory found at', MANUAL_ROOT);
    process.exit(1);
  }

  const files = listManualFiles(MANUAL_ROOT);
  let changed = 0;

  for (const filePath of files) {
    const original = fs.readFileSync(filePath, 'utf8');
    const updated = applyReplacements(original);
    if (updated !== original) {
      writeAtomic(filePath, updated);
      changed += 1;
      console.log(`rewrote ${path.relative(process.cwd(), filePath)}`);
    }
  }

  if (changed === 0) {
    console.log('No em dashes found. All files already normalized.');
  } else {
    console.log(`Normalized em dashes in ${changed} file${changed === 1 ? '' : 's'}.`);
  }
}

try {
  sweep();
} catch (error) {
  console.error('Failed to complete em dash sweep:', error);
  process.exit(1);
}
