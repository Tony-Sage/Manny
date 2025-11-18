
import { typeWriterEffect, typeWriterPlaceholder} from './typewriter.js';
import { autoParts } from './data.js';

// Create a container to display search results
const resultsContainer = document.createElement('div');
resultsContainer.classList.add('search-results');
document.querySelector('#results-section').appendChild(resultsContainer);

const searchInput = document.querySelector("#searchInput");
const placeholderWords = ["name (eg: brake pads)", "street name (eg: iron pipe)", "use (eg: used in brakes)", "keywords (eg: brakes)"];
  

function search() {
 const query = searchInput.value.trim().toLowerCase();
 resultsContainer.innerHTML = ''; // clear previous results

 if (query === '') return; // if input is empty, stop here

 // Filter auto parts based on name, streetName, use, or keywords
 const results = autoParts.filter(part => {
  return (
   part.name.toLowerCase().includes(query) ||
   part.streetName.toLowerCase().includes(query) ||
   part.use.toLowerCase().includes(query) ||
   part.keywords.forEach(keyword => {keyword.toLowerCase().includes(query)})
  );
 });

 // Display results
 if (results.length > 0) {
  results.forEach(part => {
   const item = document.createElement('div');
   item.classList.add('result-item');
   item.innerHTML = `
    <div class="result-tag">Available</div>
    <img src="${part.picture}" alt="${part.name}" class="result-img" />
    <div class="result-info">
     <h4>${part.name}</h4>
     <p>${part.streetName}</p>
     <small>${part.use}</small>
    </div>
    <button class="order-btn" 
    onclick="window.open('https://wa.me/+237697436198?text=Hi! I’d like to place an order for ${encodeURIComponent(part.name)}.', '_blank')">
    Place Order
    </button>`;
   resultsContainer.appendChild(item);
  });
  showModal()
 } else {
  resultsContainer.innerHTML = '<p class="no-results">No parts found.</p>';
 }
}

// Modal control
function showModal() {
  const modal = document.getElementById('infoModal');
  const closeBtn = document.getElementById('closeModalBtn');

  // Only show once per session
  if (sessionStorage.getItem('modalShown')) return;

  modal.style.display = 'flex';
  sessionStorage.setItem('modalShown', 'true');

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Run typing animation for on-page spans
  document.querySelectorAll('.typing, .typing-alt').forEach(span => {
    const words = JSON.parse(span.getAttribute('data-words'));
    typeWriterEffect(span, words);
  });

  // Typing animation for placeholder
  typeWriterPlaceholder(searchInput, placeholderWords);
});

// Listen for input changes
searchInput.addEventListener('input', search)

document.querySelector("#results-section").addEventListener("click", (e) => {
  const resultItem = e.target.closest(".result-item");
  
  if (!resultItem) return;

  if (e.target.classList.contains("order-btn")) return;

  const partName = resultItem.querySelector("h4").textContent.trim();
  const searchURL = `https://www.google.com/search?q=${encodeURIComponent(partName)} auto part`;
  
  window.open(searchURL, "_blank");
});