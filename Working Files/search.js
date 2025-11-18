// search.js
// Single-file script implementing the Search page features described.
// Assumes: ./data.js exports `autoParts` (an array of objects).
// Phone for Place Order: +2349161536457
// Page size: 12, Debounce: 300ms

import { autoParts } from './data.js';

const WHATSAPP_PHONE = '+2349161536457';
const PAGE_SIZE = 12;
const DEBOUNCE_MS = 300;
const PLACEHOLDER_WORDS = [
  "name (eg: brake pads)",
  "street name (eg: iron pipe)",
  "use (eg: used in brakes)",
  "keywords (eg: brakes)"
];

// ---------- Utilities ----------
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function debounce(fn, wait = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

function safeText(v) {
  return (v === null || v === undefined) ? '' : String(v);
}

// normalize string for searching
function norm(s) {
  return safeText(s).toLowerCase();
}

// wrap matched substrings in a highlight <mark> or span
function highlightMatch(text, query) {
  if (!query) return text;
  const q = query.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'); // escape regex
  try {
    const re = new RegExp(`(${q})`, 'ig');
    return text.replace(re, '<mark class="highlight">$1</mark>');
  } catch (e) {
    return text;
  }
}

// score an item for relevance to query
function scoreItem(item, q) {
  // q is lowercase
  if (!q) return 0;
  let score = 0;
  const name = norm(item.name);
  const street = norm(item.streetName || item.street || '');
  const use = norm(item.use || '');
  const keywords = (item.keywords || []).map(k => norm(k));
  const category = norm(item.category || '');
  const brands = Array.isArray(item.brand) ? item.brand.map(norm) : [norm(item.brand || '')];
  const models = Array.isArray(item.model) ? item.model.map(norm) : [norm(item.model || '')];
  const years = Array.isArray(item.year) ? item.year.map(String) : (item.year ? [String(item.year)] : []);

  if (name === q) score += 200;
  else if (name.includes(q)) score += 120;

  for (const kw of keywords) {
    if (kw === q) score += 90;
    else if (kw.includes(q)) score += 40;
  }

  if (street.includes(q) || use.includes(q)) score += 30;

  for (const b of brands) if (b && b.includes(q)) score += 25;
  for (const m of models) if (m && m.includes(q)) score += 20;
  for (const y of years) if (y && y.includes(q)) score += 15;
  if (category.includes(q)) score += 10;

  // small boost for exact id match
  if (String(item.id) === q) score += 150;

  return score;
}

// Build whatsapp url
function whatsappUrl(message) {
  // Use wa.me format with digits only
  const digits = WHATSAPP_PHONE.replace(/\D/g, '');
  const text = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${text}`;
}

// Truncate text safely
function truncate(str, n = 140) {
  if (!str) return '';
  return str.length > n ? str.slice(0, n).trim() + '…' : str;
}

// ---------- DOM creation helpers ----------
function createElem(tag, classes = '', attrs = {}) {
  const el = document.createElement(tag);
  if (classes) el.className = classes;
  for (const k in attrs) {
    if (k === 'html') el.innerHTML = attrs[k];
    else el.setAttribute(k, attrs[k]);
  }
  return el;
}

// ---------- App state ----------
const state = {
  mode: 'identifiers', // 'identifiers' | 'category'
  pillPos: 0, // 0 brand | 1 model | 2 year
  dropdownValue: null, // selected brand/model/year value
  query: '',
  page: 1,
  pageSize: PAGE_SIZE,
  results: [],
  activeCategory: null,
  showHelpShownThisSession: !!sessionStorage.getItem('manny_help_shown'),
};

// derived flag for optional features
const largeDataset = Array.isArray(autoParts) && autoParts.length > 50;

// ---------- Build/apply UI scaffolding ----------
function ensureResultsContainer() {
  let container = $('#results-section');
  if (!container) {
    container = createElem('section', '', { id: 'results-section' });
    // append after main content if available, else to body
    const main = document.querySelector('main');
    if (main && main.parentNode) main.parentNode.insertBefore(container, main.nextSibling);
    else document.body.appendChild(container);
  }
  // clear and add inner structure we need
  container.innerHTML = '';
  const resultsWrap = createElem('div', 'search-results-wrap', { id: 'searchResultsWrap', 'aria-live': 'polite' });
  const list = createElem('div', 'search-results', { id: 'searchResults' });
  const pagination = createElem('div', 'pagination', { id: 'pagination' });
  container.appendChild(resultsWrap);
  resultsWrap.appendChild(list);
  resultsWrap.appendChild(pagination);
  return container;
}

// render pagination controls
function renderPagination(total, page = 1, pageSize = PAGE_SIZE) {
  const pagination = $('#pagination');
  if (!pagination) return;
  pagination.innerHTML = '';
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return;

  const nav = createElem('nav', 'pager', { 'aria-label': 'Pagination' });
  const prev = createElem('button', 'pager-btn prev', { type: 'button' });
  prev.textContent = 'Prev';
  prev.disabled = page <= 1;
  prev.addEventListener('click', () => {
    state.page = clamp(state.page - 1, 1, totalPages);
    renderResultsFromState();
    scrollToResultsTop();
  });
  nav.appendChild(prev);

  // page numbers (compact if many)
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  if (start > 1) {
    const b = pageBtn(1); nav.appendChild(b);
    if (start > 2) nav.appendChild(createElem('span','dots',{html:'…'}));
  }
  for (let p = start; p <= end; p++) {
    nav.appendChild(pageBtn(p));
  }
  if (end < totalPages) {
    if (end < totalPages - 1) nav.appendChild(createElem('span','dots',{html:'…'}));
    nav.appendChild(pageBtn(totalPages));
  }

  const next = createElem('button', 'pager-btn next', { type: 'button' });
  next.textContent = 'Next';
  next.disabled = page >= totalPages;
  next.addEventListener('click', () => {
    state.page = clamp(state.page + 1, 1, totalPages);
    renderResultsFromState();
    scrollToResultsTop();
  });
  nav.appendChild(next);

  pagination.appendChild(nav);

  function pageBtn(p) {
    const btn = createElem('button', `pager-num ${p === page ? 'active' : ''}`, { type: 'button' });
    btn.textContent = String(p);
    btn.addEventListener('click', () => {
      state.page = p;
      renderResultsFromState();
      scrollToResultsTop();
    });
    return btn;
  }
}

function scrollToResultsTop() {
  const wrap = document.getElementById('searchResultsWrap');
  if (wrap) {
    wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ---------- Render a single result card ----------
function renderResultCard(item, query) {
  const card = createElem('article', 'result-card', { 'data-id': item.id });
  // image section
  const imgWrap = createElem('div', 'result-img-wrap');
  const img = createElem('img', 'result-img', { src: item.picture || './download.jpeg', alt: item.name || 'part' });
  imgWrap.appendChild(img);
  card.appendChild(imgWrap);

  // availability tag top-right
  const avail = createElem('div', 'availability', { html: 'Available' });
  card.appendChild(avail);

  // content
  const body = createElem('div', 'result-body');
  const nameHTML = highlightMatch(escapeHtml(item.name || ''), query);
  body.appendChild(createElem('h3', 'result-title', { html: nameHTML }));

  const street = escapeHtml(item.streetName || '');
  const useText = escapeHtml(truncate(item.use || '', 140));
  const descHtml = `${highlightMatch(street, query)}<div class="short-use">${highlightMatch(useText, query)}</div>`;
  body.appendChild(createElem('p', 'result-desc', { html: descHtml }));

  // compatibility summary (first few brands/models)
  const comp = createElem('div', 'result-compat');
  const brands = Array.isArray(item.brand) ? item.brand : (item.brand ? [item.brand] : []);
  const models = Array.isArray(item.model) ? item.model : (item.model ? [item.model] : []);
  const compText = (brands.length > 0 ? brands.slice(0,3).join(', ') : '') +
                   (models.length > 0 ? (brands.length ? ' • ' : '') + models.slice(0,3).join(', ') : '');
  comp.innerHTML = `<small class="compat-label">Compatibilities:</small> <span class="compat-list">${escapeHtml(compText)}</span>`;
  body.appendChild(comp);

  // meta row with see details and place order
  const meta = createElem('div', 'result-meta');
  const detailBtn = createElem('button', 'btn-see-details', { type: 'button' });
  detailBtn.textContent = 'See Details';
  const orderBtn = createElem('button', 'btn-order', { type: 'button' });
  orderBtn.textContent = 'Place Order';
  meta.appendChild(createElem('div','price',{html: item.price ? `₦${escapeHtml(String(item.price))}` : ''}));
  const rightBtns = createElem('div', 'meta-actions');
  rightBtns.appendChild(detailBtn);
  rightBtns.appendChild(orderBtn);
  meta.appendChild(rightBtns);

  body.appendChild(meta);
  card.appendChild(body);

  // clicking card (except the order button) shows modal
  card.addEventListener('click', (e) => {
    if (e.target.closest('.btn-order')) return; // skip if order clicked
    openDetailsModal(item);
  });

  detailBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openDetailsModal(item);
  });

  orderBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const msg = `Hello, I'm interested in "${item.name}" (ID: ${item.id}). Do you have it available?`;
    window.open(whatsappUrl(msg), '_blank');
  });

  return card;
}

