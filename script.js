// ==========================================================================
// 長榮校友會 - 首頁邏輯控制端 (全自動精選與歷史列表分流系統)
// ==========================================================================

// 自動抓取長內文前三句並加上省略號的功能
function generateExcerpt(htmlContent) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const pureText = tempDiv.textContent || tempDiv.innerText || "";
    const cleanedText = pureText.replace(/\s+/g, ' ').trim();
    const sentences = cleanedText.match(/[^。！？]+[。！？]/g);

    if (sentences && sentences.length > 0) {
        const topThree = sentences.slice(0, 3).join('');
        return sentences.length > 3 ? `${topThree}...` : topThree;
    }
    return cleanedText.length > 120 ? `${cleanedText.substring(0, 120)}...` : cleanedText;
}

// 核心動態渲染邏輯
function renderNews() {
    const gridContainer = document.getElementById('news-grid-container');
    const listContainer = document.getElementById('js-history-list');
    
    if (!gridContainer || !listContainer) return; // 安全檢查

    gridContainer.innerHTML = '';
    listContainer.innerHTML = '';

    // ✨ 邏輯分流 A：抓取前 2 篇最新消息，渲染成大氣的圖文卡片
    const featuredNews = newsData.slice(0, 3);
    featuredNews.forEach((news, index) => {
        const isFeatured = index === 0 ? 'featured-card' : '';
        const autoExcerpt = generateExcerpt(news.fullContent);

        const cardHtml = `
            <article class="news-card ${isFeatured}">
                <div class="news-img-box">
                    <img src="${news.imgUrl}" alt="${news.title}" class="news-img">
                </div>
                <div class="news-content">
                    <div class="news-meta">
                        <span class="news-date">${news.date}</span>
                        <span class="news-category">${news.category}</span>
                    </div>
                    <h3 class="news-title">${news.title}</h3>
                    <p class="news-excerpt">${autoExcerpt}</p>
                    <a href="news-detail.html?id=${news.id}" class="news-read-more">閱讀全文 ➔</a>
                </div>
            </article>
        `;
        gridContainer.innerHTML += cardHtml;
    });

    // ✨ 邏輯分流 B：從第 3 篇開始（index 2 以後），全自動打包進下方極簡歷史列表
    const historyNews = newsData.slice(3);
    
    if (historyNews.length === 0) {
        // 如果目前資料庫少於 3 篇，自動隱藏歷史區塊標題
        document.querySelector('.history-news-section').style.display = 'none';
    } else {
        document.querySelector('.history-news-section').style.display = 'block';
        historyNews.forEach(news => {
            const listItemHtml = `
                <li class="history-item">
                    <a href="news-detail.html?id=${news.id}" class="history-item-link">
                        <div class="history-item-meta">
                            <span class="h-date">${news.date}</span>
                            <span class="h-badge">${news.category}</span>
                        </div>
                        <h4 class="history-item-title">${news.title}</h4>
                        <span class="history-item-arrow">➔</span>
                    </a>
                </li>
            `;
            listContainer.innerHTML += listItemHtml;
        });
    }
}

document.addEventListener('DOMContentLoaded', renderNews);
// ==========================================================================
// 📱 手機版導覽列：點擊大項摺疊展開機制 (無衝突終極版)
// ==========================================================================
function initMobileMenu() {
    // 監聽畫面的寬度是否小於等於 992px
    if (window.innerWidth <= 992) {
        
        // 1. 處理第二層選單展開 (關於我們、活動訊息等)
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            // 先移除可能舊有的監聽器防止重複觸發
            toggle.removeEventListener('click', handleMobileDropdown);
            toggle.addEventListener('click', handleMobileDropdown);
        });

        // 2. 處理第三層選單展開 (傑出校友、加入校友會等)
        const nestedToggles = document.querySelectorAll('.nested-toggle');
        nestedToggles.forEach(toggle => {
            toggle.removeEventListener('click', handleMobileDropdown);
            toggle.addEventListener('click', handleMobileDropdown);
        });
    }
}

// 核心點擊處理函式
function handleMobileDropdown(e) {
    e.preventDefault(); // 徹底阻擋 <a> 標籤的預設跳躍或重新整理
    e.stopPropagation(); // 阻止事件向上冒泡
    
    const nextMenu = this.nextElementSibling;
    if (nextMenu) {
        // 切換 active 類別（如果開著就收起來，關著就推開）
        nextMenu.classList.toggle('active');
    }
}

// 頁面載入完成時執行
document.addEventListener("DOMContentLoaded", function () {
    initMobileMenu();
    
    // 監聽視窗大小改變（防止在電腦版切換成手機模擬器時沒刷新）
    window.addEventListener('resize', initMobileMenu);
});