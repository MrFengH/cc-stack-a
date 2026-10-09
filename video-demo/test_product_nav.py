import asyncio
from playwright.async_api import async_playwright

async def test():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={"width": 1920, "height": 1080})
        page = await context.new_page()
        
        # Navigate from catalog to product
        await page.goto("http://127.0.0.1:8001/tienda/?marca=dolce-gabbana")
        print("Catalog URL:", page.url)
        # Click on the product card
        product_link = page.locator("a[href*='/perfume/dolce-gabbana-the-one-75ml/']").first
        await product_link.click()
        await page.wait_for_load_state("networkidle")
        print("Arrived at product URL:", page.url)
        print("H1:", await page.locator("h1").inner_text())
        print("Price:", await page.locator(".price").first.inner_text())
        
        # Check olfactory pyramid elements
        h2s = await page.locator("h2").all_inner_texts()
        print("H2s:", h2s)
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(test())
