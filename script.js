const API_URL = "https://script.google.com/macros/s/AKfycbyuskkfJ5nxLnupqF75P8gqW6yWyq-CDa2DiI0HsAO11v-XhhhX8HYk1Io--zbzAcUH/exec";

// 1. برمجة قائمة الهاتف (Mobile Menu)
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');
mobileToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
});

// 2. برمجة الإشعارات (Toast Notification System)
function showToast(message) {
    const container = document.getElementById('toaster');
    const toast = document.createElement('div');
    toast.className = 'toast';
    // أيقونة الصح (Check icon)
    toast.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> <span>${message}</span>`;
    container.appendChild(toast);
    
    // إخفاء الإشعار بعد 3 ثواني
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 3. أيقونات SVG (مستخرجة من مكتبة lucide-react التي استخدمها v0)
const iconBuilding = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path></svg>`;
const iconCalendar = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`;
const iconBriefcase = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`;
const iconBell = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`;
const svgEmblem = `<svg viewBox="0 0 100 100" width="22" height="22"><path d="M50 15 L58 35 L80 35 L62 48 L70 70 L50 55 L30 70 L38 48 L20 35 L42 35 Z" fill="#004b87"/></svg>`;

// 4. جلب البيانات من Google Sheets
async function loadJobs() {
    const container = document.getElementById("jobsContainer");
    const liveJobsCount = document.getElementById("liveJobsCount");
    
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        container.innerHTML = "";

        if (!data || data.length === 0) {
            container.innerHTML = '<div class="loading-state" style="color: #dc3545;">عفواً، لا توجد إعلانات نشطة في الوقت الحالي.</div>';
            if(liveJobsCount) liveJobsCount.textContent = "0";
            return;
        }

        const reversedData = data.slice().reverse();
        
        // تحديث عداد الإحصائيات الحي
        if(liveJobsCount) liveJobsCount.textContent = reversedData.length;

        reversedData.forEach(item => {
            let cleanDate = item.date ? String(item.date).split("T")[0] : "";
            let department = item.category || "إدارة عمومية / قطاع خاص";

            const card = document.createElement("div");
            card.className = "job-card";
            
            card.innerHTML = `
                <svg viewBox="0 0 100 100" class="watermark">
                    <path d="M50 15 L58 35 L80 35 L62 48 L70 70 L50 55 L30 70 L38 48 L20 35 L42 35 Z" fill="#004b87"/>
                    <circle cx="50" cy="50" r="12" fill="#cc9933" />
                </svg>

                <div class="card-header">
                    <button class="bell-btn" onclick="showToast('تم تفعيل إشعارات المباراة بنجاح')" title="تفعيل الإشعارات">${iconBell}</button>
                    <div class="icon-group">
                        <div class="icon-box">${svgEmblem}</div>
                        <div class="icon-box">${iconBuilding}</div>
                    </div>
                </div>

                <h3 class="job-title">${item.title}</h3>
                
                <div class="job-dept">
                    <span>${department}</span>
                    ${iconBuilding}
                </div>

                <a href="news.html?id=${item.id}" class="announce-btn">التفاصيل وقرار الإعلان</a>

                <div class="card-footer">
                    <div class="meta-item">
                        <span>نوع التوظيف: ${item.tag || 'غير محدد'}</span>
                        ${iconBriefcase}
                    </div>
                    <div class="meta-item">
                        <span>تاريخ النشر: ${cleanDate}</span>
                        ${iconCalendar}
                    </div>
                    <div class="meta-item deadline">
                        <span>آخر أجل للترشيح: ${item.deadline || 'غير محدد'}</span>
                        ${iconCalendar}
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        container.innerHTML = '<div class="loading-state" style="color: #dc3545;">حدث خطأ أثناء الاتصال بقاعدة البيانات. تأكد من صلاحيات Google Apps Script.</div>';
    }
}

// بدء التشغيل عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", loadJobs);