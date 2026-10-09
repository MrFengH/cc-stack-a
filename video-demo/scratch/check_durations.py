import asyncio
import os
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        recordings_dir = os.path.abspath('video-demo/public/recordings')
        for f in sorted(os.listdir(recordings_dir)):
            if f.endswith('.webm'):
                fp = os.path.join(recordings_dir, f).replace('\\', '/')
                await page.set_content(f'<video src="file:///{fp}"></video>')
                dur = await page.evaluate('''() => {
                    const v = document.querySelector("video");
                    return new Promise(r => {
                        if (!isNaN(v.duration) && v.duration > 0) return r(v.duration);
                        v.onloadedmetadata = () => r(v.duration);
                    });
                }''')
                print(f"{f}: {dur:.2f}s ({round(dur*30)} frames)")
        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
