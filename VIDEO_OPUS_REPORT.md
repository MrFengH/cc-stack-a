# Nota Alta — Product Film (versión Opus) · Reporte

**Entregable:** `video-demo-opus/out/nota-alta-opus.mp4` · 1920×1080 · 30 fps · H.264 + AAC 320 kbps · **62,4 s** (1872 frames) · **21,8 MB** (22.882.026 bytes) · BT.709

Dirección: [`VIDEO_OPUS_PLAN.md`](VIDEO_OPUS_PLAN.md). Proyecto: `video-demo-opus/` (Remotion 4.0.534, React 19, TypeScript).

## 1. Concepto

**«Tres notas».** La ficha de producto de la app enseña cómo evoluciona cada perfume en la piel: **Salida** («Primeros 15 minutos»), **Corazón** («De 30 minutos a 3 horas») y **Fondo** («Lo que queda al final del día»). El comercial usa esa pirámide real como estructura narrativa:

- **Salida, descubrir:** home, familias olfativas, 14 marcas, búsqueda por nota («vainilla»), filtro de precio.
- **Corazón, elegir:** ficha de The One, la pirámide en la UI real (el espectador descubre de dónde sale la estructura del film), precio y stock, cupón DG10 ($119.00 → **$107.10**), checkout con retiro en tienda y Yappy/ACH.
- **Fondo, lo que queda:** seguimiento del pedido NA-00411, historial, panel (KPIs, ventas de 30 días, pedidos por estado, stock bajo, inventario).
- **Cierre:** «Nota Alta. Perfumería online en Panamá.», sobre una nota aguda sostenida (la «nota alta»).

## 2. Funcionalidades representadas (todas con datos reales de la app)

Descubrimiento y home · familias olfativas (Cítricos, Florales, Amaderados, Gourmand) · marcas (las 14 reales) · búsqueda («vainilla») · filtros (precio $100–$150: de 23 a 8 perfumes) · catálogo · ficha de producto · pirámide olfativa · precio, precio anterior y ahorro ($119.00 / $135.00 / −12 %) · disponibilidad (10 unidades) · carrito · cupón DG10 (−$11.90) · checkout · envío (Ciudad / interior) y retiro en tienda · métodos de pago (tarjeta, **Yappy**, **ACH**, contra entrega) · cuenta del cliente e historial de pedidos · seguimiento del pedido · panel: total vendido $10,560.50, 54 pedidos, ticket $195.56, 13 clientes, ventas 30 días $6,786.30 (+79,8 %), pedidos por estado, stock bajo / agotado, inventario (245 unidades, $23,509.00) · panel completo.

**Condensadas a un golpe** (1–2 s): marcas, búsqueda, filtros, envío/retiro, ACH, historial, inventario. **Desarrolladas:** pirámide, cupón, seguimiento, panel.
**Fuera a propósito:** registro, edición de perfil, formularios del panel (escriben en BD o no aportan al relato).

## 3. Motion: decisiones principales

- **Rejilla de 100 BPM** (1 tiempo = 18 frames, 1 compás = 72). Los cortes, las entradas de tipografía y las tarjetas caen en tiempos u octavos.
- **Push vertical como transición principal:** el plano saliente sube y el entrante entra desde abajo, el mismo gesto que el scroll de la tienda. Se reserva para cambios de bloque; dentro de un bloque hay cortes en tiempo fuerte.
- **Transiciones derivadas de la UI:**
  - *Match-zoom:* la cámara entra en la foto de The One en el catálogo filtrado, y esa foto se convierte en el plano de producto del capítulo Corazón.
  - *Puerta de Fondo:* la celda «Fondo» de la pirámide real crece hasta llenar el cuadro en verde pino justo en el downbeat del capítulo.
  - *Speed ramp:* scroll real de la ficha a 2,4× hasta la pirámide, luego la cámara aterriza en ella.
- **Cámara virtual** (`Cam`) sobre la UI: push-ins lentos, snap-zoom al salir del buscador y sobre el total del carrito. Pasa de una zona a otra siguiendo cada elección en el checkout. Clamping para no mostrar nunca bordes vacíos.
- **Recaptura nítida:** los clips se capturan a 2× y la cámara congela en su último frame. Para los acercamientos fuertes (pirámide, resumen del carrito, buy box) se superpone en la misma posición una captura 2× del elemento, sin cambio visible.
- **Tipografía cinética** en Schibsted Grotesk (la fuente de la tienda): palabras que suben desde una máscara. La «pirámide» inicial se recompone como tipo con el copy literal de la UI. Contadores con expo-out que aterrizan exactamente en la cifra real. Gráfica de 30 barras reconstruida desde la tabla accesible del panel.
- **Arco de color = descenso por la pirámide:** hueso → salvia → pino profundo. El naranja de oferta se reserva para dinero.
- **Indicador de notas** (Salida · Corazón · Fondo) que aparece solo en los cambios de capítulo, con el punto descendiendo.
- **Taps:** un anillo que se cierra sobre el punto y desaparece en el frame del clic real grabado. Nunca sobrevive al cambio de página.
- Todo es función de `useCurrentFrame()`. Sin CSS transitions, `Math.random` ni reloj.

## 4. Audio

