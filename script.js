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
document.addEventListener("DOMContentLoaded", function () {
    
    // 🔗 填入 FB 粉專帳號名稱或 ID（例如 cjshs.alumni）
    const fbPageHandle = "cjshs.alumni"; 
    
    // RSS2JSON 轉接 API
    const fbApiUrl = `https://api.rss2json.com/v1/api.json?rss_url=https://rsshub.app/facebook/page/${fbPageHandle}`;

    // 抓取 DOM 元素
    const fbCard = document.querySelector(".news-custom-card.fb-border");
    const fbImgEl = fbCard ? fbCard.querySelector(".news-card-img") : null;
    const fbDateEl = document.getElementById("fb-card-date");
    const fbTitleEl = document.getElementById("fb-card-title");
    const fbTextEl = document.getElementById("fb-card-text");
    const fbLinkEl = document.getElementById("fb-card-link");

    if (fbTextEl && fbLinkEl) {
        fetch(fbApiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.status === "ok" && data.items && data.items.length > 0) {
                    const latestPost = data.items[0]; // 取得最新貼文

                    // 1. 格式化日期
                    const postDate = new Date(latestPost.pubDate).toLocaleDateString('zh-TW', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    });

                    // 2. 處理貼文圖片 (優先抓取 thumbnail/enclosure，抓不到則用正则解析 HTML 裡面的 <img>)
                    let postImageUrl = latestPost.thumbnail || (latestPost.enclosure ? latestPost.enclosure.link : null);
                    
                    if (!postImageUrl && latestPost.description) {
                        const imgMatch = latestPost.description.match(/<img[^>]+src="([^">]+)"/);
                        if (imgMatch && imgMatch[1]) {
                            postImageUrl = imgMatch[1];
                        }
                    }

                    // 如果有成功抓到貼文圖片，替換圖片並移除 logo 特殊 padding 樣式
                    if (postImageUrl && fbImgEl) {
                        fbImgEl.src = postImageUrl;
                        fbImgEl.classList.remove("fb-img-contain"); // 切換回全幅裁切模式
                    }

                    // 3. 過濾 HTML 標籤，整理內文 (擷取 75 字)
                    const cleanText = latestPost.description
                        .replace(/<[^>]*>?/gm, '')
                        .trim()
                        .substring(0, 75) + "...";

                    // 4. 注入 DOM
                    if (fbDateEl) fbDateEl.textContent = `${postDate} · FB 最新動態`;
                    if (fbTitleEl) fbTitleEl.textContent = latestPost.title || "FB 官方最新貼文";
                    fbTextEl.textContent = cleanText;
                    fbLinkEl.href = latestPost.link;
                    fbLinkEl.textContent = "前往 FB 閱讀完整貼文 ➔";
                }
            })
            .catch(error => {
                console.log("FB 貼文動態抓取失敗，保持靜態預設畫面：", error);
            });
    }
});
// 當視窗大小改變時（如手機旋轉），自動重新整理 FB iframe 讓它重新計算最佳寬度
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        const fbIframe = document.querySelector('.fb-iframe-wrapper iframe');
        if (fbIframe) {
            // 重設 src 觸發重新渲染
            fbIframe.src = fbIframe.src;
        }
    }, 300); // 停頓 0.3 秒後執行，避免頻繁刷新的效能消耗
});


