// search-merged.js
// - Go To Store -> sets sessionStorage key then navigates to store page
// - Place Quick Order -> brand/model/year selection + WhatsApp quick-order
// - pagination, instruction modal, categories, and placeholder typing preserved

import { fetchCarData, fetchCategoryData } from "./data.js"; // ensure data.js exports both

const carData = await fetchCarData();
const autoParts = await fetchCategoryData();

/* =========================
   Config & constants
   ========================= */
const PAGE_SIZE = 5;
const WHATSAPP_PHONE = "+237692521155";
const INSTRUCTION_SHOWN_KEY = "manny_instruction_shown_session";
const STORE_OPEN_KEY = "manny_store_open_part";

/* =========================
   DOM references & create missing nodes
   ========================= */
const pillOptions = Array.from(document.querySelectorAll(".pill-option"));
const pill = document.querySelector(".pill");
const dropdownMenu = document.querySelector(".selector-dropdown select");
const filterLabel = document.querySelector("#filter-dropdown");
const hamburger = document.querySelector(".hamburger");
const mobileSidebar = document.getElementById("mobileSidebar");
const mobileCloseButton = document.querySelector(".mobile-close");
const modeOptions = Array.from(document.querySelectorAll(".mode-option"));
const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".btn-primary");
const categoriesSection = document.querySelector(".categories");
const categoriesGrid = document.querySelector(".categories-grid");
const identifiersSection = document.querySelector(".identifiers");
const searchRow = document.querySelector(".search-row");

/* results section */
let resultsSection = document.getElementById("results-section");
if (!resultsSection) {
  resultsSection = document.createElement("section");
  resultsSection.id = "results-section";
  resultsSection.className = "results-section page-inner";
  const insertAfter = searchRow ?? document.querySelector("main .page-inner");
  if (insertAfter && insertAfter.parentNode) insertAfter.parentNode.insertBefore(resultsSection, insertAfter.nextSibling);
  else document.querySelector("main")?.appendChild(resultsSection);
}

/* details modal (create or reuse) */
let detailsModal = document.getElementById("details-modal");
if (!detailsModal) {
  detailsModal = document.createElement("div");
  detailsModal.id = "details-modal";
  detailsModal.className = "modal hidden";
  detailsModal.innerHTML = `
    <div class="modal-backdrop"></div>
    <div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="details-modal-title">
      <header style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
        <h2 id="details-modal-title">Part</h2>
        <button class="modal-close">✕</button>
      </header>
      <div class="modal-body"></div>
      <footer style="display:flex;gap:10px;justify-content:flex-end;">
        <button class="modal-close">Close</button>
      </footer>
    </div>
  `;
  document.body.appendChild(detailsModal);
}

/* instruction modal */
let instructionModal = document.getElementById("instruction-modal");
if (!instructionModal) {
  instructionModal = document.createElement("div");
  instructionModal.id = "instruction-modal";
  instructionModal.className = "modal hidden";
  instructionModal.innerHTML = `
    <div class="modal-backdrop"></div>
    <div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="instruction-modal-title">
      <header><h2 id="instruction-modal-title">Quick tip</h2></header>
      <div class="modal-body">
        Click any result card to view full details. Use the tabs to switch between General Info and Specs.
      </div>
      <footer>
        <button class="instruction-ok">Ok</button>
      </footer>
    </div>
  `;
  document.body.appendChild(instructionModal);
}

/* confirmation modal */
function ensureConfirmModal() {
  let conf = document.getElementById("confirm-modal");
  if (!conf) {
    conf = document.createElement("div");
    conf.id = "confirm-modal";
    conf.className = "modal";
    conf.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-panel" role="dialog" aria-modal="true">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <h3 class="modal-title">Confirm</h3>
          <button class="modal-close">✕</button>
        </div>
        <div class="confirm-body" style="margin-top:12px"></div>
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px">
          <button class="btn-secondary" data-action="cancel">Cancel</button>
          <button class="btn-order" data-action="confirm">Save</button>
        </div>
      </div>
    `;
    document.body.appendChild(conf);
    conf.querySelectorAll(".modal-close").forEach(b => b.addEventListener("click", () => closeModal(conf)));
  }
  return conf;
}

/* =========================
   Small helpers
   ========================= */
function normalize(s = "") { return String(s).toLowerCase().trim(); }
function escapeHtml(s = "") { return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;"); }
function formatNumber(n){ return Number(n).toLocaleString(); }
function openModal(el){ el.classList.remove("hidden"); document.body.classList.add("modal-open"); }
function closeModal(el){ el.classList.add("hidden"); const anyOpen = document.querySelectorAll(".modal:not(.hidden)").length > 0; if (!anyOpen) document.body.classList.remove("modal-open"); }

/* =========================
   Placeholder typewriter (from search.js)
   ========================= */
const PLACEHOLDER_WORDS = [
  "name (eg: brake pads)",
  "OEM number (eg: 27121-4A000)",
  "keywords (eg: wheel bearing)"
];
let placeholderTimer = null;
function startPlaceholderTypewriter(inputEl, words = PLACEHOLDER_WORDS, speed = 100, pause = 1400) {
  if (!inputEl) return;
  let wi = 0, ci = 0, deleting = false;
  inputEl.setAttribute('placeholder','');
  function tick() {
    const w = words[wi] || '';
    if (!deleting) {
      ci++;
      inputEl.setAttribute('placeholder', w.substring(0, ci) + (ci < w.length ? '|' : ''));
      if (ci >= w.length) { setTimeout(()=>{ deleting = true; tick(); }, pause); return; }
    } else {
      ci--;
      inputEl.setAttribute('placeholder', w.substring(0, ci) + (ci ? '|' : ''));
      if (ci <= 0) { deleting = false; wi = (wi+1) % words.length; }
    }
    placeholderTimer = setTimeout(tick, deleting ? speed/2 : speed);
  }
  tick();
  const stopFn = () => stopPlaceholderTypewriter(inputEl);
  inputEl.addEventListener('focus', stopFn, { once:true });
  inputEl.addEventListener('input', stopFn, { once:true });
  return () => stopPlaceholderTypewriter(inputEl);
}
function stopPlaceholderTypewriter(inputEl){
  if (placeholderTimer) { clearTimeout(placeholderTimer); placeholderTimer = null; }
  if (inputEl) inputEl.setAttribute('placeholder','');
}


async function getPartInfo(partId, brand, model, year) {
  let queryParams = [];

  if (brand) queryParams.push(`?brand=${brand}`);
  if (model) queryParams.push(`model=${model}`);
  if (year) queryParams.push(`year=${year}`);
  
  const queryParamString = queryParams.join("&");
  
  const res = await fetch(
    `http://localhost:4000/search/${partId}/info${queryParamString}`
  );
  const info = await res.json();
  return info;
}