- **Música original generada por código** (`scripts/music.mjs`): sintetizador determinista en Node con ruido sembrado, 48 kHz, 100 BPM, con la forma del film:
  - Apertura: pad y el motivo de tres notas, una por palabra.
  - Salida: plucks Karplus-Strong agudos, sin bombo.
  - Corazón: entran bombo suave, bajo y snap.
  - Fondo: registro grave, bombo a negras, hats a semicorcheas.
  - Riser filtrado solo en los dos cambios de capítulo.
  - **Silencio de un tiempo** antes del cierre.
  - Cierre: campana A6, la «nota alta».
- **Narración:** `es-PA-MargaritaNeural` (Edge TTS, −6 % de velocidad), 14 frases cortas (~22 s de voz en 62 s). Cada frase va en su propio archivo para colocarla en la rejilla contra la imagen; por ejemplo, «Yappy» cae en el frame en que se selecciona Yappy.
- **Ducking:** la música baja unos 8 dB con rampas de 6–12 frames en cada frase.
- **SFX:** solo un «tick» suave, al aplicar el cupón y en los tres pasos completados del seguimiento. Sin whooshes.
- **Subtítulos: no.** La tipografía cinética ya lleva las palabras clave y no se tapa la UI.
- **Master:** `loudnorm` a −15 LUFS integrados, true peak ≤ −1,5 dBTP (`scripts/master.ps1`).

## 5. Grabaciones (todas nuevas, en `video-demo-opus/public/recordings/`)

Playwright con Chromium, viewport 1920×1080 y deviceScaleFactor 2:

- **9 clips frame a frame** (`scripts/capture/*.mjs`): cada frame es una captura y el scroll se calcula por frame con `requestAnimationFrame` y easing (easeInOutCubic o easeOutQuart). Resultado determinista y sin tirones. Se codifican a 2880 px de ancho (x264 CRF 14).
- **33 capturas 2×** de elementos y páginas, más el último frame de cada clip (9) para congelarlo.

Cada carga de página se valida: HTTP 200, sin textos de traceback, 404 o DEBUG, fuentes cargadas e imágenes lazy forzadas a cargar (evita que aparezcan a mitad de un scroll). Revisé el inicio, la mitad y el final de cada clip con hojas de contacto.

**Seguridad de datos:**
- Solo acciones de sesión: carrito, cupón y selección de opciones del checkout.
- **Nunca se confirmó un pedido.** El carrito se vacía al terminar cada script.
- El panel solo se visitó con GET.
- No se tocó Django, la BD ni otras carpetas.

## 6. Fidelidad

Todas las cifras en pantalla salen de la app renderizada el 2026-10-09 y viven en `src/data/facts.ts` con su página de origen. La serie diaria de ventas se extrajo de la tabla accesible del panel (`src/data/sales.json`). Comprobé que suma $6,786.30 y que su máximo es $954.00, igual que la cabecera del panel. Las posiciones de cámara salen de mediciones del DOM real (`scripts/measure.mjs` → `src/data/layout.json`). Al detectar que el checkout grabado mostraba $119.00 sin cupón (incoherente con el plano del carrito), lo regrabé con DG10 aplicado.

## 7. Validaciones realizadas

- `tsc --noEmit` (strict, noUnusedLocals): sin errores. Formateo con Prettier.
- 5 rondas de QA visual con fotogramas renderizados en hojas de contacto. Corregí, entre otros:
  - columnas de la apertura que se solapaban;
  - bordes vacíos al hacer push-in (ahora la cámara hace clamp);
  - un encuadre del buscador que cortaba el logo;
  - un collage de marcas ilegible (rehecho como rodillo tipográfico con las 14 marcas reales);
  - el título de Corazón encima de la foto;
  - KPIs que se pisaban;
  - cifras tabulares con puntuación espaciada;
  - un anillo de tap que caía sobre «Quitar» tras el cambio de página;
  - transparencias fantasma en la transición del carrito.
- Render previo completo a media resolución sin errores. Render final: 1,3 min.
- Formato verificado en el MP4 entregado: H.264 `yuv420p (tv, bt709)` 1920×1080 30 fps, AAC 48 kHz estéreo, 62,40 s. El primer render salía como `yuvj420p` de rango completo, lo que algunos reproductores muestran lavado o con negros aplastados; lo corregí con `setColorSpace("bt709")` y volví a renderizar.
- QA del entregable: 12 fotogramas extraídos del MP4 final (inicio, mitad, final y momentos clave).
- Audio:
  - medición por compás del score para equilibrar secciones (Salida subió unos 4 dB, bombo y bajo bajaron);
  - medición de picos y RMS de cada frase de voz;
  - loudness integrado de la mezcla: −18 LUFS antes del master; **−14,5 LUFS integrados, −1,5 dBTP, LRA 5,7** después.
- Codex: auditoría técnica, crítica visual y validación final (ver §9).

## 8. Skills utilizadas

| Skill | Por qué |
|---|---|
| `remotion-best-practices` (router) + `remotion-create`, `remotion-markup` y `remotion-render` (leídas desde `.agents/skills` del repo principal) | Arquitectura Remotion, reglas de animación por frame (sin CSS transitions), `@remotion/media` para vídeo y audio, `premountFor` y sintaxis de `render --frames` para QA. No usé `create-video` porque puede inicializar Git; monté el proyecto a mano. |
| `ponytail` (activada por el usuario al inicio) | Solo en implementación y limpieza: reducir duplicación (una primitiva `ClipHold` para todos los congelados, `Cam` única, timing en un solo `Film.tsx`) y quitar código muerto. No se usó en concepto, storytelling ni diseño de motion. |

