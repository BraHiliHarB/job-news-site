const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

const API_URL = "https://script.google.com/macros/s/AKfycbziph2ncuar_liWyyieIln2RBbMfBolBcep9oyPa_HOGHBjMcaNczY3qc556CR-2pzX/exec";

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("show");
    menuBtn.textContent = navLinks.classList.contains("show") ? "×" : "☰";
  });
}

async function loadNews() {
  try {
    const res = await fetch(API_URL);
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
        <a href="news.html?id=${item.id}">اقرأ التفاصيل ←</a>
      `;

      newsGrid.appendChild(card);
    });

    setupFilters();
    setupSearch();

  } catch (error) {
    console.error("خطأ في تحميل الأخبار:", error);
  }
}

function setupFilters() {
  const filters = document.querySelectorAll(".filter");

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      filters.forEach((btn) => btn.classList.remove("active"));
      filter.classList.add("active");

      const selected = filter.dataset.filter;
      const cards = document.querySelectorAll(".news-card");

      cards.forEach((card) => {
        card.style.display =
          selected === "all" || card.dataset.category === selected
            ? "block"
            : "none";
      });
    });
  });
}

function setupSearch() {
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");

  if (!searchBtn || !searchInput) return;

  searchBtn.addEventListener("click", () => {
    const keyword = searchInput.value.trim().toLowerCase();
    const cards = document.querySelectorAll(".news-card");

    cards.forEach((card) => {
      const text = card.innerText.toLowerCase();
      card.style.display = text.includes(keyword) ? "block" : "none";
    });
  });
}

loadNews();