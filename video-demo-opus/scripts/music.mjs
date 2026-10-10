// Original score for the film, synthesized deterministically (seeded noise, no wall-clock input).
// 100 BPM => 1 beat = 0.6 s = 18 frames @30fps, 1 bar = 2.4 s = 72 frames. Sections follow the film:
//   bars 0-1 open · 2-7 Salida · 8-15 Corazón · 16-22 Fondo · 23-25 cierre (the "nota alta" bell).
// Output: public/audio/music.wav (48 kHz, 16-bit stereo) and public/audio/sfx/tick.wav.
import fs from "node:fs";

const SR = 48000;
const BEAT = 0.6;
const BAR = BEAT * 4;
const BARS = 26;
const LEN = Math.ceil((BARS * BAR + 3) * SR);
const L = new Float32Array(LEN), R = new Float32Array(LEN);
const verbL = new Float32Array(LEN), verbR = new Float32Array(LEN); // reverb send bus

let seed = 1234567;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;
const mtof = (m) => 440 * 2 ** ((m - 69) / 12);
const db = (d) => 10 ** (d / 20);
const at = (bar, beat = 0) => (bar * 4 + beat) * BEAT;

function add(i, l, r, send = 0) {
  if (i < 0 || i >= LEN) return;
  L[i] += l; R[i] += r;
  if (send) { verbL[i] += l * send; verbR[i] += r * send; }
}
const panLR = (p) => [Math.cos((p + 1) * Math.PI / 4), Math.sin((p + 1) * Math.PI / 4)];

// --- instruments -----------------------------------------------------------------------------
function pad(notes, t0, dur, gain, { cutoff = 1400, attack = 0.9, release = 1.6, send = 0.5 } = {}) {
  const n = Math.floor((dur + release) * SR), s0 = Math.floor(t0 * SR);
  notes.forEach((m, k) => {
    const voices = [-7, 0, 6].map((c) => ({ f: mtof(m) * 2 ** (c / 1200), ph: (k * 0.37 + c) % 1 }));
    const [pl, pr] = panLR(((k % 2) * 2 - 1) * 0.35);
    let lp = 0;
    const a = 1 - Math.exp((-2 * Math.PI * cutoff) / SR);
    for (let i = 0; i < n; i++) {
      const t = i / SR;
      let s = 0;
      for (const v of voices) { v.ph = (v.ph + v.f / SR) % 1; s += 2 * v.ph - 1; }
      lp += a * (s / 3 - lp);
      const env = Math.min(1, t / attack) * (t > dur ? Math.exp(-(t - dur) / (release / 4)) : 1);
      const x = lp * env * gain / Math.sqrt(notes.length);
      add(s0 + i, x * pl, x * pr, send);
    }
  });
}

// Karplus-Strong pluck
function pluck(m, t0, gain, { pan = 0, decay = 0.996, send = 0.35, bright = 0.5 } = {}) {
  const f = mtof(m), period = Math.round(SR / f), buf = new Float32Array(period);
  for (let i = 0; i < period; i++) buf[i] = rnd();
  const [pl, pr] = panLR(pan), s0 = Math.floor(t0 * SR), n = Math.floor(2.2 * SR);
  let idx = 0, prev = 0;
  for (let i = 0; i < n; i++) {
    const cur = buf[idx];
    const next = decay * (bright * cur + (1 - bright) * prev);
    prev = cur; buf[idx] = next; idx = (idx + 1) % period;
    const env = Math.min(1, i / 48);
    add(s0 + i, cur * env * gain * pl, cur * env * gain * pr, send);
  }
}

function bell(m, t0, gain, len = 6) {
  const f = mtof(m), s0 = Math.floor(t0 * SR), n = Math.floor(len * SR);
  const partials = [[1, 1, 1], [2.0, 0.5, 0.6], [2.76, 0.35, 0.4], [5.4, 0.18, 0.25], [8.93, 0.08, 0.15]];
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let s = 0;
    for (const [r, a, d] of partials) s += a * Math.sin(2 * Math.PI * f * r * t) * Math.exp(-t / (len * d * 0.5));
    const x = s * gain * Math.min(1, t / 0.004);
    add(s0 + i, x * 0.9, x, 0.6);
  }
}

function kick(t0, gain) {
  const s0 = Math.floor(t0 * SR), n = Math.floor(0.45 * SR);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * (44 + 90 * Math.exp(-t / 0.035))) / SR;
    const x = Math.tanh(1.6 * Math.sin(ph)) * Math.exp(-t / 0.16) * gain;
    add(s0 + i, x, x);
  }
}

