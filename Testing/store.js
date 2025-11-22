// store.js
// Manny Autos — store page behavior
// Features:
// - dataset with variant prices
// - mobile sidebar toggle
// - cart modal + quantity controls + totals + Place Order -> WhatsApp
// - filter mode dropdown + dynamic reuse of .category-filter buttons
// - applied filters UI with removable chips
// - rendering parts into strip tracks and "View All" / section modal
// - details modal with Brand -> Model -> Year selection (auto-skip when filters narrow)
// - add-to-cart flows and Quick Order (WhatsApp)

const BUSSINESS_WHATSAPP = "+2348012345678"; // <-- REPLACE with your number in international format
const STORE_SESSION_CART_KEY = "manny_store_cart_v1";

// ---------- Sample dataset (variants) ----------
// Keep this small for demo; expand for real usage.

/*
const storeData = [
  {
    id: 1,
    name: "Brake Pad Set",
    slug: "brake-pad-set",
    description: "Ceramic brake pad set — quieter and longer life.",
    image: "../images/brake pads.jpg",
    category: "Brakes",
    compatibilities: [
      { brand: "Toyota", model: "Corolla", years: [2010,2011,2012] },
      { brand: "Honda", model: "Civic", years: [2014,2015,2016] },
      { brand: "Honda", model: "Accord", years: [2012,2013,2014] }
    ],
    // variants: each entry is a specific brand+model+year price & availability
    variants: [
      { brand: "Toyota", model: "Corolla", year: 2010, price: 9500, availability: "In stock" },
      { brand: "Toyota", model: "Corolla", year: 2011, price: 10000, availability: "In stock" },
      { brand: "Honda", model: "Civic", year: 2014, price: 12000, availability: "Low stock" },
      { brand: "Honda", model: "Civic", year: 2015, price: 11500, availability: "Low stock" },
      { brand: "Honda", model: "Accord", year: 2012, price: 12500, availability: "In stock" }
    ]
  },

  {
    id: 2,
    name: "Oil Filter",
    slug: "oil-filter",
    description: "High-flow oil filter. Protects engine from contaminants.",
    image: "../images/linkage.jpg",
    category: "Filters",
    compatibilities: [
      { brand: "Toyota", model: "Corolla", years: [2010,2011,2012,2013] },
      { brand: "Nissan", model: "Sentra", years: [2015,2016] }
    ],
    variants: [
      { brand: "Toyota", model: "Corolla", year: 2012, price: 1800, availability: "In stock" },
      { brand: "Toyota", model: "Corolla", year: 2013, price: 1800, availability: "In stock" },
      { brand: "Nissan", model: "Sentra", year: 2015, price: 2000, availability: "In stock" }
    ]
  },

  {
    id: 3,
    name: "Headlight Bulb (H4)",
    slug: "headlight-h4",
    description: "Bright halogen H4 bulb. Long life and good penetration.",
    image: "https://via.placeholder.com/400x300?text=Headlight+H4",
    category: "Lighting",
    compatibilities: [
      { brand: "Toyota", model: "Avanza", years: [2010,2011] },
      { brand: "Honda", model: "Civic", years: [2014,2015] }
    ],
    variants: [
      { brand: "Toyota", model: "Avanza", year: 2010, price: 1200, availability: "Low stock" },
      { brand: "Honda", model: "Civic", year: 2014, price: 1400, availability: "In stock" }
    ]
  },

  {
    id: 4,
    name: "Air Filter",
    slug: "air-filter",
    description: "Premium air filter for better airflow and engine life.",
    image: "../images/shaft heads.jpg",
    category: "Filters",
    compatibilities: [
      { brand: "Toyota", model: "Corolla", years: [2010,2011,2012] },
      { brand: "Honda", model: "Civic", years: [2015,2016] }
    ],
    variants: [
      { brand: "Toyota", model: "Corolla", year: 2012, price: 2200, availability: "In stock" },
      { brand: "Honda", model: "Civic", year: 2015, price: 2500, availability: "In stock" }
    ]
  },

  {
    id: 5,
    name: "Radiator Hose",
    slug: "radiator-hose",
    description: "Reinforced rubber radiator hose — heat and pressure resistant.",
    image: "https://via.placeholder.com/400x300?text=Radiator+Hose",
    category: "Engine Parts",
    compatibilities: [
      { brand: "Nissan", model: "Altima", years: [2014,2015] },
      { brand: "Toyota", model: "Camry", years: [2013,2014] }
    ],
    variants: [
      { brand: "Nissan", model: "Altima", year: 2014, price: 3400, availability: "In stock" },
      { brand: "Toyota", model: "Camry", year: 2013, price: 3600, availability: "Low stock" }
    ]
  },

  {
    id: 6,
    name: "Timing Belt",
    slug: "timing-belt",
    description: "High-durability timing belt.",
    image: "https://via.placeholder.com/400x300?text=Timing+Belt",
    category: "Engine Parts",
    compatibilities: [
      { brand: "Toyota", model: "Corolla", years: [2010,2011] },
      { brand: "Honda", model: "Accord", years: [2012] }
    ],
    variants: [
      { brand: "Toyota", model: "Corolla", year: 2010, price: 6200, availability: "Low stock" },
      { brand: "Honda", model: "Accord", year: 2012, price: 6500, availability: "In stock" }
    ]
  }
];
*/