// escape html helper to avoid injection (we also use highlightMatch that returns HTML)
function escapeHtml(unsafe) {
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ---------- Modal (details) ----------
let modalEl = null;
let lastFocusedEl = null;
function createModalStructure() {
  if (modalEl) return modalEl;
  modalEl = createElem('div', 'manny-modal', { id: 'mannyModal', 'aria-hidden': 'true' });
  modalEl.innerHTML = `
    <div class="manny-modal-backdrop" id="mannyModalBackdrop"></div>
    <div class="manny-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="mannyModalTitle">
      <button class="manny-modal-close" aria-label="Close dialog">✕</button>
      <div class="manny-modal-content" id="mannyModalContent"></div>
    </div>
  `;
  document.body.appendChild(modalEl);

  // events
  $('.manny-modal-close', modalEl).addEventListener('click', closeModal);
  $('#mannyModalBackdrop', modalEl).addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalEl && modalEl.getAttribute('aria-hidden') === 'false') closeModal();
  });
  return modalEl;
}

function openDetailsModal(item) {
  createModalStructure();
  lastFocusedEl = document.activeElement;
  const content = $('#mannyModalContent');
  content.innerHTML = '';
  const title = createElem('h2','modal-title',{id:'mannyModalTitle', html: escapeHtml(item.name || 'Part')});
  content.appendChild(title);

  const grid = createElem('div','modal-grid');
  const img = createElem('img','modal-img',{src: item.picture || './download.jpeg', alt: item.name || 'part'});
  grid.appendChild(img);
  const info = createElem('div','modal-info');
  info.innerHTML = `
    <p><strong>ID:</strong> ${escapeHtml(String(item.id || ''))}</p>
    <p><strong>Street name:</strong> ${escapeHtml(item.streetName || '')}</p>
    <p><strong>Category:</strong> ${escapeHtml(item.category || '')}</p>
    <p><strong>Use:</strong> ${escapeHtml(item.use || '')}</p>
    <p><strong>Keywords:</strong> ${escapeHtml((item.keywords || []).join(', '))}</p>
    <p><strong>Compatibility:</strong> ${escapeHtml(formatCompat(item))}</p>
  `;
  grid.appendChild(info);
  content.appendChild(grid);

  // Actions row
  const actions = createElem('div','modal-actions');
  const order = createElem('button','modal-order',{type:'button'});
  order.textContent = 'Place Order';
  order.addEventListener('click', () => {
    const msg = `Hello, I'm interested in "${item.name}" (ID: ${item.id}). Do you have it available?`;
    window.open(whatsappUrl(msg), '_blank');
  });
  actions.appendChild(order);
  content.appendChild(actions);

  // show modal
  modalEl.setAttribute('aria-hidden', 'false');
  modalEl.classList.add('open');
  // focus close button
  const closeBtn = $('.manny-modal-close', modalEl);
  if (closeBtn) closeBtn.focus();
  trapFocus(modalEl);
}

