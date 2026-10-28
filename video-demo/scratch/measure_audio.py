import asyncio
import os
from playwright.async_api import async_playwright

async def measure():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        voice_dir = os.path.abspath("video-demo/public/audio/voice")
        for f in sorted(os.listdir(voice_dir)):
            if f.endswith('.mp3'):
                fp = os.path.join(voice_dir, f).replace('\\', '/')
                await page.goto(f"file:///{fp}")
                dur = await page.evaluate("() => document.querySelector('video, audio').duration")
                frames = round(dur * 30)
                print(f"{f:<18} | {dur:.2f}s | {frames} frames")
        await browser.close()

if __name__ == '__main__':
    asyncio.run(measure())
