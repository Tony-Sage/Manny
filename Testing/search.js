/*
// search.js (paste into your existing file)
const pill = document.querySelector('.pill');
if (pill) {
  const options = Array.from(pill.querySelectorAll('.pill-option'));
  const select = document.querySelector('.selector-dropdown select');

  // Friendly labels to keep dropdown in sync (optional)
  const placeholders = ['Select Brand', 'Select Model', 'Select Year'];

  // Ensure options have dataset.index as numbers and set initial aria state
  options.forEach((btn, i) => {
    if (btn.dataset.index === undefined) btn.dataset.index = String(i);
    btn.setAttribute('role', 'tab');
    btn.setAttribute('tabindex', i === 0 ? '0' : '-1'); // only first focusable initially
    btn.setAttribute('aria-selected', pill.classList.contains(`pos-${i}`) ? 'true' : 'false');
  });

  // Utility to set the pill position (index = 0/1/2)
  function setPillPosition(index, { focusOption = false } = {}) {
    index = Number(index);
    // remove existing pos-* classes then add the new one
    pill.classList.remove('pos-0', 'pos-1', 'pos-2');
    pill.classList.add(`pos-${index}`);

    // update aria-selected and tabindex on each option
    options.forEach((btn, i) => {
      const selected = i === index;
      btn.setAttribute('aria-selected', String(selected));
      btn.setAttribute('tabindex', selected ? '0' : '-1');
      if (selected && focusOption) btn.focus();
    });

    // keep the dropdown placeholder (first <option>) in sync if present
    if (select && select.options && select.options.length) {
      // change the first option's text (the placeholder) — optional UX choice
      select.options[0].text = placeholders[index] || select.options[0].text;
    }
  }

  // Click handlers
  options.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = Number(btn.dataset.index);
      setPillPosition(idx, { focusOption: true });
    });

    // keyboard activation for accessibility (Enter / Space)
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const idx = Number(btn.dataset.index);
        setPillPosition(idx, { focusOption: true });
      }
    });
  });

  // Support keyboard navigation across the pill: Left/Right, Home, End
  pill.addEventListener('keydown', (e) => {
    const currentIndex = options.findIndex(o => o.getAttribute('aria-selected') === 'true');
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;

    if (e.key === 'ArrowRight' || e.key === 'Right') {
      nextIndex = (currentIndex + 1) % options.length;
      e.preventDefault();
      setPillPosition(nextIndex, { focusOption: true });
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
      nextIndex = (currentIndex - 1 + options.length) % options.length;
      e.preventDefault();
      setPillPosition(nextIndex, { focusOption: true });
    } else if (e.key === 'Home') {
      nextIndex = 0;
      e.preventDefault();
      setPillPosition(nextIndex, { focusOption: true });
    } else if (e.key === 'End') {
      nextIndex = options.length - 1;
      e.preventDefault();
      setPillPosition(nextIndex, { focusOption: true });
    }
  });

  // Initialize: if the pill already has pos-x on page load, reflect that; otherwise default to 0
  (function init() {
    const initial = [0, 1, 2].find(i => pill.classList.contains(`pos-${i}`));
    setPillPosition(initial === undefined ? 0 : initial, { focusOption: false });
  })();
}


document.querySelector(".hamburger").addEventListener("click", () => {
  document.getElementById("mobileSidebar").classList.add("open");
});

document.querySelector(".mobile-close").addEventListener("click", () => {
  document.getElementById("mobileSidebar").classList.remove("open");
}); 
*/

import {carData} from "./data.js"

const options = document.querySelectorAll(".pill-option")
const pill = document.querySelector('.pill')
const dropdownMenu = document.querySelector(".selector-dropdown select")
const filterLabel = document.querySelector("#filter-dropdown")
const x = "<option disabled selected>Select</option>"
const words = ["Jesus is Lord", "Obi is a boy", "Ada is a girl"];
const span = document.querySelector(".placeholder-text");
let selectedBrand
let selectedModel
let selectedYear


// ----------
// FUNCTIONS
// ----------
function loadBrandOptions(){
 dropdownMenu.innerHTML = x
 carData.forEach((b) => {
  const option = document.createElement("option")
  option.innerText = b.brand
  option.value = b.brand
  dropdownMenu.appendChild(option)
 })
}

function loadModelOptions(){
 dropdownMenu.innerHTML = x
 carData.forEach((b) => {
  b.models.forEach((m) => {
   const option = document.createElement("option")
   option.innerText = m.name
   option.value = m.name
   dropdownMenu.appendChild(option)
   })
 })
}

function filterModelOptions(b){
 dropdownMenu.innerHTML = x
 const br = carData.find((brandObject) => {
  return brandObject.brand === b
 })
 br.models.forEach((m) => {
  const option = document.createElement("option")
  option.innerText = m.name
  option.value = m.name
  pill.classList.remove("pos-0")
  pill.classList.add("pos-1")
  dropdownMenu.appendChild(option)
 })
}

function filterYearOptions(b, m){
 dropdownMenu.innerHTML = x
 const br = carData.find((brandObject) => {
  return brandObject.brand === b
 })
 const mo = br.models.find((modelObject) => {
  return modelObject.name === m
 })
 mo.years.forEach((year) => {
  const option = document.createElement("option")
  option.innerText = year
  pill.classList.remove("pos-1")
  pill.classList.add("pos-2")
  dropdownMenu.appendChild(option)
 })
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeAndDelete(words, el, options = {}) {
  const { typeSpeed = 80, deleteSpeed = 40, pauseAfterType = 700, pauseAfterDelete = 300, loops = 2 } = options;
  

  for (let loop = 0; loop < loops; loop++) {
    for (const word of words) {
      // TYPE
      for (let i = 1; i <= word.length; i++) {
        el.textContent = word.slice(0, i);
        await wait(typeSpeed);
      }
      await wait(pauseAfterType);

      // DELETE
      for (let i = word.length; i >= 0; i--) {
        el.textContent = word.slice(0, i);
        await wait(deleteSpeed);
      }
      await wait(pauseAfterDelete);
    }
  }

  el.textContent = ""; // optional, keep last word if desired
}

// ----------
// EVENT LISTENERS
// ----------
options.forEach((btn, i) => {
 btn.addEventListener("click", () => {
  const pillClass = pill.classList
  pillClass.forEach((c) => {
   if (c.startsWith("pos-")){
    pillClass.remove(c)
   }
  })
  pillClass.add(`pos-${i}`)
  filterLabel.innerText = `Select ${btn.innerText}`
  if (pillClass.contains("pos-0")){
   loadBrandOptions()
  } else if (pillClass.contains("pos-1")){
   loadModelOptions()
  }
 })
})

dropdownMenu.addEventListener("change", () => {
 if (pill.classList.contains("pos-0")){
  selectedBrand = dropdownMenu.value
  filterModelOptions(selectedBrand)
 } else if (pill.classList.contains("pos-1")){
  selectedModel = dropdownMenu.value
  filterYearOptions(selectedBrand, selectedModel)
 } else {
  selectedYear = dropdownMenu.value
 }
})

// ----------
//INITIALIZATIONS
// ----------

// loads brands from data.js
loadBrandOptions()

// start typing animation
typeAndDelete(words, span);