function formatCompat(item) {
  const brands = Array.isArray(item.brand) ? item.brand : (item.brand ? [item.brand] : []);
  const models = Array.isArray(item.model) ? item.model : (item.model ? [item.model] : []);
  const years = Array.isArray(item.year) ? item.year : (item.year ? [item.year] : []);
  const parts = [];
  if (brands.length) parts.push(`Brands: ${brands.join(', ')}`);
  if (models.length) parts.push(`Models: ${models.join(', ')}`);
  if (years.length) parts.push(`Years: ${years.join(', ')}`);
  return parts.join(' • ') || '—';
}

function closeModal() {
  if (!modalEl) return;
  modalEl.setAttribute('aria-hidden', 'true');
  modalEl.classList.remove('open');
  releaseFocus();
  if (lastFocusedEl) lastFocusedEl.focus();
}

// basic focus trap: remember previously focused, limit Tab to modal
let focusTrapHandler = null;
function trapFocus(modal) {
  releaseFocus();
  const focusable = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const nodes = Array.from(modal.querySelectorAll(focusable)).filter(n => !n.hasAttribute('disabled'));
  if (nodes.length === 0) return;
  const first = nodes[0], last = nodes[nodes.length - 1];
  focusTrapHandler = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
      else { if (document.activeElement === last) { e.preventDefault(); first.focus(); } }
    }
  };
  document.addEventListener('keydown', focusTrapHandler);
}
function releaseFocus() {
  if (focusTrapHandler) {
    document.removeEventListener('keydown', focusTrapHandler);
    focusTrapHandler = null;
  }
}