function hat(t0, gain, pan = 0.2) {
  const s0 = Math.floor(t0 * SR), n = Math.floor(0.09 * SR), [pl, pr] = panLR(pan);
  let prev = 0;
  for (let i = 0; i < n; i++) {
    const w = rnd(), x = (w - prev) * Math.exp(-i / SR / 0.022) * gain; // first difference = crude highpass
    prev = w;
    add(s0 + i, x * pl, x * pr, 0.1);
  }
}

function snap(t0, gain) {
  const s0 = Math.floor(t0 * SR), n = Math.floor(0.25 * SR);
  let bp1 = 0, bp2 = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    bp1 += 0.35 * (rnd() - bp1); bp2 += 0.35 * (bp1 - bp2);
    const x = (bp1 - bp2) * 3 * (Math.exp(-t / 0.05) + 0.4 * Math.exp(-Math.abs(t - 0.012) / 0.004)) * gain;
    add(s0 + i, x, x, 0.45);
  }
}

function bass(m, t0, dur, gain) {
  const f = mtof(m), s0 = Math.floor(t0 * SR), n = Math.floor((dur + 0.15) * SR);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const env = Math.min(1, t / 0.01) * (t > dur ? Math.exp(-(t - dur) / 0.04) : Math.exp(-t / 2.5));
    const x = Math.tanh(1.3 * (Math.sin(2 * Math.PI * f * t) + 0.25 * Math.sin(4 * Math.PI * f * t))) * env * gain;
    add(s0 + i, x, x);
  }
}

// filtered-noise swell that resolves on the next downbeat (used only at the two chapter changes)
function riser(t0, dur, gain) {
  const s0 = Math.floor(t0 * SR), n = Math.floor(dur * SR);
  let lp = 0;
  for (let i = 0; i < n; i++) {
    const p = i / n, a = 1 - Math.exp((-2 * Math.PI * (200 + 5000 * p * p)) / SR);
    lp += a * (rnd() - lp);
    const x = lp * p * p * gain;
    add(s0 + i, x * (1 - p * 0.3), x * (0.7 + p * 0.3), 0.5);
  }
}

// --- score ------------------------------------------------------------------------------------
const C = {
  Amaj9: [57, 61, 64, 68, 71], A: [57, 61, 64, 69], EG: [56, 59, 64, 68], Fm: [54, 57, 61, 66],
  D: [54, 57, 62, 66], E: [52, 56, 59, 64], Bm: [54, 59, 62, 66], AC: [61, 64, 69, 73], Esus: [52, 57, 59, 64], Aadd9: [57, 61, 64, 71],
};
const ROOT = { Amaj9: 45, A: 45, EG: 44, Fm: 42, D: 38, E: 40, Bm: 47, AC: 49, Esus: 40, Aadd9: 45 };
const prog = [
  "Amaj9", "Amaj9",                                  // open
  "A", "EG", "Fm", "D", "A", "E",                    // Salida
  "Fm", "D", "A", "E", "Fm", "D", "Bm", "E",         // Corazón
  "D", "AC", "Bm", "Fm", "D", "Esus", "E",           // Fondo
  "Aadd9", "Aadd9", "Aadd9",                         // cierre
];

// the three-note motif: one note per word of the pyramid, repeated at each chapter downbeat
const motif = (bar, gain) => [88, 85, 81].forEach((m, i) => pluck(m, at(bar, i + 1), gain, { pan: (i - 1) * 0.4, send: 0.6, bright: 0.6 }));

pad(C.Amaj9, at(0), BAR * 2, db(-14), { cutoff: 900, attack: 1.6 });
motif(0, db(-8));

