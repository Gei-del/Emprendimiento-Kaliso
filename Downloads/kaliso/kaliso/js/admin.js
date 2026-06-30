/**
 * ============================================================
 *  KALISO — Panel de administración
 * ============================================================
 *  Permite agregar, editar y eliminar productos (foto + precio)
 *  SIN tocar código. Los cambios se guardan en este navegador
 *  (localStorage) y desde aquí se descarga un archivo
 *  "products.js" actualizado, listo para subir al hosting.
 *
 *  IMPORTANTE — cómo funciona porque este es un sitio estático:
 *  1. Editas/agregas productos aquí. Se guardan SOLO en este
 *     navegador (vista previa local).
 *  2. Cuando estés conforme, presiona "Descargar products.js".
 *  3. Sube ese archivo a tu hosting reemplazando el anterior
 *     (arrastrando a Netlify, por FTP, o como subas tus archivos).
 *  4. Recién ahí los cambios se ven en el catálogo público para
 *     todas las visitantes.
 *
 *  Depende de: js/products.js (para los datos iniciales)
 * ============================================================ */

const STORAGE_KEY = "kaliso_admin_data_v1";
const PIN_KEY = "kaliso_admin_pin_v1";

const TAG_OPTIONS = [
  { id: "nuevo", label: "Nuevo" },
  { id: "mas-vendido", label: "Más vendido" },
  { id: "ultimas-unidades", label: "Últimas unidades" },
  { id: "edicion-especial", label: "Edición especial" },
  { id: "artesanal", label: "Artesanal" },
  { id: "exclusivo", label: "Exclusivo" },
];

let adminState = { categories: [], products: [] };
let editingId = null;
let currentImages = []; // dataURLs for the product being edited/created
let nextId = 1;

/* ============================================================
   PERSISTENCIA LOCAL
   ============================================================ */
function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      adminState = JSON.parse(raw);
      return;
    } catch (e) {
      console.warn("No se pudo leer el estado guardado, se usa el original.", e);
    }
  }
  // Bootstrap desde products.js (CATEGORIES y PRODUCTS globales)
  adminState = {
    categories: JSON.parse(JSON.stringify(CATEGORIES)),
    products: JSON.parse(JSON.stringify(PRODUCTS)),
  };
  saveState();
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(adminState));
}

function resetToOriginal() {
  if (!confirm("Esto borrará tus cambios locales y volverá a los datos originales del archivo products.js. ¿Continuar?")) return;
  adminState = {
    categories: JSON.parse(JSON.stringify(CATEGORIES)),
    products: JSON.parse(JSON.stringify(PRODUCTS)),
  };
  saveState();
  renderAll();
  showToast("Se restableció a los datos originales");
}

/* ============================================================
   PIN DE ACCESO (protección básica, no es seguridad real)
   ============================================================ */
function setupPinGate() {
  const gate = document.getElementById("pinGate");
  const app = document.getElementById("adminApp");
  const storedPin = localStorage.getItem(PIN_KEY);
  const input = document.getElementById("pinInput");
  const error = document.getElementById("pinError");
  const title = document.getElementById("pinGateTitle");
  const desc = document.getElementById("pinGateDesc");
  const btn = document.getElementById("pinSubmit");

  const unlock = () => {
    gate.style.display = "none";
    app.style.display = "block";
    initAdminApp();
  };

  if (!storedPin) {
    title.textContent = "Crea un PIN de acceso";
    desc.textContent = "Este PIN evita que cualquiera que tenga el enlace entre por accidente. No es una contraseña de alta seguridad: no compartas este enlace públicamente.";
    btn.textContent = "Crear PIN y continuar";
    btn.addEventListener("click", () => {
      const val = input.value.trim();
      if (val.length < 4) {
        error.textContent = "Usa al menos 4 dígitos.";
        return;
      }
      localStorage.setItem(PIN_KEY, val);
      unlock();
    });
  } else {
    title.textContent = "Panel de administración";
    desc.textContent = "Ingresa el PIN de este equipo para continuar.";
    btn.textContent = "Entrar";
    btn.addEventListener("click", () => {
      if (input.value.trim() === storedPin) {
        unlock();
      } else {
        error.textContent = "PIN incorrecto.";
      }
    });
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") btn.click();
  });
}

