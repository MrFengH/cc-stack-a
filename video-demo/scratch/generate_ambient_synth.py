import math
import struct
import wave
import os

SAMPLE_RATE = 44100
DURATION = 82.0 # seconds
TOTAL_SAMPLES = int(SAMPLE_RATE * DURATION)

# Chord progression (Fmaj9, Dm9, Bbmaj9, Csus4/C9)
# Chord duration: 2 bars at 104 BPM = ~4.615s per chord
BPM = 104.0
BEAT_SEC = 60.0 / BPM
BAR_SEC = BEAT_SEC * 4.0 # ~2.307s

CHORDS = [
    # (Bass note freq, [Chord freqs])
    (87.31, [174.61, 220.00, 261.63, 329.63, 392.00]),   # F2, [F3, A3, C4, E4, G4] (Fmaj9)
    (73.42, [146.83, 220.00, 261.63, 329.63, 349.23]),   # D2, [D3, A3, C4, E4, F4] (Dm9)
    (58.27, [116.54, 174.61, 233.08, 293.66, 349.23]),   # Bb1, [Bb2, F3, Bb3, D4, F4] (Bbmaj7)
    (65.41, [130.81, 196.00, 261.63, 293.66, 349.23]),   # C2, [C3, G3, C4, D4, F4] (Csus4)
]

