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
        url: "https://www.bing.com/?ensearch=0&adlt=strict&q=",
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
        url: "https://www.google.com/search?safe=active&num=50&q=",
    },
    yahoo: {
        name: "Yahoo!",
        url: "https://search.yahoo.com/search?p=",
    },
    yandex: {
        name: "Yandex",
        url: "https://yandex.com/search/?filter=none&text=",
    },
    whois: {
        name: "域名Whois",
        url: "https://www.whois.com/whois/",
    },
    photo_images: {
        name: "Photo Image",
        url: "https://pixabay.com/zh/photos/",
    },
    icon_images: {
        name: "PNG ICON Image",
        url: "https://www.flaticon.com/search?word=",
    },
    svg_images: {
        name: "SVG ICON Image",
        url: "https://icon-sets.iconify.design/?query=",
    },
    //
    // android_cn: {
    //     name: "中国区安卓应用",
    //     url: "https://h5.appstore.vivo.com.cn/#/result?keyfrom=2&keyword=",
    // },
    // android_en: {
    //     name: "En APK",
    //     url: "https://www.bing.com/?ensearch=0&adlt=strict&q=Malavida APK ",
    // },
    // windows_cn: {
    //     name: "Win App",
    //     url: "https://apps.microsoft.com/search?hl=en-US&query=",
    // },
    // mac_us: {
    //     name: "Mac App",
    //     url: "https://apps.apple.com/us/mac/search?term=",
    // },
    // mac_cn: {
    //     name: "中国区Mac应用",
    //     url: "https://apps.apple.com/cn/mac/search?term=",
    // },
    // android_en: {
    //     name: "EN APK",
    //     url: "https://en.divxland.org/?s=",
    // },
    // android_ru: {
    //     name: "RU APK",
    //     url: "https://5play.org/index.php?lang=en&do=search&subaction=search&titleonly=0&story=",
    // },
};
export default search_engines_dict;