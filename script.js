// MENU TOGGLE (mobile)
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("show");
    menuBtn.textContent = navLinks.classList.contains("show") ? "×" : "☰";
  });
}

// LOAD NEWS FROM JSON
async function loadNews() {
  try {
    const res = await fetch("news-data.json");
    const data = await res.json();

    const newsGrid = document.getElementById("newsGrid");
    if (!newsGrid) return;

    newsGrid.innerHTML = "";

    data.forEach((item) => {
      const card = document.createElement("article");
      card.className = "news-card";
      card.setAttribute("data-category", item.category);

      card.innerHTML = `
        <span class="tag">${item.tag}</span>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <a href="${item.link}">اقرأ التفاصيل ←</a>
      `;

      newsGrid.appendChild(card);
    });

    setupFilters();
    setupSearch();

  } catch (err) {
    console.error("Error loading news:", err);
  }
}

// FILTER SYSTEM
function setupFilters() {
  const filters = document.querySelectorAll(".filter");
  const cards = document.querySelectorAll(".news-card");

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      filters.forEach((btn) => btn.classList.remove("active"));
      filter.classList.add("active");

      const selected = filter.dataset.filter;

      cards.forEach((card) => {
        if (selected === "all" || card.dataset.category === selected) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

// SEARCH SYSTEM
function setupSearch() {
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");

  if (!searchBtn) return;

  searchBtn.addEventListener("click", () => {
    const keyword = searchInput.value.toLowerCase();
    const cards = document.querySelectorAll(".news-card");

    cards.forEach((card) => {
      const text = card.innerText.toLowerCase();
      card.style.display = text.includes(keyword) ? "block" : "none";
    });
  });
}

// START
loadNews();