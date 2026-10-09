import asyncio
import os
import shutil
from playwright.async_api import async_playwright

async def record_clip05():
    print("=== RECORDING CLEAN 05-carrito-cupon.webm ===")
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        
        # 1. Context prep
        context_prep = await browser.new_context(viewport={"width": 1920, "height": 1080})
        page_prep = await context_prep.new_page()
        
        # Login
        await page_prep.goto("http://127.0.0.1:8001/cuenta/ingresar/")
        await page_prep.fill("input[name='username']", "cliente@notaalta.example")
        await page_prep.fill("input[name='password']", "Cliente2026!")
        await page_prep.click("button[type='submit']")
        await page_prep.wait_for_timeout(1000)
        
        # Check cart
        await page_prep.goto("http://127.0.0.1:8001/carrito/")
        await page_prep.wait_for_load_state("networkidle")
        
        # If cart is empty, add product
        if "Tu carrito está vacío" in await page_prep.content():
            print("Cart is empty, adding product...")
            await page_prep.goto("http://127.0.0.1:8001/perfume/dolce-gabbana-the-one-75ml/")
            await page_prep.click("button:has-text('Agregar al carrito')")
            await page_prep.wait_for_timeout(1000)
            await page_prep.goto("http://127.0.0.1:8001/carrito/")
            await page_prep.wait_for_load_state("networkidle")
            
        # If coupon already applied, remove ONLY the coupon
        coupon_remove = page_prep.locator("form[action*='cupon'] button:has-text('Quitar')")
        if await coupon_remove.count() > 0:
            print("Removing existing coupon so recording starts clean...")
            await coupon_remove.click()
            await page_prep.wait_for_load_state("networkidle")
            await page_prep.wait_for_timeout(1000)
            
        # Verify clean cart state
        print("Prep verify: input#coupon count:", await page_prep.locator("input#coupon").count())
        storage = await context_prep.storage_state()
        await page_prep.close()
        await context_prep.close()
        
        # 2. Recording context
        record_dir = "video-demo/scratch/record_temp_05"
        os.makedirs(record_dir, exist_ok=True)
        for f in os.listdir(record_dir):
            fp = os.path.join(record_dir, f)
            if os.path.isfile(fp):
                os.remove(fp)
                
        context = await browser.new_context(
            viewport={"width": 1920, "height": 1080},
            storage_state=storage,
            record_video_dir=record_dir,
            record_video_size={"width": 1920, "height": 1080}
        )
        page = await context.new_page()
        
        # Load cart
        await page.goto("http://127.0.0.1:8001/carrito/")
        await page.wait_for_load_state("networkidle")
        
        # Initial hold (1.5s): clean cart with Subtotal $119.00 and Total $119.00
        await page.wait_for_timeout(1500)
        
        # Focus coupon input
        coupon_input = page.locator("input#coupon")
        await coupon_input.click()
        await page.wait_for_timeout(400)
        
        # Type "DG10" character by character with realistic speed
        await coupon_input.press_sequentially("DG10", delay=180)
        await page.wait_for_timeout(500)
        
        # Click "Aplicar"
        aplicar_btn = page.locator("button:has-text('Aplicar')")
        await aplicar_btn.click()
        await page.wait_for_load_state("networkidle")
        await page.wait_for_timeout(600)
        
        # Read real DOM values
        subtotal = await page.locator("dl div:nth-child(1) dd").inner_text()
        discount_el = page.locator("dl .text-sale dd")
        discount = await discount_el.inner_text() if await discount_el.count() > 0 else "None"
        total = await page.locator("dl .price.text-2xl").inner_text()
        badge = await page.locator(".badge-coupon").inner_text() if await page.locator(".badge-coupon").count() > 0 else "None"
        
        print("\n==========================================")
        print("REAL DOM VALUES EXTRACTED FROM APPLICATION:")
        print(f"Subtotal: {subtotal}")
        print(f"Coupon badge: {badge}")
        print(f"Discount: {discount}")
        print(f"Total:    {total}")
        print("==========================================\n")
        
        # Hold on updated state with coupon applied (3.0s)
        await page.wait_for_timeout(3000)
        
        # Close and finalize recording
        await page.close()
        video_path = await page.video.path()
        await context.close()
        await browser.close()
        
        print("Recorded video to:", video_path)
        dest = "video-demo/public/recordings/05-carrito-cupon.webm"
        shutil.copyfile(video_path, dest)
        print("Successfully copied clean recording to:", dest)

if __name__ == "__main__":
    asyncio.run(record_clip05())
