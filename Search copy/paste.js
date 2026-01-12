// search.js

const searchInput = document.querySelector("#search-input");
const resultsSection = document.querySelector("#results-section");

// Function to fetch search results
async function searchParts(query) {
  if (!query) return [];
  
  const res = await fetch(`http://localhost:4000/search?q=${query}`);
  const parts = await res.json();
  return parts;
}

// Function to fetch part info
async function getPartInfo(partId, brand, model, year) {
  const res = await fetch(
    `http://localhost:4000/search/${partId}/info?brand=${brand}&model=${model}&year=${year}`
  );
  const info = await res.json();
  return info;
}

// Function to render result cards
function renderResults(parts) {
  resultsSection.innerHTML = "";

  if (parts.length === 0) {
    resultsSection.innerHTML = "<p>No results found</p>";
    return;
  }

  parts.forEach(part => {
    const card = document.createElement("div");
    card.classList.add("result-card");
    card.innerHTML = `
      <h3>${part.name}</h3>
      <p>${part.description}</p>
      <button class="view-info-btn">View Info</button>
    `;

    // Add click listener to fetch and show part info
    card.querySelector(".view-info-btn").addEventListener("click", async () => {
      const brand = part.brand || ""; // adjust based on your data
      const model = part.model || ""; // adjust based on your data
      const year = part.year || "";   // adjust based on your data

      const info = await getPartInfo(part.id, brand, model, year);
      showPartInfoModal(info);
    });

    resultsSection.appendChild(card);
  });
}

// Function to generate dynamic tabs and display part info
function showPartInfoModal(info) {
  const modal = document.createElement("div");
  modal.classList.add("info-modal");
  modal.innerHTML = `<div class="modal-content">
    <span class="close-btn">&times;</span>
    <h2>${info.name}</h2>
    <div class="tabs"></div>
    <div class="tab-content"></div>
  </div>`;

  document.body.appendChild(modal);

  const tabsContainer = modal.querySelector(".tabs");
  const tabContent = modal.querySelector(".tab-content");

  // Dynamically generate tabs from categories
  info.categories.forEach((category, index) => {
    const tabBtn = document.createElement("button");
    tabBtn.textContent = category.name;
    tabBtn.classList.add("tab-btn");
    if (index === 0) tabBtn.classList.add("active"); // default first tab active

    tabBtn.addEventListener("click", () => {
      // Remove active from all tabs
      modal.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
      tabBtn.classList.add("active");
      renderTabContent(category);
    });

    tabsContainer.appendChild(tabBtn);
  });

  // Render first tab by default
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

  // Close modal functionality
  modal.querySelector(".close-btn").addEventListener("click", () => {
    document.body.removeChild(modal);
  });
}

// Search input listener
searchInput.addEventListener("input", async (e) => {
  const query = e.target.value.trim();
  const results = await searchParts(query);
  renderResults(results);
});
