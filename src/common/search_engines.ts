interface SearchEnginesDictType {
    [key: string]: {
        name?: string;
        url?: string;
    };
}
// 搜索引擎
const search_engines_dict: SearchEnginesDictType = {
    bing: {
        name: "Bing",
        url: "https://www.bing.com/?ensearch=0&q=",
    },
    baidu: {
        name: "百度Baidu",
        url: "https://www.baidu.com/s?ie=utf-8&wd=",
    },
    sogou: {
        name: "搜狗Sogou",
        url: "https://sogou.com/web?query=",
    },
    google: {
        name: "Google",
        url: "https://www.google.com/search?q=",
    },
    yahoo: {
        name: "Yahoo!",
        url: "https://search.yahoo.com/search?p=",
    },
    yandex: {
        name: "Yandex",
        url: "https://yandex.com/search/?text=",
    },
    android_cn: {
        name: "中国区安卓应用",
        url: "https://h5.appstore.vivo.com.cn/#/result?keyfrom=2&keyword=",
    },
    windows_cn: {
        name: "中国区Win应用",
        url: "https://apps.microsoft.com/search?hl=zh-CN&query=",
    },
    // mac_us: {
    //     name: "Mac App",
    //     url: "https://apps.apple.com/us/mac/search?term=",
    // },
    // mac_cn: {
    //     name: "中国区Mac应用",
    //     url: "https://apps.apple.com/cn/mac/search?term=",
    // },
    android_en: {
        name: "EN APK",
        url: "https://en.divxland.org/?s=",
    },
    android_ru: {
        name: "RU APK",
        url: "https://5play.org/index.php?lang=en&do=search&subaction=search&titleonly=0&story=",
    },
    icon_images: {
        name: "PNG Image",
        url: "https://www.flaticon.com/search?word=",
    },
    svg_images: {
        name: "SVG Image",
        url: "https://icon-sets.iconify.design/?query=",
    },
    ip_domain: {
        name: "IP & Domain",
        url: "https://ipchaxun.com/",
    },
    whois: {
        name: "Whois",
        url: "https://www.whois.com/whois/",
    },
    //
};
export default search_engines_dict;