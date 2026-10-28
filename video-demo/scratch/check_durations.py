import os
from playwright.sync_api import sync_playwright

FILES = [
    '01-intro.mp3',
    '02-discovery.mp3',
    '03-catalog.mp3',
    '04-product.mp3',
    '05-cart.mp3',
    '06-checkout.mp3',
    '07-tracking.mp3',
    '08-panel.mp3',
    '09-operations.mp3',
    '10-outro.mp3',
]

base_dir = r'C:\Users\sfeng\CCProyectos\cc-stack-a\video-demo\public\audio\voice'

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    total_audio_sec = 0.0
    total_frames = 0
    print('--- ARCHIVO POR ARCHIVO ---')
    for f in FILES:
        path = os.path.join(base_dir, f).replace('\\', '/')
        page.goto(f'file:///{path}')
        dur = page.evaluate('() => document.querySelector("video, audio").duration')
        frames = round(dur * 30)
        total_audio_sec += dur
        total_frames += frames
        print(f'{f}: {dur:6.3f} s ({frames:3d} frames)')
    browser.close()

print(f'\nSuma total exacta duraciones audio: {total_audio_sec:.3f} s ({total_frames} frames)')
print(f'Equivalente en frames a 30fps: {total_frames / 30.0:.3f} s')
