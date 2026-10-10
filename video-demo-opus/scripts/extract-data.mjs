// Extracts the real figures the film animates (read-only) into src/data/real.json.
import { chromium } from "playwright";
import fs from "node:fs";

const BASE = "http://127.0.0.1:8001";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto(`${BASE}/cuenta/ingresar/`);
await page.fill('input[name="username"]', "admin@notaalta.example");
await page.fill('input[name="password"]', "NotaAlta2026!");
await Promise.all([page.waitForURL((u) => !u.pathname.includes("ingresar")), page.click('form button[type="submit"]')]);

await page.goto(`${BASE}/panel/`, { waitUntil: "networkidle" });
const panel = await page.evaluate(() => {
  const rows = [...document.querySelectorAll("main details table tbody tr, main table")]
    .filter((el) => el.tagName === "TR")
    // the table lives in a closed <details>, so innerText is empty
    .map((tr) => [...tr.cells].map((c) => c.textContent.trim()));
  const kpis = [...document.querySelectorAll("main dl, main [class*=grid] > div")]
    .map((d) => d.innerText.replace(/\s+/g, " ").trim())
    .filter((t) => t.length < 80)
    .slice(0, 12);
  return { salesTable: rows, kpis, stamp: document.querySelector("main p")?.innerText };
});
await page.goto(`${BASE}/panel/clientes/`, { waitUntil: "networkidle" });
const clientes = await page.evaluate(() => document.querySelector("main").innerText.replace(/\n{2,}/g, "\n").slice(0, 1500));
await page.goto(`${BASE}/panel/pedidos/412/`, { waitUntil: "networkidle" });
const order = await page.evaluate(() => document.querySelector("main").innerText.replace(/\n{2,}/g, "\n").slice(0, 1500));
await page.screenshot({ path: "scratch/explore/admin_order_412.jpg", type: "jpeg", quality: 60 });
console.log(JSON.stringify(panel, null, 1));
console.log("=== CLIENTES\n" + clientes + "\n=== ORDER 412\n" + order);
fs.mkdirSync("src/data", { recursive: true });
fs.writeFileSync("src/data/sales.json", JSON.stringify(panel.salesTable, null, 1));
await browser.close();
