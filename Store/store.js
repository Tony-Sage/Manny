// store.js
// Manny Autos — store page behavior (updated)
// - Adds "Others" filter mode (tags)
// - Splits page into three sections: Top (Featured), Middle (Categories), Bottom (Others)
// - Parts can appear in multiple tracks (uses `tracks` array or inferred placement)
// - Product cards open details modal by clicking the card (no separate buttons)

import {storeData} from "./data.js"

const BUSSINESS_WHATSAPP = "+237692521155"; // <-- REPLACE with your number
const STORE_SESSION_CART_KEY = "manny_store_cart_v1";

/* =========================
   App state
   - parts: immutable reference to storeData
   - filters: mode and selected sets
   - strips: computed mapping: featured, categories, othersByTag, tagList
   ========================= */
const state = {
  currentExpandedSection: null,
  parts: storeData.slice(),
  filters: {
    mode: "category", // 'category' | 'brand' | 'model' | 'others'
    selected: {
      brand: new Set(),
      model: new Set(),
      category: new Set(),
      tags: new Set()
    }
  },
  cart: loadCartFromSession(),
  strips: {
    featured: [],
    categories: {},     // categoryName -> [partIds]
    othersByTag: {},    // tag -> [partIds]
    tagList: []         // list of tags discovered (sorted)
  },
  // canonical category order for the middle section
  canonicalCategories: [
    "Engine Parts",
    "Chassis Parts",
    "Body Parts",
    "Electrical Accessories",
    "Interior Accessories"
  ]
};


const filterBtn = document.querySelector(".filter-btn");
const categoriesRow = document.querySelector(".categories"); // reusable .category-filter buttons
const searchInput = document.getElementById("search-input");
const sectionModal = document.getElementById("section-modal");
const detailsModal = document.getElementById("details-modal");
const mobileSidebar = document.getElementById("mobileSidebar");
const hamburgerBtn = document.querySelector(".hamburger");
const mobileCartBtns = document.querySelectorAll(".mobile-cart-btn");
const bodyEl = document.body;

/* containers we may create */
let othersSectionContainer = document.getElementById("others-section"); // bottom container for tag strips
let appliedFiltersContainer = null;
let filtersDropdownMenu = null;
let cartModal = null;

/* =========================
   Utilities
   ========================= */
function escapeHtml(s="") { return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"); }
function formatCurrency(n){ return `${Number(n).toLocaleString()} FCFA`; }
function unique(arr){ return Array.from(new Set(arr)); }

/* =========================
   Persistence: cart
   ========================= */
function loadCartFromSession(){
  try {
    const raw = sessionStorage.getItem(STORE_SESSION_CART_KEY);
    return raw ? JSON.parse(raw) : { items: [] };
  } catch(e){ return { items: [] }; }
}
function persistCart(){ try{ sessionStorage.setItem(STORE_SESSION_CART_KEY, JSON.stringify(state.cart)); }catch(e){} }

/* =========================
   Build strips mapping (featured, categories, othersByTag)
   - A part can be in multiple tracks.
   - If part.tracks exists, respect it (e.g. ["featured","brakes","custom-tag"])
   - Otherwise: include it in:
       - featured if id appears in a short curated featured list (we choose first N)
       - category track: its category
       - tag tracks: every tag in part.tags
   ========================= */
function buildStripsMapping() {
  // reset
  state.strips.featured = [];
  state.strips.categories = {};
  state.strips.othersByTag = {};
  const tagSet = new Set();

  // featured: choose first 8 by default (or parts which explicitly include 'featured' track)
  const explicitFeatured = state.parts.filter(p => Array.isArray(p.tracks) && p.tracks.includes("featured")).map(p => p.id);
  if (explicitFeatured.length) {
    state.strips.featured = explicitFeatured.slice(0, 8);
  } else {
    state.strips.featured = state.parts.slice(0, 8).map(p => p.id);
  }

  state.parts.forEach(p => {
    // category track
    const cat = (p.category || "Uncategorized").trim();
    if (!state.strips.categories[cat]) state.strips.categories[cat] = [];
    // a part can appear multiple times in categories? No — categories are unique, but part may appear in more than one track (e.g. both featured and its category)
    state.strips.categories[cat].push(p.id);

    // tags
    (p.tags || []).forEach(t => {
      const tag = String(t).trim();
      tagSet.add(tag);
      if (!state.strips.othersByTag[tag]) state.strips.othersByTag[tag] = [];
      state.strips.othersByTag[tag].push(p.id);
    });

    // explicit tracks array: allow placing into named tracks (besides category and tags)
    if (Array.isArray(p.tracks)) {
      p.tracks.forEach(tname => {
        const tn = String(tname).trim();
        if (!tn) return;
        // if "featured" already handled, ignore duplication
        if (tn.toLowerCase() === "featured") {
          if (!state.strips.featured.includes(p.id)) state.strips.featured.push(p.id);
          return;
        }
        // if matches one of canonicalCategories, ensure it appears there too
        if (state.canonicalCategories.includes(tn)) {
          if (!state.strips.categories[tn]) state.strips.categories[tn] = [];
          if (!state.strips.categories[tn].includes(p.id)) state.strips.categories[tn].push(p.id);
          return;
        }
        // otherwise treat as a tag-equivalent (others)
        tagSet.add(tn);
        if (!state.strips.othersByTag[tn]) state.strips.othersByTag[tn] = [];
        if (!state.strips.othersByTag[tn].includes(p.id)) state.strips.othersByTag[tn].push(p.id);
      });
    }
  });

  state.strips.tagList = Array.from(tagSet).sort();
}

/* =========================
   Rendering helpers
   ========================= */

/** produce a strip-card element (card is clickable) */
function createStripCard(part) {
  const el = document.createElement("article");
  el.className = "strip-card";
  el.tabIndex = 0;
  el.setAttribute("role", "listitem");
  el.dataset.partId = String(part.id);
  el.innerHTML = `
    <div class="card-thumb"><img src="${escapeHtml(part.image)}" alt="${escapeHtml(part.name)}"></div>
    <div>
      <div class="card-title">${escapeHtml(part.name)}</div>
      <div class="card-desc">${escapeHtml(part.description)}</div>
    </div>
    <div class="card-meta">
      <div class="card-price">${estimatePriceRange(part)}</div>
      <div class="badge ${hasInStockVariant(part) ? "in-stock" : ""}">${hasInStockVariant(part) ? "In stock" : "Check"}</div>
    </div>
  `;
  // clicking anywhere on card opens details modal (not buttons)
  el.addEventListener("click", () => openDetailsModalForPart(part.id));
  el.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      openDetailsModalForPart(part.id);
    }
  });
  return el;
}

