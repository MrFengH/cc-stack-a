// Measures where camera targets sit inside the captured clips/stills (CSS px, 1920x1080 viewport),
// reproducing the exact capture states. Output: src/data/layout.json. Session-only, nothing persisted.
import fs from "node:fs";
import { launch, login, open } from "./capture/lib.mjs";

const { browser, page } = await launch({ dpr: 1 });
const out = {};
// rect of the element whose own text is `text` (or matching selector), viewport coords, optionally relative to `rel`
const rect = (text, { sel, rel, climb } = {}) =>
  page.evaluate(
    ({ text, sel, rel, climb }) => {
      const own = (el, t) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim() === t);
      let el = sel ? document.querySelector(sel) : [...document.querySelectorAll("main *")].find((e) => own(e, text));
      if (!el) return null;
      if (climb) el = el.closest(climb);
      const r = el.getBoundingClientRect();
      let ox = 0, oy = 0;
      if (rel) {
        const base = typeof rel === "string" ? document.querySelector(rel) ?? [...document.querySelectorAll("main *")].find((e) => own(e, rel)) : null;
        const b = base.getBoundingClientRect(); ox = b.left; oy = b.top;
      }
      return { x: Math.round(r.left - ox), y: Math.round(r.top - oy), w: Math.round(r.width), h: Math.round(r.height) };
    },
    { text, sel, rel, climb },
  );
const scrollToY = (y) => page.evaluate((y) => scrollTo(0, y), y);
const legendTop = (t) => page.evaluate((t) => [...document.querySelectorAll("main legend")].find((h) => h.textContent.trim() === t).getBoundingClientRect().top + scrollY, t);
const h2Top = (t) => page.evaluate((t) => [...document.querySelectorAll("main h2")].find((h) => h.textContent.trim() === t).getBoundingClientRect().top + scrollY, t);

// home hero (scroll 0)
await open(page, "/");
out.homeHeadline = await rect(null, { sel: "main h1" });

// search bar (header) at scroll 0
out.searchInput = await rect(null, { sel: 'header input[name="q"], header input[type="search"]' });

// filter clip: before (/tienda/ @240) and after (filtered @240)
await open(page, "/tienda/");
await scrollToY(240);
out.filterLink = await rect(null, { sel: 'main a[href="?precio_min=100&precio_max=150"]' });
out.filterCountBefore = await rect("23 perfumes");
await open(page, "/tienda/?precio_min=100&precio_max=150");
await scrollToY(240);
out.filterCards = await page.evaluate(() =>
  [...document.querySelectorAll("main article")].slice(0, 6).map((a) => {
    const img = a.querySelector("img").getBoundingClientRect();
    return { name: a.querySelector("h3, h2")?.textContent.trim(), x: Math.round(img.left), y: Math.round(img.top), w: Math.round(img.width), h: Math.round(img.height) };
  }),
);
out.filterCountAfter = await page.evaluate(() => {
  const el = [...document.querySelectorAll("main *")].find((e) => /^\d+ perfumes?$/.test(e.textContent.trim()) && e.children.length === 0);
  const r = el.getBoundingClientRect();
  return { text: el.textContent.trim(), x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) };
});

// product: pyramid in the last frame of product-to-pyramid, buybox/pyramid positions inside their stills
await open(page, "/perfume/dolce-gabbana-the-one-75ml/");
const buyboxSel = "main h1";
const bb = await page.evaluate((s) => {
  const h1 = document.querySelector(s);
  let el = h1;
  while (el && !el.querySelector("button[type=submit]")) el = el.parentElement;
  el.setAttribute("data-m", "buybox");
  return true;
}, buyboxSel);
if (bb) {
  out.buybox = {
    box: await rect(null, { sel: '[data-m="buybox"]' }),
    price: await rect("Ahorras $16.00 (12%)", { rel: '[data-m="buybox"]' }),
    stock: await page.evaluate(() => {
      const box = document.querySelector('[data-m="buybox"]').getBoundingClientRect();
      const el = [...document.querySelectorAll('[data-m="buybox"] *')]
        .filter((e) => e.textContent.includes("Disponible"))
        .sort((a, b) => a.textContent.length - b.textContent.length)[0].parentElement;
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.left - box.left), y: Math.round(r.top - box.top), w: Math.round(r.width), h: Math.round(r.height) };
    }),
  };
}
const py = await h2Top("Cómo evoluciona en la piel");
await scrollToY(py - 140);
out.pyramidInClip = {};
for (const t of ["Salida", "Corazón", "Fondo"]) out.pyramidInClip[t] = await rect(t, { climb: "div" });
out.pyramidCellsInClip = await page.evaluate(() => {
  const own = (el, t) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim() === t);
  const h2 = [...document.querySelectorAll("main h2")].find((h) => h.textContent.trim() === "Cómo evoluciona en la piel");
  const cont = h2.parentElement;
  const res = {};
  for (const t of ["Salida", "Corazón", "Fondo"]) {
    let el = [...cont.querySelectorAll("*")].find((e) => own(e, t));
    while (el.parentElement !== cont && el.parentElement.children.length < 3) el = el.parentElement;
    const r = el.getBoundingClientRect();
    res[t] = { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) };
  }
  const c = cont.getBoundingClientRect();
  res.container = { x: Math.round(c.left), y: Math.round(c.top), w: Math.round(c.width), h: Math.round(c.height) };
  return res;
});

// cart + checkout (client session)
await login(page, "client");
await open(page, "/perfume/dolce-gabbana-the-one-75ml/");
await page.click('form[action="/carrito/agregar/154/"] button[type="submit"]');
await page.waitForSelector("[data-toast]", { state: "visible" });
await open(page, "/carrito/");
out.cartBefore = { summary: await rect("Resumen", { climb: "aside, section, div.border, div" }), input: await rect(null, { sel: 'input[name="code"]' }), total: await rect("$119.00", { sel: "main [data-cart-total], main aside dd:last-of-type" }) };
await page.fill('input[name="code"]', "DG10");
await Promise.all([page.waitForNavigation({ waitUntil: "networkidle" }), page.click('form[action="/carrito/cupon/"] button[type="submit"]')]);
out.cartAfter = { discount: await rect("-$11.90"), total: await rect("$107.10"), summary: await rect(null, { sel: "main aside" }) };
await open(page, "/checkout/");
await scrollToY((await legendTop("Método de envío")) - 140);
out.checkout = {};
for (const v of ["ciudad", "interior", "retiro", "tarjeta", "yappy", "ach", "contra_entrega"]) out.checkout[v] = await rect(null, { sel: `input[value="${v}"]`, climb: "label" });
out.checkout.total = await rect("$107.10");
out.checkout.summary = await rect("Tu pedido", { climb: "aside, div" });
// empty the session cart again
await open(page, "/carrito/");
while (await page.locator('form[action^="/carrito/quitar/"] button').count())
  await Promise.all([page.waitForNavigation({ waitUntil: "networkidle" }), page.locator('form[action^="/carrito/quitar/"] button').first().click()]);

fs.writeFileSync("src/data/layout.json", JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
await browser.close();