/* ============================================================
   COMPRESIÓN DE IMÁGENES (canvas) → dataURL liviano
   ============================================================ */
function fileToCompressedDataURL(file, maxWidth = 1000, quality = 0.74) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function setupImageUpload() {
  const zone = document.getElementById("imageUploadZone");
  const input = document.getElementById("imageInput");

  zone.addEventListener("click", () => input.click());
  zone.addEventListener("dragover", (e) => { e.preventDefault(); zone.style.borderColor = "var(--color-gold)"; });
  zone.addEventListener("dragleave", () => { zone.style.borderColor = ""; });
  zone.addEventListener("drop", (e) => {
    e.preventDefault();
    zone.style.borderColor = "";
    handleFiles(e.dataTransfer.files);
  });
  input.addEventListener("change", (e) => handleFiles(e.target.files));

  async function handleFiles(fileList) {
    const files = Array.from(fileList).slice(0, 4 - currentImages.length);
    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      try {
        const dataUrl = await fileToCompressedDataURL(file);
        currentImages.push(dataUrl);
      } catch (err) {
        console.error("Error procesando imagen", err);
      }
    }
    renderImagePreviews();
    input.value = "";
  }
}

function renderImagePreviews() {
  const wrap = document.getElementById("imagePreviewList");
  wrap.innerHTML = currentImages
    .map(
      (src, i) => `
      <div class="image-preview-item">
        <img src="${src}" alt="">
        <button type="button" class="image-preview-remove" data-index="${i}" aria-label="Quitar imagen">✕</button>
      </div>`
    )
    .join("");

  wrap.querySelectorAll(".image-preview-remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentImages.splice(Number(btn.dataset.index), 1);
      renderImagePreviews();
    });
  });
}

/* ============================================================
   CATEGORÍAS
   ============================================================ */
function slugify(text) {
  return text
    .toString()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function renderCategoryManager() {
  const wrap = document.getElementById("adminCategories");
  wrap.innerHTML = adminState.categories
    .filter((c) => c.id !== "todos")
    .map(
      (c) => `
      <span class="admin-category-chip">
        ${c.name}
        <button type="button" data-id="${c.id}" aria-label="Eliminar categoría">✕</button>
      </span>`
    )
    .join("");

  wrap.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const inUse = adminState.products.some((p) => p.category === id);
      if (inUse) {
        alert("No puedes eliminar esta categoría: hay productos que la usan. Cámbiales la categoría primero.");
        return;
      }
      adminState.categories = adminState.categories.filter((c) => c.id !== id);
      saveState();
      renderCategoryManager();
      renderCategorySelect();
      showToast("Categoría eliminada");
    });
  });
}

function setupAddCategory() {
  const input = document.getElementById("newCategoryInput");
  const btn = document.getElementById("newCategoryBtn");
  btn.addEventListener("click", () => {
    const name = input.value.trim();
    if (!name) return;
    const id = slugify(name);
    if (adminState.categories.some((c) => c.id === id)) {
      alert("Ya existe una categoría con ese nombre.");
      return;
    }
    adminState.categories.push({ id, name });
    saveState();
    input.value = "";
    renderCategoryManager();
    renderCategorySelect();
    showToast("Categoría agregada");
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); btn.click(); }
  });
}

function renderCategorySelect() {
  const select = document.getElementById("fieldCategory");
  const current = select.value;
  select.innerHTML = adminState.categories
    .filter((c) => c.id !== "todos")
    .map((c) => `<option value="${c.id}">${c.name}</option>`)
    .join("");
  if (current) select.value = current;
}

/* ============================================================
   FORMULARIO DE PRODUCTO
   ============================================================ */
