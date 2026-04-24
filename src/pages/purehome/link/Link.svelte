<script lang="ts">
    import { resolve } from '$app/paths';
    import func from "../../../common/func.svelte.js";
    import {afterNavigate} from "$app/navigation";
    import {onMount} from "svelte";
    import {browser_ok, runtime_ok} from "../../../services/middleware.svelte";
    import {browser} from "$app/environment";

    
    // 本页面参数
    let route = $state(func.get_route());
    const link_data = [
        {
            name: func.get_translate("link_news"),
            list: [
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("虎嗅"),
                    href: func.string_to_unicode("https://www.huxiu.com")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("联合早报"),
                    href: func.string_to_unicode("https://yzaobao.com")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("南方周末"),
                    href: func.string_to_unicode("https://www.infzm.com")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("IT之家"),
                    href: func.string_to_unicode("https://m.ithome.com")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("太平洋科技"),
                    href: func.string_to_unicode("https://news.pconline.com.cn/broadcasting/")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("MacRumors"),
                    href: func.string_to_unicode("https://www.macrumors.com")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("少数派"),
                    href: func.string_to_unicode("https://sspai.com/")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("搜狐新闻"),
                    href: func.string_to_unicode("https://sohu.com")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("CNN"),
                    href: func.string_to_unicode("https://edition.cnn.com/world")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("新浪财经"),
                    href: func.string_to_unicode("https://finance.sina.com.cn/7x24/")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("新浪行情"),
                    href: func.string_to_unicode("https://gu.sina.cn/#/index/index")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("雪球话题"),
                    href: func.string_to_unicode("https://xueqiu.com/today")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("系统极客"),
                    href: func.string_to_unicode("https://www.sysgeek.cn/")
                },

            ],
        },
        {
            name: func.get_translate("link_tools"),
            list: [
                { //
                    show_lang: "all",
                    title: func.string_to_unicode(func.get_translate("Calculator")),
                    href: func.string_to_unicode("@calculator")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode(func.get_translate("qr")),
                    href: func.string_to_unicode("@qr")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("Ping/IP/Agent"),
                    href: func.string_to_unicode("@info")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("毒蘑菇测试"),
                    href: func.string_to_unicode("@dumogu")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("网速测试USTC"),
                    href: func.string_to_unicode("https://test.ustc.edu.cn")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("Speedtest.net"),
                    href: func.string_to_unicode("https://www.speedtest.net/")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("万年日历"),
                    href: func.string_to_unicode("https://wannianrili.bmcx.com")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("Windy天气"),
                    href: func.string_to_unicode("https://www.windy.com")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("🧲喵磁力"),
                    href: func.string_to_unicode("https://www.miaocili.com/")
                },

            ],
        },
        {
            name: func.get_translate("link_subscribe"),
            list: [
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("CCTV1综合"),
                    href: func.string_to_unicode("https://tv.cctv.cn/live/cctv1/")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("CCTV17农业"),
                    href: func.string_to_unicode("https://tv.cctv.cn/live/cctv17/")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("CCTV14少儿"),
                    href: func.string_to_unicode("https://tv.cctv.cn/live/cctvchild/")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("B站-极客湾"),
                    href: func.string_to_unicode("https://space.bilibili.com/25876945/")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("B站-淘沙博士"),
                    href: func.string_to_unicode("https://space.bilibili.com/289706107/")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("阮一峰周报"),
                    href: func.string_to_unicode("https://ruanyifeng.com/blog")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("Github"),
                    href: func.string_to_unicode("https://github.com")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("YouTube"),
                    href: func.string_to_unicode("https://youtube.com")
                },
                // { //
                //     show_lang: "all",
                //     title: func.string_to_unicode("X.com"),
                //     href: func.string_to_unicode("https://x.com")
                // },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("Reddit"),
                    href: func.string_to_unicode("https://reddit.com")
                },
                // { //
                //     show_lang: "all",
                //     title: func.string_to_unicode("Linux.do"),
                //     href: func.string_to_unicode("https://linux.do")
                // },
            ],
        },
        {
            name: "AI",
            list: [
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("DeepSeek"),
                    href: func.string_to_unicode("https://chat.deepseek.com")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("Grok"),
                    href: func.string_to_unicode("https://grok.com")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("Gemini"),
                    href: func.string_to_unicode("https://gemini.google.com")
                },
            ],
        },
        {
            name: func.get_translate("link_docs"),
            list: [
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("iOS Release"),
                    href: func.string_to_unicode("https://developer.apple.com/documentation/ios-ipados-release-notes")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("MacOS Release"),
                    href: func.string_to_unicode("https://developer.apple.com/documentation/macos-release-notes")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("Github.com"),
                    href: func.string_to_unicode("https://github.com")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("Svelte.dev"),
                    href: func.string_to_unicode("https://svelte.dev")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("Golang"),
                    href: func.string_to_unicode("https://golang.google.cn")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("菜鸟教程Runoob"),
                    href: func.string_to_unicode("https://www.runoob.com")
                },
            ],
        },
        {
            name: func.get_translate("link_download"),
            list: [
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("vivo-安卓商店"),
                    href: func.string_to_unicode("https://h5.appstore.vivo.com.cn/#/")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("豌豆荚-安卓商店"),
                    href: func.string_to_unicode("https://www.wandoujia.com")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("APKPure-安卓市场"),
                    href: func.string_to_unicode("https://download.cnet.com/apkpure/3000-2094_4-77459320.html")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("APKs Download（Github）"),
                    href: func.string_to_unicode("https://github.com/fyonecon/clean_hyperos/releases")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("LibCheck.apk"),
                    href: func.string_to_unicode("https://www.downkuai.com/android/147630.html")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("Firefox.apk"),
                    href: func.string_to_unicode("https://firefox.en.divxland.org/download/")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("Firefox (官网)"),
                    href: func.string_to_unicode("https://www.firefox.com/zh-CN/download/")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("Chrome (官网)"),
                    href: func.string_to_unicode("https://www.google.cn/intl/zh-CN_ALL/chrome/other-platforms/")
                },
                //
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("Chrome Mac Universal"),
                    href: func.string_to_unicode("https://dl.google.com/chrome/mac/universal/stable/GGRO/googlechrome.dmg")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("Chrome Win AMD64"),
                    href: func.string_to_unicode("https://dl.google.com/chrome/install/ChromeStandaloneSetup64.exe")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("Chrome Ubuntu AMD64"),
                    href: func.string_to_unicode("https://www.google.cn/intl/zh-CN/chrome/?standalone=1&platform=linux")
                },
            ],
        },
    ];


    // 本页面函数：Svelte的HTML组件onXXX=中正确调用：={()=>def.xxx()}
    const def = {
        open_url: function(_href=""){
            // func.open_url(_href);
            func.loading_show("", 1200);
            // 自动判断路由深度
            let path_num = (route.split("/").length - 1); if (path_num <= 1){path_num = 1;}
            let path_fix = "./" + "../".repeat(path_num - 1);
            //
            let href = path_fix+"search?word="+encodeURIComponent(_href)+"&engine=bing&url_timeout="+func.url_timeout_encode("search", 1.5*60*60)+"&ap=lks";
            if (browser){
                if (func.is_mobile_screen()){
                    window.open(href, "_self");
                }else{
                    window.open(href, "_blank");
                }
            }else{
                func.open_url_with_default_browser(href);
            }
        },
    };


    // 页面函数执行的入口，实时更新数据
    function page_start(){
        func.console_log("page_start=", route);
        func.loading_hide(); // 避免其他页面跳转到本页面时出现loading图
        // 开始
        func.title(func.get_translate("Link"));
    }

    // 标签处于切换显示状态
    function page_show(){
        func.console_log("page_show=", route);
        func.loading_hide();
        // show
    }

    // 标签处于切换隐藏状态
    function page_hide(){
        func.console_log("page_hide=", route);
        // hide
    }


    // 刷新页面数据
    afterNavigate(() => {
        if (!func.support_min_js()){return;}
        if (!runtime_ok() || !browser_ok()){return;} // 系统基础条件检测
        //
        page_start();
    });


    // 页面装载完成后，只运行一次
    // addEventListener专用函数
    onMount(() => {
        if (!func.support_min_js()){return;}
        if (!runtime_ok() || !browser_ok()){return;} // 系统基础条件检测
        // 监测页面标签是否处于显示
        if (browser){
            document.addEventListener("visibilitychange", () => {
                if (document.hidden) { // onHide
                    page_hide();
                } else { // onShow
                    page_show();
                }
            });
        }
    });


</script>

<div class="page-div link-box select-none">
    {#each link_data as group_data}
        <div class="link-group ">
            <div class="link-group-title font-text">{@html group_data.name}</div>
            <div class="link-group-list font-text">
                {#each group_data.list as list_data}
                    <button class="link-group-list-item click break bg-neutral-200 dark:bg-surface-800" onclick={()=>def.open_url(list_data.href)}>{@html func.unicode_to_string(list_data.title)}</button>
                {/each}
                <div class="clear"></div>
            </div>
        </div>
    {/each}
</div>

<style>

    .link-box{
        padding: 10px 5px;
    }

</style>