No cargué el resto de skills de diseño o marca del entorno: la dirección visual ya la fija la propia app (paleta, tipografía y fotografía reales), y una skill de branding habría empujado a reinterpretarla.

## 9. Subagentes y Codex

**Subagentes de Claude:** ninguno. La revisión independiente quedó cubierta por Codex, y un segundo agente no habría añadido una perspectiva distinta, solo más contexto que reconstruir.

**Codex CLI** (`codex-cli 0.162.0`, autenticado): 3 invocaciones con `codex exec -s read-only --ephemeral`. **Ninguna con permiso de escritura y ninguna operación Git.** Cada prompt incluía objetivo, contexto, directorios legibles y modificables (ninguno), prohibición de Git, resultado esperado y criterio de fin.

| # | Tarea | Resultado | Decisión |
|---|---|---|---|
| 1 | Auditoría técnica de `src/`: determinismo, timing, assets, audio, coherencia de datos | 8 hallazgos | **Aceptado:** la fórmula de `ClipHold` producía un salto de unos 6 frames fuente en el clip acelerado a 2,4×; adopté `ceil`. **Rechazado:** «imports `EASE_IN` sin usar rompen el typecheck» (sí se usan y `tsc` pasaba). Rechacé también la pérdida del último frame a 1×: el still congelado *es* ese frame, así que no había salto. El resto confirmó que no había no-determinismo, assets rotos, solapes de VO ni incoherencia de datos. |
| 2 | Crítica visual con 4 hojas de contacto (un fotograma cada 2 s) como imágenes | 8 hallazgos | **Aceptados:** la tarjeta del carrito quedaba sola en la transición (ahora las cifras entran mientras viaja); el plano de título de Corazón era demasiado estático (más deriva de la foto); el historial competía con el seguimiento (atenuado y más bajo); el cierre estático (push lento). **Rechazados:** «UI ilegible» y «apertura de bajo contraste» (Codex juzgaba miniaturas de 640 px; a 1080p el texto mide 16–20 px o más, y la apertura es tinta sobre hueso a 116 px); «cambio brusco en Fondo» (era un hueco del muestreo: la expansión de la celda ocurre entre esos fotogramas); «perder la foto en el plano de precio» (la buy box ya identifica el producto, y la foto estuvo en pantalla segundos antes). |
| 3 | Validación final de los cambios y de todos los `inputRange` | Sin hallazgos en los 6 puntos | Se renderizó el definitivo. |

## 10. Limitaciones reales

- **El ffmpeg incluido en Remotion está recortado** (sin `select`, `tile`, `alimiter` ni muxer null). Las hojas de contacto se componen en el navegador y el master usa solo `loudnorm`, cuyo limitador interno cumple el true peak.
- **Bug de Remotion 4.0.534:** `render --frames` con fotogramas no contiguos falla en el mezclador de audio inline, incluso con `--muted`. Lo resolví con una prop `silent` que solo usan los renders de QA.
- **No pude escuchar el resultado.** La mezcla se validó con mediciones (RMS por compás, picos, LUFS) y la colocación de la voz con detección de silencios, no de oído. Merece una escucha humana: equilibrio voz/música y carácter del sintetizador.
- Las cifras del panel dependen de la fecha: la gráfica y los totales son los del 9 de octubre de 2026, 19:00. Si se regraba otro día, `scripts/extract-data.mjs` y las capturas deben repetirse juntas.
- La voz TTS tiene pausas largas tras punto. Lo compensé con frases separadas, pero algunas («Tu cupón.») siguen sonando a frase suelta.

## 11. Reproducir

```powershell
cd video-demo-opus
npm install; npx playwright install chromium
node scripts/capture/store.mjs; node scripts/capture/commerce.mjs; node scripts/capture/panel.mjs
node scripts/extract-data.mjs; node scripts/measure.mjs
py -m venv .venv; .venv\Scripts\pip install edge-tts; powershell -File scripts\voice.ps1
node scripts/music.mjs
npx remotion render NotaAltaFilm out/nota-alta-opus-raw.mp4 --props='{"voice":"v1"}'   # v1 (la composición ahora usa v2 por defecto)
powershell -File scripts\master.ps1 out\nota-alta-opus-raw.mp4 out\nota-alta-opus.mp4
```

---

## 12. VOICE AUDITION V2

**Nuevo MP4:** `video-demo-opus/out/nota-alta-opus-voice-v2.mp4` · 1920×1080 · 30 fps · H.264 `yuv420p (tv, bt709)` + AAC 48 kHz · 62,40 s · 22.944.174 bytes (21,9 MB).
El original `out/nota-alta-opus.mp4` queda intacto. Solo cambian la capa vocal y la mezcla; imagen, montaje, motion, música y SFX son los mismos.

> **Limitación principal: no puedo escuchar audio.** Nada de esta sección afirma que una voz «suena mejor» como hecho. La selección se hizo con mediciones objetivas que funcionan como *proxies*: transcripción automática, prosodia, pausas, ancho de banda, identificación de idioma y loudness. Todas las muestras se conservan para que una persona confirme la elección de oído.

