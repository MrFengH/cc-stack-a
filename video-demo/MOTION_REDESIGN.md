# Plan de Rediseño Visual y Motion Design · ProductShowcase V2
**Rama de trabajo:** `video-v2-redesign` (Check visual sobre `video-v1-visual`)  
**Fecha:** 8 de octubre de 2026  
**Enfoque:** Dirección de arte editorial, ritmo audiovisual diferenciado, eliminación del abuso de glassmorphism/glow, transiciones cinemáticas con continuidad de movimiento y scrolls ultra fluidos.

---

## 1. Diagnóstico Crítico de la V1

1. **Monotonía de movimiento:** El 90% de las escenas dependían exclusivamente de un zoom lento y continuo (1.0x → 1.05x/1.08x) sin punch-ins, descansos ni cambios de escala justificados.
2. **Saturación de Glassmorphism genérico:** Prácticamente todas las escenas utilizaban el mismo componente flotante (`HeaderCallout`: caja oscura semitransparente, borde dorado, badges y pills), dando la impresión de un slideshow de plantillas sobre grabaciones de pantalla.
3. **Pills y Callouts redundantes:** Elementos como *"Dolce & Gabbana · 2 fragancias"* o *"Aplicando cupón: DG10"* duplicaban información que la interfaz ya mostraba nítidamente.
4. **Cortes secos sin continuidad:** Las escenas terminaban en el frame `N` y la siguiente aparecía de inmediato en el frame `N+1`, generando una sensación de clips independientes pegados.
5. **Scroll entrecortado:** Ciertos desplazamientos en la grabación original presentaban pequeños saltos provocados por eventos de rueda de ratón con pausas.
6. **Falta de contraste de ritmo:** Todas las escenas duraban entre 8 y 9 segundos con una velocidad constante, sin momentos rápidos de 1-3 segundos ni pausas deliberadas tras una acción clave.

---

## 2. Sistema de Dirección de Arte V2

### 2.1. Eliminación y Reemplazo del Sistema de Overlays
- **ELIMINAR:** Cajas oscuras flotantes con borde dorado para títulos.
- **ELIMINAR:** Micro-pills redundantes que repiten datos de la interfaz.
- **ELIMINAR:** Glow dorado permanente e injustificado.
- **INTRODUCIR:** Tipografía editorial como parte de la composición (títulos monumentales en cortes limpios, reveals con máscaras tipográficas, wipes horizontales/verticales, textos alineados con bordes de la UI).
- **INTRODUCIR:** Motion design numérico directo para precios y ahorros ($119.00 → $107.10, -$11.90) sin cajas.

### 2.2. Sistema de Transiciones Cinematográficas
1. **Familia A — Continuous Push / Slide (10–16 frames overlap):** Continuidad direccional entre vistas relacionadas (ej. Home → Familias con empuje vertical; Familias → Catálogo con desplazamiento lateral).
2. **Familia B — Match Zoom / Match Crop (12–18 frames overlap):** La tarjeta de producto en el catálogo crece y se empareja espacialmente con la ficha de producto para dar la sensación de que la cámara entra en la interfaz.
3. **Familia C — Cambio de Contexto (16–22 frames):** De la perspectiva del cliente (tienda clara) al panel de administración (interfaz oscura), utilizando split mask y tipografía de contexto `CLIENTE → NEGOCIO`.
4. **Corte Rápido Intencional (Hard Cut sincopado):** Utilizado en administración entre pedidos e inventario para imprimir velocidad operativa.

---

## 3. Matriz de Auditoría y Rediseño Escena por Escena

