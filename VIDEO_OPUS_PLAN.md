# Nota Alta — Product Film (versión Opus)

> Dirección creativa. No es un guion frame a frame: el plan marca intención, estructura y reglas; la producción puede corregirlo.

## 1. Lo que encontré explorando la app

Fuente de verdad: la app renderizada en `http://127.0.0.1:8001` (explorada con Playwright, como visitante, cliente y admin).

- **La tienda es sobria y fotográfica.** Fondo hueso `#f1f2ee`, verde pino `#23463c`, naranja de oferta `#b8431f`, Schibsted Grotesk. Fotografía real de producto. Nada de negro con dorado.
- **La ficha de producto tiene una sección «Cómo evoluciona en la piel»** con tres filas: **Salida** («Primeros 15 minutos»), **Corazón** («De 30 minutos a 3 horas») y **Fondo** («Lo que queda al final del día»). Es el detalle más propio del producto y la base del concepto.
- **Momento cupón (real):** The One (Dolce & Gabbana) cuesta **$119.00** (antes $135.00, −12 %). Con **DG10** el carrito muestra **−$11.90** y un total de **$107.10**. Envío en Ciudad de Panamá: gratis.
- **Checkout:** envío Ciudad de Panamá / interior ($9.00) / **retiro en tienda** (listo en 4 horas). Pago con tarjeta, **Yappy**, **transferencia ACH** o contra entrega.
- **Cliente (Mariela Ríos):** 9 pedidos, 2 en curso, $2,615.20 comprados. El pedido NA-00411 tiene un stepper de seguimiento: Pendiente de pago → Pagado → En preparación → Enviado → Entregado.
- **Panel:** Total vendido **$10,560.50**, **54** pedidos, ticket promedio **$195.56**, **13** clientes registrados; ventas de los últimos 30 días **$6,786.30 (+79,8 %)**, con la serie diaria real en una tabla accesible. Pedidos por estado, más vendidos, stock bajo («Hugo Boss Boss Bottled — Agotado»). Inventario: **245** unidades y **$23,509.00** a precio de venta.
- **Descubrimiento:** 23 perfumes, 14 marcas, 8 familias olfativas, búsqueda por nota («vainilla» → 10 perfumes) y filtros por precio, marca, familia, concentración y oferta.

## 2. Concepto central — «Tres notas»

**Un perfume se cuenta en tres notas. Nota Alta también.**

La película toma prestada la estructura de la pirámide olfativa, que la propia app enseña en cada ficha, y la convierte en la estructura narrativa del comercial:

| Nota | En la piel (copy real de la app) | En el producto |
|---|---|---|
| **Salida** | Primeros 15 minutos | Descubrir: familias, búsqueda, filtros, marcas, catálogo |
| **Corazón** | De 30 minutos a 3 horas | Decidir y comprar: ficha, pirámide, precio, cupón, envío o retiro, Yappy/ACH |
| **Fondo** | Lo que queda al final del día | Lo que permanece: pedidos, seguimiento y el panel (ventas, pedidos, stock) |

**Por qué funciona**
- Viene del producto, no de un adorno: el espectador ve la pirámide en la UI a mitad del film y entiende que la estructura salió de ahí. El concepto *es* una funcionalidad.
- Ordena 30+ funcionalidades en tres ideas que se recuerdan: descubrir, comprar, sostener.
- Lleva al cliente y al negocio en una sola historia. El «fondo» que queda al final del día es el pedido que llega y la venta que se registra.
- El nombre de la marca cierra la idea: la pieza termina, literalmente, en una **nota alta** (firma sonora).

**Mensaje:** Nota Alta es una experiencia moderna y completa para descubrir y comprar perfumes en Panamá, de la primera nota a la última.

## 3. Estructura narrativa (~60 s)

Rejilla musical de **100 BPM**: 1 tiempo = 18 frames y 1 compás = 72 frames a 30 fps. Cortes y acentos caen en la rejilla.

1. **Apertura (≈5 s).** Fondo hueso, silencio y luego un pulso. Las tres palabras de la pirámide aparecen como tipografía, con su copy real («Primeros 15 minutos»…). VO: *«Todo perfume se cuenta en tres notas.»* «Salida» crece y nos lleva dentro.
2. **Salida — descubrir (≈14 s).** Ritmo rápido y aireado. La home entra con push-in; las familias olfativas cambian a tempo (Cítricos · Florales · Amaderados · Gourmand); la búsqueda escribe «vainilla» y los resultados se ordenan; los filtros reconfiguran la rejilla; los nombres de las marcas pasan en tipografía grande. Termina con un match-zoom de la tarjeta de The One a su ficha.
3. **Corazón — elegir (≈18 s).** Más cálido, con el beat completo. Ficha de The One aislada: foto, precio y «Disponible: 10 unidades». Revelación: la sección «Cómo evoluciona en la piel» en la UI real (el momento de «ah, de ahí sale todo»). Carrito, **DG10**: $119.00 se tacha y rueda a **$107.10**. Checkout en composición partida: envío → retiro en tienda; pago → Yappy / ACH.
4. **Fondo — lo que queda (≈17 s).** La fila «Fondo» de la pirámide real hace de transición: zoom hasta que la palabra llena la pantalla y el fondo vira a verde pino. Seguimiento del pedido (stepper que se completa) e historial. Luego el negocio: KPIs que cuentan hasta las cifras reales, la gráfica de 30 días reconstruida desde la tabla real, pedidos por estado y stock bajo e inventario.
5. **Cierre (≈6 s).** Logotipo tipográfico «Nota Alta». *«Perfumería online en Panamá.»* Una nota aguda sostenida cierra la música.

