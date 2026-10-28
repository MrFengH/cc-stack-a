import json

with open('video-demo/src/data/subtitles.json', encoding='utf-8') as f:
    subs = json.load(f)

total_sub_frames = sum(s['endFrame'] - s['startFrame'] for s in subs)
print(f'Suma frames subtitulos: {total_sub_frames} frames = {total_sub_frames/30.0:.2f} s')
for s in subs:
    dur_f = s['endFrame'] - s['startFrame']
    print(f"  Cue {s['id']:2d} ({s['scene']}): {dur_f:3d} f ({dur_f/30.0:4.2f} s) -> '{s['text']}'")
