// store.js
// Implements store rendering, filters, cart, modals, quick-order flows.
// Expects `export const storeData = [...]` from ./data.js
import { storeData } from "./data.js";

/* ============
   Config & State
   ============ */
const WHATSAPP_PHONE = "+2349161536457"; // change to your number w/o plus if desired
const MAX_TAG_STRIPS = 10;
const CATEGORIES = [
  "Engine Accessories",
  "Chassis Accessories",
  "Body Parts",
  "Electrical Accessories",
  "Interior Decorations"
];

const state = {
  // filters: arrays allow multi-selection
  filterMode: "category", // 'brand' | 'model' | 'category' | 'others'
  filters: {
    brand: new Set(),
    model: new Set(),
    category: new Set(),
    tags: new Set()
  },
  showFilterChips: false,
  // cart: { productId, variant: {brand,model,year,price}, qty }
  cart: JSON.parse(localStorage.getItem("manny_cart") || "[]"),
  // view: 'home' or { page: 'section', id: 'featured'|'tag:foo'|'category:...' }
  view: "home"
};

/* ============
   DOM short-cuts
   ============ */
const doc = document;
const main = doc.querySelector("main.store-main") || doc.querySelector("main") || doc.body;
const storeContent = doc.querySelector(".store-content") || (() => {
  // if not present, create a container and insert after header
  const c = doc.createElement("div");
  c.className = "store-content";
  const header = doc.querySelector(".main-header");
  header?.insertAdjacentElement("afterend", c);
  return c;
})();
const sidebar = doc.getElementById("store-sidebar");
const mobileSidebar = doc.getElementById("mobileSidebar");
const hamburger = doc.querySelector(".hamburger");
const mobileClose = doc.querySelector(".mobile-close");
const mobileCartBtns = Array.from(doc.querySelectorAll(".mobile-cart-btn"));
const navCartBtn = doc.querySelector(".mobile-cart-btn"); // nav-level (may be hidden on small screens)
const searchInput = doc.getElementById("search-input") || doc.querySelector(".search-input");
const filterBtn = doc.querySelector(".filter-btn");
const categoriesStrip = doc.querySelector(".categories");
const stripContainerRoot = storeContent; // we'll render strips into storeContent
const sectionModal = doc.getElementById("section-modal");
const detailsModal = doc.getElementById("details-modal");

/* ============
   Utilities
   ============ */
const uniq = (arr) => Array.from(new Set(arr.filter(Boolean)));
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

function saveCart() {
  try {
    localStorage.setItem("manny_cart", JSON.stringify(state.cart));
    updateCartCount();
  } catch (e) {
    console.warn("Could not persist cart", e);
  }
}

function updateCartCount() {
  const count = state.cart.reduce((s, it) => s + it.qty, 0);
  // update any cart count UI
  const counts = doc.querySelectorAll(".cart-count");
  counts.forEach((el) => (el.textContent = ` (${count})`));
  // update any sidebar view-cart text
  const vc = doc.querySelector("#store-sidebar .view-cart") || doc.querySelector(".view-cart");
  if (vc) vc.textContent = `View Cart (${count})`;
}

/**
 * compute min,max from variants for display
 */