### Motores

| Motor | Considerado | Disponible | Notas |
|---|---|---|---|
| ElevenLabs | sí | **no** | No hay `ELEVENLABS_API_KEY` ni equivalente en el entorno de proceso, usuario o máquina. No hay skill ni MCP de ElevenLabs. No se creó ninguna credencial. |
| OpenAI TTS | sí | **no** | No hay `OPENAI_API_KEY`. Existe un login de Codex, pero es una sesión de ChatGPT para Codex, no una API key, así que no lo reutilicé para TTS. |
| Resemble AI (cloud) | sí | no (sin API key) | Evalué su modelo abierto, **Chatterbox Multilingual**, en local. |
| Microsoft Edge TTS | sí | **sí** | 46 voces en español. Solo controla velocidad, tono y volumen (sin estilos ni emociones). |
| Kokoro (ONNX) | sí | **sí** (≈340 MB) | Voces españolas `ef_dora` y `em_alex`. |
| Chatterbox Multilingual 0.1.7 | sí | **sí** (≈5,5 GB entre torch CUDA y pesos) | Corre en la GPU local (RTX 4060 de 8 GB). Es el único motor disponible con control expresivo, lo que justificó la descarga. |
| F5-TTS / Fish Speech | sí | no instalados | Otra descarga de varios GB que no añadía una capacidad distinta a la de Chatterbox. |

### Audición (las mismas 3 frases para todos)

1. *«Todo perfume se cuenta en tres notas.»* · 2. *«El corazón: elegir bien.»* · 3. *«Nota Alta. Perfumería online en Panamá.»*

Muestras en `video-demo-opus/public/audio/voice-tests-v2/`. Métricas en `metrics.json` dentro de cada carpeta.

| Candidato | Muestras | Lectura de las métricas (proxies) |
|---|---|---|
| Edge Margarita (baseline v1) | 3 | Pocas variaciones de tono (desviación de ≈2,2–3,6 semitonos). P(es)=0,86. Con ajustes más lentos, el ASR oye «El corazón **superíndice 3N**» y «Perfumer**á**». Los archivos reales de v1 (a −6 %) se transcriben bien. |
| Edge Dalia (MX), dirigida | 3 | Registro más grave (≈199 Hz) e igual de plana. Mismos errores de ASR con la versión plana. |
| Edge Salomé (CO), dirigida | 3 | La más plana (rango de 4–7 semitonos). El ASR oye «El coraza superíndice 13N». |
| Edge Dalia y Margarita, *crafted* (puntuación y segmentos con pausas a mano) | 3 + 3 | Sin errores de ASR y con pausas controladas. Sigue plana (desviación ≈2,2–2,8 semitonos). Es la que tiene más ancho de banda (roll-off de 7–8,5 kHz). |
| Kokoro Dora y Alex | 3 + 3 | Palabras correctas, pero ignora los puntos (cero pausas), va rápida (5–6 sílabas/s) y suena apagada (roll-off de 5–6 kHz). |
| Chatterbox default y directed | 3 + 3 | Default: alucina palabras («…tres notas. **En todos, nota.**»). Directed: correcto y con el doble de variación de tono. |
| Chatterbox: sesión de 3 ajustes × 3 semillas | 27 | **8 de 27 tomas con errores** (colas inventadas como «¿En Panamá?» o «¡Eh, va!»; «perfumaria»), una toma de 11 s, finales ascendentes y registro inestable (de 72 a 183 Hz). |
| **Chatterbox «D»** (identidad fijada con una de sus propias tomas limpias, cfg 0,4, temperatura 0,55) | 9 | **9 de 9 sin errores de ASR**, todos los finales descienden, registro estable (112–154 Hz), variación de tono de 4,1–4,8 semitonos (frente a 2,2–2,8 en Edge). P(es)=0,961 de media, a la par de Dalia (0,965) y por encima de Margarita (0,862). |

En total se generaron 69 muestras de audición, más la locución completa de la alternativa (`full-edge-dalia-crafted/`) y todas las tomas de producción (`public/audio/vo-v2-takes/`).

### Elección

**Motor:** Chatterbox Multilingual (Resemble AI, local). **Voz:** la voz integrada del modelo, sin clonar a nadie, con la identidad fijada usando una de sus propias tomas como referencia. **Ajustes:** exaggeration por capítulo (Salida 0,55, Corazón 0,5, Fondo 0,45, firma 0,5), cfg_weight 0,4 y temperature 0,55. Se conserva la marca de agua inaudible de Resemble.

**Por qué:**
- Es el único candidato con una prosodia claramente más expresiva: unas 1,8 veces la variación de tono de Edge, con pausas internas y finales que descienden.
- Sus problemas (alucinaciones, deriva de registro) quedaron controlados con el proceso de producción.
- Las alternativas comparten la limitación que motivó esta fase: Edge es el mismo motor «Friendly, Positive» de v1, y Kokoro no respeta las pausas.