## 4. Lenguaje visual

- **Arco de color = descenso por la pirámide.** Salida en hueso claro (`#f1f2ee`), Corazón en salvia (`#e4e8e1`), Fondo en pino profundo (`#183229`). El color cuenta en qué nota estamos sin explicarlo.
- **Tipografía:** Schibsted Grotesk (la de la marca), tracking negativo y pesos 500/600. Las palabras-capítulo en escala display (200 px o más). Las etiquetas pequeñas usan **copy literal de la UI**. Nunca captions genéricos.
- **Indicador de notas:** una marca discreta en el borde izquierdo con tres ticks (Salida/Corazón/Fondo) que desciende con la película. Es el único elemento persistente.
- **Naranja `#b8431f` reservado para dinero:** descuentos, precio rebajado y cupón. Así el ojo aprende que naranja significa ahorro.

## 5. Tratamiento de la UI

- La UI es materia prima: **capturas de elementos a 2×** (precio, pirámide, resumen del carrito, stepper, KPIs) para aislarlas y componerlas con nitidez; **clips frame a frame** para scroll e interacciones.
- Nada de mockups de navegador ni marcos de dispositivo genéricos. La UI flota sobre el color del capítulo con sombra mínima, o llena el encuadre.
- Si un clip muestra un error, se regraba. No se tapa nada.

## 6. Cámara y motion

- **Cámara:** push-ins lentos sobre UI completa (2–4 % por segundo) y **snap-zooms** solo en momentos de dato (precio final, total vendido).
- **Transiciones derivadas del producto:**
  - *Scroll-push vertical* entre bloques: el lenguaje de la propia web. Se refuerza el descenso.
  - *Match-zoom* tarjeta de catálogo → ficha (Salida → Corazón).
  - *Pirámide-como-transición:* la fila «Fondo» de la UI real se convierte en el título del capítulo 3.
  - *Máscaras* con forma de los propios contenedores de la UI (cards, botones) para revelar el plano siguiente.
- **Números:** tachado dibujado y odómetro en el precio. Contadores con easing exponencial en los KPIs. Barras de la gráfica escalonadas al tempo.
- **Springs** con poco rebote (damping alto). Overshoot solo en el precio final y el cierre.
- **Regla:** si un movimiento no ayuda al ritmo, la jerarquía o la continuidad, se quita.

## 7. Funcionalidades: desarrolladas vs. condensadas

- **Desarrolladas (momentos hero):** pirámide olfativa · cupón DG10 → $107.10 · seguimiento del pedido · panel con ventas/gráfica.
- **Condensadas (un golpe de 1–2 s cada una):** familias, búsqueda, filtros, marcas, catálogo, disponibilidad, descuentos, envío/retiro, Yappy/ACH, historial, pedidos por estado, clientes registrados, inventario/stock bajo.
- **Fuera:** registro, edición de perfil, formularios de producto/marca en el panel (escriben en BD o no aportan al relato).

## 8. Audio

- **Música original, compuesta por código** (`scripts/music.mjs`): sintetizador determinista en Node que escribe un WAV a 100 BPM, cuadrado con los cortes. Pads cálidos y plucks agudos en Salida; entran el kick suave y el bajo en Corazón; registro grave y más cuerpo en Fondo. El cierre es una **nota alta** sostenida (campana) sobre el logotipo: la firma sonora del nombre.
- **Voz:** narración breve en español latino con `es-PA-MargaritaNeural` (Edge TTS), unas 5 frases cortas que dejan respirar la pieza. Si suena a locutor genérico, se recorta o se elimina.
- **Ducking** de la música bajo la voz. SFX mínimos: un «tick» de UI en el cupón y en el stepper, nada de whooshes en cada corte.
- **Subtítulos:** no. La tipografía cinética ya lleva las palabras clave y no se tapa la UI.

## 9. Cierre

Fondo pino, logotipo «Nota Alta» en hueso y la línea «Perfumería online en Panamá.». Sin URL ni dirección: la app no tiene dominio ni dirección física reales y no se inventan.

## 10. Producción y control

- Remotion 4 (React + TS), 1920×1080, 30 fps, todo derivado de `useCurrentFrame()`.
- Grabaciones nuevas en `video-demo-opus/public/recordings/` con Playwright: clips frame a frame (scroll con easing) y capturas 2× de elementos.
- Datos animados (ventas diarias, KPIs) extraídos de la UI real a `src/data/`.
- Codex CLI: revisión técnica independiente en solo lectura (determinismo, timing, assets) antes del render final.
