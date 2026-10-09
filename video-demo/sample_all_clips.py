import asyncio
import os
from playwright.async_api import async_playwright

async def sample_clip(clip_name):
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1920, "height": 1080})
        abs_path = os.path.abspath(f"video-demo/public/recordings/{clip_name}").replace("\\", "/")
        await page.goto(f"file:///{abs_path}")
        await page.wait_for_timeout(500)
        dur = await page.evaluate("() => document.querySelector('video').duration")
        print(f"{clip_name} duration: {dur:.2f}s")
        os.makedirs("video-demo/scratch/audit_all", exist_ok=True)
        for i in range(10):
            t = (i / 9.0) * max(0.1, dur - 0.1)
            await page.evaluate(f"() => {{ document.querySelector('video').currentTime = {t}; }}")
            await page.wait_for_timeout(100)
            await page.screenshot(path=f"video-demo/scratch/audit_all/{clip_name}_step_{i}.png")
        await browser.close()

async def main():
    clips = [f for f in os.listdir("video-demo/public/recordings") if f.endswith(".webm")]
    for c in sorted(clips):
        await sample_clip(c)
    print("ALL CLIPS SAMPLED SUCCESSFULLY.")

if __name__ == "__main__":
    asyncio.run(main())
