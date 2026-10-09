import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={"width": 1920, "height": 1080})
        page = await context.new_page()
        
        # 1. Login as client
        await page.goto("http://127.0.0.1:8001/cuenta/ingresar/")
        await page.fill("input[name='username']", "cliente@notaalta.example")
        await page.fill("input[name='password']", "Cliente2026!")
        await page.click("button[type='submit']")
        await page.wait_for_timeout(1000)
        print("Logged in, current URL:", page.url)
        
        # 2. Go to product
        await page.goto("http://127.0.0.1:8001/perfume/dolce-gabbana-the-one-75ml/")
        print("Product URL:", page.url)
        
        # 3. Add to cart
        await page.click("button[type='submit']")
        await page.wait_for_timeout(1500)
        
        # 4. Go to cart
        await page.goto("http://127.0.0.1:8001/carrito/")
        print("Cart URL:", page.url)
        
        # Apply DG10 if needed
        has_coupon_input = await page.locator("input#coupon").count()
        print("Has coupon input:", has_coupon_input)
        if has_coupon_input > 0:
            await page.fill("input#coupon", "DG10")
            await page.click("button:has-text('Aplicar')")
            await page.wait_for_timeout(1500)
            print("Coupon applied!")
        
        # Read cart DOM
        subtotal = await page.locator("dl div:nth-child(1) dd").inner_text()
        discount = await page.locator("dl .text-sale dd").inner_text() if await page.locator("dl .text-sale dd").count() > 0 else "None"
        total = await page.locator("dl .price.text-2xl").inner_text()
        print(f"DOM state -> Subtotal: {subtotal}, Discount: {discount}, Total: {total}")
        
        # 5. Go to checkout
        btn_checkout = page.locator("a:has-text('Ir a pagar')")
        await btn_checkout.click()
        await page.wait_for_timeout(1500)
        print("Checkout URL:", page.url)
        print("Checkout h1:", await page.locator("h1").inner_text())
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