// ---------- Search pipeline ----------
function runSearchPipeline(query, extraFilters = {}) {
  // returns sorted results (no pagination)
  const q = norm(query).trim();
  let results = [];

  // For small dataset: simple identifier search by name/street/use/keywords
  if (!largeDataset) {
    results = autoParts.filter(item => {
      const hay = `${norm(item.name)} ${norm(item.streetName || '')} ${norm(item.use || '')} ${(item.keywords || []).map(k => norm(k)).join(' ')}`;
      return q === '' ? true : hay.includes(q);
    });
    // score & sort
    results = results.map(item => ({ item, score: scoreItem(item, q) }))
                     .sort((a,b) => b.score - a.score)
                     .map(x => x.item);
    return results;
  }

  // large dataset: enable filter chaining and advanced compatibility filtering
  // extraFilters may include: category, brand, model, year
  let pool = autoParts.slice();

  // chain category if provided
  if (extraFilters.category) {
    pool = pool.filter(it => norm(it.category || '') === norm(extraFilters.category));
  }
  if (extraFilters.brand) {
    pool = pool.filter(it => {
      const b = Array.isArray(it.brand) ? it.brand.map(norm) : [norm(it.brand || '')];
      return b.some(x => x.includes(norm(extraFilters.brand)));
    });
  }
  if (extraFilters.model) {
    pool = pool.filter(it => {
      const m = Array.isArray(it.model) ? it.model.map(norm) : [norm(it.model || '')];
      return m.some(x => x.includes(norm(extraFilters.model)));
    });
  }
  if (extraFilters.year) {
    pool = pool.filter(it => {
      const y = Array.isArray(it.year) ? it.year.map(String) : (it.year ? [String(it.year)] : []);
      return y.some(x => x.includes(String(extraFilters.year)));
    });
  }

  // If query provided, filter by relevant fields
  if (q) {
    pool = pool.filter(item => {
      const hay = `${norm(item.name)} ${norm(item.streetName || '')} ${(item.keywords || []).map(k => norm(k)).join(' ')} ${norm(item.use || '')} ${norm(item.category || '')} ${(Array.isArray(item.brand) ? item.brand.join(' ') : (item.brand || '')).toLowerCase()} ${(Array.isArray(item.model) ? item.model.join(' ') : (item.model || '')).toLowerCase()} ${Array.isArray(item.year) ? item.year.join(' ') : (item.year || '')}`;
      return hay.includes(q);
    });
  }

  // scoring & sort by score descending
  const scored = pool.map(item => ({ item, score: scoreItem(item, q) }))
                     .sort((a,b) => b.score - a.score)
                     .map(x => x.item);
  return scored;
}

