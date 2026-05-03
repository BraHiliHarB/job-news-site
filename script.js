async function loadNews() {
  const res = await fetch("news-data.json");
  const data = await res.json();

  const newsGrid = document.getElementById("newsGrid");
  newsGrid.innerHTML = "";

  data.forEach(item => {
    const card = document.createElement("div");

    card.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <a href="news.html?id=${item.id}">اقرأ التفاصيل</a>
    `;

    newsGrid.appendChild(card);
  });
}

loadNews();