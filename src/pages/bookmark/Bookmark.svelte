<script lang="ts">
    import { resolve } from '$app/paths';
    import func from "../../common/func.svelte.js";
    import {afterNavigate} from "$app/navigation";
    import {onMount} from "svelte";
    import {browser_ok, runtime_ok} from "../../common/middleware.svelte";
    import {browser} from "$app/environment";

    
    // 本页面参数
    let route = $state(func.get_route());
    const bookmark_data = [
        {
            name: func.get_translate("bookmark_news"),
            list: [
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
                    title: "搜狐新闻",
                    href: "https://sohu.com"
                },
                { //
                    show_lang: "all",
                    title: "太平洋科技7x24",
                    href: "https://g.pconline.com.cn/x/news"
                },
                { //
                    show_lang: "all",
                    title: "新浪财经7x24",
                    href: "https://finance.sina.com.cn/7x24/"
                },
                { //
                    show_lang: "all",
                    title: "联合早报7x24",
                    href: "https://yzaobao.com/realtime"
                },
                { //
                    show_lang: "all",
                    title: "新浪行情",
                    href: "https://gu.sina.cn/#/index/index"
                },
                { //
                    show_lang: "all",
                    title: "雪球话题",
                    href: "https://xueqiu.com/today"
                },
                { //
                    show_lang: "all",
                    title: "MacRumors",
                    href: "https://www.macrumors.com"
                },
                { //
                    show_lang: "all",
                    title: "【综合热点榜】",
                    href: "https://rebang.today"
                },
                { //
                    show_lang: "all",
                    title: "V2EX.com",
                    href: "https://v2ex.com"
                },
                { //
                    show_lang: "all",
                    title: "Linux.do",
                    href: "https://linux.do"
                },
                { //
                    show_lang: "all",
                    title: "X.com",
                    href: "https://x.com"
                },
            ],
        },
        {
            name: func.get_translate("bookmark_subscribe"),
            list: [
                { //
                    show_lang: "all",
                    title: "CCTV17农业",
                    href: "https://tv.cctv.cn/live/cctv17/"
                },
                { //
                    show_lang: "all",
                    title: "CCTV14少儿",
                    href: "https://tv.cctv.cn/live/cctvchild/"
                },
                { //
                    show_lang: "all",
                    title: "CCTV7军事",
                    href: "https://tv.cctv.cn/live/cctv7/"
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
                    title: "阮一峰周报",
                    href: "https://ruanyifeng.com/blog"
                },
                { //
                    show_lang: "all",
                    title: "YouTube",
                    href: "https://youtube.com"
                },
                { //
                    show_lang: "all",
                    title: "Reddit",
                    href: "https://reddit.com"
                },
            ],
        },
        {
            name: func.get_translate("bookmark_tools"),
            list: [
                { //
                    show_lang: "all",
                    title: "Windy天气",
                    href: "https://www.windy.com"
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
                    title: "浏览器信息",
                    href: "@info"
                },
                { //
                    show_lang: "all",
                    title: "【🧲喵磁力】",
                    href: "https://www.miaocili.com/"
                },
            ],
        },
        {
            name: "AI",
            list: [
                { //
                    show_lang: "all",
                    title: "Deepseek",
                    href: "https://chat.deepseek.com"
                },
                { //
                    show_lang: "all",
                    title: "Gemini",
                    href: "https://gemini.google.com"
                },
                { //
                    show_lang: "all",
                    title: "Grok",
                    href: "https://grok.com"
                },
            ],
        },
        {
            name: func.get_translate("bookmark_docs"),
            list: [
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
                    title: "Svelte",
                    href: "https://svelte.dev"
                },
                { //
                    show_lang: "all",
                    title: "Golang",
                    href: "https://golang.google.cn"
                },
                { //
                    show_lang: "all",
                    title: "菜鸟教程",
                    href: "https://www.runoob.com"
                },
            ],
        },
    ];


    // 本页面函数：Svelte的HTML组件onXXX=中正确调用：={()=>def.xxx()}
    const def = {
        open_url: function(_href=""){
            // func.open_url(_href);
            func.loading_show("", 1200);
            let href = "./search?word="+encodeURIComponent(_href)+"&engine=bing&url_timeout="+func.url_timeout_encode("search", 2*60*60)+"&ap=bkmk";
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
        // 开始
    }

    // 标签处于切换显示状态
    function page_show(){
        func.console_log("page_show=", route);
        // show
        func.loading_hide();
    }

    // 标签处于切换隐藏状态
    function page_hide(){
        func.console_log("page_hide=", route);
        // hide
    }


    // 刷新页面数据
    afterNavigate(() => {
        if (!runtime_ok() || !browser_ok()){return;} // 系统基础条件检测
        //
        page_start();
    });


    // 页面装载完成后，只运行一次
    // addEventListener专用函数
    onMount(() => {
        if (!runtime_ok() || !browser_ok()){return;} // 系统基础条件检测
        // 监测页面标签是否处于显示
        if (browser){
            document.addEventListener("visibilitychange", () => {
                if (document.hidden) { // onHide
                    page_show();
                } else { // onShow
                    page_hide();
                }
            });
        }
    });


</script>

<div class="page-div bookmark-box select-none">
    {#each bookmark_data as group_data}
        <div class="bookmark-group ">
            <div class="bookmark-group-name font-text">{group_data.name}</div>
            <div class="bookmark-group-list font-text">
                {#each group_data.list as list_data}
                    <button class="bookmark-group-list-item break bg-neutral-200 dark:bg-surface-800" onclick={()=>def.open_url(list_data.href)}>{list_data.title}</button>
                {/each}
                <div class="clear"></div>
            </div>
        </div>
    {/each}
</div>

<style>

    .bookmark-box{
        padding: 10px 10px;
    }

    .bookmark-group{
        border-radius: 10px;
        padding: 10px 5px;
        margin-bottom: 20px;
        /*border: 1px solid rgba(160,160,160, 0.5);*/
    }
    .bookmark-group-name{
        margin-left: 5px;
        margin-bottom: 5px;
        /*text-indent: 5px;*/
        height: 24px;
        line-height: 24px;
        opacity: 0.9;
    }
    .bookmark-group-list{
        width: 100%;
    }
    .bookmark-group-list-item{
        width: calc(100%/3 - 10px);
        margin: 5px 5px 5px 5px;
        padding: 5px 5px;
        float: left;
        line-height: 18px;
        height: 43px;
        overflow: hidden;
        text-align: center;
        border-radius: 10px;
        opacity: 0.9;
    }

</style>