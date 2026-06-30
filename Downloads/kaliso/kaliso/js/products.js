/**
 * ============================================================
 *  KALISO — Catálogo de productos
 * ============================================================
 *  Este archivo contiene los datos de TODOS los productos
 *  que se muestran en el catálogo.
 *
 *  RECOMENDADO: usa el Panel de administración (admin.html)
 *  para agregar, editar o eliminar productos sin tocar código.
 *  Ese panel genera automáticamente una versión actualizada
 *  de este archivo, lista para subir a tu hosting.
 *
 *  Si prefieres editarlo manualmente, así se ve un producto:
 *
 *  - id          (number)  identificador único, no repetir
 *  - name        (string)  nombre del producto
 *  - category    (string)  debe coincidir con un id de CATEGORIES
 *  - price       (number)  precio actual en COP, sin puntos ni símbolos
 *  - oldPrice    (number|null) precio anterior, para mostrar descuento. null si no aplica
 *  - tags        (array)   "nuevo" | "mas-vendido" | "ultimas-unidades" |
 *                           "edicion-especial" | "artesanal" | "exclusivo"
 *  - images      (array)   rutas de imágenes. La primera es la principal.
 *  - description (string)  descripción corta para la tarjeta
 *  - details     (array)   características para el modal
 *  - sizes       (array)   tallas disponibles. [] si no aplica
 *  - colors      (array)   colores / variantes disponibles. [] si no aplica
 *  - stock       (number)  unidades disponibles
 * ============================================================
 */

const CATEGORIES = [
  { id: "todos", name: "Todos" },
  { id: "camisas", name: "Camisas" },
  { id: "faldas", name: "Faldas" },
  { id: "velas-artesanales", name: "Velas artesanales" },
  { id: "bolsas-artesanales", name: "Bolsas artesanales" },
  { id: "accesorios", name: "Accesorios" },
];

const TAG_LABELS = {
  "nuevo": "Nuevo",
  "mas-vendido": "Más vendido",
  "ultimas-unidades": "Últimas unidades",
  "edicion-especial": "Edición especial",
  "artesanal": "Artesanal",
  "exclusivo": "Exclusivo",
};

const PRODUCTS = [
  {
    id: 1,
    name: "Falda Denim Boho Tiered",
    category: "faldas",
    price: 95000,
    oldPrice: null,
    tags: ["nuevo", "mas-vendido"],
    images: ["assets/productos/falda-denim-boho.jpg"],
    description: "Falda larga en denim con botonadura frontal y diseño escalonado. Cómoda, fresca y versátil.",
    details: ["Tela denim liviana", "Botonadura frontal funcional", "Diseño escalonado (tiered)", "Cintura elástica posterior"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Azul oscuro"],
    stock: 10,
  },
  {
    id: 2,
    name: "Camisetas Mariposa Boho",
    category: "camisas",
    price: 45000,
    oldPrice: null,
    tags: ["nuevo"],
    images: ["assets/productos/camisetas-mariposa.jpg"],
    description: "Camisetas 100% algodón con estampados artísticos de mariposas y frase motivacional.",
    details: ["100% algodón", "Estampado de alta durabilidad", "Disponible en 3 diseños", "Corte unisex"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Mariposa café", "Mariposa rosa", "Mariposa azul"],
    stock: 15,
  },
  {
    id: 3,
    name: "Camisetas Frases Inspiradoras",
    category: "camisas",
    price: 45000,
    oldPrice: null,
    tags: ["mas-vendido"],
    images: ["assets/productos/camisetas-frases.jpg"],
    description: "Camisetas con frases y diseños minimalistas para manifestar buena energía cada día.",
    details: ["100% algodón suave", "Estampado de alta durabilidad", "Disponible en 3 diseños", "Corte unisex"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Café luna", "Rosa manifest", "Blanco cactus"],
    stock: 15,
  },
  {
    id: 4,
    name: "Velas Artesanales Concha de Mar",
    category: "velas-artesanales",
    price: 25000,
    oldPrice: null,
    tags: ["artesanal", "nuevo"],
    images: ["assets/productos/velas-concha.jpg"],
    description: "Velas en forma de concha hechas a mano, ideales para decorar o regalar. Vendidas por par.",
    details: ["Cera vegetal artesanal", "Aroma suave", "Hechas a mano una por una", "Ideal para regalo o decoración"],
    sizes: [],
    colors: ["Rosa", "Lila"],
    stock: 20,
  },
  {
    id: 5,
    name: "Llaveros Resina Playa Personalizados",
    category: "accesorios",
    price: 18000,
    oldPrice: null,
    tags: ["artesanal", "exclusivo"],
    images: ["assets/productos/llaveros-resina.jpg"],
    description: "Llaveros en resina con arena y agua de mar, personalizados con la inicial que tú elijas.",
    details: ["Hechos a mano en resina", "Personalizables por inicial", "Incluye argolla metálica", "Pieza única, ninguna es igual"],
    sizes: [],
    colors: [],
    stock: 25,
  },
  {
    id: 6,
    name: "Mochila Wayuu Tricolor",
    category: "bolsas-artesanales",
    price: 180000,
    oldPrice: null,
    tags: ["artesanal", "exclusivo"],
    images: ["assets/productos/mochila-wayuu-tricolor.jpg"],
    description: "Mochila tejida a mano en crochet, inspirada en los colores de Colombia. Pieza única numerada.",
    details: ["Tejido 100% artesanal a mano", "Hilo de algodón resistente", "Correa tejida ajustable", "Cierre con borlas decorativas"],
    sizes: [],
    colors: ["Amarillo / Azul / Rojo"],
    stock: 6,
  },
  {
    id: 7,
    name: "Mochila Crochet Equipo de Fútbol",
    category: "bolsas-artesanales",
    price: 165000,
    oldPrice: null,
    tags: ["artesanal", "edicion-especial"],
    images: ["assets/productos/mochila-crochet-millonarios.jpg"],
    description: "Mochila tejida a mano con el escudo de tu equipo favorito. Ideal para mostrar tus colores con estilo.",
    details: ["Tejido 100% artesanal a mano", "Diseño con escudo deportivo", "Correa ajustable", "Personalizable a pedido por equipo"],
    sizes: [],
    colors: ["Azul / Blanco"],
    stock: 4,
  },
];
