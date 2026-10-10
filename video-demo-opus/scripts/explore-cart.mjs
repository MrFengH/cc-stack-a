// Session-only exploration of cart -> coupon -> checkout. Never submits the checkout form.
import { chromium } from "playwright";
import fs from "node:fs";

const BASE = "http://127.0.0.1:8001";
const OUT = "scratch/explore";
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

const dump = async (label) => {
  const text = await page.evaluate(() => document.querySelector("main")?.innerText ?? "");
  await page.screenshot({ path: `${OUT}/cart_${label}.jpg`, type: "jpeg", quality: 60 });
  console.log(`\n===== ${label} ${page.url()}\n` + text.replace(/\n{2,}/g, "\n").slice(0, 3000));
};

await page.goto(`${BASE}/cuenta/ingresar/`);
await page.fill('input[name="username"]', "cliente@notaalta.example");
await page.fill('input[name="password"]', "Cliente2026!");
await Promise.all([page.waitForURL((u) => !u.pathname.includes("ingresar")), page.click('form button[type="submit"]')]);

await page.goto(`${BASE}/perfume/dolce-gabbana-the-one-75ml/`);
await Promise.all([page.waitForLoadState("networkidle"), page.click('form[action="/carrito/agregar/154/"] button[type="submit"]')]);
await dump("after_add");
await page.goto(`${BASE}/carrito/`);
await dump("cart");
const forms = await page.evaluate(() => [...document.querySelectorAll("main form")].map((f) => f.getAttribute("action") + " " + [...f.elements].map((e) => e.name).join(",")));
console.log("FORMS", forms);
await page.fill('input[name="code"]', "DG10");
await Promise.all([page.waitForLoadState("networkidle"), page.click('form[action="/carrito/cupon/"] button[type="submit"]')]);
await dump("cart_dg10");
await page.goto(`${BASE}/checkout/`);
await dump("checkout");
const radios = await page.evaluate(() => [...document.querySelectorAll("main input[type=radio]")].map((r) => `${r.name}=${r.value}${r.checked ? "*" : ""}`));
console.log("RADIOS", radios);
await page.evaluate(() => window.scrollTo(0, 700));
await page.screenshot({ path: `${OUT}/cart_checkout_mid.jpg`, type: "jpeg", quality: 60 });
// clean the session cart
await page.goto(`${BASE}/carrito/`);
const rm = page.locator('form[action^="/carrito/quitar/"] button');
if (await rm.count()) await Promise.all([page.waitForLoadState("networkidle"), rm.first().click()]);
await browser.close();