// ---------- Render pipeline (use state) ----------
function renderResultsFromState() {
  const resultsWrap = $('#searchResults');
  if (!resultsWrap) return;
  // Clear
  resultsWrap.innerHTML = '';

  // If in category mode and no category selected, show category grid
  if (state.mode === 'category' && !state.activeCategory) {
    renderCategoryGrid(resultsWrap);
    $('#pagination').innerHTML = '';
    return;
  }

  // Build extraFilters for large dataset
  const filters = {};
  if (state.activeCategory) filters.category = state.activeCategory;
  // pill based dropdown value can be used (not fully implemented UI for brand/model/year selection)
  if (state.dropdownValue) {
    if (state.pillPos === 0) filters.brand = state.dropdownValue;
    else if (state.pillPos === 1) filters.model = state.dropdownValue;
    else if (state.pillPos === 2) filters.year = state.dropdownValue;
  }

  // Run search pipeline
  const allResults = runSearchPipeline(state.query, filters);
  state.results = allResults;

  // pagination
  const total = allResults.length;
  const page = clamp(state.page, 1, Math.max(1, Math.ceil(total / state.pageSize)));
  state.page = page;
  const start = (page - 1) * state.pageSize;
  const end = start + state.pageSize;
  const pageItems = allResults.slice(start, end);

  // Render each card
  if (pageItems.length === 0) {
    resultsWrap.appendChild(createElem('p', 'no-results', { html: 'No parts found.' }));
  } else {
    const grid = createElem('div', 'results-grid');
    pageItems.forEach(item => {
      const card = renderResultCard(item, state.query);
      grid.appendChild(card);
    });
    resultsWrap.appendChild(grid);
  }

  // pagination render
  renderPagination(total, state.page, state.pageSize);
}

// render category grid (when in category mode and no active category)
function renderCategoryGrid(container) {
  container.innerHTML = '';
  const categories = getUniqueCategories();
  const grid = createElem('div', 'categories-grid-cards');
  categories.forEach(cat => {
    const card = createElem('div', 'category-card-large', { html: `<strong>${escapeHtml(cat)}</strong>` });
    card.addEventListener('click', () => {
      state.activeCategory = cat;
      state.page = 1;
      renderResultsFromState();
      // show small header with back arrow
      showCategoryHeader(cat);
    });
    grid.appendChild(card);
  });
  container.appendChild(grid);
  showCategoryHeader(null); // hide header if none
}

// show header when within category
function showCategoryHeader(cat) {
  // create or update header area above results to show back arrow + category name
  let header = $('#categoryHeader');
  if (!header) {
    header = createElem('div', 'category-header', { id: 'categoryHeader' });
    const container = $('#searchResultsWrap');
    if (container) container.insertBefore(header, container.firstChild);
    else {
      const r = $('#results-section');
      if (r) r.insertBefore(header, r.firstChild);
    }
  }
  if (!cat) {
    header.innerHTML = '';
    header.style.display = 'none';
    return;
  }
  
  header.style.display = 'flex';
  header.innerHTML = `<button id="categoryBack" class="btn-back" aria-label="Back">← Back</button><h3 class="cat-title">Category: ${escapeHtml(cat)}</h3>`;
  $('#categoryBack').addEventListener('click', () => {
    state.activeCategory = null;
    state.page = 1;
    renderResultsFromState();
  });
}

// get unique categories (preserve given 5 categories ordering if present)
function getUniqueCategories() {
  // If user defined categories exist in items, use their unique set
  const cats = new Set();
  autoParts.forEach(it => {
    if (it.category) cats.add(it.category);
  });
  if (cats.size === 0) {
    // fallback: default categories (from your reference)
    return ['Engine', 'Suspension', 'Brakes', 'Electrical', 'Body'];
  }
  return Array.from(cats);
}

