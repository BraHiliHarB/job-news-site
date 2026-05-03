const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("show");
  menuBtn.textContent = navLinks.classList.contains("show") ? "×" : "☰";
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("show");
    menuBtn.textContent = "☰";
  });
});

const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".news-card");

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    filters.forEach((btn) => btn.classList.remove("active"));
    filter.classList.add("active");

    const selected = filter.dataset.filter;

    cards.forEach((card) => {
      card.style.display =
        selected === "all" || card.dataset.category === selected
          ? "block"
          : "none";
    });
  });
});

const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

searchBtn.addEventListener("click", () => {
  const keyword = searchInput.value.trim().toLowerCase();

  if (!keyword) {
    alert("اكتب كلمة للبحث أولاً");
    return;
  }

  cards.forEach((card) => {
    const text = card.innerText.toLowerCase();
    card.style.display = text.includes(keyword) ? "block" : "none";
  });
});