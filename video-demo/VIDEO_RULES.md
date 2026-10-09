\# Reglas permanentes de ProductShowcase



Estas reglas aplican a cualquier trabajo futuro sobre ProductShowcase.



\## 1. Fidelidad a la aplicación real



Remotion puede enfatizar, recortar, animar o destacar lo que ocurre en la aplicación.



Remotion NO puede inventar una funcionalidad, resultado, métrica, descuento,

estado o interacción que la grabación real no demuestre.



Ejemplos:



\- Si el video muestra un descuento de $11.90, la aplicación real debe haberlo aplicado.

\- Si el video muestra un total de $107.10, ese total debe existir realmente en la UI.

\- Si se muestra +112.7%, ese valor debe existir realmente en el dashboard.

\- Si una acción no ocurrió en la aplicación, no debe simularse mediante motion graphics.



Los overlays pueden ENFATIZAR datos reales.

No pueden INVENTARLOS.



\## 2. Cero errores visibles



Ningún clip utilizado puede contener:



\- 404

\- 500

\- excepciones Django

\- páginas de DEBUG

\- tracebacks

\- rutas inválidas

\- formularios rotos

\- estados incompletos

\- pantallas de error



Aunque el error aparezca únicamente durante unos frames al inicio o al final,

el clip debe corregirse o regrabarse.



Nunca esconder errores mediante:

\- crop

\- zoom

\- overlays

\- blur

\- transición



Se debe arreglar la grabación fuente.



\## 3. URLs reales



No inventar ni hardcodear rutas si pueden obtenerse navegando la aplicación.



Para fichas de productos:



\- obtener el href real desde la tarjeta

\- navegar mediante la UI real

\- verificar que la página cargue correctamente

\- después grabar



En esta aplicación, la ruta de producto válida sigue el patrón:



/perfume/<slug>/



No asumir rutas como:



/perfumes/<slug>/



\## 4. Verificación de acciones



Antes de afirmar que una acción ocurrió:



1\. ejecutarla realmente

2\. esperar a que la aplicación responda

3\. leer el estado final del DOM

4\. comprobar visualmente el resultado

5\. solo entonces usar ese dato en Remotion



Esto aplica especialmente a:



\- cupones

\- precios

\- carrito

\- checkout

\- inventario

\- estados de pedidos

\- métricas del dashboard



\## 5. Validación de clips



Cada clip nuevo o regrabado debe revisarse COMPLETO.



No revisar únicamente el comienzo.



Revisar:

\- primeros frames

\- parte central

\- últimos frames



Comprobar:



\- no hay errores

\- no hay 404

\- no hay excepciones

\- no hay navegación accidental

\- la acción realmente ocurre

\- el estado final es correcto

\- el scroll es fluido

\- no hay saltos visuales



\## 6. Scroll



Cuando haya scroll visible:



\- evitar grandes mouse wheel

\- usar desplazamiento continuo

\- preferir requestAnimationFrame desde Playwright

\- usar easing

\- dejar settle al terminar



No aceptar scroll escalonado o entrecortado.



\## 7. Overlays



No añadir badges, pills o popups que simplemente repitan información de la UI.



Un overlay solo debe existir si:



\- aporta contexto nuevo

\- dirige la atención

\- explica causa → efecto

\- enfatiza una métrica real



La interfaz debe seguir siendo la protagonista.



\## 8. Regla de prioridad



Si hay conflicto entre:



"hacer que el video se vea bonito"



y



"mostrar fielmente la aplicación"



siempre priorizar la fidelidad a la aplicación.