// ---------- Typewriter placeholder ----------
let placeholderTimer = null;
function startPlaceholderTypewriter(inputEl, words = PLACEHOLDER_WORDS, speed = 100, pause = 1400) {
  if (!inputEl) return;
  let wi = 0, ci = 0, deleting = false;
  inputEl.setAttribute('placeholder', '');
  function tick() {
    const w = words[wi] || '';
    if (!deleting) {
      ci++;
      inputEl.setAttribute('placeholder', w.substring(0, ci) + (ci < w.length ? '|' : ''));
      if (ci >= w.length) {
        // pause then delete
        setTimeout(() => { deleting = true; tick(); }, pause);
        return;
      }
    } else {
      ci--;
      inputEl.setAttribute('placeholder', w.substring(0, ci) + (ci ? '|' : ''));
      if (ci <= 0) {
        deleting = false;
        wi = (wi + 1) % words.length;
      }
    }
    placeholderTimer = setTimeout(tick, deleting ? speed / 2 : speed);
  }
  tick();

  // stop on focus
  const stopFn = () => stopPlaceholderTypewriter(inputEl);
  inputEl.addEventListener('focus', stopFn, { once: true });
  inputEl.addEventListener('input', stopFn, { once: true });
  return () => stopPlaceholderTypewriter(inputEl);
}
function stopPlaceholderTypewriter(inputEl) {
  if (placeholderTimer) { clearTimeout(placeholderTimer); placeholderTimer = null; }
  if (inputEl) inputEl.setAttribute('placeholder', '');
}

// ---------- One-time help modal (session) ----------
function showHelpModalOnce() {
  if (sessionStorage.getItem('manny_help_shown')) return;
  // create simple modal
  const help = createElem('div','manny-help-modal',{id:'mannyHelpModal'});
  help.innerHTML = `
    <div class="help-backdrop"></div>
    <div class="help-dialog" role="dialog" aria-modal="true">
      <h3>Welcome to Manny Autos</h3>
      <p>You can click any item to read more information about it, or click the "Place Order" button to contact stores on WhatsApp.</p>
      <div class="help-actions"><button id="helpOk" class="btn-primary">Ok</button></div>
    </div>
  `;
  document.body.appendChild(help);
  document.getElementById('helpOk').addEventListener('click', () => {
    sessionStorage.setItem('manny_help_shown', '1');
    help.remove();
  });
}

// ---------- Nav highlight + hamburger (robust) ----------
function setupNavAndHamburger() {
  // Highlight nav links (desktop)
  const links = $$('.nav-link');
  const currentFile = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  links.forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop().toLowerCase();
    if (href && href === currentFile) a.classList.add('active');
    else a.classList.remove('active');
  });
  // If on search page, highlight dropdown/mode area
  if (currentFile.includes('search')) {
    const navItem = $('.nav-item.dropdown');
    if (navItem) navItem.classList.add('active');
    const mt = $('.mode-text');
    if (mt) mt.classList.add('active');
  }

  // Hamburger behavior
  const hamburger = $('.hamburger');
  const mobileSidebar = $('#mobileSidebar');
  const mobileClose = mobileSidebar ? mobileSidebar.querySelector('.mobile-close') : null;
  if (!hamburger || !mobileSidebar) return;

  // ensure CSS fallback if sidebar has no .open styles
  if (!getComputedStyle(mobileSidebar).right || getComputedStyle(mobileSidebar).right === 'auto') {
    mobileSidebar.style.right = '-100%';
    mobileSidebar.style.transition = mobileSidebar.style.transition || 'right .28s ease';
  }

  function open() {
    mobileSidebar.classList.add('open');
    mobileSidebar.style.right = '0';
    mobileSidebar.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
  }
  function close() {
    mobileSidebar.classList.remove('open');
    mobileSidebar.style.right = '-100%';
    mobileSidebar.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
  }

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (mobileSidebar.classList.contains('open')) close(); else open();
  });
  if (mobileClose) mobileClose.addEventListener('click', close);

  mobileSidebar.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link) close(); // close when link clicked
  });

  document.addEventListener('click', (e) => {
    if (!mobileSidebar.classList.contains('open')) return;
    if (e.target.closest('#mobileSidebar') || e.target.closest('.hamburger')) return;
    close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileSidebar.classList.contains('open')) close();
  });
}

