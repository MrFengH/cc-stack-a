// Read-only exploration: dumps text, links, forms and a small screenshot per page.
// Usage: node scripts/explore.mjs <role:anon|client|admin> <path> [<path>...]
import { chromium } from "playwright";
import fs from "node:fs";

const BASE = "http://127.0.0.1:8001";
const CREDS = {
  client: ["cliente@notaalta.example", "Cliente2026!"],
  admin: ["admin@notaalta.example", "NotaAlta2026!"],
};
const [role, ...paths] = process.argv.slice(2);
const OUT = "scratch/explore";
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

if (CREDS[role]) {
  await page.goto(`${BASE}/cuenta/ingresar/`);
  await page.fill('input[name="username"]', CREDS[role][0]);
  await page.fill('input[name="password"]', CREDS[role][1]);
  await Promise.all([page.waitForLoadState("networkidle"), page.click('form button[type="submit"]')]);
  console.log("login ->", page.url());
}

for (const p of paths) {
  const res = await page.goto(BASE + p, { waitUntil: "networkidle" });
  const info = await page.evaluate(() => ({
    title: document.title,
    h: document.documentElement.scrollHeight,
    text: document.querySelector("main")?.innerText ?? document.body.innerText,
    links: [...new Set([...document.querySelectorAll("main a[href]")].map((a) => a.getAttribute("href")))].slice(0, 60),
    forms: [...document.querySelectorAll("main form")].map((f) => ({
      action: f.getAttribute("action"),
      method: f.method,
      fields: [...f.elements].filter((e) => e.name).map((e) => `${e.name}${e.type ? ":" + e.type : ""}${e.value ? "=" + e.value : ""}`).slice(0, 40),
    })),
  }));
  const name = (role + p).replace(/[^a-z0-9]+/gi, "_");
  await page.screenshot({ path: `${OUT}/${name}.jpg`, type: "jpeg", quality: 60, scale: "css" });
  console.log(`\n===== [${res.status()}] ${p}  title="${info.title}" height=${info.h}`);
  console.log(info.text.replace(/\n{2,}/g, "\n").slice(0, 2500));
  console.log("LINKS:", info.links.join(" "));
  console.log("FORMS:", JSON.stringify(info.forms));
}
await browser.close();