import {storeData} from "./data.js"

// ---------- App State ----------
const state = {
  parts: storeData.slice(),
  filters: {
    mode: "category", // 'category' | 'brand' | 'model' (default category - used for .category-filter buttons)
    selected: {
      brand: new Set(),
      model: new Set(),
      category: new Set()
    }
  },
  cart: loadCartFromSession(), // { items: [ {partId, brand, model, year, price, qty} ] }
  currentSectionView: null // when View All opens - stores the category string
};

// ---------- Cached DOM nodes ----------
const filterBtn = document.querySelector(".filter-btn");
const categoriesRow = document.querySelector(".categories");
const searchInput = document.getElementById("search-input");
const stripViewAllBtns = document.querySelectorAll(".strip-viewall");
const stripTracks = document.querySelectorAll(".strip-track");
const sectionModal = document.getElementById("section-modal");
const detailsModal = document.getElementById("details-modal");
const mobileSidebar = document.getElementById("mobileSidebar");
const hamburgerBtn = document.querySelector(".hamburger");
const mobileCartBtns = document.querySelectorAll(".mobile-cart-btn");
const bodyEl = document.body;

// containers we'll create for dynamic UI:
let appliedFiltersContainer = null; // holds the small chips and "See Filters" checkbox
let filtersDropdownMenu = null; // small menu created when filterBtn clicked
let cartModal = null;
let toastTimer = null;

// ---------- Initialization ----------
document.addEventListener("DOMContentLoaded", () => {
  mountAppliedFiltersUI();
  mountFiltersDropdown();
  renderStrips(); // initially populate strip cards from state.parts
  attachGlobalHandlers();
  updateCartUI();
});

// ------------------ DATA HELPERS ------------------
function uniqueValuesForMode(mode) {
  // mode: 'category' | 'brand' | 'model'
  const set = new Set();
  storeData.forEach(p => {
    if (mode === "category") set.add(p.category);
    else if (mode === "brand") {
      (p.compatibilities || []).forEach(c => c.brand && set.add(c.brand));
    } else if (mode === "model") {
      (p.compatibilities || []).forEach(c => c.model && set.add(c.model));
    }
  });
  return Array.from(set).sort();
}

function variantsForPart(part) {
  return part.variants || [];
}

function findPartById(id) {
  return storeData.find(p => p.id === Number(id));
}

function formatCurrency(n) {
  return "₦" + Number(n).toLocaleString();
}

// ------------------ RENDER / UI ------------------

function renderStrips() {
  // For each strip-track in DOM, get its parent section's title and populate with the first N matching items
  // We'll map by the section's strip-title text (category).
  stripTracks.forEach(track => {
    const section = track.closest(".store-strip");
    if (!section) return;
    const titleEl = section.querySelector(".strip-title");
    const cat = titleEl?.textContent?.trim();
    // find parts matching this category and current filters
    const parts = applyFiltersToParts(storeData).filter(p => p.category === cat);
    // if none, show existing HTML cards (do nothing) — but we will replace content.
    // clear existing
    track.innerHTML = "";
    // take up to 8 items
    parts.slice(0, 8).forEach(p => {
      const node = createStripCardNode(p);
      track.appendChild(node);
    });
    // If no matching parts, leave a friendly placeholder
    if (parts.length === 0) {
      const placeholder = document.createElement("div");
      placeholder.className = "strip-empty";
      placeholder.textContent = "No items match current filters.";
      track.appendChild(placeholder);
    }
  });
  updateAppliedFiltersUI();
}

function createStripCardNode(part) {
  const article = document.createElement("article");
  article.className = "strip-card";
  article.setAttribute("tabindex", "0");
  article.setAttribute("role", "listitem");
  article.dataset.partId = String(part.id);
  article.setAttribute("aria-label", `${part.name}, ${part.category}`);
  article.innerHTML = `
    <div class="card-thumb"><img src="${escapeHtml(part.image)}" alt="${escapeHtml(part.name)}"></div>
    <div>
      <div class="card-title">${escapeHtml(part.name)}</div>
      <div class="card-desc">${escapeHtml(part.description)}</div>
    </div>
    <div class="card-meta">
      <div class="card-price">${estimatePriceRange(part)}</div>
      <div class="badge ${hasInStockVariant(part) ? "in-stock" : ""}">${hasInStockVariant(part) ? "In stock" : "Check"}</div>
    </div>
    <div class="card-actions">
      <button class="card-btn view" type="button" data-action="view">View Details</button>
      <button class="card-btn add" type="button" data-action="add">Add to Cart</button>
    </div>
  `;
  return article;
}

function estimatePriceRange(part) {
  // returns "₦min — ₦max" or single price
  const v = variantsForPart(part);
  if (!v.length) return "—";
  const prices = v.map(x => Number(x.price || 0)).filter(Boolean);
  if (!prices.length) return "—";
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? formatCurrency(min) : `${formatCurrency(min)} — ${formatCurrency(max)}`;
}