function minMaxPrice(variants = []) {
  if (!Array.isArray(variants) || variants.length === 0) return { min: 0, max: 0 };
  const prices = variants.map((v) => Number(v.price || 0)).filter((p) => !Number.isNaN(p));
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

/* ============
   Data helpers
   ============ */
function getAllTags(data = storeData) {
  const all = data.flatMap((p) => p.tags || []);
  return uniq(all);
}

function getAllBrands(data = storeData) {
  const all = data.flatMap((p) => (p.compatibilities || []).map((c) => c.brand));
  return uniq(all);
}

function getModelsForBrand(brand, data = storeData) {
  if (!brand) return uniq(data.flatMap((p) => (p.compatibilities || []).map((c) => c.model)));
  const models = data.flatMap((p) => (p.compatibilities || []).filter((c) => c.brand === brand).map((c) => c.model));
  return uniq(models);
}

/* ============
   Rendering: Filter UI
   ============ */

/**
 * Build a small dropdown to choose filter mode (brand, model, category, others).
 * Clicking an option sets state.filterMode and rebuilds the .categories chip list
 */
function ensureFilterModeDropdown() {
  let dd = doc.querySelector("#filter-mode-dropdown");
  if (dd) return dd;

  dd = doc.createElement("div");
  dd.id = "filter-mode-dropdown";
  dd.style.position = "absolute";
  dd.style.zIndex = 1200;
  dd.style.background = "#fff";
  dd.style.border = "1px solid rgba(0,0,0,0.08)";
  dd.style.boxShadow = "0 8px 20px rgba(11,58,111,0.06)";
  dd.style.padding = "8px";
  dd.style.borderRadius = "8px";
  dd.style.display = "none";

  const options = [
    { key: "brand", label: "By Brand" },
    { key: "model", label: "By Model" },
    { key: "category", label: "By Category" },
    { key: "others", label: "Others (tags)" }
  ];

  options.forEach((opt) => {
    const b = doc.createElement("button");
    b.type = "button";
    b.className = "filter-mode-option";
    b.textContent = opt.label;
    b.style.display = "block";
    b.style.width = "100%";
    b.style.margin = "4px 0";
    b.style.background = "transparent";
    b.style.border = "0";
    b.style.textAlign = "left";
    b.style.cursor = "pointer";
    b.addEventListener("click", () => {
      state.filterMode = opt.key;
      populateFilterChips(); // rebuild category chips area based on mode
      hideFilterModeDropdown();
      // clear existing filter selections (optional; keep them?) - we keep them
    });
    dd.appendChild(b);
  });

  doc.body.appendChild(dd);
  return dd;
}

function showFilterModeDropdown() {
  const dd = ensureFilterModeDropdown();
  // position under filterBtn
  const rect = filterBtn.getBoundingClientRect();
  dd.style.left = `${rect.left}px`;
  dd.style.top = `${rect.bottom + 8 + window.scrollY}px`;
  dd.style.display = "block";
  // close on outside click
  setTimeout(() => {
    const handler = (e) => {
      if (!dd.contains(e.target) && e.target !== filterBtn) {
        hideFilterModeDropdown();
        doc.removeEventListener("click", handler);
      }
    };
    doc.addEventListener("click", handler);
  }, 0);
}

function hideFilterModeDropdown() {
  const dd = doc.querySelector("#filter-mode-dropdown");
  if (dd) dd.style.display = "none";
}

/**
 * populate .categories area depending on current filterMode
 */
function populateFilterChips() {
  // ensure container exists
  if (!categoriesStrip) {
    console.warn("No .categories element found");
    return;
  }
  categoriesStrip.innerHTML = ""; // reset

  if (state.filterMode === "brand") {
    const brands = getAllBrands();
    brands.forEach((b) => {
      const btn = doc.createElement("button");
      btn.className = "category-filter";
      if (state.filters.brand.has(b)) btn.classList.add("active");
      btn.textContent = b;
      btn.addEventListener("click", () => {
        toggleSet(state.filters.brand, b);
        btn.classList.toggle("active");
        onFiltersChanged();
      });
      categoriesStrip.appendChild(btn);
    });
  } else if (state.filterMode === "model") {
    // show models (across dataset)
    const models = uniq(storeData.flatMap((p) => (p.compatibilities || []).map((c) => c.model)));
    models.forEach((m) => {
      const btn = doc.createElement("button");
      btn.className = "category-filter";
      if (state.filters.model.has(m)) btn.classList.add("active");
      btn.textContent = m;
      btn.addEventListener("click", () => {
        toggleSet(state.filters.model, m);
        btn.classList.toggle("active");
        onFiltersChanged();
      });
      categoriesStrip.appendChild(btn);
    });
  } else if (state.filterMode === "category") {
    CATEGORIES.forEach((c) => {
      const btn = doc.createElement("button");
      btn.className = "category-filter";
      if (state.filters.category.has(c)) btn.classList.add("active");
      btn.textContent = c;
      btn.addEventListener("click", () => {
        toggleSet(state.filters.category, c);
        btn.classList.toggle("active");
        onFiltersChanged();
      });
      categoriesStrip.appendChild(btn);
    });
  } else if (state.filterMode === "others") {
    // show top tags
    const tags = getAllTags();
    tags.slice(0, 24).forEach((t) => {
      const btn = doc.createElement("button");
      btn.className = "category-filter";
      if (state.filters.tags.has(t)) btn.classList.add("active");
      btn.textContent = t;
      btn.addEventListener("click", () => {
        toggleSet(state.filters.tags, t);
        btn.classList.toggle("active");
        onFiltersChanged();
      });
      categoriesStrip.appendChild(btn);
    });
  }
}

/* ============
   Filter chips UI ("See Filters")
   ============ */
function ensureFiltersArea() {
  let area = doc.querySelector(".filters-area");
  if (!area) {
    area = doc.createElement("div");
    area.className = "filters-area page-inner";
    area.style.padding = "0 12px 12px";
    // checkbox toggle
    const cbWrap = doc.createElement("label");
    cbWrap.style.display = "inline-flex";
    cbWrap.style.alignItems = "center";
    cbWrap.style.gap = "8px";
    const cb = doc.createElement("input");
    cb.type = "checkbox";
    cb.id = "see-filters-checkbox";
    cb.addEventListener("change", (e) => {
      state.showFilterChips = e.target.checked;
      renderFilterChips();
    });
    cbWrap.appendChild(cb);
    cbWrap.appendChild(doc.createTextNode("See Filters"));
    area.appendChild(cbWrap);

    const chipsWrap = doc.createElement("div");
    chipsWrap.className = "applied-filter-chips";
    chipsWrap.style.marginTop = "8px";
    chipsWrap.style.display = "none"; // toggled by checkbox
    area.appendChild(chipsWrap);

    // append after categories strip
    categoriesStrip?.insertAdjacentElement("afterend", area);
  }
  return area;
}

function renderFilterChips() {
  const area = ensureFiltersArea();
  const chipsWrap = area.querySelector(".applied-filter-chips");
  chipsWrap.innerHTML = "";
  if (!state.showFilterChips) {
    chipsWrap.style.display = "none";
    return;
  }
  chipsWrap.style.display = "flex";
  chipsWrap.style.gap = "6px";
  chipsWrap.style.flexWrap = "wrap";
  // compile list of applied filters
  const applied = [];
  state.filters.brand.forEach((b) => applied.push({ type: "brand", value: b }));
  state.filters.model.forEach((m) => applied.push({ type: "model", value: m }));
  state.filters.category.forEach((c) => applied.push({ type: "category", value: c }));
  state.filters.tags.forEach((t) => applied.push({ type: "tag", value: t }));

  if (applied.length === 0) {
    const span = doc.createElement("span");
    span.style.color = "var(--muted)";
    span.textContent = "No filters applied";
    chipsWrap.appendChild(span);
    return;
  }

  applied.forEach((ap) => {
    const chip = doc.createElement("div");
    chip.className = "filter-chip";
    chip.style.padding = "6px 8px";
    chip.style.borderRadius = "999px";
    chip.style.background = "#eee";
    chip.style.display = "inline-flex";
    chip.style.alignItems = "center";
    chip.style.gap = "8px";
    chip.textContent = `${ap.type}: ${ap.value}`;

    const x = doc.createElement("button");
    x.type = "button";
    x.textContent = "✕";
    x.style.marginLeft = "6px";
    x.style.border = "0";
    x.style.background = "transparent";
    x.style.cursor = "pointer";
    x.addEventListener("click", () => {
      // remove from state
      if (ap.type === "brand") state.filters.brand.delete(ap.value);
      if (ap.type === "model") state.filters.model.delete(ap.value);
      if (ap.type === "category") state.filters.category.delete(ap.value);
      if (ap.type === "tag") state.filters.tags.delete(ap.value);
      // update UI chips and re-render
      populateFilterChips();
      renderFilterChips();
      onFiltersChanged();
    });

    chip.appendChild(x);
    chipsWrap.appendChild(chip);
  });
}

/* helper to toggle Set */
function toggleSet(setObj, val) {
  if (setObj.has(val)) setObj.delete(val);
  else setObj.add(val);
}

/* Called whenever filters changed */
function onFiltersChanged() {
  renderStrips(); // re-render strips according to filters
  renderFilterChips();
}

/* ============
   Core: Filtering logic for parts
   ============ */
function partMatchesFilters(part) {
  // If no filters, everything matches
  const f = state.filters;

  // brand filter: any selected brand must match at least one compatibility
  if (f.brand.size > 0) {
    const ok = Array.from(f.brand).some((b) => (part.compatibilities || []).some((c) => c.brand === b));
    if (!ok) return false;
  }

  // model filter
  if (f.model.size > 0) {
    const ok = Array.from(f.model).some((m) => (part.compatibilities || []).some((c) => c.model === m));
    if (!ok) return false;
  }

  // category filter
  if (f.category.size > 0) {
    if (!f.category.has(part.category)) return false;
  }

  // tags filter
  if (f.tags.size > 0) {
    const ok = Array.from(f.tags).some((t) => (part.tags || []).includes(t));
    if (!ok) return false;
  }

  return true;
}

/* ============
   Rendering: Strips / Sections
   ============ */

/**
 * Create a strip DOM element for given title and list of parts.
 * `id` used for view-all.
 */
function makeStrip({ id, title, parts = [] }) {
  const section = doc.createElement("section");
  section.className = "store-strip";
  section.setAttribute("aria-labelledby", `${id}-heading`);

  const header = doc.createElement("div");
  header.className = "strip-header";
  header.innerHTML = `<h3 id="${id}-heading" class="strip-title">${title}</h3>`;
  const actions = doc.createElement("div");
  actions.className = "strip-actions";
  const viewAllBtn = doc.createElement("button");
  viewAllBtn.className = "strip-viewall";
  viewAllBtn.type = "button";
  viewAllBtn.textContent = "View all";
  viewAllBtn.addEventListener("click", () => openSectionModal({ id, title, parts }));
  actions.appendChild(viewAllBtn);
  header.appendChild(actions);

  const track = doc.createElement("div");
  track.className = "strip-track";
  track.setAttribute("role", "list");

  // create cards
  parts.forEach((part) => {
    const { min, max } = minMaxPrice(part.variants || []);
    const card = doc.createElement("article");
    card.className = "strip-card";
    card.tabIndex = 0;
    card.role = "listitem";
    card.ariaLabel = `${part.name}, ₦${min}${min !== max ? " — ₦" + max : ""}`;

    card.innerHTML = `
      <div class="card-thumb"><img src="${part.image}" alt="${escapeHtml(part.name)}"></div>
      <div>
        <div class="card-title">${escapeHtml(part.name)}</div>
        <div class="card-desc">${escapeHtml(part.description)}</div>
      </div>
      <div class="card-meta">
        <div class="card-price">₦${min}${min !== max ? " — ₦" + max : ""}</div>
        <div class="badge ${part.variants && part.variants.some(v => /in stock/i.test(v.availability)) ? "in-stock" : ""}">${part.variants && part.variants[0] ? part.variants[0].availability : "—"}</div>
      </div>
      <div class="card-actions">
        <button class="card-btn view" data-id="${part.id}" type="button">View Details</button>
        <button class="card-btn add" data-id="${part.id}" type="button">Add to Cart</button>
      </div>
    `;
    track.appendChild(card);
  });

  section.appendChild(header);
  section.appendChild(track);
  return section;
}

function clearStoreContent() {
  stripContainerRoot.innerHTML = "";
}

/**
 * Render strips according to layout:
 * 1) Top: a "Highlights" strip containing featured + new-arrivals (dedupe)
 * 2) Middle: 5 category strips (use storeData category property)
 * 3) Bottom: "Others" - create one strip per top tags (MAX_TAG_STRIPS)
 *
 * Apply filters: only parts that match `partMatchesFilters` are shown.
 */
function renderStrips() {
  clearStoreContent();

  // 1) Highlights (featured or new-arrivals)
  const highlights = uniq(storeData.filter(p => (p.tracks || []).some(t => ["featured", "new-arrivals"].includes(t))).filter(partMatchesFilters));
  if (highlights.length > 0) {
    stripContainerRoot.appendChild(makeStrip({ id: "highlights", title: "Highlights", parts: highlights }));
  }

  // 2) Category sections (use CATEGORIES order)
  CATEGORIES.forEach((cat) => {
    const parts = storeData.filter(p => p.category === cat && partMatchesFilters(p));
    if (parts.length > 0) {
      //const id = `cat-${cat.toLowerCase().replace(/\s+/g, "-")}`;
      stripContainerRoot.appendChild(makeStrip({ id, title: cat, parts }));
    }
  });

  // 3) Others: build strips by tags
  const tags = getAllTags().slice(0, MAX_TAG_STRIPS);
  if (tags.length > 0) {
    const othersTitle = doc.createElement("h2");
    othersTitle.className = "strip-title";
    othersTitle.style.margin = "12px 0 6px";
    othersTitle.textContent = "Others";
    stripContainerRoot.appendChild(othersTitle);
    tags.forEach((tag) => {
      const parts = storeData.filter(p => (p.tags || []).includes(tag) && partMatchesFilters(p));
      if (parts.length > 0) {
        stripContainerRoot.appendChild(makeStrip({ id: `tag-${tag}`, title: tag, parts }));
      }
    });
  }

  // ensure event delegations still work (we use delegation below)
}

/* ============
   Modals: Section expand & Details
   ============ */

function openSectionModal({ id, title, parts }) {
  if (!sectionModal) return;
  const panel = sectionModal.querySelector(".modal-panel");
  sectionModal.classList.add("show");
  // populate
  panel.querySelector(".modal-title")?.textContent && (panel.querySelector(".modal-title").textContent = `${title} — All items`);
  const grid = panel.querySelector(".modal-grid");
  if (!grid) return;
  grid.innerHTML = "";
  parts.forEach((p) => {
    const item = doc.createElement("article");
    item.style.background = "#fff";
    item.style.padding = "12px";
    item.style.borderRadius = "10px";
    item.style.boxShadow = "var(--card-shadow)";
    item.innerHTML = `
      <div style="display:flex;gap:12px;align-items:flex-start">
        <img src="${p.image}" alt="${escapeHtml(p.name)}" style="width:220px;height:140px;object-fit:cover;border-radius:8px">
        <div>
          <h3 style="margin:0;color:var(--navy)">${escapeHtml(p.name)}</h3>
          <p style="color:var(--muted);margin:6px 0">${escapeHtml(p.description)}</p>
          <div style="display:flex;gap:8px;margin-top:8px">
            <button class="btn-order" data-id="${p.id}">Add to cart</button>
            <button class="btn-secondary" data-id="${p.id}">View Details</button>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(item);
  });
}

function closeSectionModal() {
  sectionModal?.classList.remove("show");
}

function openDetailsModal(part) {
  if (!detailsModal) return;
  detailsModal.classList.add("show");
  const panel = detailsModal.querySelector(".modal-panel");
  // build details body
  panel.innerHTML = `
    <div class="modal-header">
      <h2 class="modal-title">${escapeHtml(part.name)}</h2>
      <button class="modal-close" type="button" aria-label="Close product details">✕</button>
    </div>
    <div class="details-body">
      <div class="details-thumb"><img src="${part.image}" alt="${escapeHtml(part.name)}"></div>
      <div class="details-info">
        <h3>${escapeHtml(part.name)}</h3>
        <p class="details-desc">${escapeHtml(part.description)}</p>
        <div class="details-compat"><strong>Compatibilities:</strong>
          <ul>
            ${(part.compatibilities || []).map(c => `<li>${escapeHtml(c.brand)} — ${escapeHtml(c.model)} — ${escapeHtml(String((c.years||[]).join(", ")))}</li>`).join("")}
          </ul>
        </div>
        <div class="details-pricing"><strong>Price range:</strong> ₦${minMaxPrice(part.variants).min}${minMaxPrice(part.variants).min !== minMaxPrice(part.variants).max ? " — ₦" + minMaxPrice(part.variants).max : ""}</div>
        <div class="details-actions">
          <button class="btn-order" data-id="${part.id}">Add To Cart</button>
          <button class="btn-secondary quick-order" data-id="${part.id}">Place A Quick Order</button>
        </div>
      </div>
    </div>`;
  // After injecting, attach listeners for modal-close, order buttons (delegated below too)
}

/* close details modal */
function closeDetailsModal() {
  detailsModal?.classList.remove("show");
}

/* ============
   Quick flow: brand/model/year selection & confirmation
   - mode: "add-to-cart" or "quick-order"
   - origin: where to return after adding (home or section)
   ============ */

/**
 * showVariantPicker: opens a tiny modal (re-using detailsModal) to select brand/model/year
 * returns Promise that resolves to chosen variant {brand,model,year,price}
 */
function showVariantPicker(part, preSelections = { brand: null, model: null }, mode = "add-to-cart") {
  return new Promise((resolve, reject) => {
    // Build UI inside detailsModal
    if (!detailsModal) return reject(new Error("UI not available"));
    detailsModal.classList.add("show");
    const panel = detailsModal.querySelector(".modal-panel");
    panel.innerHTML = `
      <div class="modal-header">
        <h2 class="modal-title">Select variant — ${escapeHtml(part.name)}</h2>
        <button class="modal-close" type="button" aria-label="Close">✕</button>
      </div>
      <div style="display:flex;gap:12px;flex-direction:column">
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <div>
            <label>Brand</label><br/>
            <select id="variant-brand"></select>
          </div>
          <div>
            <label>Model</label><br/>
            <select id="variant-model"></select>
          </div>
          <div id="year-wrap" style="display:none">
            <label>Year</label><br/>
            <select id="variant-year"></select>
          </div>
        </div>

        <div id="variant-preview" style="margin-top:12px"></div>

        <div style="display:flex;gap:8px;margin-top:12px;justify-content:flex-end">
          <button id="variant-cancel" class="btn-secondary" type="button">Cancel</button>
          <button id="variant-confirm" class="btn-order" type="button">Confirm</button>
        </div>
      </div>
    `;

    // compute brand/model options from part.compatibilities and part.variants
    const comp = part.compatibilities || [];
    const brands = uniq(comp.map(c => c.brand));
    const brandSelect = panel.querySelector("#variant-brand");
    const modelSelect = panel.querySelector("#variant-model");
    const yearSelect = panel.querySelector("#variant-year");
    const yearWrap = panel.querySelector("#year-wrap");
    const preview = panel.querySelector("#variant-preview");

    // fill brands
    brandSelect.innerHTML = `<option value="">(choose)</option>` + brands.map(b => `<option value="${escapeHtml(b)}">${escapeHtml(b)}</option>`).join("");
    // preselect if filter context provides only one brand
    if (preSelections.brand && brands.includes(preSelections.brand)) brandSelect.value = preSelections.brand;

    // model fill function
    function fillModelsForBrand(b) {
      const models = uniq((comp.filter(c => !b || c.brand === b).map(c => c.model)));
      modelSelect.innerHTML = `<option value="">(choose)</option>` + models.map(m => `<option value="${escapeHtml(m)}">${escapeHtml(m)}</option>`).join("");
      if (preSelections.model && models.includes(preSelections.model)) modelSelect.value = preSelections.model;
    }

    function fillYearsForBrandModel(b, m) {
      const years = uniq((part.variants || []).filter(v => (!b || v.brand === b) && (!m || v.model === m)).map(v => v.year));
      if (years.length === 0) {
        yearWrap.style.display = "none";
        yearSelect.innerHTML = "";
        return;
      }
      yearWrap.style.display = "block";
      yearSelect.innerHTML = `<option value="">(choose)</option>` + years.map(y => `<option value="${y}">${y}</option>`).join("");
    }

    function updatePreview() {
      const b = brandSelect.value;
      const m = modelSelect.value;
      const y = yearSelect.value;
      if (!b && !m && !y) {
        preview.innerHTML = `<div style="color:var(--muted)">Pick brand, model and year to confirm.</div>`;
        return;
      }
      // find a matching variant
      const v = (part.variants || []).find(v => (!b || v.brand === b) && (!m || v.model === m) && (!y || String(v.year) === String(y)));
      if (v) {
        preview.innerHTML = `<div><strong>Selected:</strong> ${escapeHtml(v.brand)} ${escapeHtml(v.model)} — ${v.year} — ₦${v.price} — ${escapeHtml(v.availability)}</div>`;
      } else {
        preview.innerHTML = `<div style="color:var(--muted)">No exact price for selection yet. We'll confirm after you continue.</div>`;
      }
    }

    // initial fills
    fillModelsForBrand(brandSelect.value || null);
    fillYearsForBrandModel(null, null);
    updatePreview();

    brandSelect.addEventListener("change", () => {
      fillModelsForBrand(brandSelect.value || null);
      fillYearsForBrandModel(brandSelect.value || null);
      updatePreview();
    });
    modelSelect.addEventListener("change", () => {
      fillYearsForBrandModel(brandSelect.value || null, modelSelect.value || null);
      updatePreview();
    });
    yearSelect.addEventListener("change", updatePreview);

    // cancel handler
    panel.querySelector("#variant-cancel").addEventListener("click", () => {
      closeDetailsModal();
      reject(new Error("cancelled"));
    });

    // confirm handler
    panel.querySelector("#variant-confirm").addEventListener("click", () => {
      const b = brandSelect.value;
      const m = modelSelect.value;
      const y = yearSelect.value ? Number(yearSelect.value) : null;

      // find best matching variant (prefer exact year)
      let variant = null;
      if (y !== null) {
        variant = (part.variants || []).find(v => v.brand === b && v.model === m && Number(v.year) === y);
      }
      if (!variant) {
        // pick any variant matching brand+model or brand only
        variant = (part.variants || []).find(v => (b ? v.brand === b : true) && (m ? v.model === m : true));
      }
      if (!variant) {
        // fallback to first variant
        variant = (part.variants || [])[0] || null;
      }
      closeDetailsModal();
      resolve(variant);
    });

    // close icon
    panel.querySelector(".modal-close")?.addEventListener("click", () => {
      closeDetailsModal();
      reject(new Error("cancelled"));
    });
  });
}