**Producción tipo sesión de grabación** (`scripts/voice_v2.py`):
- cada línea se divide en sus puntos de respiración, con pausas medidas;
- se generan 6 tomas por segmento (hasta 12 si ninguna pasa);
- filtro automático de tomas: palabras exactas por ASR (para la marca solo se aceptan grafías con «y» inicial, porque «japi» indicaría una jota), ritmo plausible, sin silencios muertos de más de 0,6 s y final descendente en las afirmaciones;
- el ranking premia el ritmo objetivo de cada capítulo, la vida de la entonación y la confianza del ASR;
- la línea ensamblada debe pasar también una verificación completa de ASR, porque esa comprobación detectó una «E» de duda en una unión y un «de» extra que las tomas sueltas no mostraban.

**Alternativas descartadas:**
- Edge *crafted* Dalia: fiable y nítida, pero plana. Se conserva completa como respaldo; basta con `voice_v2.py --engine edge`.
- Margarita como baseline: es la referencia a superar.
- Kokoro: sin pausas y apagada.
- Chatterbox sin fijar identidad: inestable.

### Ajustes de guion (mínimos; mismo mensaje, misma estructura)

- «Tu cupón.» → **«Tu cupón, aplicado.»**: la frase suelta sonaba incompleta, y «aplicado» cae justo en el frame en que se aplica el cupón.
- «O por una sola nota.» → **«O por una sola… nota.»**: una pausa antes de «nota» mientras se escribe la búsqueda.
- «Nota Alta. Perfumería online en Panamá.» se divide en dos piezas: **firma** («Nota Alta.») y **cierre**. La firma suena *después* del ataque de la campana: la nota alta suena primero y luego la voz la nombra.
- Los dos puntos de los títulos de capítulo («La salida:», «El corazón:», «Y el fondo:») se dicen como apertura, con una pausa de 0,28–0,36 s antes del verbo.

### Ajustes de timing (solo microtiming; la imagen no cambia)

Posiciones en `src/data/vo-v2-cues.json`. Longitudes exactas tomadas del manifiesto generado (`src/data/vo-v2.json`). Verificación por onset medido en el archivo y por marcas de tiempo de ASR:

| Palabra | Evento de imagen | Desfase |
|---|---|---|
| «descubrir» | entra «descubrir.» (f176) | +3,6 f |
| «elegir» | entra «elegir bien.» (f630) | +1,5 f |
| «aplicado» | se aplica DG10 (f900) | +1,9 f |
| «Yappy» | última selección de Yappy (f1092) | ±0 f (ASR) |
| «lo que queda» | entra «lo que queda.» (f1192) | +1,2 f |
| «Nota Alta» | firma tras la campana (f1656) | f≈1696 |
| «Perfumería» | entra el tagline (f1728) | +1,8 f |

Sin solapes entre frases. Tras la última palabra quedan **3,0 s de cierre**.

### Ducking y mezcla (recalibrados desde cero)

- **Medición por frase con stems** (`stem="voice"` y `stem="music"`, `scripts/mix_report.py`). Con el ducking único de v1, la relación voz/música iba de +15 dB en la Salida a **+0,1 dB en «Nota Alta.»**, tapada por campana, bombo y pad.
- **Profundidad de ducking por frase** según el nivel medido de la música: 0,15–0,35 en la Salida (música ligera) y 0,52–0,66 donde hay bombo y bajo. Release más largo (10 → 26 frames) para que respiren los finales.
- **Ducking por frecuencia:** bajo cada frase, la música hace un crossfade hacia una copia «tallada» (−4,5 dB centrados en 2,2 kHz y −2 dB en 400 Hz, `scripts/mix_prep.py`). La voz gana su banda sin vaciar la música.
- **EQ de voz:** paso alto a 90 Hz, −1,5 dB a 280 Hz y +2,5 dB de presencia a 4,5 kHz, porque Chatterbox suena más oscuro que Edge. Cada línea se normaliza a −21 LUFS con al menos 1 dB de margen.
- **Firma:** +1,6 dB propios y ducking de 0,72.
- **Resultado:** relación voz/música de **+8,1 a +12,3 dB** en todas las frases (mediana +9,8).
- Los SFX («tick») y la música original no cambian; solo se ajustó su nivel bajo la voz.

### Master y validación final

- Master: **−14,8 LUFS integrados, true peak −1,4 dBTP**, LRA 4,6 LU, pico de muestra −1,4 dBFS, sin clipping.
- Imagen: PSNR v1 vs v2 en 13 fotogramas = **idénticos** (99 dB, MSE 0). La calidad visual no cambia.
- Inteligibilidad en la mezcla final: ASR de la pista mezclada frente al guion, **0 errores en 56 palabras**.
- No hay frases cortadas: cada archivo tiene 40 ms de entrada y 250 ms de cola, y cada secuencia dura lo que la frase más 30 frames.
- Fade-in y fade-out: −46,5 dB en los primeros 0,2 s, −44,9 dB en los últimos 0,3 s, y la cola musical del cierre intacta.

### Limitaciones de la evaluación auditiva

- **Elegí sin escuchar.** Las métricas muestran prosodia más variada, palabras exactas, pausas y finales correctos, español identificable e inteligibilidad sobre la música. No pueden juzgar calidez, intimidad, timbre ni si el acento suena panameño o latino neutro. El hablante base de Chatterbox se entrenó en inglés: P(es) alto sugiere que no hay acento extranjero marcado, pero solo un oído humano puede confirmarlo.
- **Comparación recomendada para la revisión humana:**
  - `voice-tests-v2/chatterbox-takes-d/` frente a `voice-tests-v2/edge-dalia-crafted__*` y `edge-margarita-baseline__*`;
  - después, la película completa en v1 frente a v2.
  - Si Chatterbox no convence, la alternativa ya está generada: `voice_v2.py --engine edge`, después `mix_prep.py --voice` y volver a renderizar.