function renderTagChecks() {
  const wrap = document.getElementById("tagChecks");
  wrap.innerHTML = TAG_OPTIONS.map(
    (t) => `
    <label class="tag-check" data-tag="${t.id}">
      <input type="checkbox" value="${t.id}">
      ${t.label}
    </label>`
  ).join("");

  wrap.querySelectorAll(".tag-check").forEach((label) => {
    const input = label.querySelector("input");
    input.addEventListener("change", () => {
      label.classList.toggle("is-checked", input.checked);
    });
  });
}

function getCheckedTags() {
  return Array.from(document.querySelectorAll("#tagChecks input:checked")).map((i) => i.value);
}

function setCheckedTags(tags) {
  document.querySelectorAll("#tagChecks input").forEach((input) => {
    const checked = tags.includes(input.value);
    input.checked = checked;
    input.closest(".tag-check").classList.toggle("is-checked", checked);
  });
}

function clearForm() {
  editingId = null;
  currentImages = [];
  document.getElementById("productForm").reset();
  setCheckedTags([]);
  renderImagePreviews();
  document.getElementById("formTitle").textContent = "Agregar producto nuevo";
  document.getElementById("submitBtn").textContent = "Guardar producto";
  document.getElementById("cancelEditBtn").style.display = "none";
}

function loadProductIntoForm(product) {
  editingId = product.id;
  currentImages = [...product.images];
  document.getElementById("fieldName").value = product.name;
  renderCategorySelect();
  document.getElementById("fieldCategory").value = product.category;
  document.getElementById("fieldPrice").value = product.price;
  document.getElementById("fieldOldPrice").value = product.oldPrice || "";
  document.getElementById("fieldDescription").value = product.description;
  document.getElementById("fieldDetails").value = product.details.join("\n");
  document.getElementById("fieldSizes").value = product.sizes.join(", ");
  document.getElementById("fieldColors").value = product.colors.join(", ");
  document.getElementById("fieldStock").value = product.stock;
  setCheckedTags(product.tags);
  renderImagePreviews();

  document.getElementById("formTitle").textContent = `Editando: ${product.name}`;
  document.getElementById("submitBtn").textContent = "Guardar cambios";
  document.getElementById("cancelEditBtn").style.display = "block";
  document.getElementById("adminFormPanel").scrollIntoView({ behavior: "smooth", block: "start" });
}

function splitList(value) {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function handleFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById("fieldName").value.trim();
  const category = document.getElementById("fieldCategory").value;
  const price = Number(document.getElementById("fieldPrice").value);
  const oldPriceRaw = document.getElementById("fieldOldPrice").value;
  const description = document.getElementById("fieldDescription").value.trim();
  const detailsRaw = document.getElementById("fieldDetails").value.trim();
  const stock = Number(document.getElementById("fieldStock").value) || 0;

  if (!name || !category || !price || currentImages.length === 0) {
    alert("Completa al menos: nombre, categoría, precio y una foto.");
    return;
  }

  const product = {
    id: editingId || nextId,
    name,
    category,
    price,
    oldPrice: oldPriceRaw ? Number(oldPriceRaw) : null,
    tags: getCheckedTags(),
    images: [...currentImages],
    description,
    details: detailsRaw ? detailsRaw.split("\n").map((s) => s.trim()).filter(Boolean) : [],
    sizes: splitList(document.getElementById("fieldSizes").value),
    colors: splitList(document.getElementById("fieldColors").value),
    stock,
  };

  if (editingId) {
    const idx = adminState.products.findIndex((p) => p.id === editingId);
    adminState.products[idx] = product;
    showToast("Producto actualizado");
  } else {
    adminState.products.push(product);
    showToast("Producto agregado");
  }

  recalculateNextId();
  saveState();
  clearForm();
  renderProductList();
}

function recalculateNextId() {
  nextId = adminState.products.reduce((max, p) => Math.max(max, p.id), 0) + 1;
}

function deleteProduct(id) {
  const product = adminState.products.find((p) => p.id === id);
  if (!product) return;
  if (!confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) return;
  adminState.products = adminState.products.filter((p) => p.id !== id);
  saveState();
  if (editingId === id) clearForm();
  renderProductList();
  showToast("Producto eliminado");
}