function hasInStockVariant(part) {
  return (variantsForPart(part) || []).some(v => String(v.availability).toLowerCase().includes("in"));
}

function escapeHtml(s = "") {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

// ---------- Filters UI ----------

function mountAppliedFiltersUI() {
  // Add a container below the categories row to show "See Filters" checkbox + applied chips
  appliedFiltersContainer = document.createElement("div");
  appliedFiltersContainer.className = "applied-filters-container";
  appliedFiltersContainer.style.padding = "0 1rem 0.5rem 1rem";
  appliedFiltersContainer.innerHTML = `
    <label style="display:inline-flex;align-items:center;gap:8px;cursor:pointer;">
      <input type="checkbox" class="see-filters-checkbox" style="transform:scale(1.05)"/>
      <span style="font-size:0.95rem;color:var(--muted)">See Filters</span>
    </label>
    <div class="applied-chips" style="display:inline-flex;gap:8px;margin-left:14px;flex-wrap:wrap"></div>
  `;
  categoriesRow.insertAdjacentElement("afterend", appliedFiltersContainer);

  const checkbox = appliedFiltersContainer.querySelector(".see-filters-checkbox");
  const chips = appliedFiltersContainer.querySelector(".applied-chips");
  checkbox.addEventListener("change", (e) => {
    chips.style.display = e.target.checked ? "inline-flex" : "none";
  });
  // initially hide chips
  chips.style.display = "none";
}

function updateAppliedFiltersUI() {
  if (!appliedFiltersContainer) return;
  const chips = appliedFiltersContainer.querySelector(".applied-chips");
  chips.innerHTML = "";
  const { brand, model, category } = state.filters.selected;
  const all = [];
  brand.forEach(b => all.push({ type: "brand", value: b }));
  model.forEach(m => all.push({ type: "model", value: m }));
  category.forEach(c => all.push({ type: "category", value: c }));

  all.forEach(item => {
    const chip = document.createElement("button");
    chip.className = "chip active";
    chip.setAttribute("data-filter-type", item.type);
    chip.setAttribute("data-filter-value", item.value);
    chip.style.fontSize = "0.8rem";
    chip.style.padding = "4px 8px";
    chip.innerHTML = `${item.type}: ${item.value} <span aria-hidden="true" style="margin-left:6px;color:#fff;background:#0001;padding:0 6px;border-radius:6px;">✕</span>`;
    chip.addEventListener("click", () => {
      // remove this filter
      removeFilter(item.type, item.value);
    });
    chips.appendChild(chip);
  });

  // toggle See Filters checkbox visibility: if no filters selected hide the box and hide chips area
  const checkbox = appliedFiltersContainer.querySelector(".see-filters-checkbox");
  if (all.length === 0) {
    checkbox.checked = false;
    appliedFiltersContainer.querySelector(".applied-chips").style.display = "none";
    appliedFiltersContainer.style.display = "none";
  } else {
    appliedFiltersContainer.style.display = "block";
    // keep existing checkbox state (default off)
    if (checkbox.checked) appliedFiltersContainer.querySelector(".applied-chips").style.display = "inline-flex";
  }
}

// ---------- Filters Dropdown (filter-btn) ----------

function mountFiltersDropdown() {
  // create a small dropdown menu when filterBtn is clicked
  filtersDropdownMenu = document.createElement("div");
  filtersDropdownMenu.className = "filters-dropdown";
  filtersDropdownMenu.style.position = "absolute";
  filtersDropdownMenu.style.zIndex = 3000;
  filtersDropdownMenu.style.background = "#fff";
  filtersDropdownMenu.style.border = "1px solid rgba(11,58,111,0.08)";
  filtersDropdownMenu.style.boxShadow = "0 6px 20px rgba(11,58,111,0.06)";
  filtersDropdownMenu.style.borderRadius = "8px";
  filtersDropdownMenu.style.padding = "8px";
  filtersDropdownMenu.style.minWidth = "160px";
  filtersDropdownMenu.style.display = "none";

  filtersDropdownMenu.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:8px;">
      <button type="button" data-mode="category" class="filter-mode-btn">By Category</button>
      <button type="button" data-mode="brand" class="filter-mode-btn">By Brand</button>
      <button type="button" data-mode="model" class="filter-mode-btn">By Model</button>
    </div>
  `;

  document.body.appendChild(filtersDropdownMenu);

  filterBtn.addEventListener("click", (e) => {
    const rect = filterBtn.getBoundingClientRect();
    filtersDropdownMenu.style.top = `${rect.bottom + window.scrollY + 8}px`;
    filtersDropdownMenu.style.left = `${rect.left + window.scrollX}px`;
    filtersDropdownMenu.style.display = filtersDropdownMenu.style.display === "none" ? "block" : "none";
  });

  // pick mode
  filtersDropdownMenu.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-mode-btn");
    if (!btn) return;
    const mode = btn.dataset.mode;
    if (!mode) return;
    setFilterMode(mode);
    filtersDropdownMenu.style.display = "none";
  });

  // outside click closes dropdown
  document.addEventListener("click", (e) => {
    if (!filtersDropdownMenu) return;
    if (e.target === filterBtn || filterBtn.contains(e.target)) return;
    if (filtersDropdownMenu.contains(e.target)) return;
    filtersDropdownMenu.style.display = "none";
  });
}

function setFilterMode(mode) {
  state.filters.mode = mode;
  // regenerate the .category-filter buttons (reuse existing DOM)
  const container = categoriesRow;
  container.innerHTML = ""; // reuse same element per your request
  const values = uniqueValuesForMode(mode);
  if (!values.length) {
    const btn = document.createElement("button");
    btn.className = "category-filter";
    btn.textContent = "No options";
    btn.disabled = true;
    container.appendChild(btn);
    return;
  }
  // create "All" button that clears selections for that mode
  const allBtn = document.createElement("button");
  allBtn.className = "category-filter";
  allBtn.textContent = "All";
  allBtn.addEventListener("click", () => {
    // clear selections for this mode
    state.filters.selected[mode] = new Set();
    renderStrips();
  });
  container.appendChild(allBtn);

  values.forEach(v => {
    const btn = document.createElement("button");
    btn.className = "category-filter";
    btn.textContent = v;
    btn.addEventListener("click", () => {
      toggleFilter(mode, v);
    });
    container.appendChild(btn);
  });
}

// toggle a single filter
function toggleFilter(type, value) {
  const set = state.filters.selected[type];
  if (!set) return;
  if (set.has(value)) set.delete(value); else set.add(value);
  // update button active state visually (there are many .category-filter buttons; update them)
  Array.from(document.querySelectorAll(".category-filter")).forEach(b => {
    const txt = b.textContent.trim();
    b.classList.toggle("active", state.filters.selected[state.filters.mode].has(txt));
  });
  renderStrips();
}

function removeFilter(type, value) {
  const set = state.filters.selected[type];
  if (!set) return;
  if (set.has(value)) set.delete(value);
  renderStrips();
}

// apply all selected filters to the full parts list
function applyFiltersToParts(partsArray = []) {
  const s = state.filters.selected;
  const searchQ = (searchInput?.value || "").trim().toLowerCase();
  return partsArray.filter(p => {
    // search filter first (if any)
    if (searchQ) {
      const hay = `${p.name} ${p.description} ${p.category} ${p.compatibilities?.map(c => c.brand + " " + c.model).join(" ")}`.toLowerCase();
      if (!hay.includes(searchQ)) return false;
    }

    // category filter
    if (s.category.size > 0 && !s.category.has(p.category)) return false;

    // brand filter: check compatibilities/variants
    if (s.brand.size > 0) {
      const brands = new Set((p.compatibilities || []).map(c => c.brand));
      const has = [...s.brand].some(b => brands.has(b));
      if (!has) return false;
    }

    // model filter
    if (s.model.size > 0) {
      const models = new Set((p.compatibilities || []).map(c => c.model));
      const has = [...s.model].some(m => models.has(m));
      if (!has) return false;
    }

    return true;
  });
}

// ------------------ Events and Delegation ------------------

function attachGlobalHandlers() {
  // strip actions (delegation)
  document.addEventListener("click", (e) => {
    const viewBtn = e.target.closest(".card-btn.view");
    if (viewBtn) {
      const card = viewBtn.closest(".strip-card");
      if (!card) return;
      const id = card.dataset.partId;
      openDetailsModalForPart(id);
      return;
    }

    const addBtn = e.target.closest(".card-btn.add");
    if (addBtn) {
      const card = addBtn.closest(".strip-card");
      if (!card) return;
      const id = card.dataset.partId;
      // open quick selection flow for adding
      openDetailsModalForPart(id, { startAction: "add-to-cart" });
      return;
    }

    const stripViewAll = e.target.closest(".strip-viewall");
    if (stripViewAll) {
      const section = stripViewAll.closest(".store-strip");
      const title = section?.querySelector(".strip-title")?.textContent?.trim();
      if (title) openSectionModal(title);
      return;
    }

    // modal close
    if (e.target.matches(".modal-close")) {
      const modal = e.target.closest(".modal");
      if (modal) closeModal(modal);
    }
  });

  // hamburger toggle mobile sidebar
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener("click", () => {
      if (!mobileSidebar) return;
      mobileSidebar.classList.toggle("open");
      mobileSidebar.setAttribute("aria-hidden", mobileSidebar.classList.contains("open") ? "false" : "true");
    });
  }

  // mobile close button
  const mobileClose = mobileSidebar?.querySelector(".mobile-close");
  if (mobileClose) {
    mobileClose.addEventListener("click", () => {
      mobileSidebar.classList.remove("open");
      mobileSidebar.setAttribute("aria-hidden", "true");
    });
  }

  // mobile cart open
  mobileCartBtns.forEach(b => {
    b.addEventListener("click", () => {
      openCartModal();
      // ensure mobile sidebar closed
      if (mobileSidebar) {
        mobileSidebar.classList.remove("open");
        mobileSidebar.setAttribute("aria-hidden", "true");
      }
    });
  });

  // details modal will contain form elements that we attach dynamically when opened
}

// ------------------ MODALS ------------------

function openModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.add("show");
  // lock scroll
  document.body.style.overflow = "hidden";
}

function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.remove("show");
  // restore scroll if no other modal open
  if (!document.querySelector(".modal.show")) {
    document.body.style.overflow = "";
  }
}

// ---------- Section Modal (View All) ----------

function openSectionModal(title) {
  state.currentSectionView = title;
  // populate the sectionModal grid with all items matching the title
  const grid = sectionModal.querySelector(".modal-grid");
  grid.innerHTML = "";
  const parts = applyFiltersToParts(storeData).filter(p => p.category === title);
  if (!parts.length) {
    const empty = document.createElement("div");
    empty.textContent = "No items found for this section.";
    grid.appendChild(empty);
  } else {
    parts.forEach(p => {
      const art = document.createElement("article");
      art.style.background = "#fff";
      art.style.padding = "12px";
      art.style.borderRadius = "10px";
      art.style.boxShadow = "var(--card-shadow)";
      art.innerHTML = `
        <div style="display:flex;gap:12px;align-items:flex-start">
          <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" style="width:220px;height:140px;object-fit:cover;border-radius:8px">
          <div>
            <h3 style="margin:0;color:var(--navy)">${escapeHtml(p.name)}</h3>
            <p style="color:var(--muted);margin:6px 0">${escapeHtml(p.description)}</p>
            <div style="display:flex;gap:8px;margin-top:8px">
              <button class="btn-order" data-action="add" data-part-id="${p.id}">Add to cart</button>
              <button class="btn-secondary" data-action="view" data-part-id="${p.id}">View Details</button>
            </div>
          </div>
        </div>
      `;
      grid.appendChild(art);
    });
  }
  openModal(sectionModal);
  // attach delegation for the modal's buttons
  sectionModal.querySelector(".modal-grid").addEventListener("click", sectionModalClickHandler);
}

function sectionModalClickHandler(e) {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const action = btn.dataset.action;
  const partId = btn.dataset.partId;
  if (action === "view") {
    closeModal(sectionModal);
    openDetailsModalForPart(partId);
  } else if (action === "add") {
    closeModal(sectionModal);
    openDetailsModalForPart(partId, { startAction: "add-to-cart" });
  }
}

// ---------- Details Modal (product) & selection flow ----------

function openDetailsModalForPart(partId, opts = {}) {
  const part = findPartById(partId);
  if (!part) return;
  // build modal content inside detailsModal -> modal-panel
  const panel = detailsModal.querySelector(".modal-panel");
  panel.innerHTML = ""; // build from scratch
  panel.innerHTML = `
    <div class="modal-header">
      <h2 class="modal-title">${escapeHtml(part.name)}</h2>
      <button class="modal-close" type="button" aria-label="Close product details">✕</button>
    </div>
    <div class="details-body">
      <div class="details-thumb"><img src="${escapeHtml(part.image)}" alt="${escapeHtml(part.name)}"></div>
      <div class="details-info">
        <h3>${escapeHtml(part.name)}</h3>
        <p style="color:var(--muted)">${escapeHtml(part.description)}</p>
        <div class="details-compat"><strong>Compatibility:</strong> ${ (part.compatibilities || []).map(c => `${c.brand} ${c.model} (${Array.isArray(c.years)?c.years.join(","):c.years})`).join("; ") }</div>
        <div class="details-pricing" style="margin-top:8px"><strong>Price range:</strong> ${estimatePriceRange(part)}</div>

        <div style="margin-top:12px">
          <label style="display:block;margin-bottom:6px"><strong>Select brand & model</strong></label>
          <div style="display:flex;gap:8px;align-items:center">
            <select class="sel-brand" aria-label="Select brand"><option value="">Select brand</option></select>
            <select class="sel-model" aria-label="Select model"><option value="">Select model</option></select>
            <select class="sel-year" aria-label="Select year" style="display:none"><option value="">Select year</option></select>
          </div>
          <div class="sel-warning" style="color:var(--muted);font-size:0.95rem;margin-top:8px"></div>
        </div>

        <div class="details-actions">
          <button class="btn-order" data-action="add">Add To Cart</button>
          <button class="btn-secondary" data-action="quick-order">Place Quick Order</button>
        </div>
      </div>
    </div>
  `;

  // populate brand/model/year options based on part variants and current filters
  const selBrand = panel.querySelector(".sel-brand");
  const selModel = panel.querySelector(".sel-model");
  const selYear = panel.querySelector(".sel-year");
  const selWarn = panel.querySelector(".sel-warning");

  const variants = variantsForPart(part);
  const allBrands = Array.from(new Set(variants.map(v => v.brand))).sort();
  const allModels = Array.from(new Set(variants.map(v => v.model))).sort();

  // If filters already specify a single brand/model for this part, preselect and skip
  const preselectedBrands = Array.from(state.filters.selected.brand);
  const preselectedModels = Array.from(state.filters.selected.model);

  // fill brands
  allBrands.forEach(b => {
    const opt = document.createElement("option");
    opt.value = b;
    opt.textContent = b;
    selBrand.appendChild(opt);
  });

  // brand change handler updates models
  function refreshModelsForBrand(brand) {
    selModel.innerHTML = `<option value="">Select model</option>`;
    const models = variants.filter(v => !brand || v.brand === brand).map(v => v.model);
    const uniq = Array.from(new Set(models)).sort();
    uniq.forEach(m => {
      const o = document.createElement("option");
      o.value = m;
      o.textContent = m;
      selModel.appendChild(o);
    });
    // hide year until model selected
    selYear.style.display = "none";
  }

  function refreshYearsForBrandModel(brand, model) {
    selYear.innerHTML = `<option value="">Select year</option>`;
    const ys = variants
      .filter(v => v.brand === brand && v.model === model)
      .map(v => v.year)
      .sort((a,b) => a-b);
    if (!ys.length) { selYear.style.display = "none"; return; }
    ys.forEach(y => {
      const o = document.createElement("option");
      o.value = String(y);
      o.textContent = String(y);
      selYear.appendChild(o);
    });
    selYear.style.display = "inline-block";
  }

  // if only one brand exists OR filters already narrowed to one brand for this product, preselect
  if (preselectedBrands.length === 1 && allBrands.includes(preselectedBrands[0])) {
    selBrand.value = preselectedBrands[0];
    refreshModelsForBrand(selBrand.value);
    // if preselected model exists and belongs to this part, preselect model
    if (preselectedModels.length === 1 && Array.from(new Set(variants.map(v=>v.model))).includes(preselectedModels[0])) {
      selModel.value = preselectedModels[0];
      refreshYearsForBrandModel(selBrand.value, selModel.value);
    }
  } else if (allBrands.length === 1) {
    selBrand.value = allBrands[0];
    refreshModelsForBrand(selBrand.value);
  } else {
    // leave brand empty
    refreshModelsForBrand("");
  }

  selBrand.addEventListener("change", (e) => {
    refreshModelsForBrand(e.target.value);
    selWarn.textContent = "";
  });
  selModel.addEventListener("change", (e) => {
    refreshYearsForBrandModel(selBrand.value, selModel.value);
    selWarn.textContent = "";
  });

  // button actions inside details modal
  panel.querySelectorAll("[data-action]").forEach(btn => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      // ensure brand & model & year selection as required
      const brand = selBrand.value || null;
      const model = selModel.value || null;
      const year = selYear.style.display === "none" ? null : selYear.value || null;

      // If filters already uniquely identify brand/model/year, we can skip
      // auto-detect: if only one brand possible given current global filters & part variants, pick it
      const autoBrand = deduceBrandFromFiltersAndPart(part);
      const autoModel = deduceModelFromFiltersAndPart(part, autoBrand);
      const autoYear = deduceYearFromFiltersAndPart(part, autoBrand, autoModel);

      const finalBrand = brand || autoBrand;
      const finalModel = model || autoModel;
      const finalYear = year || autoYear;

      // if missing brand or model or year, ask user (set warning)
      if (!finalBrand || !finalModel || !finalYear) {
        selWarn.textContent = "Please select brand, model and year (or narrow filters first).";
        return;
      }

      // find variant
      const chosenVariant = variants.find(v => String(v.brand) === String(finalBrand) && String(v.model) === String(finalModel) && String(v.year) === String(finalYear));
      if (!chosenVariant) {
        selWarn.textContent = "No variant found for this selection. Choose another year/model.";
        return;
      }

      if (action === "add") {
        // confirm modal flow
        openConfirmationModal({ part, variant: chosenVariant, action: "add" });
      } else if (action === "quick-order") {
        openConfirmationModal({ part, variant: chosenVariant, action: "quick-order" });
      }
    });
  });

  openModal(detailsModal);
}

// helper deductions
function deduceBrandFromFiltersAndPart(part) {
  const selectedBrands = Array.from(state.filters.selected.brand);
  const variants = variantsForPart(part);
  if (selectedBrands.length === 1 && variants.some(v => v.brand === selectedBrands[0])) return selectedBrands[0];
  // if part has only one brand available, return it
  const b = Array.from(new Set(variants.map(v => v.brand)));
  return b.length === 1 ? b[0] : null;
}
function deduceModelFromFiltersAndPart(part, brand) {
  const selectedModels = Array.from(state.filters.selected.model);
  const variants = variantsForPart(part);
  if (selectedModels.length === 1 && variants.some(v => v.model === selectedModels[0])) return selectedModels[0];
  // if only one model for chosen brand
  const arr = variants.filter(v => !brand || v.brand === brand).map(v => v.model);
  const uniq = Array.from(new Set(arr));
  return uniq.length === 1 ? uniq[0] : null;
}
function deduceYearFromFiltersAndPart(part, brand, model) {
  const variants = variantsForPart(part);
  const arr = variants.filter(v => (!brand || v.brand === brand) && (!model || v.model === model)).map(v => v.year);
  const uniq = Array.from(new Set(arr));
  return uniq.length === 1 ? String(uniq[0]) : null;
}

// ---------- Confirmation modal (after selection) ----------
function openConfirmationModal({ part, variant, action }) {
  // create a small modal structure (reusing .modal styles)
  let conf = document.getElementById("confirm-modal");
  if (!conf) {
    conf = document.createElement("div");
    conf.id = "confirm-modal";
    conf.className = "modal";
    conf.innerHTML = `
      <div class="modal-panel">
        <div class="modal-header">
          <h3 class="modal-title">Confirm selection</h3>
          <button class="modal-close" aria-label="Close">✕</button>
        </div>
        <div class="confirm-body"></div>
        <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px">
          <button class="btn-secondary" data-action="cancel">Cancel</button>
          <button class="btn-order" data-action="confirm">Ok</button>
        </div>
      </div>
    `;
    document.body.appendChild(conf);
    conf.querySelector(".modal-close").addEventListener("click", () => closeModal(conf));
  }
  conf.querySelector(".confirm-body").innerHTML = `
    <div style="display:flex;gap:12px;align-items:center">
      <img src="${escapeHtml(part.image)}" alt="${escapeHtml(part.name)}" style="width:120px;height:80px;object-fit:cover;border-radius:8px"/>
      <div>
        <div style="font-weight:700">${escapeHtml(part.name)}</div>
        <div style="color:var(--muted)">Selected: ${escapeHtml(variant.brand)} ${escapeHtml(variant.model)} — ${escapeHtml(String(variant.year))}</div>
        <div style="margin-top:6px;font-weight:800">${formatCurrency(variant.price)}</div>
      </div>
    </div>
  `;
  // action handling
  conf.querySelectorAll("[data-action]").forEach(b => {
    b.onclick = () => {
      const a = b.dataset.action;
      if (a === "cancel") {
        closeModal(conf);
      } else if (a === "confirm") {
        if (action === "add") {
          addToCart(part.id, variant, 1);
          showToast(`${part.name} (${variant.brand} ${variant.model} ${variant.year}) added to cart`);
          closeModal(conf);
          closeModal(detailsModal);
        } else if (action === "quick-order") {
          // open whatsapp with prebuilt message
          const message = buildWhatsAppMessageForQuickOrder(part, variant, 1);
          openWhatsApp(message);
          closeModal(conf);
          closeModal(detailsModal);
        }
      }
    };
  });
  openModal(conf);
}

// ---------- Cart Implementation ----------

function loadCartFromSession() {
  try {
    const raw = sessionStorage.getItem(STORE_SESSION_CART_KEY);
    if (!raw) return { items: [] };
    return JSON.parse(raw);
  } catch (err) {
    return { items: [] };
  }
}
function persistCartToSession() {
  try {
    sessionStorage.setItem(STORE_SESSION_CART_KEY, JSON.stringify(state.cart));
  } catch (err) {
    console.warn("Cannot persist cart:", err);
  }
}

function addToCart(partId, variant, qty = 1) {
  // if same part-version exists, increase qty
  const existing = state.cart.items.find(it => it.partId === partId && it.brand === variant.brand && it.model === variant.model && String(it.year) === String(variant.year));
  if (existing) {
    existing.qty = Number(existing.qty) + Number(qty);
  } else {
    state.cart.items.push({
      partId: Number(partId),
      brand: variant.brand,
      model: variant.model,
      year: String(variant.year),
      price: Number(variant.price),
      qty: Number(qty),
      name: findPartById(partId).name,
      image: findPartById(partId).image
    });
  }
  persistCartToSession();
  updateCartUI();
}

function updateCartUI() {
  // update cart count on page
  const totalItems = state.cart.items.reduce((s, it) => s + Number(it.qty), 0);
  document.querySelectorAll(".cart-count").forEach(el => el.textContent = ` (${totalItems})`);
  document.querySelectorAll(".mobile-cart-btn .cart-count").forEach(el => {
    el.textContent = ` (${totalItems})`;
  });
}

function openCartModal() {
  // create cart modal if not exists
  if (!cartModal) {
    cartModal = document.createElement("div");
    cartModal.id = "cart-modal";
    cartModal.className = "modal";
    cartModal.innerHTML = `
      <div class="modal-panel" style="max-width:980px;">
        <div class="modal-header">
          <h2 class="modal-title">Cart</h2>
          <button class="modal-close" aria-label="Close cart">✕</button>
        </div>
        <div style="display:flex;gap:12px">
          <div style="flex:1;max-height:60vh;overflow:auto">
            <div id="cart-items-container"></div>
          </div>
          <div style="width:320px;flex-shrink:0">
            <div style="background:#fff;padding:12px;border-radius:8px;box-shadow:var(--card-shadow)">
              <h3 style="margin:0 0 8px 0">Order summary</h3>
              <div id="cart-summary" style="margin-bottom:12px"></div>
              <div style="display:flex;gap:8px">
                <button class="btn-secondary" id="cart-continue">Continue shopping</button>
                <button class="btn-order" id="cart-place-order">Place Order</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(cartModal);

    // close handler
    cartModal.querySelector(".modal-close").addEventListener("click", () => closeModal(cartModal));
    cartModal.querySelector("#cart-continue").addEventListener("click", () => closeModal(cartModal));
    cartModal.querySelector("#cart-place-order").addEventListener("click", () => {
      // build whatsapp message and open
      const message = buildWhatsAppMessageForCart();
      openWhatsApp(message);
      closeModal(cartModal);
    });
  }

  renderCartItems();
  openModal(cartModal);
}

