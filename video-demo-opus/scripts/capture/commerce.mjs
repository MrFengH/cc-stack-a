// Purchase + after-purchase material as the demo client. Session-only: cart and coupon live in the
// session; checkout options are clicked but the order is never confirmed. The cart is emptied at the end.
import { launch, login, open, assertClean, mark, still, Clip, BASE } from "./lib.mjs";

const only = process.argv[2];
const want = (k) => !only || only.split(",").includes(k);
const { browser, page } = await launch();
await login(page, "client");

const clearCart = async () => {
  await open(page, "/carrito/");
  while (await page.locator('form[action^="/carrito/quitar/"] button').count()) {
    await Promise.all([page.waitForNavigation({ waitUntil: "networkidle" }), page.locator('form[action^="/carrito/quitar/"] button').first().click()]);
  }
};

try {
  if (want("cart") || want("checkout")) {
    await clearCart();
    await open(page, "/perfume/dolce-gabbana-the-one-75ml/");
    await page.click('form[action="/carrito/agregar/154/"] button[type="submit"]');
    await page.waitForSelector("[data-toast]", { state: "visible" });
  }

  if (want("cart")) {
    await open(page, "/carrito/");
    await still(await mark(page, "Resumen", "sum0", { climb: "card" }), "cart-summary-before");
    await open(page, "/carrito/");
    const c = new Clip(page, "cart-dg10");
    await c.frame();
    c.hold(8);
    await c.type('input[name="code"]', "DG10", 5);
    c.hold(6);
    const [res] = await Promise.all([page.waitForNavigation({ waitUntil: "networkidle" }), page.click('form[action="/carrito/cupon/"] button[type="submit"]')]);
    await assertClean(page, res);
    await c.live(6);
    c.hold(40);
    c.encode();
    await still(await mark(page, "Resumen", "sum1", { climb: "card" }), "cart-summary-dg10");
  }

  if (want("checkout")) {
    // continuity with the cart shot: the checkout carries the DG10 discount
    await open(page, "/carrito/");
    if (await page.locator('input[name="code"]').count()) {
      await page.fill('input[name="code"]', "DG10");
      await Promise.all([page.waitForNavigation({ waitUntil: "networkidle" }), page.click('form[action="/carrito/cupon/"] button[type="submit"]')]);
    }
    await open(page, "/checkout/");
    if (!(await page.getByText("Cupón DG10").count())) throw new Error("checkout without DG10");
    const y = await page.evaluate(() => [...document.querySelectorAll("main legend")].find((h) => h.textContent.trim() === "Método de envío").getBoundingClientRect().top + scrollY);
    await page.evaluate((y) => scrollTo(0, y - 140), y);
    const c = new Clip(page, "checkout-options");
    await c.frame();
    c.hold(16);
    await page.locator('input[name="shipping_method"][value="retiro"]').check();
    await c.live(4);
    c.hold(20);
    await page.locator('input[name="payment_method"][value="yappy"]').check();
    await c.live(4);
    c.hold(20);
    await page.locator('input[name="payment_method"][value="ach"]').check();
    await c.live(4);
    c.hold(12);
    await page.locator('input[name="payment_method"][value="yappy"]').check();
    await c.live(4);
    c.hold(30);
    c.encode();
    // isolated groups in their final (Retiro + Yappy) state
    await still(page.locator("main fieldset", { has: page.locator("legend", { hasText: "Método de envío" }) }), "checkout-shipping");
    await still(page.locator("main fieldset", { has: page.locator("legend", { hasText: "Método de pago" }) }), "checkout-payment");
    await still(await mark(page, "Tu pedido", "order-sum", { climb: "card" }), "checkout-summary");
  }

  if (want("account")) {
    await open(page, "/cuenta/");
    await still(page, "account");
    await still(page.locator("main h2", { hasText: "Mis pedidos" }).locator("xpath=.."), "account-orders");
    await open(page, "/cuenta/pedidos/411/");
    await still(page, "order-411");
    await still(await mark(page, "Seguimiento", "track", { climb: "card" }), "order-411-tracking");
  }
} finally {
  await clearCart();
  await browser.close();
}