/* ============================================================
   LISTADO DE PRODUCTOS
   ============================================================ */
function renderProductList(filterText = "") {
  const wrap = document.getElementById("adminProductList");
  const term = filterText.trim().toLowerCase();
  const list = adminState.products.filter((p) => p.name.toLowerCase().includes(term));

  if (list.length === 0) {
    wrap.innerHTML = `<div class="admin-empty">No hay productos${term ? " que coincidan con tu búsqueda" : " todavía. Agrega el primero con el formulario"}.</div>`;
    return;
  }

  wrap.innerHTML = list
    .map((p) => {
      const catName = adminState.categories.find((c) => c.id === p.category)?.name || p.category;
      const priceFmt = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(p.price);
      return `
      <div class="admin-product-row ${p.id === editingId ? "is-editing" : ""}" data-id="${p.id}">
        <img src="${p.images[0]}" alt="">
        <div class="info">
          <strong>${p.name}</strong>
          <span>${catName} · Stock: ${p.stock}</span>
        </div>
        <span class="price">${priceFmt}</span>
        <div class="row-actions">
          <button type="button" class="edit-btn" aria-label="Editar" data-id="${p.id}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          </button>
          <button type="button" class="danger delete-btn" aria-label="Eliminar" data-id="${p.id}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
          </button>
        </div>
      </div>`;
    })
    .join("");

  wrap.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const product = adminState.products.find((p) => p.id === Number(btn.dataset.id));
      if (product) loadProductIntoForm(product);
    });
  });
  wrap.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => deleteProduct(Number(btn.dataset.id)));
  });
}

function setupProductSearch() {
  document.getElementById("adminProductSearch").addEventListener("input", (e) => {
    renderProductList(e.target.value);
  });
}

/* ============================================================
   EXPORTAR products.js
   ============================================================ */
function generateProductsFileContent() {
  const tagLabelsBlock = `const TAG_LABELS = {
  "nuevo": "Nuevo",
  "mas-vendido": "Más vendido",
  "ultimas-unidades": "Últimas unidades",
  "edicion-especial": "Edición especial",
  "artesanal": "Artesanal",
  "exclusivo": "Exclusivo",
};`;

  const header = `/**
 * ============================================================
 *  KALISO — Catálogo de productos
 *  Generado automáticamente por el Panel de administración
 *  el ${new Date().toLocaleString("es-CO")}
 * ============================================================
 *  Puedes seguir editando este archivo desde admin.html,
 *  o manualmente siguiendo la misma estructura.
 * ============================================================ */
`;

  const categoriesBlock = `const CATEGORIES = ${JSON.stringify(adminState.categories, null, 2)};`;
  const productsBlock = `const PRODUCTS = ${JSON.stringify(adminState.products, null, 2)};`;

  return [header, categoriesBlock, "", tagLabelsBlock, "", productsBlock, ""].join("\n");
}

function downloadProductsFile() {
  const content = generateProductsFileContent();
  const blob = new Blob([content], { type: "text/javascript;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "products.js";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast("Archivo products.js descargado");
}

/* ============================================================
   TOAST
   ============================================================ */
let toastTimer;
function showToast(message) {
  const toast = document.getElementById("statusToast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

/* ============================================================
   INIT
   ============================================================ */
function renderAll() {
  recalculateNextId();
  renderCategoryManager();
  renderCategorySelect();
  renderProductList(document.getElementById("adminProductSearch")?.value || "");
}

function initAdminApp() {
  loadState();
  renderTagChecks();
  renderAll();
  setupImageUpload();
  setupAddCategory();
  setupProductSearch();

  document.getElementById("productForm").addEventListener("submit", handleFormSubmit);
  document.getElementById("cancelEditBtn").addEventListener("click", clearForm);
  document.getElementById("downloadBtn").addEventListener("click", downloadProductsFile);
  document.getElementById("resetBtn").addEventListener("click", resetToOriginal);

  clearForm();
}

document.addEventListener("DOMContentLoaded", setupPinGate);
