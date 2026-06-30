# KALISO — Catálogo Digital

Catálogo digital tipo boutique premium. No requiere instalación, ni Node, ni
build: abre `index.html` en tu navegador (doble clic) y funciona.

## Estructura

```
kaliso/
├── index.html              ← catálogo público (lo que ven tus clientas)
├── admin.html               ← panel para agregar/editar productos sin tocar código
├── css/
│   ├── style.css             ← estilos del catálogo público
│   └── admin.css             ← estilos del panel de administración
├── js/
│   ├── products.js           ← datos de productos y categorías
│   ├── app.js                 ← config (WhatsApp, pagos, dirección) + lógica del catálogo
│   └── admin.js                ← lógica del panel de administración
└── assets/
    ├── marca/logo-kaliso.png   ← tu logo
    └── productos/                ← fotos de productos
```

## ✅ Ya configurado con tu información real

- WhatsApp línea de pedidos: **+57 323 306 7322**
- WhatsApp línea de atención: **+57 317 407 0511**
- Correo: **kaliso@gmail.com**
  > ⚠️ Verifica este dato: lo recibí como "Kaliso.gmail.con", que no es un correo
  > válido, así que asumí que era un error de tipeo y lo completé como
  > `kaliso@gmail.com`. Si no es correcto, cámbialo en `js/app.js` (bloque `CONFIG`).
- Punto de fábrica: **Transversal 75L #62G Sur - 12, Bogotá, Colombia**
- Categorías: Camisas, Faldas, Velas artesanales, Bolsas artesanales, Accesorios
- 7 productos cargados con las fotos que enviaste
- Logo KALISO aplicado en el header y el footer

## ⚠️ Lo único que falta antes de publicar

Abre `js/app.js`, busca el bloque `CONFIG → payment` y reemplaza estos 3 valores
con tus datos reales (ahora mismo tienen un texto de marcador de posición):

```js
payment: {
  nequi: "[Tu número Nequi aquí]",
  daviplata: "[Tu número Daviplata aquí]",
  brebKey: "[Tu llave Bre-B aquí]",
},
```

Mientras no los cambies, el sitio mostrará literalmente ese texto entre corchetes
en la sección "Métodos de pago" — es intencional, para que no se te olvide.

**Precios:** los 7 productos cargados tienen precios de ejemplo razonables para
cada categoría, pero no son tus precios reales. Ajústalos desde el Panel de
administración (`admin.html`) antes de publicar — ver abajo.

## 🔐 Panel de administración (`admin.html`)

Esta es la respuesta a "que me dé la opción de subir foto y poner precio sin
tocar código". Ábrelo así: `admin.html` (doble clic, o súbelo junto con el
resto de la carpeta y entra por `tudominio.com/admin.html`).

**La primera vez** te pedirá crear un PIN de 4+ dígitos — ese PIN evita que
alguien que encuentre el enlace entre por accidente. **No es una contraseña de
alta seguridad** (es del lado del navegador, cualquiera con conocimientos
técnicos podría saltársela), así que:
- No publiques el enlace `admin.html` en redes sociales ni se lo compartas a clientas.
- Si quieres protección real, la mayoría de hostings gratuitos (Netlify, por
  ejemplo) permiten poner una contraseña a nivel de sitio — pregúntame si
  quieres que te explique cómo activarlo en el que elijas.

**Desde el panel puedes:**
- Agregar un producto nuevo (nombre, categoría, precio, fotos, tallas, colores, etiquetas)
- Editar o eliminar cualquier producto existente
- Agregar o quitar categorías
- Subir fotos arrastrándolas o tocando para seleccionarlas — el sistema las
  comprime automáticamente para que el sitio cargue rápido

**Importante — cómo se publican los cambios:**
Como este es un sitio sin servidor (estático), lo que edites en el panel se
guarda *solo en el navegador donde lo editaste* (vista previa local). Para que
tus clientas vean los cambios:
1. Edita lo que necesites en `admin.html`.
2. Presiona **"Descargar products.js"** (arriba a la derecha).
3. Sube ese archivo descargado a tu hosting, **reemplazando** el actual
   `js/products.js` (arrastrando el archivo en Netlify, por FTP, etc.).
4. Listo — el catálogo público ya refleja los cambios para todo el mundo.

**Si tú no estás disponible:** cualquier persona del equipo puede repetir este
mismo proceso desde su propio computador o celular — el panel no requiere
conocimientos técnicos, solo seguir los 4 pasos de arriba. Recomendamos guardar
el archivo `products.js` descargado en una carpeta compartida (Drive, WhatsApp)
para que quien tenga acceso al hosting pueda subirlo aunque no haya sido quien
hizo los cambios.

## Publicar el catálogo en internet

Proyecto 100% estático, sube la carpeta completa gratis a:
- **Netlify** (arrastra la carpeta a netlify.app/drop)
- **Vercel**
- **GitHub Pages**
- Cualquier hosting compartido tradicional (por FTP)

No necesitas configurar nada adicional: sube la carpeta tal cual.

## Funcionalidades incluidas

- Diseño responsive (celular, tablet, computador)
- Filtro por categoría + buscador en tiempo real
- Modal de producto con galería, tallas, colores y stock
- Botones de WhatsApp (línea de pedidos y línea de atención) en cada producto,
  el flotante, y la sección "Cómo comprar" — el mensaje se arma automáticamente
- Sección "Cómo comprar" con los pasos completos, conectada a tus dos líneas de WhatsApp
- Sección de pagos con tus datos de Nequi, Daviplata y llave Bre-B
- Sección "Nosotros" con el enfoque de emprendimiento de mujeres, fundado en 2026
- Panel de administración para fotos y precios sin tocar código
- Etiquetas: Nuevo, Más vendido, Últimas unidades, Edición especial, Artesanal, Exclusivo

## Evolución futura a e-commerce

La estructura modular (datos en `products.js`, panel separado en `admin.html`)
está pensada para que, cuando quieras dar el salto a un carrito de compras y
pagos en línea, solo tengas que conectar esos mismos datos a un backend real
— no tendrás que rehacer el diseño ni la experiencia de usuario.
