/**
 * ============================================================
 *  KALISO — Lógica de la aplicación
 * ============================================================
 *  Este archivo maneja: render de productos, filtros, búsqueda,
 *  modal de producto, generación de mensajes de WhatsApp,
 *  datos de contacto/pago, animaciones de scroll y header.
 *
 *  Depende de: js/products.js (debe cargarse ANTES que este archivo)
 * ============================================================ */

/* ============================================================
   CONFIGURACIÓN — EDITA ESTOS VALORES
   ============================================================
   Esta es la ÚNICA parte del sitio que requiere tocar código.
   Para productos (fotos y precios) usa admin.html, que no
   requiere ningún conocimiento técnico.
   ============================================================ */
const CONFIG = {
  // Número principal: pedidos y consultas de catálogo
  whatsappPrimary: "573233067322",
  whatsappPrimaryLabel: "Línea de pedidos",

  // Número alterno: atención al cliente / soporte
  whatsappSecondary: "573174070511",
  whatsappSecondaryLabel: "Línea de atención",

  businessName: "KALISO",
  email: "kaliso@gmail.com",

  // Punto de fábrica / recogida (no es tienda física de venta directa)
  address: "Transversal 75L #62G Sur - 12, Bogotá, Colombia",

  // Redes sociales (deja "" si no aplica, el ícono se oculta solo)
  instagramUrl: "https://instagram.com/kaliso",
  facebookUrl: "",
  tiktokUrl: "",

  // Datos de pago — edita con tus números/llave reales
  payment: {
    nequi: "[Tu número Nequi aquí]",
    daviplata: "[Tu número Daviplata aquí]",
    brebKey: "[Tu llave Bre-B aquí]",
  },

  // Mensaje genérico del botón flotante / contacto general
  defaultWhatsappMessage: "¡Hola KALISO! Vi su catálogo digital y me encantaría conocer más 😊",

  // Cuántos productos mostrar por "página" al usar Ver más
  productsPerPage: 8,

  currency: "COP",
  locale: "es-CO",
};

/* ============================================================
   UTILIDADES
   ============================================================ */
const formatPrice = (value) =>
  new Intl.NumberFormat(CONFIG.locale, {
    style: "currency",
    currency: CONFIG.currency,
    maximumFractionDigits: 0,
  }).format(value);

const buildWhatsappLink = (message, number = CONFIG.whatsappPrimary) =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

const buildProductMessage = (product, selectedSize, selectedColor) => {
  let msg = `¡Hola ${CONFIG.businessName}! 👋 Me interesa este producto:\n\n`;
  msg += `🛍️ *${product.name}*\n`;
  msg += `💰 ${formatPrice(product.price)}\n`;
  if (selectedSize) msg += `📏 Talla: ${selectedSize}\n`;
  if (selectedColor) msg += `🎨 Color/diseño: ${selectedColor}\n`;
  msg += `\n¿Está disponible?`;
  return msg;
};

const debounce = (fn, delay = 250) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/* ============================================================
   ESTADO
   ============================================================ */
const state = {
  activeCategory: "todos",
  searchTerm: "",
  visibleCount: CONFIG.productsPerPage,
  modalProduct: null,
  modalImageIndex: 0,
  modalSelectedSize: null,
  modalSelectedColor: null,
};

/* ============================================================
   RENDER: TARJETA DE PRODUCTO
   ============================================================ */
function renderTags(tags) {
  return tags
    .map((t) => `<span class="product-tag tag-${t}">${TAG_LABELS[t] || t}</span>`)
    .join("");
}

function productCardHTML(product) {
  const categoryName =
    CATEGORIES.find((c) => c.id === product.category)?.name || product.category;
  const secondImage = product.images[1] || product.images[0];

  return `
    <article class="product-card reveal" data-id="${product.id}">
      <div class="product-media" data-action="open-modal" data-id="${product.id}">
        <img class="img-primary" src="${product.images[0]}" alt="${product.name}" loading="lazy">
        <img class="img-secondary" src="${secondImage}" alt="" loading="lazy" aria-hidden="true">
        <div class="product-tags">${renderTags(product.tags)}</div>
        <div class="product-quickview">
          <button type="button" data-action="open-modal" data-id="${product.id}">Vista rápida</button>
        </div>
      </div>
      <div class="product-info">
        <span class="product-category">${categoryName}</span>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-desc">${product.description}</p>
        <div class="product-price-row">
          <span class="product-price">${formatPrice(product.price)}</span>
          ${product.oldPrice ? `<span class="product-price-old">${formatPrice(product.oldPrice)}</span>` : ""}
        </div>
        <div class="product-actions">
          <button type="button" class="btn btn-outline" data-action="open-modal" data-id="${product.id}">Ver detalle</button>
          <a class="btn btn-whatsapp" target="_blank" rel="noopener"
             href="${buildWhatsappLink(buildProductMessage(product, null, null))}">
            ${whatsappIconSVG()}
          </a>
        </div>
      </div>
    </article>
  `;
}