function renderCartItems() {
  if (!cartModal) return;
  const container = cartModal.querySelector("#cart-items-container");
  container.innerHTML = "";
  if (!state.cart.items.length) {
    const n = document.createElement("div");
    n.style.padding = "18px";
    n.textContent = "Your cart is empty.";
    container.appendChild(n);
    cartModal.querySelector("#cart-summary").innerHTML = `<div>No items.</div>`;
    return;
  }
  state.cart.items.forEach((it, idx) => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.gap = "8px";
    row.style.background = "#fff";
    row.style.padding = "8px";
    row.style.borderRadius = "8px";
    row.style.marginBottom = "8px";
    row.innerHTML = `
      <img src="${escapeHtml(it.image)}" alt="${escapeHtml(it.name)}" style="width:64px;height:44px;object-fit:cover;border-radius:6px"/>
      <div style="flex:1">
        <div style="font-weight:700">${escapeHtml(it.name)}</div>
        <div style="color:var(--muted);font-size:0.95rem">${escapeHtml(it.brand)} ${escapeHtml(it.model)} — ${escapeHtml(it.year)}</div>
      </div>
      <div style="text-align:right">
        <div style="font-weight:800">${formatCurrency(it.price)}</div>
        <div style="display:flex;align-items:center;gap:8px;margin-top:6px;justify-content:flex-end">
          <button class="qty-decrease" data-idx="${idx}" aria-label="Decrease">−</button>
          <div style="min-width:28px;text-align:center">${it.qty}</div>
          <button class="qty-increase" data-idx="${idx}" aria-label="Increase">+</button>
        </div>
      </div>
    `;
    container.appendChild(row);
  });

  // attach quantity handlers
  container.querySelectorAll(".qty-decrease").forEach(b => {
    b.addEventListener("click", () => {
      const idx = Number(b.dataset.idx);
      if (state.cart.items[idx]) {
        if (state.cart.items[idx].qty > 1) state.cart.items[idx].qty--;
        else {
          // remove
          state.cart.items.splice(idx, 1);
        }
        persistCartToSession();
        renderCartItems();
        updateCartUI();
      }
    });
  });
  container.querySelectorAll(".qty-increase").forEach(b => {
    b.addEventListener("click", () => {
      const idx = Number(b.dataset.idx);
      if (state.cart.items[idx]) {
        state.cart.items[idx].qty++;
        persistCartToSession();
        renderCartItems();
        updateCartUI();
      }
    });
  });

  // summary
  const total = state.cart.items.reduce((s, it) => s + (it.qty * it.price), 0);
  const count = state.cart.items.reduce((s, it) => s + it.qty, 0);
  cartModal.querySelector("#cart-summary").innerHTML = `
    <div style="display:flex;justify-content:space-between"><span>Items</span><strong>${count}</strong></div>
    <div style="display:flex;justify-content:space-between;margin-top:8px"><span>Total</span><strong>${formatCurrency(total)}</strong></div>
  `;
}