function estimatePriceRange(part) {
  const vs = (part.variants || []).map(v => Number(v.price||0)).filter(Boolean);
  if (!vs.length) return "—";
  const mn = Math.min(...vs), mx = Math.max(...vs);
  return mn === mx ? formatCurrency(mn) : `${formatCurrency(mn)} — ${formatCurrency(mx)}`;
}
function hasInStockVariant(part) {
  return (part.variants || []).some(v => String(v.availability||"").toLowerCase().includes("in"));
}

/* =========================
   Render the three sections:
   - Top (Featured) — uses existing .store-strip where title includes "Featured"
   - Middle (Categories) — ensure the five canonical categories exist in DOM; if not create them
   - Bottom (Others) — ensure an #others-section exists; generate a strip per tag in state.strips.tagList
   Parts may appear in multiple tracks
   ========================= */
function ensureSectionsExist() {
  // find existing store-strip for Featured; if missing, create and append near top of main
  const mainRoot = document.querySelector(".store-main") || document.querySelector("main") || document.body;
  // FEATURED: look for strip-title containing "featured"
  let featuredStrip = Array.from(document.querySelectorAll(".store-strip")).find(s => (s.querySelector(".strip-title")?.textContent||"").toLowerCase().includes("featured"));
  if (!featuredStrip) {
    featuredStrip = createStoreStrip("Featured");
    // insert at top of mainRoot
    mainRoot.insertAdjacentElement("afterbegin", featuredStrip);
  }

  // MIDDLE: ensure canonical category strips exist in the order specified
  state.canonicalCategories.forEach(catName => {
    let strip = Array.from(document.querySelectorAll(".store-strip")).find(s => (s.querySelector(".strip-title")?.textContent||"") === catName);
    if (!strip) {
      strip = createStoreStrip(catName);
      // Append after featured strip (so order: featured, then categories)
      featuredStrip.insertAdjacentElement("afterend", strip);
    }
  });

  // BOTTOM: ensure others-section container exists after categories
  othersSectionContainer = document.getElementById("others-section");
  if (!othersSectionContainer) {
    othersSectionContainer = document.createElement("div");
    othersSectionContainer.id = "others-section";
    // create heading
    const heading = document.createElement("div");
    heading.style.display = "flex";
    heading.style.alignItems = "center";
    heading.style.justifyContent = "space-between";
    heading.style.padding = "0 1rem";
    heading.innerHTML = `<h3 style="margin:12px 0;color:var(--navy);font-weight:700">Others</h3>`;
    mainRoot.appendChild(heading);
    mainRoot.appendChild(othersSectionContainer);
  }
}

/** create a .store-strip element with given title text */
function createStoreStrip(titleText) {
  const section = document.createElement("section");
  section.className = "store-strip";
  section.innerHTML = `
    <div class="strip-header">
      <h3 class="strip-title">${escapeHtml(titleText)}</h3>
      <div class="strip-actions">
        <button class="strip-viewall" type="button">View all</button>
      </div>
    </div>
    <div class="strip-track" role="list"></div>
  `;
  return section;
}

/* render all strips (featured, categories, tag-based others) */
function renderAllStrips() {
  // ensure sections exist
  ensureSectionsExist();
  // rebuild strips mapping
  buildStripsMapping();

  // FEATURED strip
  const featuredStripEl = Array.from(document.querySelectorAll(".store-strip")).find(s => (s.querySelector(".strip-title")?.textContent||"").toLowerCase().includes("featured"));
  if (featuredStripEl) {
    const track = featuredStripEl.querySelector(".strip-track");
    renderTrackByIds(track, state.strips.featured);
  }

  // MIDDLE: canonical categories
  state.canonicalCategories.forEach(cat => {
    // find matching strip element for this title
    let strip = Array.from(document.querySelectorAll(".store-strip")).find(s => (s.querySelector(".strip-title")?.textContent||"") === cat);
    if (!strip) {
      // create if missing and append after featured
      strip = createStoreStrip(cat);
      const featuredStrip = featuredStripEl || document.querySelector(".store-strip");
      featuredStrip?.insertAdjacentElement("afterend", strip);
    }
    const ids = (state.strips.categories[cat] || []).slice();
    renderTrackByIds(strip.querySelector(".strip-track"), ids);
  });

  // BOTTOM: Others (one strip per tag)
  // clear existing content in othersSectionContainer and add strips for tags
  othersSectionContainer.innerHTML = "";
  state.strips.tagList.forEach(tag => {
    const strip = createStoreStrip(tag);
    // override the header title to be tag name (already done)
    othersSectionContainer.appendChild(strip);
    const ids = (state.strips.othersByTag[tag] || []).slice();
    renderTrackByIds(strip.querySelector(".strip-track"), ids);
  });

  // attach handlers for View All buttons (delegation)
  attachStripViewAllHandlers();
}

/** Render one strip-track given array of part ids (applies current filters) */
function renderTrackByIds(trackEl, ids = []) {
  if (!trackEl) return;
  trackEl.innerHTML = "";
  // map ids -> parts
  const parts = ids.map(id => state.parts.find(p => p.id === id)).filter(Boolean);
  // apply global filters (search + selected filters)
  const filtered = parts.filter(p => applyFiltersToPart(p));
  if (!filtered.length) {
    trackEl.innerHTML = `<div class="strip-empty">No items match current filters.</div>`;
    return;
  }
  filtered.slice(0, 12).forEach(p => {
    const card = createStripCard(p);
    trackEl.appendChild(card);
  });
}

/* =========================
   Filtering logic
   - Filter modes: category | brand | model | others (tags)
   - selected filters stored in state.filters.selected
   - applyFiltersToPart returns true if a part should be shown in a track
   ========================= */
function applyFiltersToPart(part) {
  const s = state.filters.selected;
  const searchQ = (searchInput?.value || "").trim().toLowerCase();
  // search test
  if (searchQ) {
    const hay = `${part.name} ${part.description} ${part.category} ${(part.tags||[]).join(" ")} ${(part.compatibilities||[]).map(c=>c.brand+" "+c.model).join(" ")}`.toLowerCase();
    if (!hay.includes(searchQ)) return false;
  }
  // category filters
  if (s.category.size > 0 && !s.category.has(part.category)) return false;
  // brand filters
  if (s.brand.size > 0) {
    // check compatibilities and variants
    const brands = new Set((part.compatibilities || []).map(c => c.brand).concat((part.variants||[]).map(v => v.brand)));
    const ok = [...s.brand].some(b => brands.has(b));
    if (!ok) return false;
  }
  // model filters
  if (s.model.size > 0) {
    const models = new Set((part.compatibilities || []).map(c => c.model).concat((part.variants||[]).map(v => v.model)));
    const ok = [...s.model].some(m => models.has(m));
    if (!ok) return false;
  }
  // tags (others mode)
  if (s.tags.size > 0) {
    const pTags = new Set(part.tags || []);
    const ok = [...s.tags].some(t => pTags.has(t));
    if (!ok) return false;
  }
  return true;
}

