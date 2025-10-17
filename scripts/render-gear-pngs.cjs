#!/usr/bin/env node
const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

const srcSvgPath = path.resolve(__dirname, '../public/assets/gear-modern.svg');
const outDir = path.resolve(__dirname, '../public/assets');

const sizes = [
  { file: 'gear-modern.png', size: 384 },
  { file: 'gear-modern@2x.png', size: 768 },
  { file: 'gear-modern@3x.png', size: 1152 },
];

function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }

(async () => {
  const svgContent = fs.readFileSync(srcSvgPath);
  ensureDir(outDir);
  for (const { file, size } of sizes) {
    const r = new Resvg(svgContent, {
      fitTo: { mode: 'width', value: size },
      background: 'rgba(0,0,0,0)'
    });
    const pngData = r.render();
    const pngBuffer = pngData.asPng();
    const outPath = path.join(outDir, file);
    fs.writeFileSync(outPath, pngBuffer);
    console.log('wrote', outPath, pngBuffer.length);
  }
})().catch((e) => { console.error(e); process.exit(1); });