// ---------- WhatsApp Message Builders ----------

function buildWhatsAppMessageForQuickOrder(part, variant, qty = 1) {
  const lines = [
    `Hello, I want to place a quick order on Manny Autos.`,
    `Part: ${part.name}`,
    `Variant: ${variant.brand} ${variant.model} — ${variant.year}`,
    `Qty: ${qty}`,
    `Price: ${formatCurrency(variant.price)}`,
    ``,
    `Please confirm availability and delivery options.`
  ];
  return lines.join("\n");
}

function buildWhatsAppMessageForCart() {
  const lines = ["Hello, I'm ordering the following parts from Manny Autos:"];
  state.cart.items.forEach(it => {
    lines.push(`• ${it.name} — ${it.brand} ${it.model} ${it.year} — ${it.qty} × ${formatCurrency(it.price)} = ${formatCurrency(it.qty * it.price)}`);
  });
  const total = state.cart.items.reduce((s, it) => s + it.qty * it.price, 0);
  lines.push("");
  lines.push(`Total: ${formatCurrency(total)}`);
  lines.push("");
  lines.push("Please confirm availability and delivery options.");
  return lines.join("\n");
}

function openWhatsApp(message) {
  const encoded = encodeURIComponent(message);
  const url = BUSSINESS_WHATSAPP ? `https://wa.me/${BUSSINESS_WHATSAPP.replace(/\D/g,"")}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
  window.open(url, "_blank");
}

// ---------- Toast messages ----------

function showToast(msg, ms = 2400) {
  let toast = document.getElementById("manny-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "manny-toast";
    toast.style.position = "fixed";
    toast.style.top = "18px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = "rgba(11,58,111,0.95)";
    toast.style.color = "#fff";
    toast.style.padding = "8px 14px";
    toast.style.borderRadius = "8px";
    toast.style.zIndex = 4000;
    toast.style.boxShadow = "0 8px 30px rgba(11,58,111,0.2)";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = "1";
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.style.opacity = "0";
    // small fade out
  }, ms);
}

// ---------- Utilities ----------

function renderPartsMatchingFiltersToPage() {
  // re-populate all strips
  renderStrips();
}

// ------------------ Expose minimal global for debugging ------------------
window.mannyStore = {
  state,
  renderStrips,
  openCartModal,
  addToCart,
  storeData
};