/* =========================
   Top filters row (the existing .category-filter buttons)
   - The same `.categories` container is reused
   - When filter mode is 'others', we populate the buttons from tags.
   ========================= */
function populateTopFilterButtons() {
  const container = categoriesRow;
  if (!container) return;
  container.innerHTML = "";

  // Determine if any filter is selected for the current mode:
  let anySelected = false;
  const mode = state.filters.mode;
  if (mode === "category") anySelected = state.filters.selected.category.size > 0;
  if (mode === "brand") anySelected = state.filters.selected.brand.size > 0;
  if (mode === "model") anySelected = state.filters.selected.model.size > 0;
  if (mode === "others") anySelected = state.filters.selected.tags.size > 0;

  // 'All' button — active only when nothing is selected
  const allBtn = document.createElement("button");
  allBtn.classList.add("category-filter", "all-filter-btn");
  if (!anySelected) allBtn.classList.add("active");
  allBtn.textContent = "All";
  allBtn.addEventListener("click", () => {
    // clear selected for current mode in state
    clearSelectedForMode(mode);
    // refresh UI from state (render functions will check state)
    if (state.currentExpandedSection) renderExpandedSection(state.currentExpandedSection);
    else renderAllStrips();
    populateTopFilterButtons();
    updateAppliedFiltersUI();
  });
  container.appendChild(allBtn);

  // Build the list of values depending on mode (as you had)
  let values = [];
  if (mode === "category") {
    values = Array.from(new Set(state.parts.map(p => p.category))).sort();
  } else if (mode === "brand") {
    const set = new Set();
    state.parts.forEach(p => (p.compatibilities||[]).forEach(c => c.brand && set.add(c.brand)));
    values = Array.from(set).sort();
  } else if (mode === "model") {
    const set = new Set();
    state.parts.forEach(p => (p.compatibilities||[]).forEach(c => c.model && set.add(c.model)));
    values = Array.from(set).sort();
  } else if (mode === "others") {
    values = state.strips.tagList.slice();
  }

  values.forEach(v => {
    const btn = document.createElement("button");
    btn.classList.add("category-filter", "other-filter-btn");
    btn.textContent = v;
    btn.dataset.value = v;
    // mark active according to state
    const isActive =
      (mode === "category" && state.filters.selected.category.has(v)) ||
      (mode === "brand" && state.filters.selected.brand.has(v)) ||
      (mode === "model" && state.filters.selected.model.has(v)) ||
      (mode === "others" && state.filters.selected.tags.has(v));
    if (isActive) btn.classList.add("active");

    btn.addEventListener("click", () => {
      // Toggle selection in state
      toggleSelectionForMode(mode, v);
      // Re-render everything from state
      populateTopFilterButtons();
      if (state.currentExpandedSection) renderExpandedSection(state.currentExpandedSection);
      else renderAllStrips();
      updateAppliedFiltersUI();
    });

    container.appendChild(btn);
  });
}

function toggleSelectionForMode(mode, value) {
  if (mode === "category") {
    if (state.filters.selected.category.has(value)) state.filters.selected.category.delete(value); else state.filters.selected.category.add(value);
  } else if (mode === "brand") {
    if (state.filters.selected.brand.has(value)) state.filters.selected.brand.delete(value); else state.filters.selected.brand.add(value);
  } else if (mode === "model") {
    if (state.filters.selected.model.has(value)) state.filters.selected.model.delete(value); else state.filters.selected.model.add(value);
  } else if (mode === "others") {
    if (state.filters.selected.tags.has(value)) state.filters.selected.tags.delete(value); else state.filters.selected.tags.add(value);
  }
}

function clearSelectedForMode(mode) {
  if (mode === "category") state.filters.selected.category = new Set();
  if (mode === "brand") state.filters.selected.brand = new Set();
  if (mode === "model") state.filters.selected.model = new Set();
  if (mode === "others") state.filters.selected.tags = new Set();
  document.querySelectorAll('.other-filter-btn').forEach((btn)=>{
   btn.classList.remove("active")
  })
}

/* show applied filters chips UI below the categories row */
function mountAppliedFiltersUI() {
  appliedFiltersContainer = document.createElement("div");
  appliedFiltersContainer.className = "applied-filters-container";
  appliedFiltersContainer.style.padding = "0 1rem 0.5rem";
  appliedFiltersContainer.innerHTML = `
    <label style="display:none;align-items:center;gap:8px;cursor:pointer;" id="see-filters-label">
      <input type="checkbox" class="see-filters-checkbox" />
      <span style="font-size:0.95rem;color:var(--muted)">See Filters</span>
    </label>
    <div class="applied-chips" style="display:inline-flex;gap:8px;margin-left:14px;flex-wrap:wrap"></div>
  `;
  categoriesRow.insertAdjacentElement("afterend", appliedFiltersContainer);
  const checkbox = appliedFiltersContainer.querySelector(".see-filters-checkbox");
  const chips = appliedFiltersContainer.querySelector(".applied-chips");
  chips.style.display = "none";
  checkbox.addEventListener("change", (e) => {
    chips.style.display = e.target.checked ? "inline-flex" : "none";
  });
}
function updateAppliedFiltersUI(){
  if (!appliedFiltersContainer) return;
  const chips = appliedFiltersContainer.querySelector(".applied-chips");
  chips.innerHTML = "";
  const arr = [];
  state.filters.selected.brand.forEach(v => arr.push({type:"brand", value:v}));
  state.filters.selected.model.forEach(v => arr.push({type:"model", value:v}));
  state.filters.selected.category.forEach(v => arr.push({type:"category", value:v}));
  state.filters.selected.tags.forEach(v => arr.push({type:"tag", value:v}));
  if (!arr.length) {
    appliedFiltersContainer.style.display = "none";
    return;
  } else {
   appliedFiltersContainer.style.display = "block";
    document.querySelector("#see-filters-label").style.display = "inline-flex";
  }
  arr.forEach(item => {
    const b = document.createElement("button");
    b.className = "chip active";
    b.textContent = `${item.type}: ${item.value} ×`;
    b.addEventListener("click", () => {
      // remove
      if (item.type === "brand") state.filters.selected.brand.delete(item.value);
      if (item.type === "model") state.filters.selected.model.delete(item.value);
      if (item.type === "category") state.filters.selected.category.delete(item.value);
      if (item.type === "tag") state.filters.selected.tags.delete(item.value);
      updateAppliedFiltersUI();
      populateTopFilterButtons();
      if (state.currentExpandedSection) renderExpandedSection(state.currentExpandedSection);
      else renderAllStrips();

    });
    chips.appendChild(b);
  });
}

