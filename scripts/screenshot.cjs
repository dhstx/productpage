// scripts/screenshot.cjs
const path = require('path');
const fs = require('fs');
const express = require('express');
const puppeteer = require('puppeteer');

(async () => {
  const app = express();
  const distPath = path.resolve(__dirname, '..', 'dist');
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;

  app.use(express.static(distPath));

  const server = await new Promise((resolve) => {
    const s = app.listen(port, () => resolve(s));
  });

  try {
    // Ensure screenshots dir exists
    const shotsDir = path.resolve(__dirname, '..', 'screenshots');
    fs.mkdirSync(shotsDir, { recursive: true });

    const url = process.env.URL || `http://localhost:${port}`;
    const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    // Desktop
    await page.setViewport({ width: 1366, height: 768 });
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(shotsDir, 'desktop.png'), fullPage: true });

    // Mobile
    await page.setViewport({ width: 375, height: 812, isMobile: true });
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(shotsDir, 'mobile.png'), fullPage: true });

    await browser.close();
    console.log('Screenshots saved to screenshots/');
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  } finally {
    server.close();
  }
})();
