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
                    title: "太平洋科技",
                    href: "https://www.pconline.com.cn"
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
                    title: "MacRumors",
                    href: "https://www.macrumors.com"
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
                    title: "B站-LAO",
                    href: "https://space.bilibili.com/33882856"
                },
                { //
                    show_lang: "all",
                    title: "YouTube",
                    href: "https://youtube.com"
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
                    title: "🧲喵磁力",
                    href: "https://www.miaocili.com/"
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


    // 检测$state()值变化
    $effect(() => {
        //
    });


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

<div class="bookmark-box select-none">
    {#each bookmark_data as group_data}
        <div class="bookmark-group ">
            <div class="bookmark-group-name font-text">{group_data.name}</div>
            <div class="bookmark-group-list font-text">
                {#each group_data.list as list_data}
                    <button class="bookmark-group-list-item break bg-neutral-200 dark:bg-neutral-800" onclick={()=>def.open_url(list_data.href)}>{list_data.title}</button>
                {/each}
                <div class="clear"></div>
            </div>
        </div>
    {/each}
</div>

<style>

    .bookmark-box{
        width: 100%;
        padding: 20px 10px;
        margin-right: auto;
        margin-left: auto;
        max-width: 640px;
        margin-bottom: 100px;
    }

    .bookmark-group{
        border-radius: 10px;
        margin-bottom: 20px;
    }

    .bookmark-group-name{
        /*border-left: 2px solid var(--color-blue-800);*/
        margin-left: 5px;
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
        margin: 10px 5px 5px 5px;
        padding: 5px 5px;
        float: left;
        line-height: 18px;
        height: 43px;
        overflow: hidden;
        text-align: center;
        border-radius: 10px;
        opacity: 0.7;
    }

</style>