/* =========================
   Filter dropdown (filterBtn) — choose mode including "Others"
   ========================= */
function mountFilterDropdown() {
  // guard against double-mount
  if (document.body.dataset.filtersMounted === "1") return;
  document.body.dataset.filtersMounted = "1";

  // ensure filterBtn exists
  if (!filterBtn) {
    console.error("mountFilterDropdown: filterBtn not found");
    return;
  }

  // create menu
  const menu = document.createElement("div");
  menu.className = "filters-dropdown";
  Object.assign(menu.style, {
    position: "absolute",
    zIndex: "9999",
    background: "#fff",
    boxShadow: "0 8px 30px rgba(11,58,111,0.12)",
    borderRadius: "8px",
    padding: "8px",
    minWidth: "180px",
    display: "none"
  });
  menu.innerHTML = `
    <button class="fm" data-mode="category" style="display:block;padding:8px;border:0;background:transparent;text-align:left">By Category</button>
    <button class="fm" data-mode="brand" style="display:block;padding:8px;border:0;background:transparent;text-align:left">By Brand</button>
    <button class="fm" data-mode="model" style="display:block;padding:8px;border:0;background:transparent;text-align:left">By Model</button>
    <button class="fm" data-mode="others" style="display:block;padding:8px;border:0;background:transparent;text-align:left">Others (tags)</button>
  `;
  document.body.appendChild(menu);

  // helper to position menu under the button
  function positionMenu() {
    const rect = filterBtn.getBoundingClientRect();
    menu.style.left = `${rect.left + window.scrollX - 150}px`;
    menu.style.top = `${rect.bottom + window.scrollY + 8}px`;
  }

  // reliable toggle using computed style
  function isHidden() {
    return window.getComputedStyle(menu).display === "none";
  }
  function showMenu() {
    positionMenu();
    menu.style.display = "block";
  }
  function hideMenu() {
    menu.style.display = "none";
  }

  // named handler (allows safe remove later if needed)
  function onFilterBtnClick(e) {
    e.stopPropagation(); // prevent document click from also firing
    if (isHidden()) {
      showMenu();
      // update position if window resized or scrolled while open
      window.addEventListener("resize", positionMenu);
      window.addEventListener("scroll", positionMenu, { passive: true });
    } else {
      hideMenu();
      window.removeEventListener("resize", positionMenu);
      window.removeEventListener("scroll", positionMenu);
    }
  }

  // attach once
  filterBtn.addEventListener("click", onFilterBtnClick);

  // click inside menu
  menu.addEventListener("click", (e) => {
    const btn = e.target.closest(".fm");
    if (!btn) return;
    const mode = btn.dataset.mode;
    state.filters.mode = mode;
    populateTopFilterButtons();
    updateAppliedFiltersUI();
    hideMenu();
    window.removeEventListener("resize", positionMenu);
    window.removeEventListener("scroll", positionMenu);
  });

  // click outside -> hide
  document.addEventListener("click", (e) => {
    // if click was on the filter button (or its children), don't hide
    if (e.target === filterBtn || filterBtn.contains(e.target)) return;
    if (menu.contains(e.target)) return;
    if (!isHidden()) {
      hideMenu();
      window.removeEventListener("resize", positionMenu);
      window.removeEventListener("scroll", positionMenu);
    }
  });

  // keep a reference for debugging if needed
  window.__filtersMenu = { menu, filterBtn, onFilterBtnClick };
}


/* =========================
   Section View All handlers (delegated)
   ========================= */
function attachStripViewAllHandlers(){
  // clear existing to avoid duplicates
  document.querySelectorAll(".strip-viewall").forEach(btn => {
    btn.removeEventListener("click", onStripViewAll);
    btn.addEventListener("click", onStripViewAll);
  });
}

// ------------------ Expanded Section (in-page) ------------------

function onStripViewAll(e) {
  const section = e.currentTarget.closest(".store-strip");
  if (!section) return;
  const title = section.querySelector(".strip-title")?.textContent?.trim() || "Items";
  enterExpandedSection(title);
}

let expandedContainer = null;
let hiddenDefaultNodes = []; // nodes hidden when expanded view is active

