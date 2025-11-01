import puppeteer from 'puppeteer';

async function captureScreenshots() {
  const url = process.env.URL || 'http://localhost:3000';
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });

  try {
    const page = await browser.newPage();

    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60_000 });
    await page.screenshot({
      path: 'docs/screenshots/rename-commander/desktop.png',
      fullPage: true,
    });

    await page.setViewport({ width: 390, height: 844, isMobile: true, deviceScaleFactor: 2 });
    await page.reload({ waitUntil: 'networkidle0', timeout: 60_000 });
    await page.screenshot({
      path: 'docs/screenshots/rename-commander/mobile.png',
      fullPage: true,
    });
  } finally {
    await browser.close();
  }
}

captureScreenshots().catch((error) => {
  console.error('Screenshot capture failed:', error);
  process.exitCode = 1;
});
