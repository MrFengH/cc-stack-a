# Reporte de Grabación de Clips · Nota Alta Showcase

Este documento detalla el estado, métricas técnicas y observaciones de cada uno de los clips grabados mediante **Playwright** en la aplicación real (**http://127.0.0.1:8001**).

Todos los clips han sido capturados a resolución nativa **1920x1080** a **30 fps**, respetando márgenes limpios al inicio y al final (0.5 - 1.0 s) y movimientos de cámara y cursor fluidos para facilitar el trabajo posterior en Remotion.

---

## Tabla de Grabaciones

| Clip | Duración | Resolución | Flujo mostrado | Resultado | Observaciones | ¿Necesita repetirse? |
| :--- | :---: | :---: | :--- | :---: | :--- | :---: |
| `01-intro-home.webm` | 15.37 s | 1920x1080 | Portada principal (Hero), titular editorial, frasco Chanel y scroll suave hacia los 3 pilares de entrega y medios de pago. | **Óptimo** | Encuadre amplio con buen ritmo de scroll (3 s). Excelente margen inicial y final para el corte de apertura. | **No** |
| `02-descubrimiento-familias.webm` | 16.93 s | 1920x1080 | Sección *"Elige por cómo quieres oler"*, paneo sobre familias olfativas (Florales / Gourmand) y clic interactivo hacia el catálogo filtrado. | **Óptimo** | El hover sobre las notas olfativas resalta con naturalidad y la transición a la tienda es limpia. | **No** |
| `03-catalogo-filtros.webm` | 15.50 s | 1920x1080 | Catálogo general con 23 perfumes, selección de filtro de marca (*Dolce & Gabbana*) y hover sobre la tarjeta de producto resultante (*The One*). | **Óptimo** | La recarga del catálogo con los resultados filtrados es ágil y sin saltos visuales bruscos. | **No** |
| `04-detalle-producto.webm` | 20.57 s | 1920x1080 | Ficha de Dolce & Gabbana The One, precio con descuento (-12%), stock en tiempo real y recorrido por la pirámide olfativa (*Salida, Corazón, Fondo*). | **Óptimo** | Excelente material para aplicar callouts y zoom en la sección *"Cómo evoluciona en la piel"*. | **No** |
| `05-carrito-cupon.webm` | 19.03 s | 1920x1080 | Producto en el carrito, tecleo secuencial del cupón `DG10`, clic en *"Aplicar"* y recálculo instantáneo del descuento (-$11.90) con badge de envío gratis. | **Óptimo** | El recálculo del precio total ($107.10) y la aparición del badge de cupón son perfectamente nítidos. | **No** |
| `06-checkout-pagos.webm` | 22.87 s | 1920x1080 | Stepper de checkout, formulario con provincias de Panamá, opciones de entrega (retiro en 4 h) y selección interactiva de métodos locales (*Yappy / Contra entrega*). | **Óptimo** | Muestra con total claridad la localización panameña de la tienda. | **No** |
| `07-cuenta-tracking.webm` | 17.60 s | 1920x1080 | Perfil de cliente de Mariela Ríos con métricas personales, acceso al pedido `NA-00411` y visualización de la línea de tiempo vertical de seguimiento de pedido. | **Óptimo** | El recorrido visual sobre las etapas de entrega (*Pagado → En preparación → Enviado*) transmite gran transparencia. | **No** |
| `08-panel-metricas.webm` | 19.47 s | 1920x1080 | Dashboard del panel administrativo: tarjetas KPI ($10,560.50 en ventas, ticket promedio, clientes), gráfico de barras de ventas (+112.7%) y alertas de stock. | **Óptimo** | La interfaz oscura contrasta elegantemente con la tienda y las métricas comerciales son muy convincentes. | **No** |
| `09a-panel-pedidos.webm` | 16.10 s | 1920x1080 | Listado general de pedidos en el panel, activación del filtro por estado (*"Pagado 3"*) y visualización de la fila de pedido de Edwin Quintero. | **Óptimo** | Demuestra el pipeline de órdenes y la facilidad de filtrado administrativo. | **No** |
| `09b-panel-inventario.webm` | 19.10 s | 1920x1080 | Panel de inventario con KPIs de stock, activación del filtro *"Stock bajo (1 a 5)"* y foco en el control de ajuste de unidades *inline* en la tabla. | **Óptimo** | Destaca la agilidad de cambiar existencias directamente en la grilla sin entrar a formularios lentos. | **No** |

---

## Nota sobre la Escena 10 (Cierre de Producto)

De acuerdo con las directrices de planificación, **no se requirió grabar un clip adicional para la Escena 10**. El material de alta calidad capturado en `01-intro-home.webm` (especialmente el encuadre estático inicial del hero con el frasco y la marca) proporciona el metraje ideal para componer el cierre visual, superponer el claim final de Nota Alta y ejecutar el desvanecimiento de salida en Remotion.

---

## Verificación de Integridad

- **Ubicación:** `video-demo/public/recordings/`
- **Total de clips:** 10 archivos WebM
- **Peso total acumulado:** ~29.5 MB
- **Estado de la base de datos:** Intacta. Todas las pruebas se ejecutaron sin acciones destructivas y el servidor local permanece activo y en estado coherente.
