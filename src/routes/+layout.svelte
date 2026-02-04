<script lang="ts">
    /*全局事件*/
	import './layout.css'; // 全局CSS
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
        }
    };


    // 页面函数执行的入口，实时更新数据
    function page_start(){
        func.console_log("page_start=", route);
        // 开始
        route = func.get_route();

        // 网站翻译语言
        let lang = func.get_lang();
        watch_lang_data.lang_index = lang;
        lang_index = lang;

        // 网站主题
        let mode = func.get_theme_model();
        watch_theme_model_data.theme_model = mode;
        theme_model = mode;
        document.documentElement.setAttribute('data-mode', mode);

        // 系统基础条件检测
        if (!runtime_ok()){ // false
            func.alert_msg(func.get_translate("runtime_error_alert"), "long");
            func.title("⚠️");
            page_display="hide";
            return
        }else{ // 附加条件检测
            if (!browser_ok()){ // false
                func.alert_msg(func.get_translate("runtime_cn_chat_alert"), "long");
                func.title("😅");
                page_display="hide";
                return
            }else{ // ok
                page_display="show";
                //
                def.watch_404_route(); // 检测路由变化
            }
        }

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


    // 监控所有$state()值变化
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
        //

    });


    // 路由变化之前
    beforeNavigate(() => {
        //
    });


    // 整个网站关闭时
    onDestroy(() => {
        //
    });


</script>

<div class="app {page_display} select-none" data-theme_model="{theme_model}" data-language_index="{lang_index}">
    <!-- 内容 -->
	<main class="main {page_display} ">{@render children()}</main>
    <Tab />
</div>

<div class="alert select-none">
    <!--  全局交互组件  -->
    <Loading />
    <Notice />
    <Alert />
</div>