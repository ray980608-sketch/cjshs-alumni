// 全站新聞資料庫
const newsData = [
    {
        id: 1,
        title: "「我是長榮人—星火計畫」正式啟航",
        date: "2026.06.01",
        category: "計畫公告",
        imgUrl: "images/cjshs-alumni.jpg",      // 卡片封面圖 (內文第一張大图共用)
        posterUrl: null,    // 活動海報 (若無可寫 null)
        detailUrl: "news1.html",                 // 獨立頁面連結 (或 news-detail.html?id=1)
                                 
        fullContent: "跨越百年，母校培育超過八萬名校友。我們正式發起星火計畫，串聯全球校友力量，打造專屬長榮人的互助生態圈。不論你在哪裡、從事什麼行業，歡迎點擊表單登錄校友資料，一起點亮長榮人的點點星火。"
    },
    {
        id: 2,
        title: "CEO聯誼活動 圓滿成功！",
        date: "2026.07.31",
        category: "活動紀錄",
        imgUrl: "images/IMG_3446.JPG",
        posterUrl: "images/0717-poster.jpg",      // 活動海報
        detailUrl: "news2.html",

        fullContent: "校友會辦公室成立後，第一次的聯誼會，本次聯誼會以CEO為交流主軸，促進校友之間的互動與合作。活動中，各位CEO分享了各自的經營經驗與心得，也探討了未來合作的可能性，現場氣氛熱烈，交流深入。活動圓滿成功！也成功促進辦公室發展可能！"
    },

    {
        id: 3,
        title: "高中部第18屆校友返校參加141周年校慶感恩禮拜暨揭牌典禮",
        date: "2026.07.31",
        category: "活動公布",
        imgUrl: "images/demo3.png",
        posterUrl: true,                         // 無海報
        detailUrl: "news3.html",

        fullContent: "磚情六十載．恩典百四一高中部第18屆校友返校參加141周年校慶感恩禮拜暨揭牌典禮六十年前，我們在紅磚看台上揮灑青春，將感恩化為贈禮；六十年後，歲月染白了髮絲，卻剪不斷我們對母校的深情。141周年校慶感恩禮拜暨揭牌典禮，讓我們再次回到熟悉的校園，重溫當年的美好時光，並見證母校的成長與發展。"
    }
];