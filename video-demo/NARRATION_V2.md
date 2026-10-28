# Guion de Narración V2 · Nota Alta Product Showcase

Este documento establece la narración, timings y sincronización para la V2 de **ProductShowcase** (1920x1080 @ 30 FPS, 2356 frames / 78.53 segundos).

La narración está concebida bajo un tono editorial, cálido, conversacional y de alto valor de producto. No describe clics de forma mecánica; acompaña y contextualiza cada módulo de la plataforma dejando pausas para que la interfaz y el diseño sonoro respiren.

---

## Voz Oficial

- **Motor:** Edge TTS / Microsoft Speech Neural
- **Voz Oficial:** `es-PA-MargaritaNeural` (Español de Panamá, joven-adulta, cálida, natural, ágil y elegante).
- **Muestras comparativas archivadas en:** `video-demo/public/audio/voice-tests/`
  - `sample-margarita-es-PA.mp3` (8.86 s) — Voz oficial seleccionada
  - `sample-dalia-es-MX.mp3` (9.29 s) — Referencia anterior
  - `sample-paloma-es-US.mp3` (8.86 s) — Alternativa fresca
  - `sample-salome-es-CO.mp3` (10.08 s) — Alternativa suave

---

## Estructura por Escena y Timings Reales Medidos (Margarita)

| Escena | Clip de Voz | Texto | Duración Real | Frames (30fps) | Frame Global Inicio | Frame Global Fin | Margen de Silencio hasta Sig. Escena |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **01 Intro** | `01-intro.mp3` | *"Comprar perfumes en línea debe ser tan simple como disfrutarlos. Así nace Nota Alta."* | 6.62 s | 199 f | **15** | 214 | 12 frames (hasta f226) |
| **02 Descubrimiento** | `02-discovery.mp3` | *"En lugar de listas interminables, descubres fragancias por familias olfativas y cómo evolucionan en tu piel."* | 6.50 s | 195 f | **236** | 431 | 21 frames (hasta f452) |
| **03 Catálogo** | `03-catalog.mp3` | *"Un catálogo curado con filtros instantáneos por casa, ocasión y concentración."* | 5.28 s | 158 f | **462** | 620 | 56 frames (hasta f676) |
| **04 Producto** | `04-product.mp3` | *"Cada perfume detalla su pirámide olfativa completa, para que sepas exactamente qué esperar desde la primera aplicación."* | 7.08 s | 212 f | **686** | 898 | 34 frames (hasta f932) |
| **05 Carrito** | `05-cart.mp3` | *"Descuentos y cupones que se validan al instante, recalculando subtotales sin pasos innecesarios."* | 6.26 s | 188 f | **942** | 1130 | 28 frames (hasta f1158) |
| **06 Checkout** | `06-checkout.mp3` | *"Un checkout pensado para Panamá: retiro en tienda en cuatro horas y pagos locales con Yappy o ACH."* | 6.43 s | 193 f | **1168** | 1361 | 53 frames (hasta f1414) |
| **07 Tracking** | `07-tracking.mp3` | *"El cliente sigue cada etapa de su orden con total claridad, desde la confirmación hasta la entrega."* | 5.90 s | 177 f | **1424** | 1601 | 35 frames (hasta f1636) |
| **08 Panel** | `08-panel.mp3` | *"Detrás de la experiencia, un panel de control con métricas clave de ventas, demanda y stock en tiempo real."* | 6.89 s | 207 f | **1646** | 1853 | 49 frames (hasta f1902) |
| **09 Operaciones** | `09-operations.mp3` | *"Gestión integral de órdenes y ajustes directos de inventario para mantener el catálogo siempre al día."* | 5.81 s | 174 f | **1912** | 2086 | 50 frames (hasta f2136) |
| **10 Cierre** | `10-outro.mp3` | *"Nota Alta. Perfumería digital, pensada para Panamá."* | 5.18 s | 156 f | **2146** | 2302 | 54 frames (hasta f2356 fin) |

---

## Resumen Métrico Global

- **Duración de la composición:** 78.53 s (2356 frames @ 30 FPS)
- **Tiempo con voz activa:** 56.96 s (~72.5% del metraje con pausas orgánicas en cada cambio de escena)
- **Respiro entre escenas:** Ninguna voz invade ni se solapa con la siguiente escena (márgenes de 12 a 56 frames).
- **Margen final de cierre:** 54 frames (~1.8 s) para reverberación, fade de música y presencia del logo final.
