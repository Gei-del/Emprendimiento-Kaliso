# KASOLI — Contrato de experiencia

## Rutas

- `/`: catálogo público, búsqueda, filtros, detalle y lista de pedido.
- `/admin.html`: acceso de administradores y CRUD de productos.
- Título: `{Página} — KASOLI`.

## Catálogo

- Buscar y filtrar son locales, inmediatos y combinables. La búsqueda ofrece botón para limpiar.
- El estado vacío explica cómo recuperar resultados.
- “Agregar al pedido” conserva talla, color y cantidad. La lista se guarda en el dispositivo.
- “Pedir por WhatsApp” arma un único mensaje con todos los productos y permite elegir a Lorena o Karen.
- Cuando un producto no tiene precio público, se muestra “Consultar precio”.

## Administración

- El acceso usa correo con enlace mágico; nunca PIN local como seguridad.
- Crear o editar conserva datos si falla la red y evita envíos dobles.
- Las fotos validan formato y tamaño antes de subir; cada error se muestra junto al archivo.
- El selector de categoría es nativo: se acepta la geometría y navegación provista por cada sistema operativo para favorecer familiaridad en móviles.
- Eliminar requiere diálogo propio con nombre y consecuencia, foco inicial en cancelar y restauración del foco.
- Guardar vuelve a la lista y anuncia éxito. Los errores se muestran en línea y se pueden reintentar.
- Si la nube no está configurada, el catálogo usa productos iniciales y el administrador explica el estado sin fingir que publicó cambios.

## Accesibilidad y estado

- Objetivo WCAG 2.2 AA, HTML semántico, foco visible y objetivos táctiles de 44 px.
- Modal: foco contenido, Escape cierra, fondo inerte y foco restaurado.
- Toast compartido con `aria-live`; los errores corregibles también permanecen junto al campo.
- Movimiento reducido desactiva animaciones no esenciales.
- El sitio usa español de Colombia y precios COP solo cuando están confirmados.

## Propiedad canónica

- Tokens: `DESIGN.md` → variables en `css/style.css`.
- Datos y sesión: `js/data.js`.
- Diálogo, toast y botones: estilos y utilidades compartidos en `js/ui.js`.
- CRUD: `js/admin.js`, con Supabase como fuente pública única al estar configurado.

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Select/Listbox | Selector nativo | UX-CONTRACT.md | native | teclado y navegador móvil |
| Form | Formulario administrativo | js/admin.js | crear / editar | validación y foco |
| Scrollbar | Hoja global | css/style.css | geometría por superficie | estilo calculado |
| Toast | KasoliUI.toast | js/ui.js | éxito / información | región viva |
| CRUD | KasoliData | js/data.js | crear / editar / eliminar | flujo completo y fallos |
