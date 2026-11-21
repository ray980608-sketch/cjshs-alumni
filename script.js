// ==========================================================================
// 長榮校友辦公室 - 全站共用腳本
// ==========================================================================

// script.js 放在網站根目錄，用它自己的位置推算根目錄網址，
// 不論頁面在根目錄、子資料夾、本機或 GitHub Pages 都能正確定位。
const SITE_ROOT = new URL('./', document.currentScript.src);

// ==========================================================================
// 1. 共用 Header / Footer 載入器
// ==========================================================================
// header.html / footer.html 裡的路徑以「../」開頭（以子資料夾頁面為基準），
// 載入後一律改寫成從網站根目錄出發的絕對網址。
function fixPartialPaths(container) {
    container.querySelectorAll('[href], [src]').forEach(el => {
        ['href', 'src'].forEach(attr => {
            const val = el.getAttribute(attr);
            if (val && val.startsWith('../')) {
                el.setAttribute(attr, new URL(val.replace(/^(\.\.\/)+/, ''), SITE_ROOT).href);
            }
        });
    });
}

function loadPartial(containerId, fileName, onLoaded) {
    const container = document.getElementById(containerId);
    if (!container) return;

    fetch(new URL(fileName, SITE_ROOT))
        .then(response => {
            if (!response.ok) throw new Error(`${fileName} 載入失敗`);
            return response.text();
        })
        .then(html => {
            container.innerHTML = html;
            fixPartialPaths(container);
            if (onLoaded) onLoaded();
        })
        .catch(err => console.warn(err));
}

// ==========================================================================
// 2. 手機版導覽列：點擊大項摺疊展開
// ==========================================================================
function handleMobileDropdown(e) {
    e.preventDefault();
    e.stopPropagation();

    const nextMenu = this.nextElementSibling;
    if (nextMenu) nextMenu.classList.toggle('active');
}

function initMobileMenu() {
    if (window.innerWidth > 992) return;

    document.querySelectorAll('.dropdown-toggle, .nested-toggle').forEach(toggle => {
        // 同一個函式重複 add 不會重複觸發，先 remove 只是保險
        toggle.removeEventListener('click', handleMobileDropdown);
        toggle.addEventListener('click', handleMobileDropdown);
    });
}

// ==========================================================================
// 3. 首頁最新消息渲染（資料來源：news-data.js）
// ==========================================================================
function renderIndexNews() {
    const newsContainer = document.getElementById('index-news-container');
    if (!newsContainer || typeof newsData === 'undefined') return;

    newsContainer.innerHTML = newsData.map(item => {
        // 擷取前 50 個字，超過則加上省略號
        const cleanText = item.fullContent.replace(/<[^>]*>?/gm, '').trim();
        const shortExcerpt = cleanText.length > 50 ? cleanText.substring(0, 50) + '...' : cleanText;

        const goldClass = item.isGold ? 'gold-border' : '';
        const posterBadge = item.posterUrl ? '<span class="poster-tag">📌 附宣傳海報</span>' : '';

        return `
            <article class="news-custom-card ${goldClass}">
                <div class="news-card-img-box">
                    <img src="${item.imgUrl}" alt="${item.title}" class="news-card-img">
                </div>
                <div class="news-card-inner">
                    <span class="news-card-meta">${item.date} · ${item.category} ${posterBadge}</span>
                    <h3 class="news-card-heading">${item.title}</h3>
                    <p class="news-card-paragraph">${shortExcerpt}</p>
                    <a href="${item.detailUrl}" class="news-card-btn">閱讀全文 ➔</a>
                </div>
            </article>
        `;
    }).join('');
}

// ==========================================================================
// 4. 長中人文：故事分類篩選
// ==========================================================================
function initStoryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const storyItems = document.querySelectorAll('.story-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const selectedCategory = button.getAttribute('data-category');
            storyItems.forEach(item => {
                const match = selectedCategory === 'all' || item.getAttribute('data-category') === selectedCategory;
                item.style.display = match ? 'flex' : 'none';
            });
        });
    });
}

// ==========================================================================
// 啟動
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    loadPartial('site-header-container', 'header.html', initMobileMenu);
    loadPartial('site-footer-container', 'footer.html');

    initMobileMenu(); // 首頁的導覽列直接寫在 index.html 內
    renderIndexNews();
    initStoryFilter();
});

// 從電腦版切換到手機寬度時，補綁定手機選單
window.addEventListener('resize', initMobileMenu);