| Escena | Problema V1 | Elementos a Eliminar | Elementos a Mantener | Regrabación de Scroll | Nuevo Movimiento | Transición Entrada | Transición Salida | Foco Visual | Ritmo | Tipografía Integrada |
| :--- | :--- | :--- | :--- | :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| **01 — Intro** | Home estático con zoom lento, intro sin impacto. | Caja flotante `HeaderCallout`, zoom lineal continuo. | Frasco Chanel, titular de portada y 3 beneficios locales. | **Sí (`01-intro-home.webm` con scroll `easeInOutCubic`)** | Apertura editorial monumental (2.5s) + reveal de plataforma con scroll continuo fluido. | Fade y máscara tipográfica de apertura. | Continuous Push Vertical (overlap con 02). | Identidad de marca y propuesta de valor en Panamá. | Rápido al inicio (identidad), settle pausado para absorber el producto. | `"NOTA ALTA"` monumental + `"Perfumería digital en Panamá"`. |
| **02 — Descubrimiento** | Popup genérico, recorrido plano. | Caja flotante `"Descubrimiento Sensorial"`. | Hovers sobre familias olfativas (Florales / Gourmand). | No | Crops dinámicos que siguen el hover sensorial con foco nítido. | Continuous Push Vertical desde el Home. | Crop lateral y slide continuo hacia el catálogo. | Familias olfativas y notas sensoriales. | Exploratorio y cadencioso, acelerando hacia el clic. | Rótulos editoriales mínimos: `"CÍTRICO"`, `"AMADERADO"`, `"GOURMAND"`. |
| **03 — Catálogo** | Zoom continuo, pill redundante de 2 fragancias. | Pill redundante `"Dolce & Gabbana · 2 fragancias"` y caja flotante. | Columna de filtros de marca y grilla de resultados. | No | Punch-in a la faceta (causa) + pan lateral hacia los resultados (efecto) + settle. | Slide y crop lateral continuo desde familias. | **Match Zoom** hacia la tarjeta de *The One*. | Causa (filtro) y efecto (resultados filtrados). | Sincopado: punch rápido a filtro, paneo fluido a resultados. | Titular tipográfico efímero: `"CATÁLOGO PRECISO"`. |
| **04 — Producto** | 3 popups flotantes saturados, scroll escalonado. | 3 pills flotantes superpuestos y caja flotante. | Pirámide olfativa, precio ($119), descuento (-12%) y stock (8 un.). | **Sí (`04-detalle-producto.webm` con scroll `easeInOutCubic`)** | Match zoom de entrada, scroll continuo fluido a pirámide y líneas editoriales. | Match Zoom desde la tarjeta del catálogo. | Push lateral y scale hacia carrito. | Evolución en piel (salida, corazón, fondo) y disponibilidad real. | Editorial y pausado (9s). | Tipografía directa: `SALIDA 15 MIN`, `CORAZÓN 30 MIN - 3 H`, `FONDO TODO EL DÍA`. |
| **05 — Carrito** | Sin impacto en el ahorro, pill redundante. | Pill `"Aplicando cupón: DG10"` y caja flotante. | Input de cupón, validación en tiempo real y recálculo. | No | Punch-in suave al resumen, **micro-freeze** en la aplicación y animación numérica directa. | Push dinámico con escala ligera. | Desplazamiento vertical hacia checkout. | Recálculo instantáneo del ahorro y badge de envío gratis. | Rápido en tecleo, hold satisfactorio en descuento. | Números motion design: `$119.00 → $107.10` / `AHORRAS $11.90`. |
| **06 — Checkout** | Formulario largo con zoom lento, scroll entrecortado. | Caja flotante `"Checkout Local"`, zoom lineal. | Pasos de entrega, provincias, retiro express y selección de Yappy. | **Sí (`06-checkout-pagos.webm` con scroll `easeInOutCubic`)** | Secuencia en 3 fases: 01 ENTREGA → 02 RETIRO → 03 PAGO (1.5s de protagonismo a Yappy). | Continuidad vertical con overlap. | Scale down suave con settle hacia cuenta. | Adaptación logística panameña y medios locales. | Ágil, dividido en 3 compases visuales claros. | Rótulos secuenciales: `01 ENTREGA`, `02 RETIRO`, `03 PAGO LOCAL`. |
| **07 — Tracking** | Recorrido pasivo, título flotante desconectado. | Caja genérica flotante. | Timeline vertical (*Pagado → En preparación → Enviado*) y pedido `NA-00411`. | **Sí (`07-cuenta-tracking.webm` con scroll `easeInOutCubic`)** | Desplazamiento vertical guiado que acompaña la lectura de etapas. | Scale + settle vertical desde checkout. | **Cambio de Contexto** `CLIENTE → NEGOCIO`. | Línea de tiempo de despacho. | Fluido y continuo, genera confianza. | Rótulo editorial anclado: `"SEGUIMIENTO EN TIEMPO REAL"`. |
| **08 — Dashboard** | Paneo genérico en panel oscuro sin jerarquía de KPIs. | Cajas y pills genéricos. | Métricas comerciales ($10,560.50, +112.7%, 54 pedidos, ticket $195.56). | No | **Cambio de contexto monumental** + secuencia de cortes rápidos a métricas + apertura a dashboard. | Split mask y revelación cromática claro → oscuro. | Desplazamiento lateral dentro del panel. | Cifras de facturación consolidada y analítica en vivo. | Contundente y rítmico (cortes a números), luego panorámico. | Cifras monumentales y rótulo `"PANEL DE CONTROL"`. |
| **09 — Operaciones** | Transición lenta entre pedidos e inventario. | Cajas flotantes redundantes. | Filtro de pedidos ("Pagado 3") y control de stock inline. | No | Punch-in en pedidos (3.5s) → **Hard Cut rápido** → foco en stock bajo y ajuste inline (3.5s). | Desplazamiento lateral rápido en panel. | Scale down progresivo hacia el cierre. | Eficiencia operativa en despacho y bodega. | Rápido, ágil y pragmático (7s). | Badges funcionales integrados: `01 DESPACHOS`, `02 INVENTARIO`. |
| **10 — Outro** | Repetición del Home con tarjeta centrada. | Tarjeta flotante centrada genérica y repetición del Home 01. | Composición del frasco y logotipo de Nota Alta. | No | Contracción elegante de la interfaz, marco cinematográfico y cierre tipográfico definitivo. | Scale down y revelación de marca. | Fade out a negro limpio. | Logotipo e identidad perdurable. | Solemne, reposado y memorable. | `"NOTA ALTA"` + `"Perfumería digital, de principio a fin."` |

