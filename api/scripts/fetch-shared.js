#!/usr/bin/env node

// Fetches shared agents module into api/lib for isolated deploys
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LIB_DIR = path.join(__dirname, '..', 'lib');
const TARGET_FILE = path.join(LIB_DIR, 'agents-enhanced.js');
const SOURCE_URL = 'https://raw.githubusercontent.com/dhstx/productpage/main/src/lib/agents-enhanced.js';

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function downloadToFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);

    https
      .get(url, (response) => {
        if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          // Handle redirects
          return downloadToFile(response.headers.location, dest).then(resolve).catch(reject);
        }
        if (response.statusCode !== 200) {
          return reject(new Error(`Failed to download: ${response.statusCode} ${response.statusMessage}`));
        }
        response.pipe(file);
        file.on('finish', () => file.close(resolve));
      })
      .on('error', (err) => {
        fs.existsSync(dest) && fs.unlinkSync(dest);
        reject(err);
      });
  });
}

async function main() {
  try {
    ensureDir(LIB_DIR);

    // If file already exists, skip download
    if (fs.existsSync(TARGET_FILE)) {
      console.log(`[fetch-shared] Using existing ${path.relative(process.cwd(), TARGET_FILE)}`);
      return;
    }

    console.log(`[fetch-shared] Downloading shared module from ${SOURCE_URL}`);
    await downloadToFile(SOURCE_URL, TARGET_FILE);
    console.log(`[fetch-shared] Saved to ${path.relative(process.cwd(), TARGET_FILE)}`);
  } catch (err) {
    console.error('[fetch-shared] Error fetching shared module:', err.message);
    // Do not hard fail postinstall in local dev; CI can decide policy
    process.exitCode = 0;
  }
}

main();
