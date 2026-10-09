const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function check() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const dir = path.resolve('video-demo/public/recordings');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.webm'));
  for (const f of files) {
    const fileUrl = 'file:///' + path.join(dir, f).replace(/\\/g, '/');
    await page.setContent(`<video src="${fileUrl}"></video>`);
    const dur = await page.evaluate(() => {
      const v = document.querySelector('video');
      return new Promise(resolve => {
        if (!isNaN(v.duration) && v.duration > 0) resolve(v.duration);
        v.onloadedmetadata = () => resolve(v.duration);
      });
    });
    console.log(`${f}: ${dur.toFixed(2)}s (${Math.round(dur * 30)} frames)`);
  }
  await browser.close();
}
check();
