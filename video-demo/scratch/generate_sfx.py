import math
import random
import struct
import wave
import os

SAMPLE_RATE = 44100

def write_wav(filename, samples_left, samples_right=None):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    if samples_right is None:
        samples_right = samples_left
    n_frames = len(samples_left)
    
    # Peak normalization to -3.0 dB (0.707 of max 32767)
    max_val = max(max(abs(s) for s in samples_left), max(abs(s) for s in samples_right))
    if max_val > 0:
        gain = (32767 * 0.707) / max_val
    else:
        gain = 1.0
        
    with wave.open(filename, 'w') as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        data = bytearray()
        for i in range(n_frames):
            sl = int(max(-32767, min(32767, samples_left[i] * gain)))
            sr = int(max(-32767, min(32767, samples_right[i] * gain)))
            data.extend(struct.pack('<hh', sl, sr))
        wf.writeframes(data)
    print(f"Generated {filename}: {n_frames/SAMPLE_RATE:.2f}s ({n_frames} samples)")

def generate_whoosh(filename):
    duration = 0.32
    n_samples = int(duration * SAMPLE_RATE)
    left = [0.0] * n_samples
    right = [0.0] * n_samples
    
    # White noise buffer
    random.seed(42)
    noise = [random.uniform(-1.0, 1.0) for _ in range(n_samples)]
    
    # 2-pole resonant bandpass filter with sweeping frequency
    # Center freq: 350Hz -> 2400Hz -> 300Hz
    # Envelope: asymmetric raised cosine
    y1_l, y2_l = 0.0, 0.0
    y1_r, y2_r = 0.0, 0.0
    
    for i in range(n_samples):
        t = i / SAMPLE_RATE
        progress = t / duration
        
        # Center freq curve (peaks around 45% through)
        if progress < 0.45:
            fc = 350.0 + (2400.0 - 350.0) * math.sin((progress / 0.45) * (math.pi / 2))
        else:
            fc = 300.0 + (2400.0 - 300.0) * math.cos(((progress - 0.45) / 0.55) * (math.pi / 2))
            
        bw = fc * 0.7  # Q approx 1.4
        
        # Envelope: smooth attack, gentle release
        env = math.sin(progress * math.pi) ** 1.8
        
        # Filter coefficients for digital bandpass
        w0 = 2.0 * math.pi * fc / SAMPLE_RATE
        alpha = math.sin(w0) * math.sinh(math.log(2.0) / 2.0 * bw * w0 / math.sin(w0)) if math.sin(w0) > 0 else 0.1
        
        b0 = alpha
        b1 = 0.0
        b2 = -alpha
        a0 = 1.0 + alpha
        a1 = -2.0 * math.cos(w0)
        a2 = 1.0 - alpha
        
        # Normalized coefficients
        b0_n = b0 / a0
        b2_n = b2 / a0
        a1_n = a1 / a0
        a2_n = a2 / a0
        
        # IIR step (simplified difference equation)
        x0 = noise[i]
        x2 = noise[i - 2] if i >= 2 else 0.0
        
        # Left channel
        yl = b0_n * x0 + b2_n * x2 - a1_n * y1_l - a2_n * y2_l
        y2_l = y1_l
        y1_l = yl
        
        # Right channel (slight time offset for stereo width)
        x0_r = noise[min(n_samples - 1, i + 3)]
        x2_r = noise[i - 2 + 3] if (i >= 2 and i + 3 < n_samples) else 0.0
        yr = b0_n * x0_r + b2_n * x2_r - a1_n * y1_r - a2_n * y2_r
        y2_r = y1_r
        y1_r = yr
        
        # Pan sweep from left to right (-0.3 to +0.3)
        pan = -0.3 + 0.6 * progress
        gain_l = math.cos((pan + 1.0) * math.pi / 4.0)
        gain_r = math.sin((pan + 1.0) * math.pi / 4.0)
        
        left[i] = yl * env * gain_l
        right[i] = yr * env * gain_r
        
    write_wav(filename, left, right)