/* =========================
   Search algorithm (from search2.js)
   ========================= */
async function searchParts(query) {
  const q = normalize(query);
  if (!q) return [];
  
   let queryParams = [`${query}`];

  if (selectedBrand) queryParams.push(`brand=${selectedBrand}`);
  if (selectedModel) queryParams.push(`model=${selectedModel}`);
  if (selectedYear) queryParams.push(`year=${selectedYear}`);
  
  const queryString = queryParams.join("&");
  console.log(queryString)
  
  let parts;
  
  if (queryString) {
    const res = await fetch(`http://localhost:4000/search?${queryString}`);
    parts = await res.json();
  }
  
  const results = parts
    .map((part) => {
      let score = 0;
      const nName = normalize(part.name || "");
      const nCategory = normalize(part.category || "");
      const nDesc = normalize(part.description || "");
      const nOem = (part.oem || []).map(normalize);
      const nKeywords = (part.tags || []).map(normalize);

      if (nName.includes(q)) score += 40;
      if (nCategory.includes(q)) score += 20;
      if (nDesc.includes(q)) score += 10;
      if (nOem.some(o => o.includes(q))) score += 50;
      if (nKeywords.some(k => k.includes(q))) score += 25;

      const qTokens = q.split(/\s+/);
      qTokens.forEach(token => {
        if (token && nName.split(/\s+/).includes(token)) score += 5;
      });

      return { part, score };
    })
    .filter(item => item.score > 0)
    .sort((a,b) => b.score - a.score)
    .map(item => item.part);
  
  return results;
}

/* =========================
   Result card creation (no buttons, no compat)
   ========================= */
function createResultCard(part) {

 function checkAvailability(part) {
  let inStock = 0;
  let lowStock = 0;
  let outOfStock = 0;

  for (const variant of part.compatibilities) {
    const availability = variant.availability;

    if (availability === "In Stock") {
      inStock += 1;
    } else if (availability === "Low Stock") {
      lowStock += 1;
    } else {
      outOfStock += 1;
    }
  }

  if (inStock > lowStock && inStock > outOfStock) {
    return "In Stock";
  } else if (lowStock > inStock && lowStock > outOfStock) {
    return "Low Stock";
  } else {
    return "Out Of Stock";
  }
 }
 
  const card = document.createElement("article");
  card.className = "result-card";
  card.dataset.partId = String(part.id);

  // image handling: allow string or part.image
  const imgSrc = part.image_url
  const imgAlt = part.image_label
  card.innerHTML = `
    <div class="card-media">
      <img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(imgAlt)} image" onerror="this.onerror=null;this.src='images/placeholder.png'">
    </div>
    <div class="card-body">
      <h3 class="card-title">${escapeHtml(part.name)}</h3>
      <p class="card-desc">${escapeHtml(part.description || "")}</p>
      <div class="card-meta">
        <span class="availability ${availabilityClass(checkAvailability(part))}">${checkAvailability(part)}</span>
      </div>
    </div>
  `;

  // open details modal on entire card click
  card.addEventListener("click", async () => {
    //openDetailsModalForPart(part.id);

    const brand = part.brand || ""; // adjust based on your data
      const model = part.model || ""; // adjust based on your data
      const year = part.year || "";   // adjust based on your data

      const info = await getPartInfo(part.id, brand, model, year);
      showPartInfoModal(info, imgSrc, imgAlt);
  });

  return card;
}

function availabilityClass(availability) {
 const availabilityClass = availability.toLowerCase().replace(/\s+/g, "-");
 return availabilityClass
}

/* =========================
   Pagination & render results (merged)
   ========================= */
const state = { lastResults: [], page: 1, pageSize: PAGE_SIZE };

function clearResults() { resultsSection.innerHTML = ""; }