function whatsappIconSVG() {
  return `<svg viewBox="0 0 32 32" fill="currentColor" width="18" height="18"><path d="M16.001 3C9.373 3 4 8.373 4 15.001c0 2.348.652 4.611 1.885 6.594L4 29l7.59-1.852A11.93 11.93 0 0 0 16 27.002C22.628 27.002 28 21.63 28 15.001 28 8.373 22.628 3 16.001 3zm6.964 17.06c-.297.836-1.474 1.554-2.42 1.755-.644.137-1.486.246-4.318-.927-3.625-1.5-5.957-5.18-6.14-5.42-.18-.24-1.468-1.953-1.468-3.727s.927-2.645 1.255-3.008c.328-.363.717-.453.957-.453.24 0 .48.002.69.013.222.012.518-.084.81.617.297.715 1.01 2.47 1.097 2.65.088.18.146.39.03.63-.117.24-.176.39-.35.6-.176.21-.367.469-.524.63-.176.18-.36.376-.155.737.205.36.912 1.506 1.96 2.44 1.347 1.2 2.483 1.572 2.845 1.748.36.176.572.146.782-.088.21-.234.897-1.046 1.137-1.405.24-.36.48-.3.81-.18.328.12 2.083.982 2.44 1.16.357.18.595.27.683.42.088.15.088.87-.21 1.705z"/></svg>`;
}

/* ============================================================
   FILTRADO
   ============================================================ */
function getFilteredProducts() {
  return PRODUCTS.filter((p) => {
    const matchesCategory =
      state.activeCategory === "todos" || p.category === state.activeCategory;
    const term = state.searchTerm.trim().toLowerCase();
    const matchesSearch =
      term === "" ||
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });
}

function renderProducts() {
  const grid = document.getElementById("productsGrid");
  const emptyState = document.getElementById("emptyState");
  const loadMoreWrap = document.getElementById("loadMoreWrap");
  const filtered = getFilteredProducts();
  const visible = filtered.slice(0, state.visibleCount);

  if (filtered.length === 0) {
    grid.innerHTML = "";
    emptyState.classList.add("is-visible");
    loadMoreWrap.style.display = "none";
    return;
  }

  emptyState.classList.remove("is-visible");
  grid.innerHTML = visible.map(productCardHTML).join("");

  loadMoreWrap.style.display = visible.length < filtered.length ? "flex" : "none";

  observeReveals();
}

/* ============================================================
   FILTROS / CHIPS / BÚSQUEDA
   ============================================================ */
