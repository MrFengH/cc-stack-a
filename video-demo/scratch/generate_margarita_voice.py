import asyncio
import os
import edge_tts
from playwright.async_api import async_playwright

SCRIPTS = [
    ("01-intro.mp3", "Comprar perfumes en línea debe ser tan simple como disfrutarlos. Así nace Nota Alta."),
    ("02-discovery.mp3", "En lugar de listas interminables, descubres fragancias por familias olfativas y cómo evolucionan en tu piel."),
    ("03-catalog.mp3", "Un catálogo curado con filtros instantáneos por casa, ocasión y concentración."),
    ("04-product.mp3", "Cada perfume detalla su pirámide olfativa completa, para que sepas exactamente qué esperar desde la primera aplicación."),
    ("05-cart.mp3", "Descuentos y cupones que se validan al instante, recalculando subtotales sin pasos innecesarios."),
    ("06-checkout.mp3", "Un checkout pensado para Panamá: retiro en tienda en cuatro horas y pagos locales con Yappy o ACH."),
    ("07-tracking.mp3", "El cliente sigue cada etapa de su orden con total claridad, desde la confirmación hasta la entrega."),
    ("08-panel.mp3", "Detrás de la experiencia, un panel de control con métricas clave de ventas, demanda y stock en tiempo real."),
    ("09-operations.mp3", "Gestión integral de órdenes y ajustes directos de inventario para mantener el catálogo siempre al día."),
    ("10-outro.mp3", "Nota Alta. Perfumería digital, pensada para Panamá."),
]

VOICE = "es-PA-MargaritaNeural"

async def main():
    out_dir = os.path.abspath("video-demo/public/audio/voice")
    os.makedirs(out_dir, exist_ok=True)
    
    print(f"=== GENERATING TTS AUDIO WITH {VOICE} ===")
    for filename, text in SCRIPTS:
        filepath = os.path.join(out_dir, filename)
        print(f"Generating {filename}...")
        comm = edge_tts.Communicate(text, VOICE)
        await comm.save(filepath)
        print(f"Saved {filename} ({os.path.getsize(filepath)} bytes)")
        
    print("\n=== MEASURING EXACT DURATIONS WITH PLAYWRIGHT CHROMIUM ===")
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        results = []
        for filename, text in SCRIPTS:
            filepath = os.path.join(out_dir, filename).replace("\\", "/")
            await page.goto(f"file:///{filepath}")
            dur = await page.evaluate("() => document.querySelector('video, audio').duration")
            frames = round(dur * 30)
            results.append((filename, dur, frames, text))
            print(f"{filename:<18} | {dur:6.2f}s | {frames:4d} frames | \"{text[:45]}...\"")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
