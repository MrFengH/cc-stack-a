import asyncio
import os
from playwright.async_api import async_playwright

async def record_clip06():
    print("=== RECORDING CLEAN 06-checkout-pagos.webm ===")
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        
        # We need an active cart session for cliente@notaalta.example
        # Let's prepare context and session first
        context_prep = await browser.new_context(viewport={"width": 1920, "height": 1080})
        page_prep = await context_prep.new_page()
        
        # 1. Login
        await page_prep.goto("http://127.0.0.1:8001/cuenta/ingresar/")
        await page_prep.fill("input[name='username']", "cliente@notaalta.example")
        await page_prep.fill("input[name='password']", "Cliente2026!")
        await page_prep.click("button[type='submit']")
        await page_prep.wait_for_timeout(1000)
        
        # 2. Add product to cart if needed
        await page_prep.goto("http://127.0.0.1:8001/perfume/dolce-gabbana-the-one-75ml/")
        await page_prep.click("button[type='submit']")
        await page_prep.wait_for_timeout(1000)
        
        # 3. Apply DG10 coupon in cart
        await page_prep.goto("http://127.0.0.1:8001/carrito/")
        if await page_prep.locator("input#coupon").count() > 0:
            await page_prep.fill("input#coupon", "DG10")
            await page_prep.click("button:has-text('Aplicar')")
            await page_prep.wait_for_timeout(1000)
            
        # Get cookies/storage state so recording context can inherit logged-in cart state
        storage = await context_prep.storage_state()
        await page_prep.close()
        await context_prep.close()
        
        # Now create video recording context with identical storage state
        context = await browser.new_context(
            viewport={"width": 1920, "height": 1080},
            storage_state=storage,
            record_video_dir="video-demo/scratch/record_temp_06",
            record_video_size={"width": 1920, "height": 1080}
        )
        page = await context.new_page()
        
        # Navigate to checkout
        await page.goto("http://127.0.0.1:8001/checkout/")
        await page.wait_for_load_state("networkidle")
        # Clean start hold: 2.0s showing "Finalizar compra", pre-filled customer details, and order summary ($107.10)
        await page.wait_for_timeout(2000)
        
        # Smooth scroll down to shipping and payment methods
        await page.evaluate("""() => new Promise(resolve => {
            const start = window.scrollY;
            const target = 450;
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
        
        await page.wait_for_timeout(1500)
        
        # Select Yappy payment method interactively
        yappy_radio = page.locator("label:has-text('Yappy') input[type='radio']")
        await yappy_radio.check()
        await page.wait_for_timeout(1500)
        
        # Hover over Yappy badge/option to highlight it
        await page.locator("label:has-text('Yappy')").hover()
        await page.wait_for_timeout(2500)
        
        # Clean end pause: 2.0 seconds (do NOT submit order, avoid creating unwanted records!)
        await page.wait_for_timeout(2000)
        
        await page.close()
        await context.close()
        await browser.close()

    temp_dir = "video-demo/scratch/record_temp_06"
    files = [f for f in os.listdir(temp_dir) if f.endswith(".webm")]
    if files:
        rec_path = os.path.join(temp_dir, files[0])
        dest_path = "video-demo/public/recordings/06-checkout-pagos.webm"
        if os.path.exists(dest_path):
            os.remove(dest_path)
        os.rename(rec_path, dest_path)
        print(f"Successfully saved pristine {dest_path}!")

if __name__ == "__main__":
    asyncio.run(record_clip06())