/* ============
   Cart operations
   ============ */
function addToCart(partId, variant, qty = 1) {
  qty = Math.max(1, qty);
  const existing = state.cart.find(it => it.partId === partId && deepVariantEqual(it.variant, variant));
  if (existing) {
    existing.qty += qty;
  } else {
    state.cart.push({ partId, variant, qty });
  }
  saveCart();
  showToast("Added to cart");
}

function deepVariantEqual(a, b) {
  if (!a || !b) return false;
  return a.brand === b.brand && a.model === b.model && String(a.year) === String(b.year) && Number(a.price) === Number(b.price);
}

function removeCartItem(index) {
  state.cart.splice(index, 1);
  saveCart();
  renderCartModal();
}

function changeCartQty(index, delta) {
  const it = state.cart[index];
  if (!it) return;
  it.qty = clamp(it.qty + delta, 1, 999);
  saveCart();
  renderCartModal();
}

/* ============
   Cart modal rendering (full-screen modal)
   ============ */
let cartModal = null;
function ensureCartModal() {
  if (cartModal) return cartModal;
  cartModal = doc.createElement("div");
  cartModal.id = "cart-panel";
  cartModal.className = "modal";
  cartModal.innerHTML = `
    <div class="modal-panel" role="document" style="max-width:900px">
      <div class="modal-header">
        <h2 class="modal-title">Your cart</h2>
        <button class="modal-close" type="button" aria-label="Close cart">✕</button>
      </div>
      <div class="cart-body" style="display:flex;flex-direction:column;gap:8px;max-height:60vh;overflow:auto;padding:8px"></div>
      <div class="cart-footer" style="position:sticky;bottom:0;background:#fff;padding:12px;border-top:1px solid rgba(0,0,0,0.04);display:flex;justify-content:space-between;align-items:center;gap:12px">
        <div class="cart-summary"></div>
        <div style="display:flex;gap:8px;align-items:center">
          <button class="btn-secondary cart-back">Back</button>
          <button class="btn-order cart-place">Place Order</button>
        </div>
      </div>
    </div>
  `;
  doc.body.appendChild(cartModal);
  // close handlers
  cartModal.querySelector(".modal-close").addEventListener("click", () => closeCartModal());
  cartModal.querySelector(".cart-back").addEventListener("click", () => closeCartModal());
  cartModal.querySelector(".cart-place").addEventListener("click", () => placeOrderFromCart());
  return cartModal;
}