function enterExpandedSection(title) {
  // Save title in state
  state.currentExpandedSection = title;
  buildStripsMapping();

  // Ensure appliedFiltersContainer exists (we insert after it)
  if (!appliedFiltersContainer) mountAppliedFiltersUI();

  // Find parent and hide everything after the appliedFiltersContainer
  const parent = appliedFiltersContainer.parentElement;
  hiddenDefaultNodes = [];
  let node = appliedFiltersContainer.nextElementSibling;
  while (node) {
    hiddenDefaultNodes.push(node);
    // hide node (preserve inline style by storing original in dataset)
    node.dataset.__displayBackup = node.style.display || "";
    node.style.display = "none";
    node = node.nextElementSibling;
  }

  // create expanded container
  expandedContainer = document.createElement("div");
  expandedContainer.id = "expanded-section";
  expandedContainer.style.padding = "0.5rem";
  expandedContainer.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px">
      <div style="display:flex;align-items:center;gap:12px">
        <button id="expanded-back" class="btn-secondary" aria-label="Back to store">← Back</button>
        <div>
          <div style="font-weight:800;color:var(--navy);font-size:1rem" id="expanded-title">${escapeHtml(title)}</div>
          <div style="font-size:0.9rem;color:var(--muted)" id="expanded-count">0 items</div>
        </div>
      </div>
      <div>
        <!-- placeholder: could add sort or view toggles -->
      </div>
    </div>
    <div id="expanded-grid" class="products-grid" style="margin-top:8px"></div>
  `;
  // insert after appliedFiltersContainer
  appliedFiltersContainer.insertAdjacentElement("afterend", expandedContainer);

  // hook back button
  expandedContainer.querySelector("#expanded-back").addEventListener("click", () => {
    restoreDefaultView();
  });

  // render content
  renderExpandedSection(title);
}

function renderExpandedSection(title) {
  if (!expandedContainer) return;
  const grid = expandedContainer.querySelector("#expanded-grid");
  const countEl = expandedContainer.querySelector("#expanded-count");
  grid.innerHTML = "";

  // Determine parts to show based on title (category, tag, or featured)
  let parts = [];
  if (state.strips.categories[title]) {
    parts = state.strips.categories[title].map(id => state.parts.find(p => p.id === id)).filter(Boolean);
  } else if (state.strips.othersByTag[title]) {
    parts = state.strips.othersByTag[title].map(id => state.parts.find(p => p.id === id)).filter(Boolean);
  } else if (title.toLowerCase().includes("featured")) {
    parts = state.strips.featured.map(id => state.parts.find(p => p.id === id)).filter(Boolean);
  } else {
    // fallback: try matching category names case-insensitively
    parts = state.parts.filter(p => (p.category || "").toLowerCase() === (title || "").toLowerCase());
  }

  // apply active filters & search
  parts = parts.filter(p => applyFiltersToPart(p));

  // update count
  countEl.textContent = `${parts.length} item${parts.length === 1 ? "" : "s"}`;

  if (!parts.length) {
    grid.innerHTML = `<div style="padding:18px">No items match current filters.</div>`;
    return;
  }

  // render cards (use same small card appearance)
  parts.forEach(p => {
    // create a card node functionally identical to strip-card
    const node = createStripCard(p);
    // style tweak: ensure grid behavior consistent
    node.style.width = ""; // allow grid to size it
    node.style.minWidth = "";
    grid.appendChild(node);
  });
}

function restoreDefaultView() {
  // remove expanded container
  if (expandedContainer) {
    expandedContainer.remove();
    expandedContainer = null;
  }
  // unhide hidden default nodes
  hiddenDefaultNodes.forEach(n => {
    n.style.display = n.dataset.__displayBackup || "";
    delete n.dataset.__displayBackup;
  });
  hiddenDefaultNodes = [];
  state.currentExpandedSection = null;
  // re-render default strips to reflect any filters changed while expanded
  renderAllStrips();
}


/* =========================
   Details modal & selection flow
   - The details modal content and flow remain the same as your previous implementation.
   - openDetailsModalForPart(partId, opts) will populate modal-panel and open it.
   ========================= */
function openDetailsModalForPart(partId, opts = {}) {
  const part = state.parts.find(p => String(p.id) === String(partId));
  if (!part) return;
  const panel = detailsModal.querySelector(".modal-panel");
  if (!panel) return;

  // Build the same structure you used previously but inject a compact carousel in the image slot.
  panel.innerHTML = `
    <div class="modal-header">
      <h2 class="modal-title">${escapeHtml(part.name)}</h2>
      <button class="modal-close" type="button" aria-label="Close product details">✕</button>
    </div>

    <div class="details-body">
      <div class="details-thumb" style="position:relative">
        <!-- carousel container (keeps same image dimensions as before) -->
        <div class="detail-carousel" style="position:relative; width:100%; max-width:100%; overflow:hidden; border-radius:8px;">
          <button class="img-prev" aria-label="Previous image" type="button"
            style="position:absolute;left:8px;top:50%;transform:translateY(-50%);z-index:3;border-radius:999px;padding:6px;border:0;background:rgba(255,255,255,0.9);cursor:pointer;">‹</button>

          <img id="detail-main-image" src="" alt="${escapeHtml(part.name)}"
               style="width:100%;height:300px;object-fit:cover;display:block;border-radius:8px" />

          <button class="img-next" aria-label="Next image" type="button"
            style="position:absolute;right:8px;top:50%;transform:translateY(-50%);z-index:3;border-radius:999px;padding:6px;border:0;background:rgba(255,255,255,0.9);cursor:pointer;">›</button>
        </div>
        <div id="image-pagination" style="margin-top:8px;font-size:0.9rem;color:var(--muted)"></div>
      </div>

      <div class="details-info">
        <h3>${escapeHtml(part.name)}</h3>
        <p style="color:var(--muted)">${escapeHtml(part.description)}</p>
        <div class="details-compat"><strong>Compatibility:</strong> ${ (part.compatibilities || []).map(c => `${escapeHtml(c.brand)} ${escapeHtml(c.model)} (${Array.isArray(c.years)?c.years.join(","):c.years})`).join("; ") }</div>
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

        <div class="details-actions" style="margin-top:12px">
          <button class="btn-order" data-action="add">Add To Cart</button>
          <button class="btn-secondary" data-action="quick-order">Place Quick Order</button>
        </div>
      </div>
    </div>
  `;

  // ---------- Carousel logic (compact, non-invasive) ----------
  const mainImg = panel.querySelector("#detail-main-image");
  const prevBtn = panel.querySelector(".img-prev");
  const nextBtn = panel.querySelector(".img-next");
  const pagination = panel.querySelector("#image-pagination");

  // Normalize images to array
  let images = [];
  if (Array.isArray(part.image) && part.image.length) images = part.image.slice();
  else if (part.image) images = [part.image];
  else images = ["https://via.placeholder.com/600x400?text=No+image"];

  let imgIndex = 0;
  function refreshCarousel() {
    mainImg.src = images[imgIndex];
    pagination.textContent = `${imgIndex + 1} of ${images.length}`;
    // subtle hint for disabled
    prevBtn.disabled = imgIndex <= 0;
    nextBtn.disabled = imgIndex >= images.length - 1;
    prevBtn.style.opacity = prevBtn.disabled ? "0.45" : "1";
    nextBtn.style.opacity = nextBtn.disabled ? "0.45" : "1";
  }

  prevBtn.addEventListener("click", ev => {
    ev.stopPropagation();
    if (imgIndex > 0) { imgIndex--; refreshCarousel(); }
  });
  nextBtn.addEventListener("click", ev => {
    ev.stopPropagation();
    if (imgIndex < images.length - 1) { imgIndex++; refreshCarousel(); }
  });

  // touch swipe (lightweight)
  let touchStartX = null;
  mainImg.addEventListener("touchstart", (e) => { if (e.touches && e.touches[0]) touchStartX = e.touches[0].clientX; });
  mainImg.addEventListener("touchend", (e) => {
    if (touchStartX === null) return;
    const touchEndX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : null;
    if (touchEndX === null) { touchStartX = null; return; }
    const dx = touchEndX - touchStartX;
    if (dx > 40 && imgIndex > 0) imgIndex--;
    else if (dx < -40 && imgIndex < images.length - 1) imgIndex++;
    refreshCarousel();
    touchStartX = null;
  });

  // click advances
  mainImg.addEventListener("click", () => {
    if (imgIndex < images.length - 1) { imgIndex++; refreshCarousel(); }
  });

  refreshCarousel();

  // ---------- selects & variant logic (keeps original behavior) ----------
  const variants = part.variants || [];
  const selBrand = panel.querySelector(".sel-brand");
  const selModel = panel.querySelector(".sel-model");
  const selYear = panel.querySelector(".sel-year");
  const selWarn = panel.querySelector(".sel-warning");

  const brands = unique(variants.map(v => v.brand)).filter(Boolean).sort();
  const modelsByBrand = {};
  const yearsByKey = {};
  variants.forEach(v => {
    if (!v.brand || !v.model) return;
    if (!modelsByBrand[v.brand]) modelsByBrand[v.brand] = new Set();
    modelsByBrand[v.brand].add(v.model);
    const key = `${v.brand}___${v.model}`;
    if (!yearsByKey[key]) yearsByKey[key] = new Set();
    yearsByKey[key].add(v.year);
  });
  Object.keys(modelsByBrand).forEach(b => modelsByBrand[b] = Array.from(modelsByBrand[b]).sort());
  Object.keys(yearsByKey).forEach(k => yearsByKey[k] = Array.from(yearsByKey[k]).sort((a,b)=>a-b));

  brands.forEach(b => selBrand.insertAdjacentHTML("beforeend", `<option value="${escapeHtml(b)}">${escapeHtml(b)}</option>`));

  function populateModels(brand) {
    selModel.innerHTML = `<option value="">Select model</option>`;
    selYear.style.display = "none";
    if (!brand) return;
    (modelsByBrand[brand]||[]).forEach(m => selModel.insertAdjacentHTML("beforeend", `<option value="${escapeHtml(m)}">${escapeHtml(m)}</option>`));
  }
  function populateYears(brand, model) {
    selYear.innerHTML = `<option value="">Select year</option>`;
    if (!brand || !model) { selYear.style.display = "none"; return; }
    const key = `${brand}___${model}`;
    (yearsByKey[key]||[]).forEach(y => selYear.insertAdjacentHTML("beforeend", `<option value="${String(y)}">${String(y)}</option>`));
    selYear.style.display = "inline-block";
  }

  // auto-deductions (same helpers you already have)
  const autoBrand = deduceBrandFromFiltersAndPart(part);
  const autoModel = deduceModelFromFiltersAndPart(part, autoBrand);
  const autoYear = deduceYearFromFiltersAndPart(part, autoBrand, autoModel);

  if (autoBrand) { selBrand.value = autoBrand; populateModels(autoBrand); } else populateModels("");
  if (autoModel) { selModel.value = autoModel; populateYears(selBrand.value, selModel.value); }
  if (autoYear) { selYear.value = String(autoYear); }

  selBrand.addEventListener("change", () => { populateModels(selBrand.value); selWarn.textContent = ""; });
  selModel.addEventListener("change", () => { populateYears(selBrand.value, selModel.value); selWarn.textContent = ""; });

  // ---------- action buttons ----------
  panel.querySelectorAll("[data-action]").forEach(btn => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      const brand = selBrand.value || deduceBrandFromFiltersAndPart(part);
      const model = selModel.value || deduceModelFromFiltersAndPart(part, brand);
      const year = (selYear.style.display !== "none" && selYear.value) ? selYear.value : deduceYearFromFiltersAndPart(part, brand, model);

      if (!brand || !model || !year) {
        selWarn.textContent = "Please select brand, model and year (or narrow filters first).";
        return;
      }

      const chosen = variants.find(v => String(v.brand) === String(brand) && String(v.model) === String(model) && String(v.year) === String(year));
      if (!chosen) { selWarn.textContent = "Variant not available for this selection."; return; }

      if (action === "add") openConfirmationModal({ part, variant: chosen, action: "add" });
      else if (action === "quick-order") openConfirmationModal({ part, variant: chosen, action: "quick-order" });
    });
  });

  // finally open modal (keeps your modal class styling)
  openModal(detailsModal);
}''

/* helper deduction functions (same behavior as requested) */
function deduceBrandFromFiltersAndPart(part) {
  const s = Array.from(state.filters.selected.brand);
  const partBrands = unique((part.variants||[]).map(v => v.brand));
  if (s.length === 1 && partBrands.includes(s[0])) return s[0];
  if (partBrands.length === 1) return partBrands[0];
  return null;
}
function deduceModelFromFiltersAndPart(part, brand) {
  const s = Array.from(state.filters.selected.model);
  const models = unique((part.variants||[]).filter(v => !brand || v.brand === brand).map(v => v.model));
  if (s.length === 1 && models.includes(s[0])) return s[0];
  if (models.length === 1) return models[0];
  return null;
}
function deduceYearFromFiltersAndPart(part, brand, model) {
  const yrs = unique((part.variants||[]).filter(v => (!brand || v.brand === brand) && (!model || v.model === model)).map(v => v.year));
  if (yrs.length === 1) return yrs[0];
  return null;
}

/* Confirmation modal reused (very similar to your previous flow) */

function openConfirmationModal({ part, variant, action }) {
  let conf = document.getElementById("confirm-modal");
  if (!conf) {
    conf = document.createElement("div");
    conf.id = "confirm-modal";
    conf.className = "modal";
    conf.innerHTML = `
      <div class="modal-panel">
        <div class="modal-header">
          <h3 class="modal-title">Confirm selection</h3>
          <button class="modal-close">✕</button>
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
      <img src="${escapeHtml(part.image)}" style="width:120px;height:80px;object-fit:cover;border-radius:8px"/>
      <div>
        <div style="font-weight:700">${escapeHtml(part.name)}</div>
        <div style="color:var(--muted)">Selected: ${escapeHtml(variant.brand)} ${escapeHtml(variant.model)} — ${escapeHtml(String(variant.year))}</div>
        <div style="margin-top:6px;font-weight:800">${formatCurrency(variant.price)}</div>
      </div>
    </div>
  `;
  conf.querySelectorAll("[data-action]").forEach(b => b.onclick = () => {
    const a = b.dataset.action;
    if (a === "cancel") { closeModal(conf); return; }
    if (a === "confirm") {
      if (action === "add") {
        addToCart(part.id, variant, 1);
        showToast(`${part.name} (${variant.brand} ${variant.model} ${variant.year}) added to cart`);
        closeModal(conf);
        closeModal(detailsModal);
      } else if (action === "quick-order") {
        const msg = buildWhatsAppMessageForQuickOrder(part, variant, 1);
        openWhatsApp(msg);
        closeModal(conf);
        closeModal(detailsModal);
      }
    }
  });
  openModal(conf);
}

/* =========================
   Cart functions (same semantics as before)
   ========================= */
function addToCart(partId, variant, qty = 1) {
  const existing = state.cart.items.find(it =>
    it.partId === Number(partId) &&
    it.brand === variant.brand &&
    it.model === variant.model &&
    String(it.year) === String(variant.year)
  );

  // ensure thumbnail (support both string and array)
  const p = state.parts.find(x => x.id === Number(partId));
  let thumb = "";
  if (p) {
    if (Array.isArray(p.image) && p.image.length) thumb = p.image[0];
    else thumb = p.image || "";
  }

  if (existing) {
    existing.qty = Number(existing.qty) + Number(qty);
  } else {
    state.cart.items.push({
      partId: Number(partId),
      name: p ? p.name : "",
      image: thumb,          // store single thumbnail for cart view
      brand: variant.brand,
      model: variant.model,
      year: String(variant.year),
      price: Number(variant.price),
      qty: Number(qty)
    });
  }
  persistCart();
  updateCartUI();
}

function updateCartUI() {
  const total = state.cart.items.reduce((s,it) => s + Number(it.qty), 0);
  document.querySelectorAll(".cart-count").forEach(el => el.textContent = ` (${total})`);
}

/* Cart modal open (keeps your previously defined layout) */
function openCartModal() {
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
          <div style="flex:1;max-height:60vh;overflow:auto;">
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
    cartModal.querySelector(".modal-close").addEventListener("click", () => closeModal(cartModal));
    cartModal.querySelector("#cart-continue").addEventListener("click", () => closeModal(cartModal));
    cartModal.querySelector("#cart-place-order").addEventListener("click", () => {
     if (state.cart.items.length){
      const msg = buildWhatsAppMessageForCart();
      openWhatsApp(msg);
      closeModal(cartModal);
     } else {
      alert("Please add items to cart before ordering")
     }
    });
  }
  renderCartItems();
  openModal(cartModal);
}

function renderCartItems() {
  if (!cartModal) return;
  const container = cartModal.querySelector("#cart-items-container");
  const summary = cartModal.querySelector("#cart-summary");
  container.innerHTML = "";
  if (!state.cart.items.length) {
    container.innerHTML = `<div style="padding:18px">Your cart is empty.</div>`;
    summary.innerHTML = `<div>No items.</div>`;
    return;
  }

  state.cart.items.forEach((it, idx) => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.style.display = "flex";
     row.style.alignItems = "flex-start";
    row.style.gap = "12px";
    row.style.background = "#fff";
    row.style.padding = "12px";
    row.style.borderRadius = "8px";
    row.style.marginBottom = "10px";

    // left thumbnail
    const thumbHTML = `<img src="${escapeHtml(it.image || '')}" style="width:72px;height:52px;object-fit:cover;border-radius:6px"/>`;

    row.innerHTML = `
      <div style="flex:0 0 auto">${thumbHTML}</div>
      <div style="flex:1">
        <div style="font-weight:700">${escapeHtml(it.name)}</div>
        <div style="color:var(--muted);font-size:0.95rem;margin-top:4px">${escapeHtml(it.brand)} ${escapeHtml(it.model)} — ${escapeHtml(it.year)}</div>
        <div style="margin-top:8px;display:flex;gap:12px;align-items:center;justify-content:flex-start">
          <div style="font-weight:800">${formatCurrency(it.price)}</div>
          <div style="min-width:46px;text-align:center;padding:6px 8px;border-radius:8px;background:#f4f6f8">${it.qty}</div>
          <button class="btn-secondary change-qty-btn" data-idx="${idx}" type="button">Change Qty</button>
        </div>

        <div style="margin-top:8px">
          <button class="btn-secondary remove-item-btn" data-idx="${idx}" type="button" style="background:#fff;border:1px solid rgba(11,58,111,0.06);color:var(--navy)">Remove Item</button>
        </div>
      </div>
      <div style="flex-shrink:0;text-align:right">
        <div style="font-weight:800">${formatCurrency(it.price * it.qty)}</div>
      </div>
    `;
    container.appendChild(row);
  });
  
 
 // modal for changing item quantity in cart
 function openChangeQtyModal(idx) {
  if (!Number.isFinite(idx) || !state.cart.items[idx]) return;
  let modal = document.getElementById("change-qty-modal");
  const item = state.cart.items[idx];

  if (!modal) {
    modal = document.createElement("div");
    modal.id = "change-qty-modal";
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-panel" style="max-width:420px;padding:16px">
        <div class="modal-header">
          <h3 class="modal-title">Change quantity</h3>
          <button class="modal-close" aria-label="Close">✕</button>
        </div>
        <div style="padding:8px 0">
          <div style="display:flex;gap:12px;align-items:center">
            <img id="chg-qty-thumb" src="" style="width:84px;height:60px;object-fit:cover;border-radius:6px"/>
            <div>
              <div id="chg-qty-name" style="font-weight:700"></div>
              <div id="chg-qty-variant" style="color:var(--muted);font-size:0.95rem;margin-top:6px"></div>
            </div>
          </div>

          <div style="margin-top:12px">
            <label style="display:block;margin-bottom:6px">New quantity</label>
            <input id="chg-qty-input" type="number" min="1" step="1" style="width:100%;padding:10px;border-radius:8px;border:1px solid #e6e6e6" />
            <div id="chg-qty-error" style="color:#c0392b;margin-top:6px;display:none;font-size:0.9rem"></div>
          </div>
        </div>

        <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px">
          <button class="btn-secondary" data-action="cancel">Cancel</button>
          <button class="btn-order" data-action="save">Save</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    // close handlers
    modal.querySelector(".modal-close").addEventListener("click", () => closeModal(modal));
    modal.querySelector("[data-action='cancel']").addEventListener("click", () => closeModal(modal));
  }

  // populate values
  modal.querySelector("#chg-qty-thumb").src = escapeHtml(item.image || "");
  modal.querySelector("#chg-qty-name").textContent = item.name || "";
  modal.querySelector("#chg-qty-variant").textContent = `${item.brand} ${item.model} — ${item.year}`;
  const input = modal.querySelector("#chg-qty-input");
  const err = modal.querySelector("#chg-qty-error");
  input.value = String(item.qty);
  err.style.display = "none";

  // remove previous save handler (avoid duplicates)
  const saveBtn = modal.querySelector("[data-action='save']");
  const newSave = () => {
    const val = Number(input.value);
    if (!Number.isInteger(val) || val < 1) {
      err.textContent = "Enter a valid quantity (1 or more).";
      err.style.display = "block";
      return;
    }
    // update
    state.cart.items[idx].qty = val;
    persistCart();
    renderCartItems();
    updateCartUI();
    closeModal(modal);
  };
  // replace click
  const newSaveClone = saveBtn.cloneNode(true);
  saveBtn.parentNode.replaceChild(newSaveClone, saveBtn);
  newSaveClone.addEventListener("click", newSave);

  openModal(modal);
}

  // hookup handlers
  container.querySelectorAll(".remove-item-btn").forEach(b => {
    b.addEventListener("click", () => {
      const i = Number(b.dataset.idx);
      if (Number.isFinite(i) && state.cart.items[i]) {
        state.cart.items.splice(i, 1);
        persistCart();
        renderCartItems();
        updateCartUI();
      }
    });
  });

  container.querySelectorAll(".change-qty-btn").forEach(b => {
    b.addEventListener("click", () => {
      const i = Number(b.dataset.idx);
      openChangeQtyModal(i);
    });
  });

  // summary
  const total = state.cart.items.reduce((s, it) => s + it.qty * it.price, 0);
  const count = state.cart.items.reduce((s, it) => s + it.qty, 0);
  summary.innerHTML = `
    <div style="display:flex;justify-content:space-between"><span>Items</span><strong>${count}</strong></div>
    <div style="display:flex;justify-content:space-between;margin-top:8px"><span>Total</span><strong>${formatCurrency(total)}</strong></div>
  `;
}

/* WhatsApp message builders */
function buildWhatsAppMessageForQuickOrder(part, variant, qty=1) {
  return [
    `Hello, I want to place a quick order on Manny Autos. \n`,
    `Part: ${part.name} \n`,
    `Variant: ${variant.brand} ${variant.model} — ${variant.year} \n`,
    `Qty: ${qty} \n`,
    `Price: ${formatCurrency(variant.price)} \n`,
    ``,
    `Please confirm availability and delivery options.`
  ].join("\n");
}

function buildWhatsAppMessageForCart() {
  const lines = ["Hello, I'm ordering the following parts from Manny Autos: \n"];
  state.cart.items.forEach(it => {
    lines.push(`• ${it.name} — ${it.brand} ${it.model} ${it.year} — ${it.qty} × ${formatCurrency(it.price)} = ${formatCurrency(it.qty * it.price)} \n`);
  });
  const total = state.cart.items.reduce((s,it) => s + it.qty * it.price, 0);
  lines.push("", `Total: ${formatCurrency(total)}`, "", "Please confirm availability and delivery options.");
  return lines.join("\n");
}
function openWhatsApp(message) {
  const encoded = encodeURIComponent(message);
  const wa = BUSSINESS_WHATSAPP ? `https://wa.me/${BUSSINESS_WHATSAPP.replace(/\D/g,"")}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
  window.open(wa, "_blank");
}