function renderResults(fullResults) {
  state.lastResults = Array.isArray(fullResults) ? fullResults.slice() : [];
  const totalPages = Math.max(1, Math.ceil(state.lastResults.length / state.pageSize));
  if (state.page > totalPages) state.page = totalPages;
  if (state.page < 1) state.page = 1;
  clearResults();

  const header = document.createElement("div");
  header.className = "results-header";
  header.innerHTML = `<h2>Search results (${state.lastResults.length})</h2>`;
  resultsSection.appendChild(header);

  if (!state.lastResults.length) {
    const noResults = document.createElement("div");
    noResults.className = "no-results";
    noResults.innerHTML = `<p>No parts found for your search. Try keywords, OEM number, or part category.</p>`;
    resultsSection.appendChild(noResults);
    renderPaginationControls();
    return;
  }

  const start = (state.page - 1) * state.pageSize;
  const end = start + state.pageSize;
  const pageItems = state.lastResults.slice(start, end);

  const grid = document.createElement("div");
  grid.className = "results-grid";
  pageItems.forEach(part => grid.appendChild(createResultCard(part)));
  resultsSection.appendChild(grid);

  renderPaginationControls();
  scrollToResultsTop();

  // instruction modal show once
  const resultsExist = state.lastResults.length > 0;
  const alreadyShown = sessionStorage.getItem(INSTRUCTION_SHOWN_KEY) === "true";
  if (resultsExist && !alreadyShown) {
    setTimeout(()=> {
      openModal(instructionModal);
      try { sessionStorage.setItem(INSTRUCTION_SHOWN_KEY, "true"); } catch(e){}
    }, 900);
  }
}

function renderPaginationControls() {
  const total = state.lastResults.length;
  const pageSize = state.pageSize;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const existing = resultsSection.querySelector(".pagination");
  if (existing) existing.remove();
  if (totalPages <= 1) return;

  const pagination = document.createElement("div");
  pagination.className = "pagination";
  const nav = document.createElement("nav");
  nav.className = "pager";
  nav.setAttribute("aria-label","Pagination");

  const prev = document.createElement("button");
  prev.className = "pager-btn prev";
  prev.type = "button";
  prev.textContent = "Prev";
  prev.disabled = state.page <= 1;
  prev.addEventListener("click", () => {
    if (state.page <= 1) return;
    state.page = Math.max(1, state.page - 1);
    renderResults(state.lastResults);
  });
  nav.appendChild(prev);

  const maxButtons = 7;
  let startPage = Math.max(1, state.page - 3);
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);
  if (endPage - startPage + 1 < maxButtons) startPage = Math.max(1, endPage - maxButtons + 1);

  if (startPage > 1) { nav.appendChild(makePageButton(1)); if (startPage > 2) nav.appendChild(makeDots()); }
  for (let p = startPage; p <= endPage; p++) nav.appendChild(makePageButton(p));
  if (endPage < totalPages) { if (endPage < totalPages - 1) nav.appendChild(makeDots()); nav.appendChild(makePageButton(totalPages)); }

  const next = document.createElement("button");
  next.className = "pager-btn next";
  next.type = "button";
  next.textContent = "Next";
  next.disabled = state.page >= totalPages;
  next.addEventListener("click", () => {
    if (state.page >= totalPages) return;
    state.page = Math.min(totalPages, state.page + 1);
    renderResults(state.lastResults);
  });
  nav.appendChild(next);

  pagination.appendChild(nav);
  resultsSection.appendChild(pagination);

  function makePageButton(p) {
    const btn = document.createElement("button");
    btn.className = `pager-num ${p === state.page ? "active" : ""}`;
    btn.type = "button";
    btn.textContent = String(p);
    btn.addEventListener("click", () => {
      if (p === state.page) return;
      state.page = p;
      renderResults(state.lastResults);
    });
    return btn;
  }
  function makeDots() { const span = document.createElement("span"); span.className = "dots"; span.textContent = "…"; return span; }
}

function scrollToResultsTop() { if (resultsSection) resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' }); }

/* =========================
   Category mode
   ========================= */

function renderCategoryCards(){
  if (!categoriesGrid) return;
  categoriesGrid.innerHTML = "";
  const categories = autoParts;
  for (const category of autoParts) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "category-card category-card-btn";
    btn.dataset.category = category.category;
    btn.innerHTML = `
      <div class="cat-title" style="font-weight:700;color:#0B3B6F;">${escapeHtml(category.category)}</div>
      <div class="cat-count" style="font-size:13px;color:#6b7a89;">${category.numberOfParts} items</div>
    `;
    categoriesGrid.appendChild(btn);
  }
}

function showIdentifiersMode() {
  if (identifiersSection) identifiersSection.style.display = "";
  if (searchRow) searchRow.style.display = "";
  if (categoriesSection) categoriesSection.style.display = "none";
  resultsSection.style.display = ""; // results available
}
function showCategoryMode() {
  if (identifiersSection) identifiersSection.style.display = "none";
  if (searchRow) searchRow.style.display = "none";
  if (categoriesSection) categoriesSection.style.display = "";
  renderCategoryCards();
  resultsSection.innerHTML = "";
}

