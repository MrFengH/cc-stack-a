// Every figure shown on screen, as rendered by the app at http://127.0.0.1:8001 on 2026-10-09.
// Source page in each comment. Nothing here is invented or rounded.
import salesRows from "./sales.json";

// /panel/ — "Resumen" KPI row and chart header
export const KPIS = [
  { label: "Total vendido", value: 10560.5, money: true },
  { label: "Pedidos", value: 54, money: false },
  { label: "Ticket promedio", value: 195.56, money: true },
  { label: "Clientes registrados", value: 13, money: false },
] as const;
export const SALES_30D_TOTAL = 6786.3; // "$6,786.30 · +79,8% frente a los 30 días anteriores"
export const SALES_30D_DELTA = "+79,8%";
export const SALES_MAX_LABEL = "$954.00";

// /panel/ "Ventas por día, últimos 30 días" — the accessible data table under the chart
export const SALES_DAILY: { day: string; value: number }[] = (salesRows as string[][]).map(([day, v]) => ({
  day,
  value: Number(v.replace(/[$,]/g, "")),
}));

// /marcas/ — 14 houses
export const BRANDS = [
  "Antonio Banderas",
  "Chanel",
  "Dolce & Gabbana",
  "Escada",
  "Giorgio Armani",
  "Guerlain",
  "Hugo Boss",
  "Lancôme",
  "Miu Miu",
  "Narciso Rodriguez",
  "Petit Atelier",
  "Prada",
  "Versace",
  "Yves Saint Laurent",
];

// /perfume/dolce-gabbana-the-one-75ml/ and /carrito/ with DG10
export const THE_ONE = { price: "$119.00", before: "$135.00", total: "$107.10", discount: "-$11.90" };

// /perfume/... "Cómo evoluciona en la piel"
export const NOTES = [
  { name: "Salida", when: "Primeros 15 minutos" },
  { name: "Corazón", when: "De 30 minutos a 3 horas" },
  { name: "Fondo", when: "Lo que queda al final del día" },
] as const;

export const money = (v: number) => "$" + v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
