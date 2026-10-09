import asyncio
import os
from playwright.async_api import async_playwright

async def inspect():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1920, "height": 1080})
        clips_dir = os.path.abspath("video-demo/public/recordings").replace("\\", "/")
        scratch_dir = os.path.abspath("video-demo/scratch/audit").replace("\\", "/")
        os.makedirs(scratch_dir, exist_ok=True)
        
        clips = [f for f in os.listdir("video-demo/public/recordings") if f.endswith(".webm")]
        for clip in sorted(clips):
            video_url = f"file:///{clips_dir}/{clip}"
            html_content = f"""
            <html>
            <body style="margin:0; background:black; overflow:hidden;">
                <video id="v" src="{video_url}" style="width:1920px; height:1080px; object-fit:contain;"></video>
            </body>
            </html>
            """
            await page.set_content(html_content)
            await page.wait_for_timeout(500)
            duration = await page.evaluate("""() => new Promise(res => {
                const v = document.getElementById('v');
                if (v.readyState >= 1) return res(v.duration);
                v.onloadedmetadata = () => res(v.duration);
            })""")
            print(f"=== {clip}: duration {duration:.2f}s ===")
            
            # Sample frames throughout the video, especially near the end
            sample_points = [
                0.2, 
                duration * 0.25, 
                duration * 0.5, 
                duration * 0.75, 
                duration * 0.9, 
                max(0.1, duration - 0.5),
                max(0.1, duration - 0.1)
            ]
            for idx, t in enumerate(sample_points):
                await page.evaluate(f"""() => new Promise(res => {{
                    const v = document.getElementById('v');
                    v.currentTime = {t};
                    v.onseeked = () => res();
                }})""")
                await page.wait_for_timeout(100)
                thumb_name = f"{clip}_sample_{idx}_{t:.1f}s.png"
                await page.screenshot(path=os.path.join(scratch_dir, thumb_name))
        
        await browser.close()
        print("Inspection complete.")

if __name__ == "__main__":
    asyncio.run(inspect())
