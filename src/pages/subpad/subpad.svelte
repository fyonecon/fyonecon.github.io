<script lang="ts">
    import { resolve } from '$app/paths';
    import func from "../../common/func.svelte.js";
    import {afterNavigate} from "$app/navigation";
    import {onMount} from "svelte";
    import {browser_ok, runtime_ok} from "../../services/middleware.svelte";
    import {browser} from "$app/environment";

    
    // 本页面参数
    let route = $state(func.get_route());
    const link_data = [
        {
            name: "Home",
            list: [
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("🏠PureHome"),
                    href: func.string_to_unicode("https://datathink.top/purehome"),
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("🏠Link"),
                    href: func.string_to_unicode("https://datathink.top/purehome/link"),
                },
            ],
        },
        {
            name: func.get_translate("link_subscribe"),
            list: [
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("Gmail"),
                    href: func.string_to_unicode("https://gmail.google.com")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("Yahoo Mail"),
                    href: func.string_to_unicode("https://mail.yahoo.com")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("Spotify"),
                    href: func.string_to_unicode("https://open.spotify.com")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("YouTube Music"),
                    href: func.string_to_unicode("https://music.youtube.com")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("YouTube"),
                    href: func.string_to_unicode("https://youtube.com")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("Instagram"),
                    href: func.string_to_unicode("https://instagram.com")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("Telegram"),
                    href: func.string_to_unicode("https://web.telegram.org")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("X.com"),
                    href: func.string_to_unicode("https://x.com")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("Reddit"),
                    href: func.string_to_unicode("https://reddit.com")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("V2EX"),
                    href: func.string_to_unicode("https://v2ex.com")
                },
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
                    title: func.string_to_unicode("Gemini"),
                    href: func.string_to_unicode("https://gemini.google.com")
                },
                { //
                    show_lang: "all",
                    title: func.string_to_unicode("Grok"),
                    href: func.string_to_unicode("https://grok.com")
                },
            ],
        },
    ];


    // 本页面函数：Svelte的HTML组件onXXX=中正确调用：={()=>def.xxx()}
    const def = {
        open_url: function(_href=""){
            // func.open_url(_href);
            func.loading_show("", 1200 as any);
            // 自动判断路由深度
            let path_num = (route.split("/").length - 1); if (path_num <= 1){path_num = 1;}
            let path_fix = "./" + "../".repeat(path_num - 1);
            //
            let href = path_fix+"search?word="+encodeURIComponent(_href)+"&engine=bing&url_timeout="+func.url_timeout_encode("search", 1.5*60*60)+"&ap=lks";
            if (browser){
                if (func.is_safari()){
                    func.open_url(href, "_self");
                }else{
                    func.open_url(href, "_blank");
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
        func.title(func.get_translate("SubPad"));
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