/* Toast */
let toastTimer = null;
function showToast(msg, ms=2200) {
  let t = document.getElementById("manny-toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "manny-toast";
    t.style.position = "fixed";
    t.style.top = "18px";
    t.style.left = "50%";
    t.style.transform = "translateX(-50%)";
    t.style.background = "rgba(11,58,111,0.95)";
    t.style.color = "#fff";
    t.style.padding = "8px 14px";
    t.style.borderRadius = "8px";
    t.style.zIndex = 4000;
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = "1";
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> t.style.opacity = "0", ms);
}

/* =========================
   Global handlers & init
   ========================= */
function attachGlobalHandlers() {
  // enable strip-viewall buttons
  attachStripViewAllHandlers();

  // top filter button dropdown
  mountFilterDropdown();

  // populate top filter buttons initially
  buildStripsMapping();
  //populateTopFilterButtons();
  mountAppliedFiltersUI();

  // search input
  if (searchInput) searchInput.addEventListener("input", debounce(() => {
  if (state.currentExpandedSection) renderExpandedSection(state.currentExpandedSection);
  else renderAllStrips();
}, 250));


  // hamburger toggle
  if (hamburgerBtn && mobileSidebar) {
    hamburgerBtn.addEventListener("click", () => {
      mobileSidebar.classList.toggle("open");
      mobileSidebar.setAttribute("aria-hidden", mobileSidebar.classList.contains("open") ? "false" : "true");
    });
    const mobileClose = mobileSidebar.querySelector(".mobile-close");
    if (mobileClose) mobileClose.addEventListener("click", () => {
      mobileSidebar.classList.remove("open"); mobileSidebar.setAttribute("aria-hidden","true");
    });
  }

  // cart buttons
  mobileCartBtns.forEach(b => b.addEventListener("click", () => {
    openCartModal();
    if (mobileSidebar) { mobileSidebar.classList.remove("open"); mobileSidebar.setAttribute("aria-hidden","true"); }
  }));

  // details modal close (delegated)
  document.addEventListener("click", (e) => {
    if (e.target.matches(".modal-close")) {
      const modal = e.target.closest(".modal");
      if (modal) closeModal(modal);
    }
  });

  // keyboard escape to close modals
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { document.querySelectorAll(".modal.show").forEach(m => closeModal(m)); }});
}

/* small helpers */
function openModal(el){ if(!el) return; el.classList.add("show"); document.body.classList.add("modal-open"); }
function closeModal(el){ if(!el) return; el.classList.remove("show"); if (!document.querySelector(".modal.show")) document.body.classList.remove("modal-open"); }
function debounce(fn, ms=200){ let t=null; return (...a)=>{ if(t) clearTimeout(t); t=setTimeout(()=>fn(...a), ms); }; }

/* =========================
   Init on DOMContentLoaded
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  try {
    // Build strips and render UI
    buildStripsMapping();
    ensureSectionsExist();
    populateTopFilterButtons();
    mountFilterDropdown();
    attachGlobalHandlers();
    renderAllStrips();
    updateCartUI();

    const toOpen = sessionStorage.getItem('manny_store_open_part');
    if (toOpen) {
      // open modal for that id
      openDetailsModalForPart(toOpen); // adapt to your store.js function name
      sessionStorage.removeItem('manny_store_open_part');
}

  } catch (err) {
    console.error("Init error", err);
  }
});

/* expose for debugging */
window.mannyStore = {
  state,
  renderAllStrips,
  openCartModal,
  addToCart,
  storeData
};