- El modelo es estocástico. La selección es reproducible gracias a las semillas fijas registradas en `public/audio/vo-v2-takes/selection.json`.
- **Codex y subagentes:** no los usé en esta fase. Ninguno puede escuchar audio, así que no habrían añadido una evaluación auditiva independiente.

### Reproducir la voz v2

```powershell
cd video-demo-opus
py -m venv .venv-tts
.venv-tts\Scripts\pip install torch==2.6.0 torchaudio==2.6.0 --index-url https://download.pytorch.org/whl/cu124
.venv-tts\Scripts\pip install chatterbox-tts==0.1.7 kokoro-onnx faster-whisper soundfile "setuptools<81"
# pesos en .venv-tts/models/chatterbox y .venv-tts/models/faster-whisper-small (descargados con curl -C -)
.venv-tts\Scripts\python scripts\voice_v2.py          # tomas, selección -> public/audio/vo-v2-dry + manifiesto
.venv-tts\Scripts\python scripts\mix_prep.py --music --voice
npx remotion render NotaAltaFilm out/nota-alta-opus-voice-v2-raw.mp4 --props='{"voice":"v2"}'
powershell -File scripts\master.ps1 out\nota-alta-opus-voice-v2-raw.mp4 out\nota-alta-opus-voice-v2.mp4
.venv-tts\Scripts\python scripts\v2_validate.py out\nota-alta-opus.mp4 out\nota-alta-opus-voice-v2.mp4 <audio-v2.wav>
```

---

## 13. VOICE AUDITION V3 — ELEVENLABS

**Nuevo MP4:** `video-demo-opus/out/nota-alta-opus-voice-v3.mp4` · 1920×1080 · 30 fps · H.264 `yuv420p (tv, bt709)` + AAC 48 kHz · 62,40 s · **22.888.168 bytes (21,8 MB)**.
No se sobrescribió nada: `nota-alta-opus.mp4` (v1) y `nota-alta-opus-voice-v2.mp4` (v2) siguen intactos. Solo cambian la capa vocal y la mezcla; la imagen es idéntica a la v2 aprobada.

> **Limitación auditiva (sigue vigente): no puedo escuchar audio.** La elección se hizo con mediciones que funcionan como *proxies*: transcripción, identificación de idioma, entonación, finales de frase, ritmo, brillo y loudness. No es un juicio de oído. Todas las muestras se conservan para que tú compares.

### ElevenLabs: disponibilidad y límites reales de la cuenta

- `ELEVENLABS_API_KEY`: **disponible** en el entorno de este proceso (solo se comprobó que existe y su longitud). Nunca se imprimió, se escribió en un archivo ni se registró. `scripts/eleven.py` la lee de `os.environ` en cada llamada.
- **La clave tiene permisos limitados:** no tiene `user_read` (no se puede consultar la cuota) ni `models_read` (no se puede listar modelos). Los modelos utilizables se averiguaron probando TTS con una palabra: **`eleven_v3`, `eleven_multilingual_v2`, `eleven_turbo_v2_5` y `eleven_flash_v2_5`**.
- **Cuenta gratuita:**
  - La salida `pcm_44100` exige el plan Pro; se usó `pcm_24000`, también sin pérdida.
  - **Las voces de la Voice Library no se pueden usar por API en cuentas gratuitas** («Free users cannot use library voices via the API»). Por eso las voces nativas latinoamericanas de la biblioteca (Norah, Samanta, Lina, Fran…) no pudieron probarse. Solo quedaron las voces *premade* de ElevenLabs, nativas en inglés y multilingües.
  - ⚠️ **Licencia:** en el plan gratuito, ElevenLabs suele exigir atribución y no conceder uso comercial. Para publicar este comercial con la voz v3 conviene un plan de pago (Starter o superior) y regenerar o confirmar la licencia del audio. Revísalo antes de publicar.
- Consumo aproximado: unos **3.400 caracteres** (1.700 en la audición, 1.600 en producción y algunas pruebas). No hay cifra exacta porque la clave no puede leer la cuota.

### Audición (las mismas 3 frases de v2)

1. *«Todo perfume se cuenta en tres notas.»* · 2. *«El corazón: elegir bien.»* · 3. *«Nota Alta. Perfumería online en Panamá.»*

63 muestras en `video-demo-opus/public/audio/voice-tests-v3/`, con `metrics.json` en cada carpeta.

