<script lang="ts">
    import { resolve } from '$app/paths';
    import func from "../../common/func.svelte.js";
    import {afterNavigate} from "$app/navigation";
    import {onMount} from "svelte";
    import {browser_ok, runtime_ok} from "../../common/middleware.svelte";
    import search_engines_dict from "../../common/search_engines";
    import {browser} from "$app/environment";

    
    // 本页面参数
    let route = $state(func.get_route());
    const link_data = [
        {
            name: func.get_translate("mp_chigua"),
            list: [
                { //
                    show_lang: "all",
                    title: "57,49,49,29190,26009,32593",
                    href: "104,116,116,112,115,58,47,47,57,49,49,98,108,48,51,46,99,111,109"
                },
                { //
                    show_lang: "all",
                    title: "57,49,21507,29916,32593",
                    href: "104,116,116,112,58,47,47,57,49,99,103,119,49,54,46,99,111,109"
                },
                { //
                    show_lang: "all",
                    title: "53,49,21507,29916,32593",
                    href: "104,116,116,112,58,47,47,53,49,99,103,122,54,46,99,111,109"
                },
                { //
                    show_lang: "all",
                    title: "27599,26085,22823,36187",
                    href: "104,116,116,112,58,47,47,109,114,100,115,50,51,46,99,111,109"
                },
            ],
        },
        {
            name: func.get_translate("mp_fabu"),
            list: [
                { //
                    show_lang: "all",
                    title: "57,49,80",
                    href: "104,116,116,112,115,58,47,47,118,105,112,46,57,49,112,48,55,46,99,111,109,47,105,110,100,101,120,46,112,104,112"
                },
            ],
        },
        {
            name: func.get_translate("mp_dongman"),
            list: [
                { //
                    show_lang: "all",
                    title: "24433,35270,22823,20840",
                    href: "104,116,116,112,115,58,47,47,121,115,50,48,52,54,46,99,118"
                },
                { //
                    show_lang: "all",
                    title: "37324,30058,21160,28459",
                    href: "104,116,116,112,115,58,47,47,116,116,100,109,46,109,101"
                },
                { //
                    show_lang: "all",
                    title: "72,21160,28459",
                    href: "104,116,116,112,115,58,47,47,49,56,104,100,109,46,99,111,109"
                },
            ],
        },
        {
            name: func.get_translate("mp_so"),
            list: [
                { //
                    show_lang: "all",
                    title: "77,105,115,115",
                    href: "104,116,116,112,115,58,47,47,109,105,115,115,97,118,46,119,115,47,100,109,49,50,47,99,110"
                },
                { //
                    show_lang: "all",
                    title: "21941,30913,21147",
                    href: "104,116,116,112,115,58,47,47,119,119,119,46,109,105,97,111,99,105,108,105,46,99,111,109,47"
                },
                { //
                    show_lang: "en",
                    title: "30005,25253,32676,25628",
                    href: "104,116,116,112,115,58,47,47,116,46,109,101,47,115,111,117,115,117,111,51,51"
                },
            ],
        },
        {
            name: func.get_translate("mp_lieqi"),
            list: [
                { //
                    show_lang: "all",
                    title: "56,88,56,88",
                    href: "104,116,116,112,115,58,47,47,121,57,54,51,100,97,46,99,111,109"
                },
                { //
                    show_lang: "en",
                    title: "72,97,105,74,105,97,111",
                    href: "104,116,116,112,115,58,47,47,104,97,105,106,105,97,111,46,99,111,109"
                },
                { //
                    show_lang: "all",
                    title: "24517,35874,31934,36873",
                    href: "104,116,116,112,115,58,47,47,119,119,119,46,122,109,108,122,109,46,99,111,109"
                },
            ],
        },
    ];
    let page_dispplay_show = $state("hide");


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
        check_param: function(){
            let that = this;
            // 接收的参数
            let url_timeout = func.search_href_param("", "url_timeout").trim();
            // 执行跳转或展示
            if (url_timeout){ // 存在
                func.loading_show();
                if (func.url_timeout_decode("jyp", url_timeout)){
                    func.loading_hide();
                }else{ // 过期
                    func.open_url_404("./", func.get_translate("url_timeout"), func.get_href());
                }
            }else{ // 不存在
                func.open_url_404("./", func.get_translate("url_timeout_null"), func.get_href());
            }
        },
    };


    // 页面函数执行的入口，实时更新数据
    function page_start(){
        func.console_log("page_start=", route);
        // 开始
        page_dispplay_show = "show";
        def.check_param();
        func.title(func.get_translate("mp_title")+" @jyp ");
        // if (browser){
        //     if (func.is_mobile_screen()){
        //         page_dispplay_show = "show";
        //         def.check_param();
        //     }else{
        //         page_dispplay_show = "hide";
        //         func.title("...");
        //         func.open_url_404("./", "Page Error", "❌");
        //     }
        // }
        //
    }

    // 标签处于切换显示状态
    function page_show(){
        func.console_log("page_show=", route);
        func.loading_hide(); // 避免其他页面跳转到本页面时出现loading图
        // show
        func.title(func.get_translate("JYP"));
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

<div class="page-div link-box select-none {page_dispplay_show} ">
    <div class="link-group">
        <div class="link-group-title font-text">{@html func.get_translate("mp_title")} <i class="font-red select-text">@jyp</i> {@html func.get_translate("mp_notice")}</div>
        <div class="link-group-list font-text">
            <div class="link-group-title-div">
                <div class="link-group-title-txt">
                    {@html func.get_translate("mp_notice_txt")}
                </div>
            </div>
        </div>
    </div>
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

    .link-group-title-div{
        line-height: 24px;
        margin: 10px 5px 5px 5px;
        border-radius: 10px;
        border: 1px solid rgba(160,160,160, 0.6);
        letter-spacing: 2px;
    }
    .link-group-title-txt{
        opacity: 0.7;
        padding: 10px 10px;
    }

</style>