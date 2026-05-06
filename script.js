const API_URL = "https://script.google.com/macros/s/AKfycbyuskkfJ5nxLnupqF75P8gqW6yWyq-CDa2DiI0HsAO11v-XhhhX8HYk1Io--zbzAcUH/exec";

// أكواد SVG للأيقونات المتطابقة مع الموقع الرسمي
const svgBuilding = `<svg class="meta-icon" viewBox="0 0 24 24"><path d="M12 2L2 7l4 2v10l6 3 6-3V9l4-2-10-5zM6 18v-8l6 3v8l-6-3zm12-8v8l-6 3v-8l6-3z"/></svg>`;
const svgHourglass = `<svg class="meta-icon" viewBox="0 0 24 24"><path d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6zm10 14.5V20H8v-3.5l4-4 4 4zm-4-5l-4-4V4h8v3.5l-4 4z"/></svg>`;
const svgBell = `<svg class="bell-svg" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>`;

async function loadOfficialJobs() {
    const container = document.getElementById("jobsContainer");
    const countDisplay = document.getElementById("resultsCount");
    if (!container) return;

    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        container.innerHTML = "";

        if (!data || data.length === 0) {
            countDisplay.textContent = "لم يتم العثور على أي نتائج.";
            return;
        }

        // عكس المصفوفة لعرض الأحدث أولاً
        const reversedData = data.slice().reverse();
        countDisplay.textContent = `تم العثور على ${reversedData.length} النتائج`;

        reversedData.forEach(item => {
            // تصميم البطاقة المطابق
            const card = document.createElement("div");
            card.className = "job-row";
            
            // تحديد اسم القطاع (وزارة أو شركة)
            let department = item.tag === "القطاع الخاص" ? "القطاع الخاص / شركات" : "قطاع عام / وزارة";
            if(item.title.includes("وزارة")) {
                department = "قطاع حكومي";
            }

            card.innerHTML = `
                <div class="job-details">
                    <h3 class="job-title">${item.title}</h3>
                    
                    <div class="job-meta-list">
                        <div class="meta-item">
                            ${svgBuilding}
                            <span>${department} (${item.country || 'المغرب'})</span>
                        </div>
                        <div class="meta-item">
                            ${svgHourglass}
                            <span>آخر أجل لإيداع ملفات الترشيح: ${item.deadline || 'غير محدد'}</span>
                        </div>
                    </div>
                </div>

                <div class="job-actions">
                    <div class="bell-icon-wrapper" title="تفعيل الإشعارات">
                        ${svgBell}
                    </div>
                    <!-- زر الإعلان يأخذنا لصفحة news.html لنرى التفاصيل و PDF -->
                    <a href="news.html?id=${item.id}" class="btn-announce">الإعلان</a>
                </div>
            `;
            
            container.appendChild(card);
        });

    } catch (error) {
        console.error("Error:", error);
        countDisplay.textContent = "حدث خطأ أثناء جلب البيانات.";
    }
}

document.addEventListener("DOMContentLoaded", loadOfficialJobs);