// ---------- Mode toggle (identifiers <-> category) ----------
function setupModeToggle() {
  // the UI has .mode-menu with .mode-option; clicking switches mode
  const options = $$('.mode-option');
  const modeText = $('.mode-text');
  const modeArrow = $('.mode-arrow');
  const menu = $('.mode-menu');

  function setMode(mode) {
    state.mode = mode === 'By Category' || mode === 'category' || mode === 'category' ? 'category' : 'identifiers';
    if (modeText) modeText.textContent = state.mode === 'category' ? 'By Category' : 'By Identifiers';
    // change Search header active style
    const navItem = $('.nav-item.dropdown');
    if (navItem) {
      if (state.mode === 'category') navItem.classList.add('mode-category');
      else navItem.classList.remove('mode-category');
    }
    // show/hide sections in page content
    toggleModeUI();
    // reset results or state as needed
    state.page = 1;
    state.activeCategory = null;
    renderResultsFromState();
  }

  menu && menu.addEventListener('click', (e) => {
    const btn = e.target.closest('.mode-option');
    if (!btn) return;
    setMode(btn.textContent.trim());
  });

  // arrow toggles menu visibility for keyboard/touch users (also respect CSS hover)
  if (modeArrow && menu) {
    modeArrow.addEventListener('click', (e) => {
      e.stopPropagation();
      const show = menu.style.display !== 'block';
      menu.style.display = show ? 'block' : 'none';
    });
    document.addEventListener('click', () => { if (menu) menu.style.display = ''; });
  }

  // initial set based on current DOM text
  if (modeText) {
    setMode(modeText.textContent.trim());
  }
}

function toggleModeUI() {
  const identifiersSection = $('.identifiers');
  const categorySection = $('.categories'); // in your html the categories block exists (commented previously)
  if (state.mode === 'category') {
    if (identifiersSection) identifiersSection.style.display = 'none';
    if (categorySection) categorySection.style.display = 'block';
  } else {
    if (identifiersSection) identifiersSection.style.display = 'block';
    if (categorySection) categorySection.style.display = 'none';
  }
}