function openCartModal() {
  ensureCartModal();
  renderCartModal();
  cartModal.classList.add("show");
  document.body.classList.add("modal-open");
}

function closeCartModal() {
  if (!cartModal) return;
  cartModal.classList.remove("show");
  document.body.classList.remove("modal-open");
}

function renderCartModal() {
  ensureCartModal();
  const body = cartModal.querySelector(".cart-body");
  const footerSummary = cartModal.querySelector(".cart-summary");
  body.innerHTML = "";
  if (state.cart.length === 0) {
    body.innerHTML = `<div style="padding:12px;color:var(--muted)">Your cart is empty.</div>`;
    footerSummary.innerHTML = "";
    return;
  }
  state.cart.forEach((it, idx) => {
    const part = storeData.find(p => p.id === it.partId);
    const row = doc.createElement("div");
    row.className = "cart-item";
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.gap = "12px";
    row.innerHTML = `
      <img src="${part.image}" alt="${escapeHtml(part.name)}" style="width:56px;height:56px;object-fit:cover;border-radius:8px">
      <div style="flex:1">
        <div style="font-weight:700">${escapeHtml(part.name)}</div>
        <div style="color:var(--muted);font-size:0.95rem">${escapeHtml(it.variant.brand || "")} ${escapeHtml(it.variant.model || "")} ${it.variant.year ? "— " + escapeHtml(String(it.variant.year)) : ""}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
        <div>₦${formatNumber(Number(it.variant.price || 0) * it.qty)}</div>
        <div style="display:flex;gap:6px;align-items:center">
          <button class="qty-btn" data-idx="${idx}" data-delta="-1">−</button>
          <div style="min-width:28px;text-align:center">${it.qty}</div>
          <button class="qty-btn" data-idx="${idx}" data-delta="1">+</button>
        </div>
        <button class="remove-btn" data-idx="${idx}" style="background:transparent;border:0;color:#c33;cursor:pointer">Remove</button>
      </div>
    `;
    body.appendChild(row);
  });

  // attach qty & remove handlers
  body.querySelectorAll(".qty-btn").forEach((b) => {
    b.addEventListener("click", (e) => {
      const idx = Number(b.dataset.idx);
      const delta = Number(b.dataset.delta);
      changeCartQty(idx, delta);
    });
  });
  body.querySelectorAll(".remove-btn").forEach((b) => {
    b.addEventListener("click", (e) => {
      const idx = Number(b.dataset.idx);
      removeCartItem(idx);
    });
  });

  // summary
  const total = state.cart.reduce((s, it) => s + Number(it.variant.price || 0) * it.qty, 0);
  const items = state.cart.reduce((s, it) => s + it.qty, 0);
  footerSummary.innerHTML = `<div style="font-weight:800">Items: ${items}</div><div style="font-weight:800">Total: ₦${formatNumber(total)}</div>`;
}

