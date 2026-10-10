// Capture toolkit: deterministic, frame-stepped clips and 2x element stills from the live app.
// Read-only by design: it only navigates, fills session-scoped forms and never submits checkout.
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export const BASE = "http://127.0.0.1:8001";
export const REC = path.resolve("public/recordings");
const FFMPEG = path.resolve("node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe");
const TMP = path.resolve("scratch/frames");

const CREDS = {
  client: ["cliente@notaalta.example", "Cliente2026!"],
  admin: ["admin@notaalta.example", "NotaAlta2026!"],
};

export const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
export const easeOutQuart = (t) => 1 - (1 - t) ** 4;

export async function launch({ dpr = 2, viewport = { width: 1920, height: 1080 } } = {}) {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport, deviceScaleFactor: dpr, locale: "es-PA" });
  const page = await context.newPage();
  return { browser, page };
}

export async function login(page, role) {
  await page.goto(`${BASE}/cuenta/ingresar/`);
  await page.fill('input[name="username"]', CREDS[role][0]);
  await page.fill('input[name="password"]', CREDS[role][1]);
  await Promise.all([page.waitForURL((u) => !u.pathname.includes("ingresar")), page.click('form button[type="submit"]')]);
}

// Loads a page and fails loudly on anything that is not a clean 200 (no 404/500/debug pages in the film).
export async function open(page, url) {
  const res = await page.goto(BASE + url, { waitUntil: "networkidle" });
  await assertClean(page, res);
}

export async function assertClean(page, res) {
  if (res && res.status() !== 200) throw new Error(`HTTP ${res.status()} at ${page.url()}`);
  const bad = await page.evaluate(() => /Traceback|Page not found|Server Error|DoesNotExist|DEBUG = True/.test(document.body.innerText));
  if (bad) throw new Error(`Error page content at ${page.url()}`);
  await page.evaluate(async () => {
    await document.fonts.ready;
    document.documentElement.style.scrollBehavior = "auto"; // we drive the scroll per frame
    // lazy images would pop in mid-scroll: load them all up front, with a timeout as safety net
    document.querySelectorAll('img[loading="lazy"]').forEach((i) => (i.loading = "eager"));
    const pending = [...document.images].filter((i) => !i.complete).map((i) => new Promise((r) => (i.onload = i.onerror = r)));
    await Promise.race([Promise.all(pending), new Promise((r) => setTimeout(r, 8000))]);
  });
}

// Marks the nearest "card-like" ancestor of the element whose own text matches, so it can be screenshotted.
export async function mark(page, text, id, { climb = "card", minWidth = 0 } = {}) {
  const ok = await page.evaluate(
    ({ text, id, climb, minWidth }) => {
      const all = [...document.querySelectorAll("main *")];
      const hit = all.find((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim() === text));
      if (!hit) return false;
      let el = hit;
      const isCard = (e) => {
        const cs = getComputedStyle(e);
        const r = e.getBoundingClientRect();
        return r.width >= minWidth && (cs.borderTopWidth !== "0px" || (cs.backgroundColor !== "rgba(0, 0, 0, 0)" && e.tagName !== "MAIN"));
      };
      if (climb === "card") while (el && el.tagName !== "MAIN" && !isCard(el)) el = el.parentElement;
      else if (climb !== "self") el = hit.closest(climb);
      if (!el || el.tagName === "MAIN") return false;
      el.setAttribute("data-cap", id);
      return true;
    },
    { text, id, climb, minWidth },
  );
  if (!ok) throw new Error(`mark: could not find "${text}"`);
  return page.locator(`[data-cap="${id}"]`);
}

// Marks the lowest common ancestor of the elements whose own text matches each of `texts`.
export async function markCommon(page, texts, id) {
  const ok = await page.evaluate(
    ({ texts, id }) => {
      const all = [...document.querySelectorAll("main *")];
      const hits = texts.map((t) => all.find((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim() === t)));
      if (hits.some((h) => !h)) return false;
      let el = hits[0];
      while (el && !hits.every((h) => el.contains(h))) el = el.parentElement;
      el?.setAttribute("data-cap", id);
      return !!el;
    },
    { texts, id },
  );
  if (!ok) throw new Error(`markCommon: could not find ${texts}`);
  return page.locator(`[data-cap="${id}"]`);
}

export async function still(target, name, opts = {}) {
  fs.mkdirSync(path.join(REC, "stills"), { recursive: true });
  const file = path.join(REC, "stills", `${name}.png`);
  // element stills only: keep the sticky header from overlapping the isolated element
  const isPage = typeof target.locator === "function" && typeof target.goto === "function";
  if (!isPage) await target.page().addStyleTag({ content: "header{position:static!important}" });
  await target.screenshot({ path: file, animations: "disabled", ...opts });
  console.log("still", name);
  return file;
}

export class Clip {
  constructor(page, name) {
    this.page = page;
    this.name = name;
    this.dir = path.join(TMP, name);
    fs.rmSync(this.dir, { recursive: true, force: true });
    fs.mkdirSync(this.dir, { recursive: true });
    this.n = 0;
  }
  get file() {
    return path.join(this.dir, `${String(this.n).padStart(5, "0")}.jpg`);
  }
  async frame() {
    await this.page.screenshot({ path: this.file, type: "jpeg", quality: 92 });
    this.n++;
  }
  // Duplicates the last frame; the page is static during holds.
  hold(count) {
    const last = path.join(this.dir, `${String(this.n - 1).padStart(5, "0")}.jpg`);
    for (let i = 0; i < count; i++) {
      fs.copyFileSync(last, this.file);
      this.n++;
    }
  }
  // Eased programmatic scroll: one rAF-aligned position per output frame (30 fps timeline).
  async scroll(toY, frames, ease = easeInOutCubic) {
    const fromY = await this.page.evaluate(() => window.scrollY);
    for (let i = 1; i <= frames; i++) {
      const y = fromY + (toY - fromY) * ease(i / frames);
      await this.page.evaluate((y) => new Promise((r) => requestAnimationFrame(() => { window.scrollTo(0, y); requestAnimationFrame(r); })), y);
      await this.frame();
    }
  }
  async type(selector, text, framesPerChar = 4) {
    await this.page.focus(selector);
    await this.frame();
    for (const ch of text) {
      await this.page.keyboard.type(ch);
      await this.frame();
      this.hold(framesPerChar - 1);
    }
  }
  // Real-time-ish capture while CSS transitions/toasts play: frames taken as fast as possible.
  async live(count) {
    for (let i = 0; i < count; i++) await this.frame();
  }
  encode({ width = 2880 } = {}) {
    fs.mkdirSync(REC, { recursive: true });
    const out = path.join(REC, `${this.name}.mp4`);
    execFileSync(FFMPEG, [
      "-y", "-loglevel", "error", "-framerate", "30", "-i", path.join(this.dir, "%05d.jpg"),
      "-vf", `scale=${width}:-2:flags=lanczos`, "-c:v", "libx264", "-preset", "slow", "-crf", "14",
      "-pix_fmt", "yuv420p", "-g", "15", "-movflags", "+faststart", out,
    ]);
    // full-res last frame: shots freeze on it and keep moving the camera after the clip ends
    fs.mkdirSync(path.join(REC, "stills"), { recursive: true });
    fs.copyFileSync(path.join(this.dir, `${String(this.n - 1).padStart(5, "0")}.jpg`), path.join(REC, "stills", `${this.name}-last.jpg`));
    console.log("clip", this.name, this.n, "frames");
    return out;
  }
}
