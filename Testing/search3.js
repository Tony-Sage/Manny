// search3.js
// Mode switching (Identifiers <-> Category) with category listing and category -> parts flow.
// Safe: waits for DOMContentLoaded and re-queries elements, so it won't run too early.

import { autoParts } from "./data.js"; // keep same data source as other search scripts

document.addEventListener("DOMContentLoaded", () => {
  // ----- element lookups (done AFTER DOM is ready) -----
  const modeButtons = Array.from(document.querySelectorAll(".mode-option"));
  const identifiersSection = document.querySelector(".identifiers");
  const categoriesSection = document.querySelector(".categories");
  const categoriesGrid = document.querySelector(".categories-grid");
  const searchRow = document.querySelector(".search-row");

  // resultsSection may already be created by your other script; reuse if present or create one.
  let resultsSection = document.getElementById("results-section");
  if (!resultsSection) {
    resultsSection = document.createElement("section");
    resultsSection.id = "results-section";
    resultsSection.className = "results-section page-inner";
    const insertAfter = identifiersSection ?? document.querySelector("main .page-inner");
    if (insertAfter && insertAfter.parentNode) {
      insertAfter.parentNode.insertBefore(resultsSection, insertAfter.nextSibling);
    } else {
      document.body.appendChild(resultsSection);
    }
  }
  

  // header bar above results (back + heading) - create only once
  let resultsHeaderBar = document.getElementById("results-header-bar");
  if (!resultsHeaderBar) {
    resultsHeaderBar = document.createElement("div");
    resultsHeaderBar.id = "results-header-bar";
    resultsHeaderBar.className = "results-header-bar page-inner";
    resultsHeaderBar.style.display = "none";
    resultsHeaderBar.innerHTML = `
      <div class="results-header-inner" style="display:flex;align-items:center;gap:12px;">
        <button class="back-to-cats btn">← Back</button>
        <h2 class="results-heading" style="margin:0; font-size:18px; color:#0B3B6F;">
          Category: <span class="results-category-name"></span>
        </h2>
      </div>
    `;
    resultsSection.parentNode.insertBefore(resultsHeaderBar, resultsSection);
  }

  // ----- safety checks -----
  if (!modeButtons.length) {
    console.warn("search3.js: no .mode-option buttons found on page.");
  }
  if (!categoriesSection || !categoriesGrid) {
    console.warn("search3.js: categories section or grid not found. Category mode will not render cards.");
  }

  // ----- helpers -----
  const normalize = s => String(s || "").toLowerCase().trim();
  const escapeHtml = s =>
    String(s || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  function getCategoriesMap() {
    const map = new Map();
    for (const p of autoParts) {
      const cat = p.category || "Uncategorized";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat).push(p);
    }
    return map;
  }

  // create category cards
  function renderCategoryCards() {
    if (!categoriesGrid) return;
    categoriesGrid.innerHTML = "";
    const categories = getCategoriesMap();
    for (const [cat, parts] of categories.entries()) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "category-card category-card-btn";
      btn.dataset.category = cat;
      btn.innerHTML = `
        <div class="cat-title" style="font-weight:700;color:#0B3B6F;">${escapeHtml(cat)}</div>
        <div class="cat-count" style="font-size:13px;color:#6b7a89;">${parts.length} items</div>
      `;
      categoriesGrid.appendChild(btn);
    }
  }

  // create a result-card for parts (same structure as search2.js/search.js expects)
  function createResultCard(part) {
    const article = document.createElement("article");
    article.className = "result-card";
    article.dataset.partId = String(part.id);
    article.innerHTML = `
      <div class="card-media">
        <img src="${escapeHtml(part.image)}" alt="${escapeHtml(part.name)}" onerror="this.onerror=null;this.src='images/placeholder.png'">
      </div>
      <div class="card-body">
        <h3 class="card-title">${escapeHtml(part.name)}</h3>
        <p class="card-desc">${escapeHtml(part.description)}</p>
        <p class="card-compat"><strong>Compatibility:</strong> ${formatFirstCompatibility(part)}</p>
        <div class="card-meta">
          <span class="availability ${availabilityClass(part.availability)}">${escapeHtml(part.availability)}</span>
          <span class="price">₦${Number(part.price).toLocaleString()}</span>
        </div>
        <div class="card-actions">
          <button class="btn place-order">Place Order</button>
          <button class="btn see-details">See Details</button>
        </div>
      </div>
    `;
    return article;
  }

  function formatFirstCompatibility(part) {
    const first = (part.compatibilities && part.compatibilities[0]) || null;
    if (!first) return "—";
    return `${escapeHtml(first.brand)} ${escapeHtml(first.model)} (${escapeHtml(first.years)})`;
  }
  function availabilityClass(a = "") {
    const x = normalize(a);
    if (x.includes("in stock")) return "avail-in-stock";
    if (x.includes("low")) return "avail-low";
    if (x.includes("out")) return "avail-out";
    return "avail-unknown";
  }

  // render parts list into resultsSection, and show header with categoryName
  function renderPartsList(parts = [], categoryName = "") {
   identifiersSection.style.display = "block"
   document.querySelector('.identifiers h1').style.display = "none"
   document.querySelector('.identifiers p').style.display = "none"
    // show header bar if categoryName
    if (categoryName) {
      resultsHeaderBar.style.display = "";
      resultsHeaderBar.querySelector(".results-category-name").textContent = categoryName;
    } else {
      resultsHeaderBar.style.display = "none";
    }

    resultsSection.innerHTML = "";
    const header = document.createElement("div");
    header.className = "results-header";
    header.innerHTML = `<h2>Search results (${parts.length})</h2>`;
    resultsSection.appendChild(header);

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

  // toggle UI modes
  function showIdentifiersMode() {
    if (identifiersSection) identifiersSection.style.display = "";
    if (searchRow) searchRow.style.display = "";
    if (categoriesSection) categoriesSection.style.display = "none";
    resultsHeaderBar.style.display = "none";
    // clear results if desired
    // resultsSection.innerHTML = "";
  }

  function showCategoryMode() {
    if (identifiersSection) identifiersSection.style.display = "none";
    if (searchRow) searchRow.style.display = "none";
    if (categoriesSection) categoriesSection.style.display = "";
    // populate categories
    renderCategoryCards();
    resultsSection.innerHTML = "";
    resultsHeaderBar.style.display = "none";
  }

  // ----- event wiring -----
  // mode buttons (header + sidebar)
  modeButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const txt = (btn.textContent || btn.innerText || "").toLowerCase();
      if (txt.includes("category")) {
        showCategoryMode();
      } else {
        showIdentifiersMode();
      }
    });
  });

  // delegate clicks on categoriesGrid -> render parts for that category
  if (categoriesGrid) {
    categoriesGrid.addEventListener("click", (e) => {
      const btn = e.target.closest(".category-card-btn");
      if (!btn) return;
      const category = btn.dataset.category;
      if (!category) return;
      const parts = autoParts.filter(p => normalize(p.category) === normalize(category));
      renderPartsList(parts, category);
      // hide categories section and show results
      if (categoriesSection) categoriesSection.style.display = "none";
      resultsSection.style.display = "";
      resultsHeaderBar.style.display = "";
      resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // back-to-cats (in resultsHeaderBar)
  resultsHeaderBar.addEventListener("click", (e) => {
    const b = e.target.closest(".back-to-cats");
    if (!b) return;
    resultsSection.innerHTML = "";
    resultsSection.style.display = "none";
    resultsHeaderBar.style.display = "none";
    if (categoriesSection) categoriesSection.style.display = "";
    renderCategoryCards();
  });

  // delegate resultsSection for place-order / see-details just in case
  resultsSection.addEventListener("click", (e) => {
    const t = e.target;
    const card = t.closest(".result-card");
    if (!card) return;
    const id = Number(card.dataset.partId);
    const part = autoParts.find(p => p.id === id);
    if (!part) return;

    if (t.matches(".place-order")) {
      const message = `Hello, I want to order *${part.name}* (Part ID: ${part.id}).`;
      const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");
    } else if (t.matches(".see-details")) {
      // trigger existing details modal if present (search.js created one), else alert fallback
      const dm = document.getElementById("details-modal");
      if (dm) {
        const body = dm.querySelector(".modal-body");
        body.innerHTML = `
          <p><strong>${escapeHtml(part.name)}</strong></p>
          <p>${escapeHtml(part.description)}</p>
          <ul>${part.compatibilities.map(c => `<li>${escapeHtml(c.brand)} ${escapeHtml(c.model)} — ${escapeHtml(c.years)}</li>`).join("")}</ul>
        `;
        dm.classList.remove("hidden");
        document.body.classList.add("modal-open");
      } else {
        alert(`Details: ${part.name}`);
      }
    }
  });

  // initial mode on load: default to identifiers
  showIdentifiersMode();
});