for (let b = 2; b < 23; b++) {
  const ch = C[prog[b]], salida = b < 8, corazon = b >= 8 && b < 16, fondo = b >= 16;
  pad(ch, at(b), BAR, db(fondo ? -15 : salida ? -15 : -17), { cutoff: fondo ? 1100 : salida ? 1800 : 1500, attack: 0.25, release: 0.8 });
  // pluck arpeggio, 8ths; brighter/higher in Salida, sparser and lower in Fondo
  const pattern = [0, 2, 1, 3, 2, 1, 3, 2];
  for (let s = 0; s < 8; s++) {
    if (fondo && s % 2) continue;
    if (b === 22 && s >= 6) continue; // the gap before the close
    const m = ch[pattern[s] % ch.length] + (fondo ? 0 : 12);
    pluck(m, at(b, s / 2), db(salida ? -13 : -18), { pan: s % 2 ? 0.45 : -0.45, bright: salida ? 0.55 : 0.45 });
  }
  if (b === 8 || b === 16) motif(b, db(-14));
  if (!salida) {
    for (let k = 0; k < 4; k++) {
      if (b === 22 && k === 3) continue;
      if (fondo || k % 2 === 0) kick(at(b, k), db(fondo ? -12.5 : -14));
      if (k % 2 === 1) snap(at(b, k), db(-19));
    }
    bass(ROOT[prog[b]], at(b), b === 22 ? BAR - BEAT : BAR - 0.05, db(-16.5));
  }
  const hats = fondo ? 16 : 8;
  for (let h = 0; h < hats; h++) {
    if (b === 22 && h >= hats - hats / 4) continue;
    if (salida && h % 2 === 0) continue; // offbeat only in Salida
    hat(at(b, (h * 4) / hats), db(salida ? -27 : -25 - (h % 2) * 3));
  }
}
riser(at(7), BAR, db(-24));
riser(at(15), BAR, db(-22));

// cierre: the high note
pad(C.Aadd9, at(23), BAR * 2.4, db(-15), { cutoff: 1300, attack: 0.05, release: 2.5 });
bass(33, at(23), BAR * 2, db(-15));
kick(at(23), db(-11));
bell(93, at(23), db(-11), 7);
bell(81, at(23, 0.02), db(-22), 6);

// --- reverb (Schroeder: 4 combs + 2 allpasses per side) and master -------------------------
function reverb(input, combs, aps, out, wet) {
  const y = new Float32Array(LEN);
  for (const d of combs) {
    const buf = new Float32Array(d); let k = 0, lp = 0;
    for (let i = 0; i < LEN; i++) {
      const o = buf[k]; lp = o * 0.7 + lp * 0.3; buf[k] = input[i] + lp * 0.83; k = (k + 1) % d; y[i] += o / combs.length;
    }
  }
  for (const d of aps) {
    const buf = new Float32Array(d); let k = 0;
    for (let i = 0; i < LEN; i++) { const b = buf[k], v = y[i] + b * 0.5; buf[k] = v; y[i] = b - v * 0.5; k = (k + 1) % d; }
  }
  for (let i = 0; i < LEN; i++) out[i] += y[i] * wet;
}
reverb(verbL, [1557, 1617, 1491, 1422].map((d) => d * 2), [225, 556], L, 0.55);
reverb(verbR, [1577, 1601, 1513, 1446].map((d) => d * 2), [241, 579], R, 0.55);

function writeWav(file, chans) {
  const n = chans[0].length, data = Buffer.alloc(n * chans.length * 2);
  let peak = 0;
  for (const c of chans) for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(c[i]));
  const norm = db(-1.5) / peak;
  for (let i = 0; i < n; i++) chans.forEach((c, k) => data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, c[i] * norm)) * 32767), (i * chans.length + k) * 2));
  const h = Buffer.alloc(44);
  h.write("RIFF", 0); h.writeUInt32LE(36 + data.length, 4); h.write("WAVEfmt ", 8); h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20); h.writeUInt16LE(chans.length, 22); h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * chans.length * 2, 28);
  h.writeUInt16LE(chans.length * 2, 32); h.writeUInt16LE(16, 34); h.write("data", 36); h.writeUInt32LE(data.length, 40);
  fs.writeFileSync(file, Buffer.concat([h, data]));
  console.log(file, (n / SR).toFixed(2) + "s", "peak(pre-norm)=" + peak.toFixed(3));
}

for (let i = 0; i < LEN; i++) { L[i] = Math.tanh(L[i] * 1.1); R[i] = Math.tanh(R[i] * 1.1); } // gentle glue
fs.mkdirSync("public/audio/sfx", { recursive: true });
writeWav("public/audio/music.wav", [L, R]);

// UI tick: short, soft, high (used for the coupon apply and the tracking steps)
const tick = new Float32Array(Math.floor(0.12 * SR));
for (let i = 0; i < tick.length; i++) {
  const t = i / SR;
  tick[i] = (Math.sin(2 * Math.PI * 2400 * t) * 0.6 + Math.sin(2 * Math.PI * 3600 * t) * 0.25) * Math.exp(-t / 0.018) + rnd() * 0.15 * Math.exp(-t / 0.002);
}
writeWav("public/audio/sfx/tick.wav", [tick, tick]);
