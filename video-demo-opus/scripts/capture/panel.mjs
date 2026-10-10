// Admin panel material. Read-only: GET pages only, no form is submitted.
import { launch, login, open, mark, markCommon, still, Clip } from "./lib.mjs";

const { browser, page } = await launch();
await login(page, "admin");

await open(page, "/panel/");
await still(page, "panel");
await still(await markCommon(page, ["Total vendido", "Clientes registrados"], "kpis"), "panel-kpis");
for (const [t, n] of [["Ventas por día, últimos 30 días", "panel-chart"], ["Pedidos por estado", "panel-status"], ["Más vendidos", "panel-top"], ["Stock bajo", "panel-lowstock"], ["Pedidos recientes", "panel-recent"]]) {
  await still(await mark(page, t, n, { climb: "card", minWidth: 300 }), n);
}
await open(page, "/panel/");
const c = new Clip(page, "panel-scroll");
await c.frame();
c.hold(10);
await c.scroll(640, 90);
c.hold(14);
c.encode();

await open(page, "/panel/pedidos/");
const o = new Clip(page, "panel-orders");
await o.frame();
o.hold(6);
await o.scroll(900, 90);
o.hold(8);
o.encode();

await open(page, "/panel/inventario/");
await still(page, "panel-inventory");
await still(await markCommon(page, ["Unidades en stock", "Agotados"], "inv"), "panel-inventory-kpis");

await open(page, "/panel/clientes/");
await still(page, "panel-customers");
await browser.close();