| Candidata (voz premade, ID) | Rondas | Lectura de las métricas (proxies) |
|---|---|---|
| **Sarah** `EXAVITQu4vr4xnSDxMaL` | a, b, d | **Sin errores de ASR. Español más reconocible de las voces ElevenLabs** (P(es) de 1,00 / 0,99 / 0,83 sin tags). Tono 190–220 Hz: femenino, ni grave ni infantil. Brillante (roll-off de 7,5–9 kHz). En la ronda d todos los finales descienden (7,2 / 3,3 / 4,4 semitonos). |
| Matilda `XrExE9yKIg1WjnnlVkGX` | a, b, d | La más animada según las métricas (variación de tono 3,3–4,8 semitonos, ritmo vivo, finales firmes), pero la frase de cierre se reconoce a medias como español (P(es) 0,33–0,50). **Segunda opción.** |
| Bella `hpp4J3VqNfWAUOO0d1Us` | a, b, c, d | Muy clara y con buenos finales, pero acento inglés marcado según el detector: la frase de cierre se clasifica **90 % inglés** y «Panam**a**» sale sin acento final. Descartada. |
| Laura `FGY2WhTYpPnrIDTdsKH5` | a, b, c | La más expresiva, pero con finales ascendentes («¿Elegir bien?») y un error de ASR. Descartada. |
| Jessica `cgSgspJ2msm6clMCkdW9` | a | Errores de ASR («se cuente», «Inota Alta») y final ascendente. Descartada. |

**Rondas:**
- **a:** `eleven_v3`, estabilidad «Natural» (0,5), similarity 0,75, sin tags.
- **b:** con tags de interpretación de v3 (`[curious]`, `[warmly]`, `[confident]` y `[cheerfully]`), las mismas palabras.
- **c:** `eleven_multilingual_v2` con style 0,45 y speed 1,05. Más rápida y plana que v3, con el cierre ascendente; descartada.
- **d:** igual que b, pero con `[warmly]` en vez de `[cheerfully]` en el tagline. `[cheerfully]` subía el tono a unos 300 Hz y aplanaba el final.

### Comparación contra Chatterbox (baseline v2) y Chatterbox femenino

| | Chatterbox v2 (actual) | Chatterbox E/F (variante femenina) | **ElevenLabs Sarah (v3)** |
|---|---|---|---|
| Tono medio | 116–127 Hz (grave, coherente con tu «voz para dormir») | F: 145–195 Hz | **190–220 Hz** |
| Brillo (roll-off 95 %) | 5–7,5 kHz | 4,3–4,7 kHz (apagada) | **7,5–9 kHz** |
| Fiabilidad | estable con identidad fijada | E: alucinaciones («Menta en 3 notas», «elegir bien, elegir bien») y finales ascendentes | 0 alucinaciones en las 4 rondas |
| P(es) | 0,95 | 0,96 | 0,94 (sin tags) |

- **Chatterbox femenino:** la variante F usa como referencia la voz española «ef_dora» de Kokoro (sintética, licencia Apache-2.0, no es una persona). No se clonó ninguna persona real.
- Las muestras de Chatterbox están en `voice-tests-v3/chatterbox/`, y la referencia v2 en `voice-tests-v3/cb-v2-baseline__*`.

### Voz seleccionada y por qué

**ElevenLabs `eleven_v3` · Sarah (`EXAVITQu4vr4xnSDxMaL`) · stability 0,5 («Natural») · similarity_boost 0,75 · `pcm_24000` · semillas fijas.**

**Por qué** (técnicamente la más prometedora; no es un juicio de oído):
- Es femenina, joven-adulta según su etiqueta, brillante y fiable.
- Es la voz ElevenLabs que el detector reconoce como **español** con más consistencia.
- Mantiene finales firmes con la dirección por tags.
- Frente al Chatterbox actual sube casi una octava, suena más brillante y no alucina. Eso es justo lo que pedías frente a la voz «para dormir».

**Interpretación por capítulo (tags de v3, mismas palabras):**
- **Salida (descubrir):** `[curious]` / `[excited]`.
- **Corazón (elegir):** `[warmly]`, con `[cheerfully]` en «Tu cupón, aplicado» para la sonrisa.
- **Fondo (lo que queda):** `[confident]`.
- **Firma:** `[confident] Nota Alta.` seguida de `[warmly] Perfumería online en Panamá.`.

Ritmo objetivo por capítulo: 4,8 / 4,2 / 4,0 / 3,6 sílabas por segundo (más vivo que en v2).

### Producción (`scripts/voice_v2.py --engine elevenlabs`)

- Una petición por línea, 2 tomas con semilla fija por línea y más solo si ninguna pasa.
- El filtro de v2 se mantiene (palabras exactas por ASR, ritmo, sin silencios de más de 0,6 s, final descendente) y se añade un **filtro de idioma: P(es) ≥ 0,5** para esta voz nativa en inglés.
- **Corrección importante detectada en QA:** generadas por separado, las frases cortas se clasificaban como inglés. El tagline salía 63 % inglés y «Por familia.» 40 % inglés. Por eso estos pares se generan como **una sola frase en español y se cortan en su pausa**:
  - «Por familia. Por marca.»;
  - «Nota Alta. Perfumería online en Panamá.» (es exactamente el texto de la audición).
  - El tagline pasó a reconocerse primero como español (0,46 frente a 0,13 de inglés) y «Panamá» sale acentuado.
- **«Por familia. / Por marca.»** son elementos de una enumeración, así que quedan exentos del filtro de final descendente: lo natural es que queden en suspenso.
- **Tomas:** 44 en `public/audio/vo-v3-takes/`, con la selección y las semillas en `selection.json`. Archivos secos en `public/audio/vo-v3-dry/` y con EQ en `public/audio/vo-v3/`.

### Cambios de guion

**Ninguno.** Son exactamente las mismas palabras que en v2. Solo se añaden los tags de interpretación y la generación en contexto de los dos pares.

### Cambios de timing (solo posición de frases; la imagen no cambia)