function renderCategoryChips() {
  const wrap = document.getElementById("filterChips");
  wrap.innerHTML = CATEGORIES.map(
    (cat) => `
    <button type="button" class="filter-chip ${cat.id === state.activeCategory ? "is-active" : ""}" data-category="${cat.id}">
      ${cat.name}
    </button>`
  ).join("");

  wrap.querySelectorAll(".filter-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.activeCategory = btn.dataset.category;
      state.visibleCount = CONFIG.productsPerPage;
      renderCategoryChips();
      renderProducts();
      document.getElementById("coleccion").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function renderCategoryShowcase() {
  const wrap = document.getElementById("categoriesGrid");
  const showcaseCats = CATEGORIES.filter((c) => c.id !== "todos");
  wrap.innerHTML = showcaseCats
    .map((cat) => {
      const sample = PRODUCTS.find((p) => p.category === cat.id);
      const count = PRODUCTS.filter((p) => p.category === cat.id).length;
      if (!sample) return "";
      return `
      <div class="category-card reveal" data-category="${cat.id}">
        <img src="${sample.images[0]}" alt="${cat.name}" loading="lazy">
        <div class="category-card-label">
          <strong>${cat.name}</strong>
          <span>${count} ${count === 1 ? "pieza" : "piezas"}</span>
        </div>
      </div>`;
    })
    .join("");

  wrap.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", () => {
      state.activeCategory = card.dataset.category;
      state.visibleCount = CONFIG.productsPerPage;
      renderCategoryChips();
      renderProducts();
      document.getElementById("coleccion").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  observeReveals();
}

function setupSearch() {
  const input = document.getElementById("searchInput");
  input.addEventListener(
    "input",
    debounce((e) => {
      state.searchTerm = e.target.value;
      state.visibleCount = CONFIG.productsPerPage;
      renderProducts();
    }, 200)
  );
}

function setupLoadMore() {
  document.getElementById("loadMoreBtn").addEventListener("click", () => {
    state.visibleCount += CONFIG.productsPerPage;
    renderProducts();
  });
}

/* ============================================================
   MODAL DE PRODUCTO
   ============================================================ */
function openModal(productId) {
  const product = PRODUCTS.find((p) => p.id === Number(productId));
  if (!product) return;

  state.modalProduct = product;
  state.modalImageIndex = 0;
  state.modalSelectedSize = product.sizes[0] || null;
  state.modalSelectedColor = product.colors[0] || null;

  renderModal();
  document.getElementById("modalOverlay").classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modalOverlay").classList.remove("is-open");
  document.body.style.overflow = "";
  state.modalProduct = null;
}

function renderModal() {
  const product = state.modalProduct;
  if (!product) return;

  const categoryName =
    CATEGORIES.find((c) => c.id === product.category)?.name || product.category;

  document.getElementById("modalMainImage").src = product.images[state.modalImageIndex];
  document.getElementById("modalMainImage").alt = product.name;

  document.getElementById("modalThumbs").innerHTML = product.images
    .map(
      (img, i) =>
        `<img src="${img}" alt="" class="${i === state.modalImageIndex ? "is-active" : ""}" data-index="${i}">`
    )
    .join("");

  document.getElementById("modalThumbs").querySelectorAll("img").forEach((thumb) => {
    thumb.addEventListener("click", () => {
      state.modalImageIndex = Number(thumb.dataset.index);
      renderModal();
    });
  });

  document.getElementById("modalTags").innerHTML = renderTags(product.tags);
  document.getElementById("modalCategory").textContent = categoryName;
  document.getElementById("modalName").textContent = product.name;
  document.getElementById("modalPrice").textContent = formatPrice(product.price);

  const oldPriceEl = document.getElementById("modalOldPrice");
  if (product.oldPrice) {
    oldPriceEl.textContent = formatPrice(product.oldPrice);
    oldPriceEl.style.display = "inline";
  } else {
    oldPriceEl.style.display = "none";
  }

  document.getElementById("modalDesc").textContent = product.description;
  document.getElementById("modalDetailsList").innerHTML = product.details
    .map((d) => `<li>${d}</li>`)
    .join("");

  // Tallas
  const sizesWrap = document.getElementById("modalSizesGroup");
  if (product.sizes.length > 0) {
    sizesWrap.style.display = "block";
    sizesWrap.querySelector(".option-pills").innerHTML = product.sizes
      .map(
        (s) =>
          `<button type="button" class="option-pill ${s === state.modalSelectedSize ? "is-selected" : ""}" data-size="${s}">${s}</button>`
      )
      .join("");
    sizesWrap.querySelectorAll(".option-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        state.modalSelectedSize = pill.dataset.size;
        renderModal();
      });
    });
  } else {
    sizesWrap.style.display = "none";
  }

  // Colores / diseños
  const colorsWrap = document.getElementById("modalColorsGroup");
  if (product.colors.length > 0) {
    colorsWrap.style.display = "block";
    colorsWrap.querySelector(".option-pills").innerHTML = product.colors
      .map(
        (c) =>
          `<button type="button" class="option-pill ${c === state.modalSelectedColor ? "is-selected" : ""}" data-color="${c}">${c}</button>`
      )
      .join("");
    colorsWrap.querySelectorAll(".option-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        state.modalSelectedColor = pill.dataset.color;
        renderModal();
      });
    });
  } else {
    colorsWrap.style.display = "none";
  }

  // Stock bajo
  const stockNote = document.getElementById("modalStockNote");
  if (product.stock <= 5) {
    stockNote.style.display = "block";
    stockNote.textContent = `Quedan solo ${product.stock} unidades disponibles`;
  } else {
    stockNote.style.display = "none";
  }

  // CTA WhatsApp
  const waLink = document.getElementById("modalWhatsappBtn");
  waLink.href = buildWhatsappLink(
    buildProductMessage(product, state.modalSelectedSize, state.modalSelectedColor)
  );
}

function setupModal() {
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("modalOverlay").addEventListener("click", (e) => {
    if (e.target.id === "modalOverlay") closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest('[data-action="open-modal"]');
    if (trigger) {
      e.preventDefault();
      openModal(trigger.dataset.id);
    }
  });
}

/* ============================================================
   HEADER: scroll state + menú móvil
   ============================================================ */