/* Place order from cart: build message and open WhatsApp */
function placeOrderFromCart() {
  if (state.cart.length === 0) return;
  let message = `Hello, I'd like to place an order:\n\n`;
  state.cart.forEach((it, idx) => {
    const part = storeData.find(p => p.id === it.partId);
    message += `• ${part.name} — ${it.variant.brand || ""} ${it.variant.model || ""} ${it.variant.year ? "(" + it.variant.year + ")" : ""} × ${it.qty} — ₦${formatNumber(it.variant.price || 0)} each\n`;
  });
  const total = state.cart.reduce((s, it) => s + Number(it.variant.price || 0) * it.qty, 0);
  message += `\nTotal: ₦${formatNumber(total)}\n\nPlease confirm availability and delivery.`;
  openWhatsAppMessage(message);
}

/* ============
   Helpers: WhatsApp & small utilities
   ============ */
function openWhatsAppMessage(message) {
  const encoded = encodeURIComponent(message);
  const num = WHATSAPP_PHONE ? WHATSAPP_PHONE.replace(/\D/g, "") : "";
  const url = num ? `https://wa.me/${num}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
  window.open(url, "_blank");
}

function showToast(msg, timeout = 2500) {
  let t = doc.querySelector("#manny-toast");
  if (!t) {
    t = doc.createElement("div");
    t.id = "manny-toast";
    t.style.position = "fixed";
    t.style.top = "16px";
    t.style.right = "16px";
    t.style.background = "var(--navy)";
    t.style.color = "#fff";
    t.style.padding = "8px 12px";
    t.style.borderRadius = "8px";
    t.style.zIndex = 4000;
    doc.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = "1";
  setTimeout(() => {
    t.style.transition = "opacity .6s ease";
    t.style.opacity = "0";
  }, timeout);
}

function formatNumber(n) {
  return Number(n).toLocaleString();
}

/* ============
   Event delegation & UI wiring
   ============ */

// global click handler for card buttons (delegated)
stripContainerRoot.addEventListener("click", (e) => {
  const t = e.target;
  // View Details button on a card
  if (t.matches(".card-btn.view") || t.closest(".btn-secondary.quick-order")) {
    const id = Number(t.dataset.id || t.closest("[data-id]")?.dataset?.id);
    const part = storeData.find(p => p.id === id);
    if (part) {
      openDetailsModal(part);
    }
    return;
  }

  // Add to Cart on a card
  if (t.matches(".card-btn.add")) {
    const id = Number(t.dataset.id);
    const part = storeData.find(p => p.id === id);
    if (!part) return;
    // determine whether brand/model selection is required
    // if filters uniquely identify brand+model+year => skip
    const pre = inferSelectionsFromFilters(part);
    showVariantPicker(part, pre, "add-to-cart")
      .then((variant) => {
        addToCart(part.id, variant, 1);
      })
      .catch(() => {});
    return;
  }

  // inside section modal: Add to cart / View details buttons
  if (t.matches(".btn-order")) {
    const id = Number(t.dataset.id);
    const part = storeData.find(p => p.id === id);
    if (!part) return;
    const pre = inferSelectionsFromFilters(part);
    showVariantPicker(part, pre, "add-to-cart")
      .then((variant) => {
        addToCart(part.id, variant, 1);
      })
      .catch(() => {});
    return;
  }

  if (t.matches(".btn-secondary")) {
    // in section modal, view details
    const id = Number(t.dataset.id);
    const part = storeData.find(p => p.id === id);
    if (part) openDetailsModal(part);
    return;
  }
});

// modal-level delegation (close buttons, details modal actions)
doc.addEventListener("click", (e) => {
  const t = e.target;
  // close section modal/backdrop
  if (t.matches(".modal-close") || t.matches(".modal-backdrop")) {
    // close whichever modal is visible
    if (sectionModal && sectionModal.classList.contains("show")) closeSectionModal();
    if (detailsModal && detailsModal.classList.contains("show")) closeDetailsModal();
    if (cartModal && cartModal.classList.contains("show")) closeCartModal();
  }

  // details modal Add To Cart / Quick Order (these buttons are inside details modal when shown)
  if (t.matches(".btn-order") && detailsModal && detailsModal.classList.contains("show")) {
    // data-id may be on button
    const id = Number(t.dataset.id);
    const part = storeData.find(p => p.id === id);
    if (!part) return;
    // infer selection
    const pre = inferSelectionsFromFilters(part);
    showVariantPicker(part, pre, "add-to-cart")
      .then((variant) => {
        addToCart(part.id, variant, 1);
      })
      .catch(() => {});
    return;
  }
  if (t.matches(".quick-order")) {
    const id = Number(t.dataset.id);
    const part = storeData.find(p => p.id === id);
    if (!part) return;
    const pre = inferSelectionsFromFilters(part);
    showVariantPicker(part, pre, "quick-order")
      .then((variant) => {
        // build quick whatsapp message for single item
        const message = `Hello, I'd like a quick order:\n• ${part.name} — ${variant.brand || ""} ${variant.model || ""} ${variant.year ? "(" + variant.year + ")" : ""}\nPrice: ₦${formatNumber(variant.price || 0)}\nPlease confirm availability and delivery.`;
        openWhatsAppMessage(message);
      })
      .catch(() => {});
  }
});

