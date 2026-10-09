import asyncio
import os
from playwright.async_api import async_playwright

async def sample_clip05():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1920, "height": 1080})
        abs_path = os.path.abspath("video-demo/public/recordings/05-carrito-cupon.webm").replace("\\", "/")
        await page.goto(f"file:///{abs_path}")
        await page.wait_for_timeout(500)
        dur = await page.evaluate("() => document.querySelector('video').duration")
        print(f"05-carrito-cupon.webm duration: {dur:.2f}s ({round(dur*30)} frames)")
        os.makedirs("video-demo/scratch/audit_all", exist_ok=True)
        for i in range(10):
            t = (i / 9.0) * max(0.1, dur - 0.1)
            await page.evaluate(f"() => {{ document.querySelector('video').currentTime = {t}; }}")
            await page.wait_for_timeout(150)
            ss_path = f"video-demo/scratch/audit_all/05-carrito-cupon.webm_step_{i}.png"
            await page.screenshot(path=ss_path)
            print(f"Step {i} ({t:.2f}s): {ss_path}")
        await browser.close()
        print("DONE SAMPLING 05-carrito-cupon.webm")

if __name__ == "__main__":
    asyncio.run(sample_clip05())
