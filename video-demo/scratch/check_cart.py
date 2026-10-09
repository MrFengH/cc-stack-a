import asyncio
from playwright.async_api import async_playwright

async def check():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        # Login
        await page.goto('http://127.0.0.1:8001/cuenta/ingresar/')
        await page.fill('input[name="username"]', 'cliente@notaalta.example')
        await page.fill('input[name="password"]', 'Cliente2026!')
        await page.click('button[type="submit"]')
        await page.wait_for_timeout(1000)
        
        # Go to product and add
        await page.goto('http://127.0.0.1:8001/perfume/dolce-gabbana-the-one-75ml/')
        btn = page.locator('button:has-text("Agregar al carrito")')
        print("Btn count:", await btn.count())
        await btn.click()
        await page.wait_for_timeout(1500)
        
        await page.goto('http://127.0.0.1:8001/carrito/')
        print('Cart URL:', page.url)
        content = await page.content()
        print('Has Tu carrito esta vacio:', 'Tu carrito está vacío' in content)
        print('Has Quitar:', 'Quitar' in content)
        print('Has input#coupon:', await page.locator('input#coupon').count())
        if await page.locator('input#coupon').count() > 0:
            subtotal = await page.locator("dl div:nth-child(1) dd").inner_text()
            print("Cart subtotal:", subtotal)
        await browser.close()

if __name__ == '__main__':
    asyncio.run(check())
