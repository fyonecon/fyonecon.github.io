<script lang="ts">
    /*全局事件*/
	import './layout.css'; // 全局CSS
    import './pages.css'; // 自定义的pages公共CSS
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/state';
	import func from "../common/func.svelte.js";
	import { afterNavigate, beforeNavigate } from "$app/navigation";
    import Loading from "../parts/Loading.svelte";
    import Notice from "../parts/Notice.svelte";
    import Alert from "../parts/Alert.svelte";
    import config from "../config";
    import {browser_ok, runtime_ok} from "../common/middleware.svelte";
    import {watch_lang_data} from "../stores/watch_lang.store.svelte";
    import {watch_theme_model_data} from "../stores/watch_theme_model.store.svelte";
    import {browser} from "$app/environment";
    import Tab from "../parts/Tab.svelte";


    /** @type {{children: import('svelte').Snippet}} */
    let { children } = $props();


    // 本页面参数
    let route = $state(func.get_route());
    let page_display = $state("hide");
    let theme_model = $state("");
    let lang_index = $state("");


    // 本页面函数
    const def = {
        watch_404_route: function() { // 重定向到自定义的404页面
            if (page.status === 404) {
                func.redirect_pathname({
                    url_pathname: func.url_path("/_404"),
                    url_params: "?error_url=" + encodeURIComponent(func.get_href()) + "&error_msg=404 Route"
                });
            }
        },
        auto_set_language_index: function(){ // 自动设置语言
            const lang_key = config.app.app_class+"language_index";
            func.js_call_py_or_go("get_data", {data_key:lang_key}).then(res=>{
                let lang = res.content.data?res.content.data:func.get_lang();
                watch_lang_data.lang_index = lang;
                lang_index = lang; // 监测本地语言
            });
        },
        auto_set_theme_model: function () { // 自动切换主题
            const theme_model_key = config.app.app_class+"theme_model";
            func.js_call_py_or_go("get_data", {data_key:theme_model_key}).then(res=>{
                let mode=res.content.data;
                if (!mode) {
                    mode = func.get_theme_model();
                }
                watch_theme_model_data.theme_model = mode;
                theme_model = mode;
                document.documentElement.setAttribute('data-mode', mode);
            });
        },
        //
    };


    // 页面函数执行的入口，实时更新数据
    function page_start(){
        func.console_log("page_start=", route);

        //
        route = func.get_route();

        //
        if (func.is_wails() || func.is_gthon()){ // app
            def.auto_set_language_index();
            def.auto_set_theme_model();
        }else{ // web
            // 网站翻译语言
            let lang = func.get_lang();
            watch_lang_data.lang_index = lang;
            lang_index = lang;

            // 网站主题
            let mode = func.get_theme_model();
            watch_theme_model_data.theme_model = mode;
            theme_model = mode;
            document.documentElement.setAttribute('data-mode', mode);
        }

        // 确保项目所有js可以运行
        if (!func.support_min_js()){
            func.alert_msg(func.get_translate("support_min_js_alert"), "long");
            func.title("🔴");
            page_display="hide";
            setTimeout(function (){
                func.block_all_script();
            }, 100);
            return;
        }

        // 系统基础条件检测
        if (!runtime_ok()){ // false
            let screen_w = 0;
            let screen_h = 0;
            let avail_w = 0;
            let avail_h = 0;
            if (browser){
                screen_w = window.screen.width;
                screen_h = window.screen.height;
                avail_w = window.screen.availWidth;
                avail_h = window.screen.availHeight;
            }
            func.alert_msg(func.get_translate("runtime_error_alert") + " - [" + screen_w.toString() + "x" +  screen_h.toString() + "_"+ avail_w.toString() + "x" + avail_h.toString()+"]", "long");
            func.title("⚠️");
            page_display="hide";
            return
        }

        // app浏览器检测
        if (!browser_ok()){ // false
            func.alert_msg(func.get_translate("runtime_cn_chat_alert"), "long");
            func.title("😅");
            page_display="hide";
            return
        }

        // 检测通过时
        page_display="show";
        def.watch_404_route(); // 检测路由变化
        //

    }

    // 标签处于切换显示状态
    function page_show(){
        func.console_log("page_show=", route);
        // show
    }

    // 标签处于切换隐藏状态
    function page_hide(){
        func.console_log("page_hide=", route);
        // hide
    }


    // 监控所有$state()值变化，此函数尽量少用
    $effect(() => {
        // console.log("layout=effect=", page.route);
    });


	// 路由变化之后
	afterNavigate(() => {
        // 开始
        page_start();
	});


    // 页面装载完成后，只运行一次。
    // addEventListener专用函数
    onMount(() => {

        //
        if (func.is_wails() || func.is_gthon()) { // app
            let theme_event = window.matchMedia('(prefers-color-scheme: dark)');
            theme_event.addEventListener('change', function (event){ // 监测主题变化
                def.auto_set_theme_model();
            });
        } else { // web
            // 网站翻译语言
            let lang = func.get_lang();
            watch_lang_data.lang_index = lang;
            lang_index = lang;

            // 监听亮暗主题
            let theme_event = window.matchMedia('(prefers-color-scheme: dark)');
            theme_event.addEventListener('change', function (event){ // 监测主题变化
                let mode = func.get_theme_model();
                watch_theme_model_data.theme_model = mode;
                theme_model = mode;
                document.documentElement.setAttribute('data-mode', mode);
            });
        }

        if (!func.support_min_js()){return;}
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


    // 路由变化之前
    beforeNavigate(() => {
        //
    });


    // 处理页面切换或关闭时的事件，比如定时器
    onDestroy(() => {
        //
    });


</script>

<div class="app {page_display} select-none" data-theme_model="{theme_model}" data-language_index="{lang_index}">
    <!-- Route内容 -->
	<main class="main {page_display} ">{@render children()}</main>
    <!-- 自定义公共组件 -->
    <Tab />
</div>

<div class="alert select-none">
    <!--  全局交互组件  -->
    <Loading />
    <Notice />
    <Alert />
</div>