`src/data/vo-v3-cues.json`. El onset de cada palabra clave se midió dentro de su archivo: inicio de la ráfaga de voz tras una pausa (el ASR adelanta 8–20 frames las palabras que siguen a una pausa) o marca de tiempo de ASR en frases continuas.

| Palabra | Evento | Medido en el stem |
|---|---|---|
| «descubrir» | entra «descubrir.» (f176) | f179 |
| «nota» | resultados de búsqueda (f463–472) | f470 (la frase se solapa con el tecleo) |
| «elegir» | entra «elegir bien.» (f630) | f628 |
| «aplicado» | se aplica DG10 (f900) | **f899** |
| «Yappy» | última selección de Yappy (f1092) | **f1091** |
| «lo que queda» | entra «lo que queda.» (f1192) | f1193–1202 |
| «Nota Alta» | firma tras la campana (f1656) | f1688–1703 |
| «Perfumería» | tagline (f1728) | f1731 |

- Capítulos: «La salida» en f146 (el capítulo empieza en f144), «El corazón» en f596 (título en f594), «Y el fondo» en f1160 (puerta en f1152).
- Sin solapes. Tras la última palabra quedan **3,0 s de cierre**.

### Cambios de mezcla (recalibrada para esta voz)

- **EQ de voz:** paso alto a 90 Hz y −1,5 dB a 280 Hz. **Sin realce de presencia**, porque Sarah ya es brillante. En v2 se añadían +2,5 dB a 4,5 kHz para Chatterbox. Cada línea se normaliza a −21 LUFS.
- **Medición por frase con stems.** Con la profundidad de ducking de v2, la voz quedaba de +8,5 a +10,5 dB sobre la música. Como esta voz atraviesa mejor la mezcla, el objetivo bajó a **~+9 dB** para integrarla en la música en lugar de dejarla encima. Las frases que pasaban de +9,5 dB recibieron 0,06 menos de ducking.
- **Resultado:** relación voz/música de **+8,5 a +9,8 dB** (mediana +9,1).
- **Firma:** +2,6 dB (ganancia 1,35) y ducking de 0,72, para que «Nota Alta» se entienda dentro de la campana.
- Música y SFX sin cambios.

### Master y QA final

- Master: **−14,5 LUFS integrados, true peak −1,5 dBTP**, LRA 4,5 LU, pico de muestra −1,5 dBFS, sin clipping. Fade-in de −46,9 dB, final de −45,2 dB y cola musical del cierre intacta.
- **Imagen idéntica a la v2 aprobada:** PSNR de 99 dB (MSE 0) en 13 fotogramas.
- **Las 14 frases del guion** (15 archivos, porque la firma se separa del tagline) son **inteligibles en la mezcla final: 15/15** con ASR por frase sobre la propia mezcla. Incluye «Yappy», «Tu cupón, aplicado», los tres capítulos y «Nota Alta».
- La transcripción larga de todo el archivo falla en el cierre de forma variable («suscríbete», «pota/tota alta» o nada), mientras que el mismo audio aislado se transcribe bien. Es una alucinación de Whisper en la cola musical del final del archivo, no un problema de la voz. Por eso el validador comprueba por frase (`scripts/v2_validate.py … v3`).

### Limitaciones

- **No escuché el resultado.** Las métricas dicen voz femenina, brillante, español reconocible, palabras exactas, finales firmes, sincronía e inteligibilidad sobre la música. No pueden juzgar carisma, calidez, si la sonrisa se oye ni si el acento suena latino.
- Sarah es una voz *premade* nativa en inglés. «Nota Alta.» por sí sola sigue clasificándose como inglés en la detección de idioma, aunque se transcribe bien; con dos palabras el detector apenas tiene información. **Escucha especialmente la firma y el tagline.**
- Las voces nativas latinoamericanas de la Voice Library requieren un plan de pago. Con un plan Starter se podría repetir esta audición con Norah, Lina, Samanta o Fran, que probablemente suenen más naturales en español.
- **Licencia del plan gratuito:** revisar antes de publicar (ver arriba).
- **Para comparar de oído:**
  - `voice-tests-v3/el-sarah-v3-d__*` frente a `el-matilda-v3-d__*` y `cb-v2-baseline__*`;
  - después, la película completa v2 frente a v3.

### Reproducir la voz v3

```powershell
cd video-demo-opus
# ELEVENLABS_API_KEY en el entorno (nunca en archivos)
.venv-tts\Scripts\python scripts\eleven_audition.py a   # (b, c, d) audición -> public/audio/voice-tests-v3
.venv-tts\Scripts\python scripts\voice_v2.py --engine elevenlabs        # -> vo-v3-dry, vo-v3-takes, src/data/vo-v3.json
.venv-tts\Scripts\python scripts\mix_prep.py --voice v3
npx remotion render NotaAltaFilm out/nota-alta-opus-voice-v3-raw.mp4 --props='{"voice":"v3"}'
powershell -File scripts\master.ps1 out\nota-alta-opus-voice-v3-raw.mp4 out\nota-alta-opus-voice-v3.mp4
.venv-tts\Scripts\python scripts\v2_validate.py out\nota-alta-opus-voice-v2.mp4 out\nota-alta-opus-voice-v3.mp4 <audio-v3.wav> v3
```
