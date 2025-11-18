/* ============================
   Top: Variable declarations
   ============================ */

import { autoParts } from "./data.js"; // ensure your data.js exports autoParts exactly as given

// Selectors (page elements)
const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".btn-primary");

// Results container - create if missing
let resultsSection = document.getElementById("results-section");
if (!resultsSection) {
  const container = document.createElement("section");
  container.id = "results-section";
  container.className = "results-section page-inner"; // reuse page-inner for width
  // place it after .search-row if possible
  const searchRow = document.querySelector(".search-row");
  if (searchRow && searchRow.parentNode) {
    searchRow.parentNode.insertBefore(container, searchRow.nextSibling);
  } else {
    document.querySelector("main")?.appendChild(container);
  }
  resultsSection = container;
}


// Modal containers (one for details modal, one for instruction modal)
// Create them now (hidden by default)
let detailsModal = document.getElementById("details-modal");
if (!detailsModal) {
  detailsModal = document.createElement("div");
  detailsModal.id = "details-modal";
  detailsModal.className = "modal hidden";
  detailsModal.innerHTML = `
    <div class="modal-backdrop"></div>
    <div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="details-modal-title">
      <header>
        <h2 id="details-modal-title">Part details</h2>
      </header>
      <div class="modal-body">
        <!-- empty for now; filled later if needed -->
      </div>
      <footer>
        <button class="modal-close">Close</button>
      </footer>
    </div>
  `;
  document.body.appendChild(detailsModal);
}

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
        Click <strong>See Details</strong> on any result to view full compatibilities, or click <strong>Place Order</strong> to start an order on WhatsApp.
      </div>
      <footer>
        <button class="instruction-ok">Ok</button>
      </footer>
    </div>
  `;
  document.body.appendChild(instructionModal);
}

// small helper config
const WHATSAPP_PHONE = ""; // optional: put your business number in international format, without + (e.g. "2348012345678"). If empty, uses "https://wa.me/?text="
const INSTRUCTION_MODAL_DELAY_MS = 3000; // show the tip modal this many ms after a search
let instructionModalTimeout = null;

/* ============================
   Middle: Function definitions
   ============================ */

/**
 * normalize string for searching (lowercase, trim)
 */
function normalize(str = "") {
  return String(str).toLowerCase().trim();
}

/**
 * searchParts: performs a search over autoParts array.
 * Searches by: name, category, any OEM number, keywords (any), and description.
 * Returns array of matching parts (simple relevance: matches in name first, then others).
 */
function searchParts(query) {
  const q = normalize(query);
  if (!q) return [];

  // compute simple score and sort by score descending
  const results = autoParts
    .map((part) => {
      let score = 0;
      const nName = normalize(part.name);
      const nCategory = normalize(part.category);
      const nDesc = normalize(part.description || "");
      const nOem = (part.oem || []).map(normalize);
      const nKeywords = (part.keywords || []).map(normalize);

      if (nName.includes(q)) score += 40;
      if (nCategory.includes(q)) score += 20;
      if (nDesc.includes(q)) score += 10;
      if (nOem.some(o => o.includes(q))) score += 30;
      if (nKeywords.some(k => k.includes(q))) score += 25;

      // small fallback if no direct includes but token matches any word
      const qTokens = q.split(/\s+/);
      qTokens.forEach(token => {
        if (token && nName.split(/\s+/).includes(token)) score += 5;
      });

      return { part, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.part);

  return results;
}

/**
 * clearResults: remove all children from resultsSection
 */
function clearResults() {
  resultsSection.innerHTML = "";
}

/**
 * createResultCard: given a part object, build a result card DOM node and return it.
 * The card includes:
 * - image
 * - name
 * - description
 * - first compatibility summary (brand/model/years)
 * - availability tag
 * - Place Order button (opens WhatsApp with message)
 * - See Details button (opens details modal)
 */
function createResultCard(part) {
  const card = document.createElement("article");
  card.className = "result-card";
  card.dataset.partId = String(part.id);

  // simple layout container
  card.innerHTML = `
    <div class="card-media">
      <img src="${part.image}" alt="${escapeHtml(part.name)} image" onerror="this.onerror=null;this.src='images/placeholder.png'">
    </div>
    <div class="card-body">
      <h3 class="card-title">${escapeHtml(part.name)}</h3>
      <p class="card-desc">${escapeHtml(part.description)}</p>
      <p class="card-compat"><strong>Compatibility:</strong> ${formatFirstCompatibility(part)}</p>
      <div class="card-meta">
        <span class="availability ${availabilityClass(part.availability)}">${escapeHtml(part.availability)}</span>
        <span class="price">₦${formatNumber(part.price)}</span>
      </div>
      <div class="card-actions">
        <button class="btn place-order">Place Order</button>
        <button class="btn see-details">See Details</button>
      </div>
    </div>
  `;

  // attach event handlers via delegation at top-level; but we add a small data attr for the part
  return card;
}

/**
 * renderResults: given an array of parts, render them into resultsSection.
 * If no results, show a friendly message.
 */
function renderResults(parts) {
  clearResults();

  const header = document.createElement("div");
  header.className = "results-header";
  header.innerHTML = `<h2>Search results (${parts.length})</h2>`;
  resultsSection.appendChild(header);

  if (!parts || parts.length === 0) {
    const noResults = document.createElement("div");
    noResults.className = "no-results";
    noResults.innerHTML = `<p>No parts found for your search. Try keywords, OEM number, or part category.</p>`;
    resultsSection.appendChild(noResults);
    return;
  }

  const grid = document.createElement("div");
  grid.className = "results-grid";
  parts.forEach(part => {
    const card = createResultCard(part);
    grid.appendChild(card);
  });

  resultsSection.appendChild(grid);

  // show instruction modal a few seconds after presenting results (only once per search)
  if (instructionModalTimeout) clearTimeout(instructionModalTimeout);
  instructionModalTimeout = setTimeout(() => {
    openModal(instructionModal);
  }, INSTRUCTION_MODAL_DELAY_MS);
}

/* -------------------------
   Helper small utilities
   ------------------------- */

function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatFirstCompatibility(part) {
  const first = (part.compatibilities && part.compatibilities[0]) || null;
  if (!first) return "—";
  return `${escapeHtml(first.brand)} ${escapeHtml(first.model)} (${escapeHtml(first.years)})`;
}

function availabilityClass(avail) {
  const a = normalize(avail);
  if (a.includes("in stock")) return "avail-in-stock";
  if (a.includes("low")) return "avail-low";
  if (a.includes("out") || a.includes("unavailable")) return "avail-out";
  return "avail-unknown";
}

function formatNumber(n) {
  return Number(n).toLocaleString(); // e.g. 18,500
}

/* -------------------------
   Modal helpers
   ------------------------- */

function openModal(modalEl) {
  modalEl.classList.remove("hidden");
  document.body.classList.add("modal-open");
}

function closeModal(modalEl) {
  modalEl.classList.add("hidden");
  document.body.classList.remove("modal-open");
}

/* -------------------------
   WhatsApp helper
   ------------------------- */

function openWhatsAppForPart(part) {
  const message = `Hello, I want to order *${part.name}* (Part ID: ${part.id}). Price: ₦${formatNumber(part.price)}. Please confirm availability and delivery options.`;
  const encoded = encodeURIComponent(message);
  const waUrl = WHATSAPP_PHONE
    ? `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`
    : `https://wa.me/?text=${encoded}`;

  window.open(waUrl, "_blank");
}

