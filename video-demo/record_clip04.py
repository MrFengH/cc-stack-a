import asyncio
import os
from playwright.async_api import async_playwright

async def record_clip04():
    print("=== RECORDING CLEAN 04-detalle-producto.webm ===")
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        # Setup page without recording first to navigate cleanly
        page_prep = await browser.new_page()
        # Navigate via catalog to verify link
        await page_prep.goto("http://127.0.0.1:8001/tienda/?marca=dolce-gabbana")
        target_link = await page_prep.locator("a[href*='/perfume/dolce-gabbana-the-one-75ml/']").first.get_attribute("href")
        print("Obtained product target link via UI:", target_link)
        full_url = f"http://127.0.0.1:8001{target_link}"
        await page_prep.close()
        
        # Now create video recording context
        context = await browser.new_context(
            viewport={"width": 1920, "height": 1080},
            record_video_dir="video-demo/scratch/record_temp_04",
            record_video_size={"width": 1920, "height": 1080}
        )
        page = await context.new_page()
        
        # Load the product page directly
        await page.goto(full_url)
        await page.wait_for_load_state("networkidle")
        # 1.5s clean hold at start showing hero, bottle, price, and stock
        await page.wait_for_timeout(1500)
        
        # Smooth continuous scroll using requestAnimationFrame + easeInOutCubic
        await page.evaluate("""() => new Promise(resolve => {
            const start = window.scrollY;
            const target = 520;
            const duration = 1400;
            const startTime = performance.now();
            function easeInOutCubic(t) {
                return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            }
            function step(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                window.scrollTo(0, start + (target - start) * easeInOutCubic(progress));
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    resolve();
                }
            }
            requestAnimationFrame(step);
        })""")
        
        # Hold over olfactory pyramid for 4 seconds
        await page.wait_for_timeout(4000)
        
        # 2s clean pause at end (no scrolls, no clicks, completely stable)
        await page.wait_for_timeout(2000)
        
        await page.close()
        await context.close()
        await browser.close()

    temp_dir = "video-demo/scratch/record_temp_04"
    files = [f for f in os.listdir(temp_dir) if f.endswith(".webm")]
    if files:
        rec_path = os.path.join(temp_dir, files[0])
        dest_path = "video-demo/public/recordings/04-detalle-producto.webm"
        if os.path.exists(dest_path):
            os.remove(dest_path)
        os.rename(rec_path, dest_path)
        print(f"Successfully saved pristine {dest_path}!")

if __name__ == "__main__":
    asyncio.run(record_clip04())
