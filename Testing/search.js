import {carData} from "./data.js"

const options = document.querySelectorAll(".pill-option")
const pill = document.querySelector('.pill')
const dropdownMenu = document.querySelector(".selector-dropdown select")
const filterLabel = document.querySelector("#filter-dropdown")
const x = "<option disabled selected>Select</option>"
const words = ["Jesus is Lord", "Obi is a boy", "Ada is a girl"];
const span = document.querySelector(".placeholder-text");
const sideBar = document.querySelector('#mobileSidebar')
const hamburger = document.querySelector(".hamburger")
const mobileCloseButton = document.querySelector(".mobile-close")
const modeOptions = document.querySelectorAll(".mode-option")
const PLACEHOLDER_WORDS = [
  "name (eg: brake pads)",
  "OEM number (eg: 27121-4A000)",
  "use (eg: used in the wheels)",
  "keywords (eg: wheel bearing)"
];
const searchInput = document.querySelector('.search-input')
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

function showSideBar(){
 sideBar.style.right = "0%"
 console.log("Should be open!")
}

function closeSideBar(){
 sideBar.style.right = "-100%"
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
  } else if (pillClass.contains("pos-2")){
   dropdownMenu.innerHTML = x
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

hamburger.addEventListener("click", showSideBar)

mobileCloseButton.addEventListener("click", (e) => {
 closeSideBar()
 document.querySelector(".mode-text").innerText = e.target.innerText
})

modeOptions.forEach((option) => {
 option.addEventListener("click", (e) => {
    closeSideBar()
    console.log("Should be closed!")
  })
})


document.querySelectorAll(".mode-text").forEach((text)=>{
  text.addEventListener("mouseover", () => {
    document.querySelectorAll(".mode-menu").forEach((menu)=>{
      menu.style.display = "block"
      setTimeout(() => {
        menu.style.display = "none"
      }, 2500) 
      menu.addEventListener("click", (e) => {
        text.innerText = e.target.innerText
      }) 
    })  
  })
})

// ----------
//INITIALIZATIONS
// ----------

// loads brands from data.js
loadBrandOptions()

// starts placeholder typing animation if search input exists
if (searchInput) startPlaceholderTypewriter(searchInput, PLACEHOLDER_WORDS, 90, 1300);