/* ============================
   End: Event listeners
   ============================ */

/* Search trigger: user clicks Search button */
if (searchButton) {
  searchButton.addEventListener("click", (e) => {
    e.preventDefault();
    const q = searchInput?.value ?? "";
    const results = searchParts(q);
    renderResults(results);
  });
}

/* Live search (optional): trigger on Enter or after typing (debounced) */
let debounceTimer = null;
if (searchInput) {
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const results = searchParts(searchInput.value);
      renderResults(results);
    }
  });

  searchInput.addEventListener("input", () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const results = searchParts(searchInput.value);
      renderResults(results);
    }, 450); // 450ms debounce for usability
  });
}

/* Global click handler for result card buttons (delegation) */
resultsSection.addEventListener("click", (e) => {
  const target = e.target;
  const card = target.closest(".result-card");
  if (!card) return;

  const partId = Number(card.dataset.partId);
  const part = autoParts.find(p => p.id === partId);
  if (!part) return;

  if (target.matches(".place-order")) {
    openWhatsAppForPart(part);
  } else if (target.matches(".see-details")) {
    // for now open details modal (empty). We can populate modal content later as needed.
    const body = detailsModal.querySelector(".modal-body");
    // populate with minimal content for now
    body.innerHTML = `
      <p><strong>${escapeHtml(part.name)}</strong></p>
      <p>${escapeHtml(part.description)}</p>
      <p><strong>Full compatibilities (all):</strong></p>
      <ul>
        ${part.compatibilities.map(c => `<li>${escapeHtml(c.brand)} ${escapeHtml(c.model)} — ${escapeHtml(c.years)}</li>`).join("")}
      </ul>
      <p><em>Place Order on WhatsApp to proceed.</em></p>
    `;
    openModal(detailsModal);
  }
});

/* Modal close buttons */
document.addEventListener("click", (e) => {
  const t = e.target;
  // instruction modal Ok
  if (t.matches(".instruction-ok")) {
    closeModal(instructionModal);
  }
  // details modal close
  if (t.matches(".modal-close")) {
    closeModal(detailsModal);
  }
  // click on backdrop closes modals
  if (t.matches(".modal-backdrop")) {
    const parent = t.parentElement;
    if (parent && parent.id === "details-modal") closeModal(detailsModal);
    if (parent && parent.id === "instruction-modal") closeModal(instructionModal);
  }
});

/* Optional: close modals with Escape key */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!detailsModal.classList.contains("hidden")) closeModal(detailsModal);
    if (!instructionModal.classList.contains("hidden")) closeModal(instructionModal);
  }
});