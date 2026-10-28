import asyncio
import os
import json
import edge_tts

SCENES = [
    ("01", 15, "Comprar perfumes en línea debe ser tan simple como disfrutarlos. Así nace Nota Alta."),
    ("02", 236, "En lugar de listas interminables, descubres fragancias por familias olfativas y cómo evolucionan en tu piel."),
    ("03", 462, "Un catálogo curado con filtros instantáneos por casa, ocasión y concentración."),
    ("04", 686, "Cada perfume detalla su pirámide olfativa completa, para que sepas exactamente qué esperar desde la primera aplicación."),
    ("05", 942, "Descuentos y cupones que se validan al instante, recalculando subtotales sin pasos innecesarios."),
    ("06", 1168, "Un checkout pensado para Panamá: retiro en tienda en cuatro horas y pagos locales con Yappy o ACH."),
    ("07", 1424, "El cliente sigue cada etapa de su orden con total claridad, desde la confirmación hasta la entrega."),
    ("08", 1646, "Detrás de la experiencia, un panel de control con métricas clave de ventas, demanda y stock en tiempo real."),
    ("09", 1912, "Gestión integral de órdenes y ajustes directos de inventario para mantener el catálogo siempre al día."),
    ("10", 2146, "Nota Alta. Perfumería digital, pensada para Panamá."),
]

VOICE = "es-PA-MargaritaNeural"

async def generate_subtitles():
    subtitles = []
    sub_id = 1
    
    for scene_id, global_start_frame, text in SCENES:
        comm = edge_tts.Communicate(text, VOICE)
        boundaries = []
        async for chunk in comm.stream():
            if chunk['type'] == 'SentenceBoundary':
                boundaries.append(chunk)
                
        # If no sentence boundary returned, fallback to full text
        if not boundaries:
            boundaries = [{'offset': 0, 'duration': 50000000, 'text': text}]
            
        for b in boundaries:
            # 10,000,000 ticks = 1 second = 30 frames
            offset_sec = b['offset'] / 10_000_000.0
            dur_sec = b['duration'] / 10_000_000.0
            
            start_frame = global_start_frame + round(offset_sec * 30)
            end_frame = start_frame + round(dur_sec * 30)
            
            subtitles.append({
                "id": sub_id,
                "scene": scene_id,
                "startFrame": start_frame,
                "endFrame": end_frame,
                "text": b['text'].strip()
            })
            sub_id += 1
            
    out_dir = os.path.abspath("video-demo/src/data")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "subtitles.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(subtitles, f, ensure_ascii=False, indent=2)
        
    print(f"Generated {len(subtitles)} subtitles in {out_path}")
    for s in subtitles:
        dur = (s['endFrame'] - s['startFrame']) / 30.0
        print(f"[{s['startFrame']:4d} - {s['endFrame']:4d}] ({dur:4.2f}s) (Scene {s['scene']}): \"{s['text']}\"")

if __name__ == '__main__':
    asyncio.run(generate_subtitles())