---

## 4. Plan de Ejecución

1. **Regrabación con Playwright de clips con scroll:**
   - `01-intro-home.webm`
   - `04-detalle-producto.webm`
   - `06-checkout-pagos.webm`
   - `07-cuenta-tracking.webm`
   - Implementando script determinista con `easeInOutCubic` vía `requestAnimationFrame` en 1920x1080 a 30 FPS.
2. **Reemplazo del sistema de Overlays:**
   - Crear componentes editoriales limpios en `video-demo/src/components/editorial/`:
     - `EditorialTitle.tsx` (títulos y marcas sin cajas).
     - `PyramidNotes.tsx` (notas olfativas integradas con guías limpias).
     - `PriceMotion.tsx` (cambio de precios y ahorro animado).
     - `StepProgress.tsx` (indicadores secuenciales de checkout).
     - `ContextSwitch.tsx` (transición visual `CLIENTE → NEGOCIO`).
3. **Reestructuración de la Composición:**
   - Sustituir la secuencia rígida de `<Series>` por un sistema de `<Sequence>` con overlap controlado (8 a 16 frames entre escenas).
   - Eliminar `<AudioMixer />` y `<Subtitles />` en esta fase para concentrarse exclusivamente en el impacto visual.
4. **Verificación y Pruebas en Remotion Studio:**
   - Comprobar fluidez de scrolls, ausencia de frames negros y legibilidad de la UI.

---

## 5. Resultados de Validación Visual y QA (V2)

1. **Re-grabaciones de Clips con Scroll:**
   - Realizadas con Playwright + `requestAnimationFrame` + `easeInOutCubic` (1100–1400ms duration) en resolución nativa 1920x1080 @ 30 FPS.
   - Eliminados saltos bruscos de rueda en `01-intro-home.webm`, `04-detalle-producto.webm`, `06-checkout-pagos.webm` y `07-cuenta-tracking.webm`.
   - V1 original respaldado en `video-demo/public/recordings/backup_v1/`.

2. **Comportamiento de Transiciones Overlapping:**
   - Transiciones continuas implementadas con `Sequence` superpuestas (14 a 18 frames):
     - Entrada Hero / Outro: monumental y limpia.
     - Match Zoom Catálogo → Producto (Escena 03 → 04): tarjeta en foco se alinea espacialmente sin cajas flotantes.
     - Ahorro numérico Carrito (Escena 05): `$119.00` tachado -> `$107.10` en verde esmeralda con -$11.90 en tiempo real.
     - Cambio de Contexto (Escena 07 → 08): reveal tipográfico `CLIENTE → NEGOCIO` al pasar a la administración oscura.
     - Despachos e Inventario (Escena 09): Hard cut sincopado que enfatiza la agilidad operativa.

3. **Arquitectura y Rendimiento:**
   - Reemplazo de `OffthreadVideo` por `<Video>` nativo de Remotion para garantizar compatibilidad con streams de pantalla WebM.
   - Bundle verificado (`npx tsc` y `remotion bundle`) con 0 advertencias y 0 errores.
   - Duración total calibrada: 2356 frames (78.53 s @ 30 FPS).

