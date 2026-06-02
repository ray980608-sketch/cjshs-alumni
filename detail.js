// ==========================================================================
// 長榮校友會 - 新聞內頁邏輯控制端 (資料已由 news-data.js 供應)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const newsId = parseInt(urlParams.get('id'));

    const currentNews = newsData.find(item => item.id === newsId);

    if (!currentNews) {
        alert('抱歉，找不到該篇新聞內容！');
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('js-meta-category').innerText = currentNews.category;
    document.getElementById('js-news-date').innerText = currentNews.date;
    document.getElementById('js-news-category').innerText = currentNews.category;
    document.getElementById('js-news-title').innerText = currentNews.title;

    const mediaContainer = document.getElementById('js-media-container');
    
    // ✨ 全自動動態媒體切換系統
    if (currentNews.youtubeId && currentNews.youtubeId.trim() !== "") {
        mediaContainer.innerHTML = `
            <div class="video-responsive-wrapper">
                <iframe 
                    src="https://www.youtube.com/embed/${currentNews.youtubeId}?rel=0&showinfo=0" 
                    title="${currentNews.title}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowfullscreen>
                </iframe>
            </div>
        `; // 💡 完美修復點：確保這裡是 </iframe>
    } else {
        mediaContainer.innerHTML = `
            <img src="${currentNews.imgUrl}" alt="${currentNews.title}" id="js-news-img" class="article-main-img">
        `;
    }

    document.getElementById('js-news-content').innerHTML = currentNews.fullContent;
    document.title = `${currentNews.title} | 長榮校友會`;
});