// hamburger mobile sidebar toggles
hamburger?.addEventListener("click", () => {
  if (!mobileSidebar) return;
  mobileSidebar.classList.toggle("open");
  mobileSidebar.setAttribute("aria-hidden", String(!mobileSidebar.classList.contains("open")));
});

// mobile close
mobileClose?.addEventListener("click", () => {
  if (!mobileSidebar) return;
  mobileSidebar.classList.remove("open");
  mobileSidebar.setAttribute("aria-hidden", "true");
});

// mobile & nav cart buttons
mobileCartBtns.forEach((b) => b.addEventListener("click", () => {
  openCartModal();
}));

// filter button
filterBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  showFilterModeDropdown();
});

// search input: simple text filtering on name/slug
(searchInput ? [searchInput] : []).forEach((si) => {
  si.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      performSearch(si.value || "");
    }
  });
  let dbt = null;
  si.addEventListener("input", () => {
    if (dbt) clearTimeout(dbt);
    dbt = setTimeout(() => performSearch(si.value || ""), 400);
  });
});

function performSearch(q) {
  const term = String(q || "").trim().toLowerCase();
  if (!term) {
    // clear search -> show home view
    state.view = "home";
    renderStrips();
    return;
  }
  // filter storeData by name/slug/keywords
  const results = storeData.filter((p) => {
    const hay = `${p.name} ${p.slug} ${p.description} ${(p.tags||[]).join(" ")}`.toLowerCase();
    return hay.includes(term);
  });
  // show a single 'Search results' strip
  clearStoreContent();
  const section = makeStrip({ id: "search-results", title: `Search results (${results.length})`, parts: results });
  stripContainerRoot.appendChild(section);
}

