#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = process.cwd();
const TARGET_DIR = path.join(ROOT, "content", "manual");

if (!fs.existsSync(TARGET_DIR)) {
  console.error(`[no-emdash-atomic] target directory missing: ${TARGET_DIR}`);
  process.exit(1);
}

function atomicWriteFileSync(fullPath, content) {
  const dir = path.dirname(fullPath);
  const base = path.basename(fullPath);
  const temp = path.join(dir, `.tmp-${base}-${process.pid}-${Date.now()}`);
  const fd = fs.openSync(temp, "w", 0o600);
  try {
    fs.writeFileSync(fd, content, "utf8");
    fs.fsyncSync(fd);
  } finally {
    fs.closeSync(fd);
  }
  fs.renameSync(temp, fullPath);
}

function rewriteEmDashes(text) {
  let next = text;
  next = next.replace(/\s—\s/g, " → ");
  next = next.replace(/([a-z0-9\)])—([a-z0-9\(\[])/gi, "$1, $2");
  next = next.replace(/([A-Za-z0-9])—\s*(?=[A-Z])/g, "$1: ");
  next = next.replace(/—/g, " - ");
  return next;
}

function listFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const results = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...listFiles(fullPath));
      continue;
    }
    if (/\.(mdx?|MDX?)$/.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

function git(args, options = {}) {
  const result = spawnSync("git", args, { stdio: "inherit", ...options });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(" ")} failed`);
  }
}

const files = listFiles(TARGET_DIR);
const staged = [];

for (const file of files) {
  const original = fs.readFileSync(file, "utf8");
  const updated = rewriteEmDashes(original);
  if (updated !== original) {
    atomicWriteFileSync(file, updated);
    const relative = path.relative(ROOT, file);
    git(["add", relative]);
    staged.push(relative);
  }
}

if (!staged.length) {
  console.log("[no-emdash-atomic] No em dashes detected; nothing to commit.");
  process.exit(0);
}

git(["commit", "-m", "chore(manual): remove em dashes and normalize punctuation (safe sweep)"]);

console.log(`[no-emdash-atomic] Updated and committed ${staged.length} file(s).`);
