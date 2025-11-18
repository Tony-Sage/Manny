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
}

function closeSideBar(){
 sideBar.style.right = "-100%"
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
mobileCloseButton.addEventListener("click", closeSideBar)

modeOptions.forEach((option) => {
 option.addEventListener("click", closeSideBar)
})

// ----------
//INITIALIZATIONS
// ----------

// loads brands from data.js
loadBrandOptions()