def generate_click(filename):
    duration = 0.04
    n_samples = int(duration * SAMPLE_RATE)
    samples = [0.0] * n_samples
    
    for i in range(n_samples):
        t = i / SAMPLE_RATE
        # Crisp click: 1700 Hz damped sine + 3400 Hz harmonic + initial transient
        env1 = math.exp(-t / 0.006)
        env2 = math.exp(-t / 0.003)
        click_tone = 0.7 * math.sin(2.0 * math.pi * 1750.0 * t) * env1
        harmonic = 0.3 * math.sin(2.0 * math.pi * 3500.0 * t) * env2
        transient = 0.5 * (1.0 - t / 0.002) if t < 0.002 else 0.0
        samples[i] = click_tone + harmonic + transient
        
    write_wav(filename, samples)

def generate_coupon_impact(filename):
    duration = 0.85
    n_samples = int(duration * SAMPLE_RATE)
    left = [0.0] * n_samples
    right = [0.0] * n_samples
    
    # Elegant harmonic chime: E5 (659.25), B5 (987.77), E6 (1318.51), G#6 (1661.22)
    chords = [
        (659.25, 0.40, 0.75, 0.0),    # fundamental
        (987.77, 0.30, 0.60, 0.005),  # fifth
        (1318.51, 0.25, 0.45, 0.010), # octave
        (1661.22, 0.15, 0.35, 0.015), # major third sparkle
        (2637.02, 0.08, 0.20, 0.018), # high shimmer
    ]
    
    for i in range(n_samples):
        t = i / SAMPLE_RATE
        sl = 0.0
        sr = 0.0
        for freq, amp, decay, delay in chords:
            if t >= delay:
                dt = t - delay
                # Envelope: rapid 4ms attack, smooth exponential decay
                attack = min(1.0, dt / 0.004)
                env = attack * math.exp(-dt / decay)
                # Subtle phase modulation for shimmer
                shimmer = 1.0 + 0.002 * math.sin(2.0 * math.pi * 6.0 * dt)
                tone = amp * math.sin(2.0 * math.pi * freq * shimmer * dt) * env
                sl += tone
                sr += tone * (0.95 if freq > 1000 else 1.05)
        left[i] = sl
        right[i] = sr
        
    write_wav(filename, left, right)

def generate_metric_rise(filename):
    duration = 0.70
    n_samples = int(duration * SAMPLE_RATE)
    left = [0.0] * n_samples
    right = [0.0] * n_samples
    
    # Ascending triad sparkle: C5 -> E5 -> G5 -> C6
    notes = [
        (523.25, 0.00, 0.35, 0.25),
        (659.25, 0.06, 0.35, 0.30),
        (783.99, 0.12, 0.38, 0.35),
        (1046.50, 0.18, 0.45, 0.45),
        (1318.51, 0.24, 0.30, 0.35),
    ]
    
    for i in range(n_samples):
        t = i / SAMPLE_RATE
        sl = 0.0
        sr = 0.0
        for freq, delay, amp, decay in notes:
            if t >= delay:
                dt = t - delay
                attack = min(1.0, dt / 0.005)
                env = attack * math.exp(-dt / decay)
                tone = amp * (
                    math.sin(2.0 * math.pi * freq * dt) +
                    0.25 * math.sin(2.0 * math.pi * freq * 2.0 * dt)
                ) * env
                # Stereo pan widens with pitch
                pan_offset = (freq - 500.0) / 1000.0 * 0.2
                sl += tone * (1.0 - pan_offset)
                sr += tone * (1.0 + pan_offset)
        left[i] = sl
        right[i] = sr
        
    write_wav(filename, left, right)

if __name__ == '__main__':
    base_dir = r"C:\Users\sfeng\CCProyectos\cc-stack-a\video-demo\public\audio\sfx"
    generate_whoosh(os.path.join(base_dir, "whoosh.wav"))
    generate_click(os.path.join(base_dir, "click.wav"))
    generate_coupon_impact(os.path.join(base_dir, "coupon-impact.wav"))
    generate_metric_rise(os.path.join(base_dir, "metric-rise.wav"))
    print("All SFX generated successfully!")
