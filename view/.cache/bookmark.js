
function bookmark_list(){
    let array_a = [ //
        // {
        //     show_lang: "all", // all en zh jp
        //     title: "",
        //     href: ""
        // },
        { //
            show_lang: "all",
            title: "虎嗅",
            href: "https://www.huxiu.com"
        },
        { //
            show_lang: "all",
            title: "IT之家手机版",
            href: "https://m.ithome.com"
        },
        { //
            show_lang: "all",
            title: "IT之家博客版",
            href: "https://blog.ithome.com"
        },
        { //
            show_lang: "all",
            title: "太平洋科技",
            href: "https://www.pconline.com.cn"
        },
        { //
            show_lang: "all",
            title: "MacRumors",
            href: "https://www.macrumors.com"
        },
        { //
            show_lang: "all",
            title: "新浪财经7x24",
            href: "https://finance.sina.com.cn/7x24/"
        },
        { //
            show_lang: "all",
            title: "新浪行情",
            href: "https://gu.sina.cn/#/index/index"
        },
        { //
            show_lang: "all",
            title: "V2EX",
            href: "https://v2ex.com"
        },
        { //
            show_lang: "all",
            title: "万年日历",
            href: "https://wannianrili.bmcx.com"
        },
        { //
            show_lang: "all",
            title: "中科大网速测试",
            href: "https://test.ustc.edu.cn"
        },
        { //
            show_lang: "all",
            title: "CCTV17农业",
            href: "https://tv.cctv.cn/live/cctv17/"
        },
        { //
            show_lang: "all",
            title: "CCTV7军事",
            href: "https://tv.cctv.cn/live/cctv7/"
        },
        { //
            show_lang: "all",
            title: "CCTV14少儿",
            href: "https://tv.cctv.cn/live/cctvchild/"
        },
        { //
            show_lang: "all",
            title: "iOS Release",
            href: "https://developer.apple.com/documentation/ios-ipados-release-notes"
        },
        { //
            show_lang: "all",
            title: "MacOS Release",
            href: "https://developer.apple.com/documentation/macos-release-notes"
        },

        { //
            show_lang: "all",
            title: "B站-极客湾",
            href: "https://space.bilibili.com/25876945/"
        },
        { //
            show_lang: "all",
            title: "B站-淘沙博士",
            href: "https://space.bilibili.com/289706107/"
        },
        { //
            show_lang: "all",
            title: "B站-LAO曦子",
            href: "https://space.bilibili.com/33882856"
        },
        { //
            show_lang: "all",
            title: "YouTube",
            href: "https://youtube.com"
        },
        { //
            show_lang: "all",
            title: "喵磁力",
            href: "https://www.miaocili.com/"
        },

    ];
    //
    array_a.forEach((info, index)=>{
        let num = index+1; if (num<10){num="0"+num;}
        let show_lang = info.show_lang;
        let title = info.title;
        let href = info.href;
        if ( // 根据系统语言展示相关内容
            show_lang === "all" ||
            (show_lang === "en" && lang_eq === 1) ||
            (show_lang === "zh" && lang_eq === 0) ||
            (show_lang === "zh-tw" && lang_eq === 2) ||
            (show_lang === "jp" && lang_eq === 3)
        ){
            let dom_a = '<div style="margin-bottom: 10px;margin-top: 10px; line-height: 26px;" class="a-click break click font-title" data-href="'+href+'" data-title="'+title+'" data-target="_blank" ><div class="break">' + num + '：' +title+'</div></div>';
            $(".bookmark-list").append(dom_a);
        }
    });
    $(".bookmark-list").append('<hr/>');
}

//
let bookmark_title = "<div style='width: calc(100% - 20px);'>" +
    "<div><span style='font-weight: 700;'>BOOKMARK</div>" +
    "</div>";
let bookmark_dom = `<hr/><div class="clear"></div>
<div class="bookmark-list"></div>
<div class="clear"></div><br/><br/><br/>`;
