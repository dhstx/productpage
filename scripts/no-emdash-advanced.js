import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

function processText(text) {
  let t = text;

  // Replace spaced em dashes with an arrow affordance when it reads as a transition.
  t = t.replace(/\s—\s/g, ' → ');

  // Prefer comma separation when clauses flow together without capitalization breaks.
  t = t.replace(/([a-z0-9\)])—([a-z0-9\(\[])/gi, '$1, $2');

  // Promote stronger clause separation with a colon when the next segment starts with uppercase.
  t = t.replace(/([A-Za-z0-9])—\s*(?=[A-Z])/g, '$1: ');

  // Fallback: replace any remaining em dashes with a spaced hyphen.
  t = t.replace(/—/g, ' - ');

  return t;
}

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (!fullPath.endsWith('.md') && !fullPath.endsWith('.mdx')) continue;

    const original = readFileSync(fullPath, 'utf8');
    const updated = processText(original);

    if (updated !== original) {
      writeFileSync(fullPath, updated, 'utf8');
      console.log('Updated:', fullPath);
    }
  }
}

const root = path.join(process.cwd(), 'content', 'manual');
walk(root);
console.log('Done em-dash sweep.');