/* ============
   helpers: infer selections from current filters
   If filters already contain brand+model+year unique, return them to skip asking.
   ============ */
function inferSelectionsFromFilters(part) {
  const pre = { brand: null, model: null, year: null };
  // if a single brand filter selected and that brand appears in part.compatibilities, preselect it
  if (state.filters.brand.size === 1) {
    const b = Array.from(state.filters.brand)[0];
    if ((part.compatibilities || []).some(c => c.brand === b)) pre.brand = b;
  }
  // model
  if (state.filters.model.size === 1) {
    const m = Array.from(state.filters.model)[0];
    if ((part.compatibilities || []).some(c => c.model === m)) pre.model = m;
  }
  // if both brand & model are set AND there's only one matching year across variants, set year
  if (pre.brand && pre.model) {
    const years = uniq((part.variants || []).filter(v => v.brand === pre.brand && v.model === pre.model).map(v => v.year));
    if (years.length === 1) pre.year = years[0];
  }
  return pre;
}

/* ============
   Small helpers
   ============ */
function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/* ============
   Initialization
   ============ */
function init() {
 console.log("Heh")
  // render initial filter chips / dropdown
  ensureFilterModeDropdown();
  populateFilterChips();
  ensureFiltersArea();
  renderFilterChips();

  // initial strips
  renderStrips();

  // restore cart UI
  updateCartCount();

  // wire up modal close by clicking backdrop (delegated)
  doc.addEventListener("click", (e) => {
    if (e.target.matches(".modal")) {
      // close whichever modal is open
      if (e.target === sectionModal) closeSectionModal();
      if (e.target === detailsModal) closeDetailsModal();
      if (e.target === cartModal) closeCartModal();
    }
  });

  // global keyboard handler for Escape to close modals
  doc.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeSectionModal();
      closeDetailsModal();
      closeCartModal();
    }
  });

  // wire up section modal close buttons (if created by markup)
  sectionModal?.querySelectorAll(".modal-close")?.forEach((b) => b.addEventListener("click", closeSectionModal));

  // attach click handlers inside details modal (delegated above)

  // populate the .categories initially
  populateFilterChips();

  // show top-of-page instruction (optional)
  // showToast("Store ready");
}

init();