def generate_ambient_track(output_wav):
    print(f"Generating ambient music track: {DURATION}s ({TOTAL_SAMPLES} samples)...")
    left = [0.0] * TOTAL_SAMPLES
    right = [0.0] * TOTAL_SAMPLES

    # Precalculate sine LUT or math for fast synthesis
    two_pi = 2.0 * math.pi

    # Iterate through chords across time
    time_cursor = 0.0
    chord_idx = 0

    while time_cursor < DURATION:
        bass_freq, chord_notes = CHORDS[chord_idx % len(CHORDS)]
        chord_start_sample = int(time_cursor * SAMPLE_RATE)
        chord_dur_sec = BAR_SEC * 2.0 # 2 bars per chord = ~4.615s
        chord_samples = int(chord_dur_sec * SAMPLE_RATE)

        # 1. Bass layer (warm filtered sine + sub)
        for i in range(chord_samples):
            idx = chord_start_sample + i
            if idx >= TOTAL_SAMPLES:
                break
            t = i / SAMPLE_RATE
            # Attack 50ms, decay/sustain
            env_bass = min(1.0, t / 0.05) * math.exp(-t / 3.8)
            bass_sig = (
                0.35 * math.sin(two_pi * bass_freq * t) +
                0.15 * math.sin(two_pi * (bass_freq * 2.0) * t)
            ) * env_bass
            left[idx] += bass_sig * 0.95
            right[idx] += bass_sig * 0.95

        # 2. Electric Piano / Rhodes (staggered arpeggiated strike)
        for note_i, freq in enumerate(chord_notes):
            note_delay = 0.04 * note_i
            start_s = chord_start_sample + int(note_delay * SAMPLE_RATE)
            for i in range(chord_samples - int(note_delay * SAMPLE_RATE)):
                idx = start_s + i
                if idx >= TOTAL_SAMPLES:
                    break
                t = i / SAMPLE_RATE
                # Bell-like exponential decay
                env_ep = min(1.0, t / 0.008) * math.exp(-t / 1.7)
                # Multi-harmonic Rhodes timbre
                ep_sig = (
                    0.20 * math.sin(two_pi * freq * t) +
                    0.10 * math.sin(two_pi * (freq * 2.0) * t) * math.exp(-t / 0.8) +
                    0.04 * math.sin(two_pi * (freq * 3.0) * t) * math.exp(-t / 0.4) +
                    0.02 * math.sin(two_pi * (freq * 4.0) * t) * math.exp(-t / 0.2)
                ) * env_ep
                # Stereo spread per note
                pan = -0.35 + 0.7 * (note_i / (len(chord_notes) - 1))
                gain_l = math.cos((pan + 1.0) * math.pi / 4.0)
                gain_r = math.sin((pan + 1.0) * math.pi / 4.0)
                left[idx] += ep_sig * gain_l
                right[idx] += ep_sig * gain_r

        # 3. Soft Ambient Pad (continuous detuned wash with slow LFO)
        for note_i, freq in enumerate(chord_notes[:3]):
            pad_freq = freq * 0.5 if freq > 300 else freq
            for i in range(chord_samples + int(1.2 * SAMPLE_RATE)): # Overlap pad decay into next chord
                idx = chord_start_sample + i
                if idx >= TOTAL_SAMPLES:
                    break
                t = i / SAMPLE_RATE
                total_dur = chord_dur_sec + 1.2
                # Smooth raised cosine fade in / fade out
                if t < 0.6:
                    env_pad = 0.5 * (1.0 - math.cos(math.pi * t / 0.6))
                elif t > total_dur - 0.8:
                    env_pad = 0.5 * (1.0 + math.cos(math.pi * (t - (total_dur - 0.8)) / 0.8))
                else:
                    env_pad = 1.0
                
                # Detuned chorus sines (0, +1.1Hz, -1.1Hz)
                lfo = 1.0 + 0.15 * math.sin(two_pi * 0.2 * (time_cursor + t))
                pad_sig = 0.05 * (
                    math.sin(two_pi * pad_freq * t) +
                    0.6 * math.sin(two_pi * (pad_freq + 1.1) * t) +
                    0.6 * math.sin(two_pi * (pad_freq - 1.1) * t)
                ) * env_pad * lfo

                left[idx] += pad_sig * 1.05
                right[idx] += pad_sig * 0.95

        time_cursor += chord_dur_sec
        chord_idx += 1

    # 4. Subtle tech percussion / pulse (starts after 7.0s, stays gentle and background)
    cur_beat = 0
    t_beat = 0.0
    while t_beat < DURATION - 4.0:
        if t_beat >= 7.0: # Starts after intro
            beat_in_bar = cur_beat % 4
            beat_s = int(t_beat * SAMPLE_RATE)
            
            # Kick on beat 0 and soft ghost on 2.5
            if beat_in_bar == 0:
                kick_len = int(0.18 * SAMPLE_RATE)
                for i in range(kick_len):
                    idx = beat_s + i
                    if idx >= TOTAL_SAMPLES:
                        break
                    t = i / SAMPLE_RATE
                    # Pitch sweep 110Hz -> 48Hz
                    f = 48.0 + 62.0 * math.exp(-t / 0.03)
                    env_k = math.exp(-t / 0.06)
                    k_sig = 0.18 * math.sin(two_pi * f * t) * env_k
                    left[idx] += k_sig
                    right[idx] += k_sig

            # Soft tactile rim tap on beat 2
            if beat_in_bar == 2:
                rim_len = int(0.04 * SAMPLE_RATE)
                for i in range(rim_len):
                    idx = beat_s + i
                    if idx >= TOTAL_SAMPLES:
                        break
                    t = i / SAMPLE_RATE
                    env_r = math.exp(-t / 0.008)
                    r_sig = 0.06 * math.sin(two_pi * 950.0 * t) * env_r
                    left[idx] += r_sig * 0.9
                    right[idx] += r_sig * 1.1

            # Soft shaker / hi-hat on every 8th note
            hat_len = int(0.03 * SAMPLE_RATE)
            for sub in [0, int(0.5 * BEAT_SEC * SAMPLE_RATE)]:
                s_idx = beat_s + sub
                for i in range(hat_len):
                    idx = s_idx + i
                    if idx >= TOTAL_SAMPLES:
                        break
                    t = i / SAMPLE_RATE
                    # Filtered noise tick
                    env_h = math.exp(-t / 0.005)
                    # Simple high freq tick
                    h_sig = 0.02 * math.sin(two_pi * 7200.0 * t) * env_h
                    left[idx] += h_sig
                    right[idx] += h_sig * 1.05

        cur_beat += 1
        t_beat = cur_beat * BEAT_SEC

    # Master envelope: 1.5s fade in, 3.5s smooth fade out at end
    fade_in_len = int(1.5 * SAMPLE_RATE)
    fade_out_start = int((DURATION - 3.5) * SAMPLE_RATE)
    fade_out_len = TOTAL_SAMPLES - fade_out_start

    for i in range(TOTAL_SAMPLES):
        gain = 1.0
        if i < fade_in_len:
            gain = 0.5 * (1.0 - math.cos(math.pi * i / fade_in_len))
        elif i >= fade_out_start:
            rem = i - fade_out_start
            gain = 0.5 * (1.0 + math.cos(math.pi * rem / fade_out_len))
        left[i] *= gain
        right[i] *= gain

    # Peak normalization to -3.0 dB
    max_val = max(max(abs(s) for s in left), max(abs(s) for s in right))
    print(f"Max raw signal amplitude: {max_val:.4f}")
    if max_val > 0:
        norm_gain = (32767 * 0.707) / max_val
    else:
        norm_gain = 1.0

    os.makedirs(os.path.dirname(output_wav), exist_ok=True)
    with wave.open(output_wav, 'w') as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        data = bytearray()
        for i in range(TOTAL_SAMPLES):
            sl = int(max(-32767, min(32767, left[i] * norm_gain)))
            sr = int(max(-32767, min(32767, right[i] * norm_gain)))
            data.extend(struct.pack('<hh', sl, sr))
        wf.writeframes(data)
    print(f"Successfully generated ambient music: {output_wav}")

if __name__ == '__main__':
    out_wav = r"C:\Users\sfeng\CCProyectos\cc-stack-a\video-demo\public\audio\music\ambient-tech-lounge.wav"
    generate_ambient_track(out_wav)