// 核心動態渲染邏輯 (防爆安全修正版)
function renderNews() {
    const gridContainer = document.getElementById('news-grid-container');
    const listContainer = document.getElementById('js-history-list');
    
    // 安全檢查：如果這個頁面沒有新聞容器，直接優雅退出，不影響後續腳本
    if (!gridContainer || !listContainer) return;

    gridContainer.innerHTML = '';
    listContainer.innerHTML = '';

    // 檢查 newsData 是否存在
    if (typeof newsData === 'undefined' || !Array.isArray(newsData)) return;

    // ✨ 邏輯分流 A：抓取前 3 篇最新消息
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

    // ✨ 邏輯分流 B：歷史列表
    const historyNews = newsData.slice(3);
    const historySection = document.querySelector('.history-news-section');
    
    if (historyNews.length === 0) {
        // 🔒 安全修復：加上 historySection ? 判斷，就算 HTML 找不到這個 Class 也絕對不爆錯！
        if (historySection) historySection.style.display = 'none';
    } else {
        if (historySection) historySection.style.display = 'block';
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

// 自動載入 Header & Footer 的組件載入器
document.addEventListener("DOMContentLoaded", function () {
    const headerContainer = document.getElementById("site-header-container");
    if (headerContainer) {
        fetch("header.html")
            .then(response => {
                if (!response.ok) throw new Error("Header 載入失敗");
                return response.text();
            })
            .then(html => {
                headerContainer.innerHTML = html;
                initMobileMenu(); // 載入完 HTML 後重新綁定手機選單事件
            })
            .catch(err => console.warn("Header 載入異常：", err));
    }
});

// ==========================================================================
// 全站通用組件動態載入器 (Header & Footer)
// ==========================================================================
document.addEventListener("DOMContentLoaded", function () {
    
    // 1. 動態載入 Header
    const headerContainer = document.getElementById("site-header-container");
    if (headerContainer) {
        fetch("header.html")
            .then(response => {
                if (!response.ok) throw new Error("Header 載入失敗");
                return response.text();
            })
            .then(html => {
                headerContainer.innerHTML = html;
                initMobileMenu(); // ⚠️ Header 載入完成後，必須重新綁定手機版下拉選單事件！
            })
            .catch(err => console.warn("Header 載入異常：", err));
    }

    // 2. 動態載入 Footer
    const footerContainer = document.getElementById("site-footer-container");
    if (footerContainer) {
        fetch("footer.html")
            .then(response => {
                if (!response.ok) throw new Error("Footer 載入失敗");
                return response.text();
            })
            .then(html => {
                footerContainer.innerHTML = html;
            })
            .catch(err => console.warn("Footer 載入異常：", err));
    }

});
// ==========================================================================
// 全站通用組件動態載入器 (Header & Footer 自動相容子資料夾)
// ==========================================================================
document.addEventListener("DOMContentLoaded", function () {
    // 自動判斷是否在子資料夾 (例如 /about/)
    const isInSubfolder = window.location.pathname.includes('/about/') || window.location.pathname.split('/').length > 2;
    const basePath = isInSubfolder ? '../' : './';

    // 1. 動態載入 Header
    const headerContainer = document.getElementById("site-header-container");
    if (headerContainer) {
        fetch(basePath + "header.html")
            .then(response => {
                if (!response.ok) throw new Error("Header 載入失敗");
                return response.text();
            })
            .then(html => {
                headerContainer.innerHTML = html;
                if (typeof initMobileMenu === 'function') {
                    initMobileMenu(); // 綁定手機版菜單
                }
            })
            .catch(err => console.warn("Header 載入異常：", err));
    }

    // 2. 動態載入 Footer
    const footerContainer = document.getElementById("site-footer-container");
    if (footerContainer) {
        fetch(basePath + "footer.html")
            .then(response => {
                if (!response.ok) throw new Error("Footer 載入失敗");
                return response.text();
            })
            .then(html => {
                footerContainer.innerHTML = html;
            })
            .catch(err => console.warn("Footer 載入異常：", err));
    }
});
// ==========================================================================
// 首頁新聞動態渲染系統 (含 50 字截斷與海報標示)
// ==========================================================================
function renderIndexNews() {
    const newsContainer = document.getElementById('index-news-container');
    if (!newsContainer || typeof newsData === 'undefined') return;

    newsContainer.innerHTML = ''; // 清空容器

    newsData.forEach(item => {
        // 1. 自動擷取前 50 個字，超過則加上省略號
        const cleanText = item.fullContent.replace(/<[^>]*>?/gm, '').trim();
        const shortExcerpt = cleanText.length > 50 
            ? cleanText.substring(0, 50) + '...' 
            : cleanText;

        // 2. 判斷卡片樣式 (金邊與海報 Tag)
        const goldClass = item.isGold ? 'gold-border' : '';
        const posterBadge = item.posterUrl ? '<span class="poster-tag">📌 附宣傳海報</span>' : '';

        // 3. 組合 HTML
        const cardHtml = `
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

        newsContainer.innerHTML += cardHtml;
    });
}

// 頁面載入後自動觸發渲染
document.addEventListener('DOMContentLoaded', renderIndexNews);

// 假設這是你載入 Header 的邏輯
const pathPrefix = getPathPrefix(); // 自動計算目前頁面需要退幾層

fetch(pathPrefix + 'header.html') // 自動抓取正確位置的 header.html
    .then(response => response.text())
    .then(data => {
        document.getElementById('header-container').innerHTML = data;

        // 💡 關鍵修正：將 Header 內所有帶有 ../ 的路徑，統一修正為目前頁面該有的相對層級
        const elements = document.querySelectorAll('#header-container a, #header-container img');
        
        elements.forEach(el => {
            ['href', 'src'].forEach(attr => {
                const val = el.getAttribute(attr);
                // 如果原本路徑是以 ../ 開頭
                if (val && val.startsWith('../')) {
                    // 先把原本的 ../ 拿掉，再加上目前頁面正確的 pathPrefix
                    const cleanPath = val.replace(/^(\.\.\/)+/, '');
                    el.setAttribute(attr, pathPrefix + cleanPath);
                }
            });
        });
    });

/**
 * 🧮 自動計算當前頁面相對於專案根目錄的層級前綴
 * 如果在首頁 (index.html) -> 回傳 ""
 * 如果在一層子資料夾 (about/about.html) -> 回傳 "../"
 * 如果在兩層子資料夾 (a/b/page.html) -> 回傳 "../../"
 */
function getPathPrefix() {
    const path = window.location.pathname;
    
    // 如果是首頁或根目錄，回傳空字串
    if (path.endsWith('/') || path.endsWith('/index.html')) {
        return '';
    }

    // 計算專案名稱後面的子資料夾深度
    // 以 GitHub Pages 網址 /cjshs-alumni/about/about.html 為例：
    // 切割後的層級數可以準確算出需要補幾個 ../
    const segments = path.split('/').filter(Boolean);
    
    // 如果網址包含 repository 名稱 (cjshs-alumni)，扣除專案名與檔名
    const repoName = 'cjshs-alumni'; // 👈 請確認這跟你的 GitHub 儲存庫名稱完全一致
    let depth = 0;
    
    if (segments.includes(repoName)) {
        const repoIndex = segments.indexOf(repoName);
        // 深度 = 總長度 - 專案目錄索引 - 1(專案本身) - 1(檔名)
        depth = segments.length - repoIndex - 2;
    } else {
        // 本地 Live Server 情況 (沒有 repository 名稱)
        depth = segments.length - 1;
    }

    return '../'.repeat(Math.max(0, depth));
}
// 1. 先判斷目前頁面「是不是首頁」
const isHomePage = window.location.pathname.endsWith('/') || 
                   window.location.pathname.endsWith('/index.html');

// 2. 根據所在位置，決定抓取 header.html 的路徑
const headerPath = isHomePage ? './header.html' : '../header.html';

fetch(headerPath)
    .then(response => {
        if (!response.ok) throw new Error('Header 載入失敗');
        return response.text();
    })
    .then(html => {
        const headerContainer = document.getElementById('header-container');
        headerContainer.innerHTML = html;

        // 3. 🎯 核心邏輯：
        // 如果目前在【首頁】，把 header 裡面多餘的 ../ 全部拿掉（因為首頁就在最外層）
        // 如果目前在【子資料夾分頁】，原本 header.html 裡的 ../ 就完全保留不用動！
        if (isHomePage) {
            const elements = headerContainer.querySelectorAll('a, img');
            elements.forEach(el => {
                ['href', 'src'].forEach(attr => {
                    const val = el.getAttribute(attr);
                    if (val && val.startsWith('../')) {
                        // 把開頭的 ../ 替換掉，變成直接指向子資料夾或同層檔案
                        el.setAttribute(attr, val.replace(/^\.\.\//, './'));
                    }
                });
            });
        }
    })
    .catch(err => console.error(err));

    // 確保 DOM 載入後執行
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const storyItems = document.querySelectorAll('.story-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 1. 切換按鈕 active 樣式
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // 2. 取得點擊的分類名稱
            const selectedCategory = button.getAttribute('data-category');

            // 3. 篩選故事清單
            storyItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');

                if (selectedCategory === 'all' || itemCategory === selectedCategory) {
                    item.style.display = 'flex'; // 顯示符合條件的項目
                } else {
                    item.style.display = 'none'; // 隱藏不符合的項目
                }
            });
        });
    });
});