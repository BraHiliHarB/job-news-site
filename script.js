// 1. رابط الـ API الخاص بك من Google Apps Script
const API_URL = "https://script.google.com/macros/s/AKfycbxIliIDLQ1JaKdpQhpKSAlMoS0OXr3Rvx04eaLWxGLfFU7hIfJQQVEp4jb0XTl28glH/exec";

// 2. التحكم في قائمة الهاتف (Mobile Menu)
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');
if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });
}

// 3. نظام الإشعارات (Toast System)
function showToast(message) {
    const container = document.getElementById('toaster');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg> 
        <span>${message}</span>`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 4. الأيقونات المستخدمة في البطاقات
const iconBuilding = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path></svg>`;
const iconCalendar = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`;
const iconBriefcase = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`;
const iconBell = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`;
const svgEmblem = `<svg viewBox="0 0 100 100" width="22" height="22"><path d="M50 15 L58 35 L80 35 L62 48 L70 70 L50 55 L30 70 L38 48 L20 35 L42 35 Z" fill="#d4af37"/></svg>`;

// 5. دالة العداد التصاعدي للإحصائيات
function animateCounter(id, target) {
    const el = document.getElementById(id);
    if (!el || isNaN(target)) return;
    let current = 0;
    const duration = 1000; // مدة الحركة بالملي ثانية
    const stepTime = 20;
    const increment = target / (duration / stepTime);
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            el.innerText = Math.floor(target);
            clearInterval(timer);
        } else {
            el.innerText = Math.floor(current);
        }
    }, stepTime);
}

// 6. المحرك الرئيسي لجلب البيانات من الشيت
async function loadJobs() {
    const container = document.getElementById("jobsContainer");
    if (!container) return;
    
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        container.innerHTML = "";

        if (!data || data.length === 0) {
            container.innerHTML = '<div class="loading-state" style="color: #d4af37; text-align:center; width:100%; grid-column: 1/-1;">عفواً، لا توجد إعلانات نشطة حالياً.</div>';
            return;
        }

        // عكس البيانات ليظهر الأحدث أولاً
        const reversedData = data.slice().reverse();
        
        // عدادات الإحصائيات
        let counts = { وظيفة: 0, هجرة: 0, منحة: 0, تطوع: 0 };

        reversedData.forEach(item => {
            // تصنيف الإحصائيات
            let tag = (item.tag || "وظيفة").trim();
            if (counts.hasOwnProperty(tag)) {
                counts[tag]++;
            } else {
                counts["وظيفة"]++;
            }

            // إعداد بيانات البطاقة
            let cleanDate = item.publish || item.date || "قريباً";
            let department = item.category || "قطاع عام";

            const card = document.createElement("div");
            card.className = "job-card";
            card.innerHTML = `
                <div class="card-header">
                    <button class="bell-btn" onclick="showToast('تم تفعيل إشعارات هذه الفرصة')" title="تفعيل الإشعارات">${iconBell}</button>
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
                
                <a href="news.html?id=${item.id}" class="announce-btn">إقرأ المزيد والتفاصيل</a>

                <div class="card-footer">
                    <div class="meta-item">
                        <span>النوع: ${tag}</span>
                        ${iconBriefcase}
                    </div>
                    <div class="meta-item">
                        <span>تاريخ النشر: ${cleanDate}</span>
                        ${iconCalendar}
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

        // تشغيل العدادات في أعلى الموقع
        animateCounter("statJobs", counts["وظيفة"]);
        animateCounter("statImmigration", counts["هجرة"]);
        animateCounter("statScholarships", counts["منحة"]);
        animateCounter("statVolunteer", counts["تطوع"]);

    } catch (error) {
        console.error("Connection Error:", error);
        container.innerHTML = '<div class="loading-state" style="color: #dc3545; grid-column: 1/-1; text-align:center;">حدث خطأ أثناء الاتصال بقاعدة البيانات. تأكد من إعدادات النشر (Deploy).</div>';
    }
}

// تشغيل المحرك عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", loadJobs);