// ---------- Highlighting helper CSS injection ----------
function injectHighlightStyles() {
  if ($('#mannyHighlightStyles')) return;
  const style = createElem('style', '', { id: 'mannyHighlightStyles' });
  style.innerHTML = `
    .highlight { background: linear-gradient(90deg, rgba(46,196,214,0.18), rgba(11,58,111,0.08)); padding: .05em .12em; border-radius: 3px; }
    .result-card { display:flex; gap:12px; background:#fff; padding:12px; border-radius:10px; margin-bottom:10px; align-items:flex-start; position:relative; box-shadow:0 6px 18px rgba(11,58,111,0.03); }
    .result-img { width:140px; height:100px; object-fit:cover; border-radius:8px; }
    .availability { position:absolute; right:12px; top:12px; background:#0B3B6F; color:white; padding:4px 8px; border-radius:999px; font-weight:700; font-size:0.8rem; }
    .result-body { flex:1; display:flex; flex-direction:column; gap:8px; }
    .result-title { margin:0; color:#0B3B6F; }
    .result-desc { margin:0; color:#6b7a89; font-size:0.95rem; }
    .result-meta { display:flex; align-items:center; justify-content:space-between; gap:8px; margin-top:8px; }
    .meta-actions button { margin-left:8px; }
    .btn-see-details, .btn-order { padding:8px 12px; border-radius:999px; border:0; cursor:pointer; font-weight:700; }
    .btn-see-details { background: transparent; color:#0B3B6F; border:1px solid rgba(11,58,111,0.08); }
    .btn-order { background:#0B3B6F; color:white; }
    .search-results-wrap { max-width:1100px; margin:18px auto; padding:0 20px; }
    .results-grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:12px; }
    .no-results { color:#888; padding:18px; text-align:center; }
    .pager { display:flex; gap:8px; align-items:center; justify-content:center; margin-top:14px; }
    .pager-btn, .pager-num { padding:8px 10px; border-radius:8px; border:1px solid rgba(11,58,111,0.06); background:#fff; cursor:pointer; }
    .pager-num.active { background:#0B3B6F; color:white; }
    /* modal */
    .manny-modal { position:fixed; inset:0; display:none; align-items:center; justify-content:center; z-index:9999; }
    .manny-modal.open { display:flex; }
    .manny-modal-backdrop { position:absolute; inset:0; background:rgba(0,0,0,0.45); }
    .manny-modal-dialog { position:relative; background:#fff; border-radius:12px; padding:18px; z-index:2; max-width:900px; width:100%; box-shadow:0 18px 60px rgba(11,58,111,0.18); }
    .manny-modal-close { position:absolute; right:12px; top:12px; background:transparent; border:0; font-size:18px; cursor:pointer; }
    .modal-grid { display:flex; gap:18px; align-items:flex-start; }
    .modal-img { width:340px; height:220px; object-fit:cover; border-radius:8px; }
    .modal-info { flex:1; color:#0B2A44; }
    .modal-actions { margin-top:12px; display:flex; gap:8px; justify-content:flex-end; }
    .modal-order { background:#0B3B6F; color:white; padding:10px 14px; border-radius:10px; border:0; cursor:pointer; }
    .category-header { display:none; gap:12px; align-items:center; padding:12px 20px; max-width:1100px; margin:0 auto 8px; }
    .btn-back { background:transparent; border:1px solid rgba(11,58,111,0.08); padding:6px 10px; border-radius:8px; cursor:pointer; }
    .category-card-large { background:#fff; padding:20px; border-radius:10px; box-shadow:0 8px 20px rgba(11,58,111,0.04); cursor:pointer; text-align:center; }
    .categories-grid-cards { display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:12px; }
    /* help modal */
    #mannyHelpModal { position:fixed; inset:0; display:flex; align-items:center; justify-content:center; z-index:9998; }
    #mannyHelpModal .help-backdrop { position:absolute; inset:0; background:rgba(0,0,0,0.35); }
    #mannyHelpModal .help-dialog { background:#fff; padding:18px; border-radius:10px; max-width:480px; z-index:2; box-shadow:0 18px 60px rgba(11,58,111,0.12); }
    @media (max-width:780px){ .results-grid{grid-template-columns:1fr;} .modal-grid{flex-direction:column;} .modal-img{width:100%;height:auto;} }
  `;
  document.head.appendChild(style);
}

// ---------- Initialize UI and events ----------
function init() {
  injectHighlightStyles();
  ensureResultsContainer();
  setupNavAndHamburger();
  setupModeToggle();
  toggleModeUI();

  // create placeholder typewriter on search input
  const searchInput = $('.search-input');
  if (searchInput) startPlaceholderTypewriter(searchInput, PLACEHOLDER_WORDS, 90, 1300);

  // create one-time help modal
  if (!state.showHelpShownThisSession) {
    setTimeout(() => showHelpModalOnce(), 700);
  }

  // create modal structure ready
  createModalStructure();

  // Setup search input events
  const debouncedSearch = debounce((e) => {
    state.query = (e && e.target) ? e.target.value.trim() : state.query;
    state.page = 1;
    renderResultsFromState();
  }, DEBOUNCE_MS);

  if (searchInput) {
    searchInput.addEventListener('input', debouncedSearch);
    // Enter to search immediately
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        state.query = e.target.value.trim();
        state.page = 1;
        renderResultsFromState();
      }
    });
  }

  // Search button click
  const searchBtn = $('.identifiers .btn-primary');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const v = searchInput ? searchInput.value.trim() : '';
      state.query = v;
      state.page = 1;
      renderResultsFromState();
    });
  }

  // Build results container and show initial results (modal shown on first load per your spec)
  renderResultsFromState();

  // If you wanted the details modal to appear on first load, uncomment this:
  // if (state.results && state.results.length) openDetailsModal(state.results[0]);
}

// ---------- Kick off on DOMContentLoaded ----------
document.addEventListener('DOMContentLoaded', init);

// Export nothing; module runs on import.