/* categories click delegation */
if (categoriesGrid) {
  categoriesGrid.addEventListener("click", async (e) => {
    const btn = e.target.closest(".category-card-btn");
    if (!btn) return;
    const category = btn.dataset.category;
    if (!category) return;
    const parts = await fetch(`http://localhost:4000/search?category=${category}`)
    .then(res => res.json())
    renderPartsList(parts, category);
    if (categoriesSection) categoriesSection.style.display = "none";
    identifiersSection.style.display = "block"
    resultsSection.style.display = "";
    resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

/* helper to render parts list (used when clicking a category) */
function renderPartsList(parts = [], categoryName = "") {
  // hide the top hints in identifiers section for clarity
  if (identifiersSection) {
    const h1 = identifiersSection.querySelector("h1");
    const p = identifiersSection.querySelector("p");
    if (h1) h1.style.display = "none";
    if (p) p.style.display = "none";
  }
  // show a header bar if categoryName (we'll keep it simple and show in results)
  resultsSection.innerHTML = "";
  const header = document.createElement("div");
  header.className = "results-header";
  header.innerHTML = `
   <div>
    <button class="back-button">« Back</button>
    <h1>${categoryName}</h1>
   </div>
   <h2>Search results (${parts.length})</h2>`;
  resultsSection.appendChild(header);
  
  document.querySelector(".back-button").addEventListener("click", ()=>{
   showCategoryMode()
  })

  if (!parts.length) {
    const noRes = document.createElement("div");
    noRes.className = "no-results";
    noRes.innerHTML = `<p>No parts found in this category.</p>`;
    resultsSection.appendChild(noRes);
    return;
  }

  const grid = document.createElement("div");
  grid.className = "results-grid";
  parts.forEach(p => grid.appendChild(createResultCard(p)));
  resultsSection.appendChild(grid);
}

/* =========================
   Details modal & tabs + Quick Order
   ========================= */
// function openDetailsModalForPart(partId) {
//   const part = autoParts.find(p => String(p.id) === String(partId));
//   if (!part) return;
//   const panel = detailsModal.querySelector(".modal-panel");
//   const body = detailsModal.querySelector(".modal-body");

//   // make modal-panel visually large (nearly full screen)
//   panel.style.maxWidth = "min(1100px, 96vw)";
//   panel.style.width = "96vw";
//   panel.style.maxHeight = "94vh";
//   panel.style.padding = "14px";

//   // content: header with tabs, then container for tab contents, then action buttons
//   body.innerHTML = `
//     <div class="details-top" style="display:flex;gap:12px;align-items:flex-start;flex-direction:column;">
//       <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;width:100%;flex-wrap:wrap">
//         <div style="display:flex;gap:12px;align-items:center">
//           <div style="font-weight:800;font-size:18px;color:#0B3B6F">${escapeHtml(part.name)}</div>
//           <div style="color:#6b7a89">${escapeHtml(part.category || "")}</div>
//         </div>
//         <div style="display:flex;gap:8px;align-items:center">
//           <button class="btn btn-secondary goto-store">Go To Store</button>
//           <button class="btn btn-primary quick-order">Place Quick Order</button>
//         </div>
//       </div>

//       <div class="details-tabs" style="margin-top:12px;display:flex;gap:8px;">
//         <button class="tab-btn active" data-tab="general">General Info</button>
//         <button class="tab-btn" data-tab="specs">Specs</button>
//       </div>

//       <div class="tab-contents" style="width:100%;margin-top:12px;">
//         <div class="tab-pane" data-tab="general" style="display:block">
//           <div class="general-grid">
//             <div class="image-panel" style="border-radius:8px;overflow:hidden;background:#f5f7fa;">
//               <!-- image slot populated below -->
//             </div>
//             <div class="general-info" style="display:flex;flex-direction:column;gap:8px;">
//               <div class="gi-desc" style="color:#0B2A44">${escapeHtml(part.description || "")}</div><br>
              
//               <div><strong>Availability:</strong> <span class="${availabilityClass(part.availability)}">${ escapeHtml(part.availability || "")}</span></div><br>
              
//               <div><strong>Price:</strong> ${formatNumber(part.price || 0)} FCFA</div><br>
              
//               <div class="more-general"></div><br>
//             </div>
//           </div>
//         </div>

//         <div class="tab-pane" data-tab="specs" style="display:none">
//           <div class="specs-list" style="display:block"></div>
//         </div>
//       </div>
//     </div>
//   `;

//   // populate image area (support string or array)
//   const imagePanel = body.querySelector(".image-panel");
//   const images = Array.isArray(part.image) ? part.image.slice() : (part.image ? [part.image] : []);
//   const imgIndexState = { i: 0 };
//   function renderImagePanel() {
//     imagePanel.innerHTML = "";
//     const imgWrap = document.createElement("div");
//     imgWrap.style.position = "relative";
//     imgWrap.style.display = "flex";
//     imgWrap.style.alignItems = "center";
//     imgWrap.style.justifyContent = "center";
//     imgWrap.style.height = "100%";
//     imgWrap.innerHTML = `
//       <img src="${escapeHtml(images[imgIndexState.i] || 'images/placeholder.png')}" style="width:100%;height:360px;object-fit:cover;display:block" onerror="this.onerror=null;this.src='images/placeholder.png'"/><br>
//     `;
//     // arrows if multiple images
//     if (images.length > 1) {
//       const left = document.createElement("button");
//       left.className = "img-arrow left";
//       left.style.position = "absolute";
//       left.style.left = "8px";
//       left.style.top = "50%";
//       left.style.transform = "translateY(-50%)";
//       left.textContent = "◀";
//       left.style.background = "rgba(0,0,0,0.12)";
//       left.style.color = "#fff";
//       left.style.border = "0";
//       left.style.width = "36px";
//       left.style.height = "36px";
//       left.style.borderRadius = "50%";
//       left.addEventListener("click", (ev) => {
//         ev.stopPropagation();
//         if (imgIndexState.i > 0) { imgIndexState.i--; renderImagePanel(); }
//       });
//       const right = document.createElement("button");
//       right.className = "img-arrow right";
//       right.style.position = "absolute";
//       right.style.right = "8px";
//       right.style.top = "50%";
//       right.style.transform = "translateY(-50%)";
//       right.textContent = "▶";
//       right.style.background = "rgba(0,0,0,0.12)";
//       right.style.color = "#fff";
//       right.style.border = "0";
//       right.style.width = "36px";
//       right.style.height = "36px";
//       right.style.borderRadius = "50%";
//       right.addEventListener("click", (ev) => {
//         ev.stopPropagation();
//         if (imgIndexState.i < images.length - 1) { imgIndexState.i++; renderImagePanel(); }
//       });
//       imgWrap.appendChild(left);
//       imgWrap.appendChild(right);
//     }
//     imagePanel.appendChild(imgWrap);
//   }
//   renderImagePanel();


//   // Helper: convert camelCase or snake_case to Title Case
//   function formatKey(key) {
//     return key
//       // convert camelCase to space-separated
//       .replace(/([a-z])([A-Z])/g, "$1 $2")
//       // replace underscores with space
//       .replace(/_/g, " ")
//       // capitalize first letter of each word
//       .replace(/\b\w/g, char => char.toUpperCase());
//   }
 
//   // Render General Info
//   const moreGeneral = body.querySelector(".more-general");
//   const generalInfo = part.general; // the object you provided
//   moreGeneral.innerHTML = ""; // clear previous content
 
//   if (generalInfo && typeof generalInfo === "object") {
//     Object.keys(generalInfo).forEach((key) => {
//       const value = generalInfo[key];
//       if (value !== undefined && value !== null && String(value).trim() !== "") {
//         const div = document.createElement("div");
  
//         if (Array.isArray(value)) {
//           div.innerHTML = `<strong>${escapeHtml(formatKey(key))}:</strong> ${value.map(v => escapeHtml(String(v))).join(", ")}`;
//         } else if (typeof value === "object") {
//           const items = Object.keys(value)
//             .map(subKey => `${escapeHtml(formatKey(subKey))}: ${escapeHtml(String(value[subKey]))}`)
//             .join(" · ");
//           div.innerHTML = `<strong>${escapeHtml(formatKey(key))}:</strong> ${items}`;
//         } else {
//           div.innerHTML = `<strong>${escapeHtml(formatKey(key))}:</strong> ${escapeHtml(String(value))}`;
//         }
  
//         const br = document.createElement("br")
//         moreGeneral.appendChild(div);
//         moreGeneral.appendChild(br)
//       }
//     });
//   }


//   // populate specs list (assume part.specs as object or array)
//   const specsList = body.querySelector(".specs-list");
//   if (Array.isArray(part.specs)) {
//     specsList.innerHTML = `<ul>${part.specs.map(s => `<li>${escapeHtml(String(s))}</li>`).join("")}</ul>`;
//   } else if (part.specs && typeof part.specs === "object") {
//     specsList.innerHTML = `<dl style="display:grid;grid-template-columns: 1fr 1fr;gap:8px">${Object.keys(part.specs).map(k => `<dt style="font-weight:700">${escapeHtml(formatKey(k))}</dt><dd>${escapeHtml(String(part.specs[k]))}</dd>`).join("")}</dl>`;
//   } else {
//     specsList.innerHTML = `<div style="color:#6b7a89">No specs available.</div>`;
//   }

//   // tab switching
//   body.querySelectorAll(".tab-btn").forEach(btn => {
//     btn.addEventListener("click", () => {
//       body.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
//       btn.classList.add("active");
//       const tab = btn.dataset.tab;
//       body.querySelectorAll(".tab-pane").forEach(p => p.style.display = (p.dataset.tab === tab ? "block" : "none"));
//     });
//   });

//   // Go To Store
//   body.querySelector(".goto-store")?.addEventListener("click", () => {
//     try { sessionStorage.setItem(STORE_OPEN_KEY, String(part.id)); } catch (e) {}
//     // navigate to store page (update relative path if needed)
//     window.location.href = "../Store/store.html";
//   });

//   // Quick Order flow (select brand->model->year inside modal)
//   // Quick Order flow (single panel, populates from variants or compatibilities)
// body.querySelector(".quick-order")?.addEventListener("click", () => {
//   // if panel already exists, focus/scroll to it instead of creating another
//   const existing = body.querySelector(".quick-order-panel");
//   if (existing) {
//     existing.scrollIntoView({ behavior: "smooth", block: "center" });
//     return;
//   }

//   const container = document.createElement("div");
//   container.className = "quick-order-panel";
//   container.style.marginTop = "12px";
//   container.innerHTML = `
//     <div style="display:grid;gap:10px">
//       <div><strong>Quick Order</strong></div>
//       <div style="display:flex;gap:8px;flex-wrap:wrap">
//         <select class="qo-brand"><option value="">Select brand</option></select>
//         <select class="qo-model"><option value="">Select model</option></select>
//         <select class="qo-year" style="display:none"><option value="">Select year</option></select>
//       </div>
//       <div class="qo-warning" style="color:#b00000"></div>
//       <div style="display:flex;gap:8px;justify-content:flex-end">
//         <button class="btn-secondary qo-cancel">Cancel</button>
//         <button class="btn btn-primary qo-send">Send Order</button>
//       </div>
//     </div>
//   `;
//   body.querySelector(".details-top").appendChild(container);
//   container.scrollIntoView({ behavior: "smooth", block: "center" });

//   const selBrand = container.querySelector(".qo-brand");
//   const selModel = container.querySelector(".qo-model");
//   const selYear = container.querySelector(".qo-year");
//   const warn = container.querySelector(".qo-warning");

//   // build variant data: prefer part.variants, else fallback to compatibilities
//   const variants = Array.isArray(part.variants) && part.variants.length ? part.variants.slice() : [];
//   if (!variants.length && Array.isArray(part.compatibilities)) {
//     // convert compatibilities to pseudo-variants with placeholder price/year
//     part.compatibilities.forEach(c => {
//       variants.push({ brand: c.brand || "", model: c.model || "", year: (Array.isArray(c.years) ? c.years[0] : c.years) || "" , price: part.price || 0 });
//     });
//   }

//   // map brands -> models -> years
//   const modelsByBrand = {};
//   const yearsByBm = {};
//   const brandsSet = new Set();
//   variants.forEach(v => {
//     const b = v.brand || "";
//     const m = v.model || "";
//     const y = v.year || "";
//     brandsSet.add(b);
//     if (!modelsByBrand[b]) modelsByBrand[b] = new Set();
//     if (m) modelsByBrand[b].add(m);
//     const key = `${b}___${m}`;
//     if (!yearsByBm[key]) yearsByBm[key] = new Set();
//     if (y) yearsByBm[key].add(y);
//   });

//   const brands = Array.from(brandsSet).filter(Boolean).sort();
//   brands.forEach(b => selBrand.insertAdjacentHTML("beforeend", `<option value="${escapeHtml(b)}">${escapeHtml(b)}</option>`));
//   function populateModelsForBrand(b) {
//     selModel.innerHTML = `<option value="">Select model</option>`;
//     selYear.style.display = "none";
//     (Array.from(modelsByBrand[b] || [])).sort().forEach(m => selModel.insertAdjacentHTML("beforeend", `<option value="${escapeHtml(m)}">${escapeHtml(m)}</option>`));
//   }
//   function populateYearsFor(b,m) {
//     selYear.innerHTML = `<option value="">Select year</option>`;
//     const arr = Array.from(yearsByBm[`${b}___${m}`] || []).sort();
//     arr.forEach(y => selYear.insertAdjacentHTML("beforeend", `<option value="${escapeHtml(y)}">${escapeHtml(y)}</option>`));
//     selYear.style.display = arr.length ? "inline-block" : "none";
//   }

//   selBrand.addEventListener("change", () => { populateModelsForBrand(selBrand.value); warn.textContent = ""; });
//   selModel.addEventListener("change", () => { populateYearsFor(selBrand.value, selModel.value); warn.textContent = ""; });

//   container.querySelector(".qo-cancel").addEventListener("click", () => container.remove());

//   container.querySelector(".qo-send").addEventListener("click", () => {
//     const brand = selBrand.value || null;
//     const model = selModel.value || null;
//     const year = (selYear.style.display !== "none" && selYear.value) ? selYear.value : null;
//     if (!brand || !model || !year) { warn.textContent = "Please select brand, model and year."; return; }

//     // find the best matching variant if possible (match all three)
//     const chosen = variants.find(v => String(v.brand) === String(brand) && String(v.model) === String(model) && String(v.year) === String(year))
//                    || { price: part.price || 0, brand, model, year };

//     const msg = [
//       `Hello, I want to place a quick order on Manny Autos. \n \n`,
//       `Part: ${part.name} \n`,
//       `Variant: ${chosen.brand} ${chosen.model} — ${chosen.year} \n`,
//       `Qty: 1 \n`,
//       `Price: ${formatNumber(chosen.price)} FCFA \n`,
//       ``,
//       `Please confirm availability and delivery options.`
//     ].join("\n");
//     const encoded = encodeURIComponent(msg);
//     const waUrl = WHATSAPP_PHONE ? `https://wa.me/${WHATSAPP_PHONE.replace(/\D/g,"")}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
//     window.open(waUrl, "_blank");
//     closeModal(detailsModal);
//   });
// });

//   openModal(detailsModal);
// }


// Function to generate dynamic tabs and display part info
function showPartInfoModal(info, imgSrc, imgAlt) {
  const modal = document.createElement("div");
  modal.classList.add("info-modal");

  modal.innerHTML = `
    <div class="modal-overlay"></div>

    <div class="modal-content">
      <div class="modal-header">
        <h2>${info.name}</h2>
        <span class="close-btn">&times;</span>
      </div>

      <div class="modal-body">

        <div class="info-top">
          <div class="info-image">
            <img src="${imgSrc}" alt="${imgAlt}">
          </div>

          <div class="info-actions">
            <button class="btn btn-secondary goto-store-btn">Go To Store</button>
            <button class="btn btn-primary quick-order-btn">Place Quick Order</button>
          </div>
        </div>

        <div class="tabs"></div>
        <div class="tab-content"></div>

      </div>
    </div>
  `;

  document.body.appendChild(modal);
  
  const quickOrderBtn = document.querySelector(".quick-order-btn")
  const gotoStoreBtn = document.querySelector(".goto-store-btn")
  
  quickOrderBtn.addEventListener("click", ()=>{
   const panelExist = document.querySelector(".quick-order-panel")
   if (panelExist){
    return
   }
   
   const quickOrderPanel = document.createElement("div")
   quickOrderPanel.classList.add("quick-order-panel")
    quickOrderPanel.innerHTML = `
     <div class="quick-order">
      <select class="brand-select">
       <option value="">Select Brand</option>
      </select>
      <select class="model-select">
       <option value="">Select Model</option>
      </select>
      <select class="year-select">
       <option value="">Select Year</option>
      </select>
     </div>
    `
    // to populate brand and model dropdowns
    const brandSelect = quickOrderPanel.querySelector(".brand-select")
    const modelSelect = quickOrderPanel.querySelector(".model-select")
    const yearSelect = quickOrderPanel.querySelector(".year-select")
    loadBrandOptions(brandSelect)
    loadModelOptions(modelSelect)
    
    // to filter model and year dropdowns after the predecessor is selected
    brandSelect.addEventListener("change", ()=>{
     const selectedBrand = brandSelect.value
     filterModelOptions(modelSelect, selectedBrand)
    })
    modelSelect.addEventListener("change", ()=>{
     const selectedBrand = brandSelect.value;
     const selectedModel = modelSelect.value;
     filterYearOptions(yearSelect, selectedBrand, selectedModel)
    })
    
    //creates quick order button
    yearSelect.addEventListener("change", ()=>{
     const orderBtn = document.createElement("button")
     orderBtn.classList.add("btn-primary")
     orderBtn.addEventListener("click", ()=>{
      placeQuickOrder(brandSelect.value, modelSelect.value, yearSelect.value)
     })
     orderBtn.textContent = "Order"
     quickOrderPanel.appendChild(orderBtn)
    })
   
   document.querySelector(".modal-content").appendChild(quickOrderPanel)
   quickOrderPanel.scrollIntoView({behaviour: "smooth"})
  })

  const tabsContainer = modal.querySelector(".tabs");
  const tabContent = modal.querySelector(".tab-content");

  info.categories.forEach((category, index) => {
    const tabBtn = document.createElement("button");
    tabBtn.textContent = category.name;
    tabBtn.classList.add("tab-btn");
    if (index === 0) tabBtn.classList.add("active");

    tabBtn.addEventListener("click", () => {
      modal.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
      tabBtn.classList.add("active");
      renderTabContent(category);
    });

    tabsContainer.appendChild(tabBtn);
  });

  renderTabContent(info.categories[0]);

  function renderTabContent(category) {
    tabContent.innerHTML = "";
    category.fields.forEach(field => {
      const fieldDiv = document.createElement("div");
      fieldDiv.classList.add("field-item");
      fieldDiv.innerHTML = `<strong>${field.name}:</strong> ${field.value || "N/A"}`;
      tabContent.appendChild(fieldDiv);
    });
  }
  
  function placeQuickOrder(brand, model, year){
   const msg = [
    `Hello, I want to place a quick order on Manny Autos for the ${info.name} of ${year} ${brand} ${model}. \n \n`,
    `Please confirm availability, price and delivery options.`
   ].join("\n");
   const encoded = encodeURIComponent(msg); 
   const waUrl = WHATSAPP_PHONE ? `https://wa.me/${WHATSAPP_PHONE.replace(/\D/g,"")}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
   window.open(waUrl, "_blank");
  }

  modal.querySelector(".close-btn").addEventListener("click", () => {
    modal.remove();
  });

  modal.querySelector(".modal-overlay").addEventListener("click", () => {
    modal.remove();
  });
}

/* =========================
   Event wiring: search button, live search
   ========================= */
if (searchButton) {
  searchButton.addEventListener("click", async (e) => {
    e.preventDefault();
    state.page = 1;
    const q = searchInput?.value ?? "";
    const results = await searchParts(q);
    renderResults(results);
  });
}
let debounceTimer = null;
if (searchInput) {
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); state.page = 1; renderResults(searchParts(searchInput.value)); }
  });
  searchInput.addEventListener("input", ()=> {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async ()=> { state.page = 1; renderResults(await searchParts(searchInput.value)); }, 450);
  });
}

/* =========================
   Placeholder & initializations
   ========================= */
if (searchInput) startPlaceholderTypewriter(searchInput, PLACEHOLDER_WORDS, 90, 1300);

/* =========================
   Header mode switching (Identifiers <-> Category)
   ========================= */
modeOptions.forEach(btn => {
  btn.addEventListener("click", () => {
    const txt = (btn.textContent || btn.innerText || "").toLowerCase();
    if (txt.includes("category")) showCategoryMode(); else showIdentifiersMode();
    mobileSidebar.classList.remove("open");
    mobileSidebar.setAttribute("aria-hidden","true");
  });
});

/* =========================
   Categories back button (if present in other script)
   ========================= */
/* search3.js had a results header bar with .back-to-cats — handle if present */
document.addEventListener("click", (e) => {
  const b = e.target.closest(".back-to-cats");
  if (!b) return;
  // restore categories UI
  resultsSection.innerHTML = "";
  resultsSection.style.display = "none";
  const resultsHeaderBar = document.getElementById("results-header-bar");
  if (resultsHeaderBar) resultsHeaderBar.style.display = "none";
  if (categoriesSection) categoriesSection.style.display = "";
  renderCategoryCards();
});

/* =========================
   Category-card click handled earlier; resultsSection delegation already used
   ========================= */

/* =========================
   Modal close & instruction modal handlers
   ========================= */
document.addEventListener("click", (e) => {
  if (e.target.matches(".modal-close")) {
    const modal = e.target.closest(".modal");
    if (modal) closeModal(modal);
  }
  if (e.target.matches(".instruction-ok")) closeModal(instructionModal);
  if (e.target.classList && e.target.classList.contains("modal-backdrop")) {
    const parent = e.target.parentElement;
    if (parent && parent.id === "details-modal") closeModal(detailsModal);
    if (parent && parent.id === "instruction-modal") closeModal(instructionModal);
  }
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { document.querySelectorAll(".modal:not(.hidden)").forEach(m => closeModal(m)); } });

/* =========================
   Small UI: mobile sidebar & hamburger
   ========================= */
if (hamburger && mobileSidebar) {
  hamburger.addEventListener("click", () => { mobileSidebar.classList.add("open"); mobileSidebar.setAttribute("aria-hidden","false"); });
}
if (mobileCloseButton && mobileSidebar) {
  mobileCloseButton.addEventListener("click", () => { mobileSidebar.classList.remove("open"); mobileSidebar.setAttribute("aria-hidden","true"); });
}

/* =========================
   Hook up categoriesGrid render & initial mode
   ========================= */
if (categoriesGrid) renderCategoryCards();
showIdentifiersMode();

/* =========================
   Result-card delegation fallback (if any other dynamic generation)
   ========================= */
resultsSection.addEventListener("click", (e) => {
  const card = e.target.closest(".result-card");
  if (!card) return;
  const id = Number(card.dataset.partId);
  const part = autoParts.find(p => p.id === id);
  if (!part) return;
  // open modal
  openDetailsModalForPart(id);
});

/* =========================
   Expose small debug API
   ========================= */
window.mannySearch = {
  renderResults,
  searchParts,
  //openDetailsModalForPart,
  autoParts
};



/* =========================
    Corrections to the initial script
======================== */

/* -------------------------
   Pill selector helpers (restores behavior from search.js)
   Uses carData from data.js (already imported)
   ------------------------- */
let selectedBrand = null;
let selectedModel = null;
let selectedYear = null;
const placeholderOption = "<option disabled selected>Select</option>";

function loadBrandOptions(selectElement) {
  if (!dropdownMenu) return;
  selectElement.innerHTML = placeholderOption;
  (carData || []).forEach(b => {
    const opt = document.createElement("option");
    opt.value = b.brand;
    opt.textContent = b.brand;
    selectElement.appendChild(opt);
  });
}

function loadModelOptions(selectElement) {
  if (!dropdownMenu) return;
  selectElement.innerHTML = placeholderOption;
  (carData || []).forEach(b => {
    (b.models || []).forEach(m => {
      const opt = document.createElement("option");
      opt.value = m.name;
      opt.textContent = m.name;
      selectElement.appendChild(opt);
    });
  });
}

function filterModelOptions(selectElement, brand) {
  if (!dropdownMenu) return;
  selectElement.innerHTML = placeholderOption;
  const brObj = (carData || []).find(x => x.brand === brand);
  if (!brObj) return;
  (brObj.models || []).forEach(m => {
    const opt = document.createElement("option");
    opt.value = m.name;
    opt.textContent = m.name;
    selectElement.appendChild(opt);
  });
  pill.classList.remove("pos-0");
  pill.classList.add("pos-1");
}
function filterYearOptions(selectElement, brand, model) {
  if (!dropdownMenu) return;
  selectElement.innerHTML = placeholderOption;
  const brObj = (carData || []).find(x => x.brand === brand);
  if (!brObj) return;
  const mo = (brObj.models || []).find(x => x.name === model);
  if (!mo) return;
  (mo.years || []).forEach(y => {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    selectElement.appendChild(opt);
  });
  pill.classList.remove("pos-1");
  pill.classList.add("pos-2");
}

/* wire dropdown change to pill positions */
if (dropdownMenu) {
  dropdownMenu.addEventListener("change", () => {
    if (pill.classList.contains("pos-0")) {
      selectedBrand = dropdownMenu.value;
      filterModelOptions(dropdownMenu, selectedBrand);
    } else if (pill.classList.contains("pos-1")) {
      selectedModel = dropdownMenu.value;
      filterYearOptions(dropdownMenu, selectedBrand, selectedModel);
    } else {
      selectedYear = dropdownMenu.value;
    }
  });
}

/* restore pill option click handlers (initialization) */
if (pillOptions && pillOptions.length) {
  pillOptions.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      // remove other pos- classes
      const cls = Array.from(pill.classList).find(c => c.startsWith("pos-"));
      if (cls) pill.classList.remove(cls);
      pill.classList.add(`pos-${i}`);
      filterLabel.innerText = `Select ${btn.innerText}`;
      // pre-load options for pos-0
      if (pill.classList.contains("pos-0")) loadBrandOptions(dropdownMenu);
      else if (pill.classList.contains("pos-1")) loadModelOptions();
      else if (pill.classList.contains("pos-2")) dropdownMenu.innerHTML = placeholderOption;
    });
  });
}
/* ensure initial brand list is present */
loadBrandOptions(dropdownMenu);


/* -------------------------
   Nav mode hover with short persistence (from original search.js)
   Keeps the .mode-menu visible a few seconds after hover to allow selection
   ------------------------- */
document.querySelectorAll(".mode-text").forEach(textEl => {
  // find the associated menu (sibling .mode-menu). There may be multiple pairs (header + mobile)
  const container = textEl.closest(".nav-item") || textEl.parentElement;
  const menu = container?.querySelector(".mode-menu");
  if (!menu) return;

  let hideTimer = null;
  function showMenuTemp() {
    menu.style.display = "block";
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    // hide after 2500ms of inactivity
    hideTimer = setTimeout(() => { menu.style.display = "none"; hideTimer = null; }, 2500);
  }

  textEl.addEventListener("mouseover", () => showMenuTemp());
  // also open when mouse enters the menu itself and reset timer
  menu.addEventListener("mouseenter", () => {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    menu.style.display = "block";
  });
  menu.addEventListener("mouseleave", () => {
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(()=> menu.style.display = "none", 600);
  });

  // clicking in menu should set the text and keep hidden logic working
  menu.addEventListener("click", (e) => {
    const opt = e.target.closest(".mode-option");
    if (!opt) return;
    textEl.innerText = opt.innerText;
    menu.style.display = "none";
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
  });
});