function setupHeader() {
  const header = document.getElementById("siteHeader");
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.classList.toggle("is-open", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.classList.remove("is-open");
      document.body.style.overflow = "";
    });
  });
}

/* ============================================================
   ANIMACIONES DE SCROLL (IntersectionObserver)
   ============================================================ */
let revealObserver;
function observeReveals() {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
  }
  document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => revealObserver.observe(el));
  document.querySelectorAll(".thread-divider:not(.is-visible)").forEach((el) => revealObserver.observe(el));
}

/* ============================================================
   ENLACES DE WHATSAPP (genéricos, no ligados a un producto)
   ============================================================ */
function setupWhatsappLinks() {
  document.querySelectorAll("[data-whatsapp-default]").forEach((el) => {
    el.href = buildWhatsappLink(CONFIG.defaultWhatsappMessage, CONFIG.whatsappPrimary);
    el.target = "_blank";
    el.rel = "noopener";
  });
  document.querySelectorAll("[data-whatsapp-secondary]").forEach((el) => {
    el.href = buildWhatsappLink(CONFIG.defaultWhatsappMessage, CONFIG.whatsappSecondary);
    el.target = "_blank";
    el.rel = "noopener";
  });
}

function setupSocialLinks() {
  const map = {
    instagramLink: CONFIG.instagramUrl,
    facebookLink: CONFIG.facebookUrl,
    tiktokLink: CONFIG.tiktokUrl,
  };
  Object.entries(map).forEach(([id, url]) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (!url) {
      el.style.display = "none";
    } else {
      el.href = url;
    }
  });
}

/* ============================================================
   DATOS DE CONTACTO Y PAGO (inyectados desde CONFIG)
   ============================================================ */
function setupContactAndPaymentInfo() {
  const text = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };
  const textAll = (selector, value) => {
    document.querySelectorAll(selector).forEach((el) => { el.textContent = value; });
  };

  text("brandNameFooter", CONFIG.businessName);

  const emailLink = document.getElementById("footerEmailLink");
  if (emailLink) {
    emailLink.href = `mailto:${CONFIG.email}`;
    emailLink.textContent = CONFIG.email;
  }

  text("footerAddress", CONFIG.address);

  textAll(".js-whatsapp1-number", formatWhatsappDisplay(CONFIG.whatsappPrimary));
  textAll(".js-whatsapp2-number", formatWhatsappDisplay(CONFIG.whatsappSecondary));
  textAll(".js-whatsapp1-label", CONFIG.whatsappPrimaryLabel);
  textAll(".js-whatsapp2-label", CONFIG.whatsappSecondaryLabel);

  text("paymentNequi", CONFIG.payment.nequi);
  text("paymentDaviplata", CONFIG.payment.daviplata);
  text("paymentBreb", CONFIG.payment.brebKey);
}

function formatWhatsappDisplay(number) {
  // 573233067322 -> +57 323 306 7322
  const country = number.slice(0, 2);
  const rest = number.slice(2);
  return `+${country} ${rest.slice(0, 3)} ${rest.slice(3, 6)} ${rest.slice(6)}`;
}

/* ============================================================
   COPIAR DATOS DE PAGO AL PORTAPAPELES
   ============================================================ */
function setupCopyButtons() {
  const checkIconSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>`;

  document.querySelectorAll(".copy-btn").forEach((btn) => {
    const originalHTML = btn.innerHTML;
    btn.addEventListener("click", async () => {
      const target = document.getElementById(btn.dataset.copyId);
      const value = target ? target.textContent.trim() : "";
      if (!value) return;

      try {
        await navigator.clipboard.writeText(value);
      } catch (err) {
        // Fallback para navegadores sin soporte de Clipboard API
        const temp = document.createElement("textarea");
        temp.value = value;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        document.body.removeChild(temp);
      }

      btn.innerHTML = checkIconSVG;
      btn.classList.add("is-copied");
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.classList.remove("is-copied");
      }, 1500);
    });
  });
}

/* ============================================================
   LOADER INICIAL
   ============================================================ */
function hidePageLoader() {
  const loader = document.getElementById("pageLoader");
  if (!loader) return;
  setTimeout(() => loader.classList.add("is-hidden"), 350);
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  setupContactAndPaymentInfo();
  renderCategoryChips();
  renderCategoryShowcase();
  renderProducts();
  setupSearch();
  setupLoadMore();
  setupModal();
  setupHeader();
  setupWhatsappLinks();
  setupSocialLinks();
  setupCopyButtons();
  observeReveals();
  hidePageLoader();
});
