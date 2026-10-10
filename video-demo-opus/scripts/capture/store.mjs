// Storefront material (anonymous visitor): discovery + product page.
import { launch, open, assertClean, mark, still, Clip, easeOutQuart } from "./lib.mjs";

const only = process.argv[2];
const want = (k) => !only || only.split(",").includes(k);
const { browser, page } = await launch();
const topOf = (sel) => page.evaluate((s) => document.querySelector(s).getBoundingClientRect().top + scrollY, sel);
const topOfText = (t) =>
  page.evaluate((t) => [...document.querySelectorAll("main h1,main h2,main h3")].find((h) => h.textContent.trim() === t).getBoundingClientRect().top + scrollY, t);

if (want("home")) {
  await open(page, "/");
  await still(page, "home-hero");
  const c = new Clip(page, "home-hero");
  await c.frame();
  c.hold(12);
  await c.scroll(470, 96);
  c.hold(18);
  c.encode();

  // Families block, isolated, and the editorial category row
  const y = await topOfText("Elige por cómo quieres oler");
  await page.evaluate((y) => scrollTo(0, y - 120), y);
  await still(await mark(page, "Elige por cómo quieres oler", "fam", { climb: "section" }), "home-families");
  for (const fam of ["Cítricos", "Florales", "Amaderados", "Gourmand"]) {
    await still(await mark(page, fam, `fam-${fam}`, { climb: "a" }), `family-${fam.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "")}`);
  }
  await still(await mark(page, "10% de descuento en tu compra", "promo", { climb: "card" }), "home-nota10");
}

if (want("search")) {
  await open(page, "/");
  const c = new Clip(page, "search-vainilla");
  await c.frame();
  c.hold(6);
  await c.type('header input[type="search"], header input[name="q"]', "vainilla", 4);
  c.hold(8);
  const [res] = await Promise.all([page.waitForNavigation({ waitUntil: "networkidle" }), page.keyboard.press("Enter")]);
  await assertClean(page, res);
  await c.frame();
  c.hold(10);
  await c.scroll(300, 40, easeOutQuart);
  c.hold(24);
  c.encode();
  await still(page, "search-results");
}

if (want("filter")) {
  await open(page, "/tienda/");
  const c = new Clip(page, "filter-price");
  await page.evaluate(() => scrollTo(0, 240));
  await c.frame();
  c.hold(14);
  const link = page.locator('main a[href="?precio_min=100&precio_max=150"]').first();
  const [res] = await Promise.all([page.waitForNavigation({ waitUntil: "networkidle" }), link.click()]);
  await assertClean(page, res);
  await page.evaluate(() => scrollTo(0, 240));
  await c.frame();
  c.hold(30);
  c.encode();
}

if (want("brands")) {
  await open(page, "/marcas/");
  await still(await mark(page, "Las más buscadas", "brands", { climb: "section" }), "brands-top");
  const c = new Clip(page, "brands-scroll");
  await c.frame();
  c.hold(8);
  await c.scroll(760, 70);
  c.hold(10);
  c.encode();
}

if (want("product")) {
  await open(page, "/tienda/");
  await still(await mark(page, "The One", "card-one", { climb: "article" }), "card-the-one");

  await open(page, "/perfume/dolce-gabbana-the-one-75ml/");
  await still(page, "product-the-one");
  await still(page.locator("[data-gallery-main]").first(), "product-photo-the-one");
  await still(page.locator("main h1").locator("xpath=ancestor::div[.//button[contains(., 'Agregar al carrito')]][1]"), "product-buybox");
  const py = await topOfText("Cómo evoluciona en la piel");
  await page.evaluate((y) => scrollTo(0, y - 100), py);
  await still(page.locator("main h2", { hasText: "Cómo evoluciona en la piel" }).locator("xpath=.."), "product-pyramid");

  await open(page, "/perfume/dolce-gabbana-the-one-75ml/"); // fresh page: drop the still-only header style
  const c = new Clip(page, "product-to-pyramid");
  await c.frame();
  c.hold(10);
  await c.scroll(py - 140, 84);
  c.hold(30);
  c.encode();
}

await browser.close();
