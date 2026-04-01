<script lang="ts">
    import { resolve } from '$app/paths';
    import func from "../../common/func.svelte.js";
    import {afterNavigate} from "$app/navigation";
    import {onMount} from "svelte";
    import {browser_ok, runtime_ok} from "../../services/middleware.svelte";
    import config from "../../config";
    import search_engines_dict from "../../common/search_engines";
    import {browser} from "$app/environment";
    import { copy } from 'svelte-copy';


    // 本页面参数
    let route = $state(func.get_route());
    let browser_search_engine_show = $state("hide");
    let browser_search_engine = $state("");
    let show_txt = $state("🚩");
    let page_show_num = $state(0);
    let page_show_num_timer = $state(0);

    const search_selected_key = config.app.app_class + "search_selected";
    const search_history_key = search_selected_key+"_history";
    const search_history_split = "#@#"+search_history_key+"#@#";
    const search_history_max_len = 200;


    // 本页面函数：Svelte的HTML组件onXXX=中正确调用：={()=>def.xxx()}
    const def = {
        check_white_word: function(word = ""){
            let that = this;
            let back_state = false;
            browser_search_engine_show = "hide";
            let browser_search_engine_http = (window.location.host.indexOf(".github.io") !== -1)?"https":"http";
            // 白名单跳转
            if (word === config.sys.home_route_white_word ||  word === "@home"){ // 必要，home页面
                back_state = true;
                let href = "."+config.sys.home_route+"?cache="+func.js_rand(100000, 9999999)
                href = href.replaceAll(".?cache=", "./?cache=");
                href = href.replaceAll("//", "/");
                that.open_url(href);
            }
            else if (word === "@reload" || word === "@fresh" || word === "@refresh"){
                back_state = true;
                func.fresh_page(0);
            }
            else if (word === "@link" || word === "@bookmark"){
                back_state = true;
                that.open_url("./link");
            }
            else if (word === "@jyp" || word === "@JYP" || word === "@Jyp"){
                back_state = true;
                that.open_url("./jyp?url_timeout="+func.url_timeout_encode("jyp", 2*60*60)+"&ap=ipt");
            }
            else if (word === "@info"){
                back_state = true;
                that.open_url("./info");
            }
            else if (word === "@calculator" || word === "@calc"){
                back_state = true;
                that.open_url("./calculator");
            }
            else if (word === "@qr" || word === "@ewm"){
                back_state = true;
                that.open_url("./qr");
            }
            else if (word === "@divine" || word === "@divination"){
                back_state = true;
                that.open_url("./divination");
            }
            else if (word === "@dumogu" || word === "@dmg"){
                back_state = true;
                that.open_url("./dumogu.html");
            }
            else if (word === "@404"){
                back_state = true;
                that.open_url("./_404");
            }
            else if (word === "@clear"){ // 只删除配置信息，不删除用户信息
                back_state = true;
                func.clear_local_data();
                that.open_url(func.url_path(config.sys.base_route+config.sys.home_route)+"?clear="+func.js_rand(10000, 99999));
            }
            //
            else if (word === "@cos"){
                back_state = true;
                that.open_url("https://console.cloud.tencent.com/cos/bucket");
            }
            // 自定义搜索引擎
            else if (word === "@bing"){
                back_state = true;
                browser_search_engine_show = "show";
                browser_search_engine = browser_search_engine_http + "://" + window.location.host + config.sys.base_route + "/search" + "?engine=bing&history=yes&word=%s";
            }
            else if (word === "@baidu"){
                back_state = true;
                browser_search_engine_show = "show";
                browser_search_engine = browser_search_engine_http + "://" + window.location.host + config.sys.base_route + "/search" + "?engine=baidu&history=no&word=%s";
            }
            else if (word === "@sogou"){
                back_state = true;
                browser_search_engine_show = "show";
                browser_search_engine = browser_search_engine_http + "://" + window.location.host + config.sys.base_route + "/search" + "?engine=sogou&history=no&word=%s";
            }
            else if (word === "@google"){
                back_state = true;
                browser_search_engine_show = "show";
                browser_search_engine = browser_search_engine_http + "://" + window.location.host + config.sys.base_route + "/search" + "?engine=google&history=yes&word=%s";
            }
            else if (word === "@yahoo"){
                back_state = true;
                browser_search_engine_show = "show";
                browser_search_engine = browser_search_engine_http + "://" + window.location.host + config.sys.base_route + "/search" + "?engine=yahoo&history=yes&word=%s";
            }
            else if (word === "@yandex"){
                back_state = true;
                browser_search_engine_show = "show";
                browser_search_engine = browser_search_engine_http + "://" + window.location.host + config.sys.base_route + "/search" + "?engine=yandex&history=yes&word=%s";
            }
            //

            //
            return back_state;
        },
        get_href_domain: function(href=""){ // 返回href的host+port
            try {
                const urlObj = new URL(href);
                let host = urlObj.hostname;
                return host.replace(/^www\./, '').slice(0, 54);
            }catch (e) {
                return "...";
            }
        },
        open_url: function(href=""){
            if (browser){
                window.location.replace(href);
            }else{
                func.open_url(href, "_self");
            }
        },
        check_param: function(){
            let that = this;
            // 接收的参数
            let word = func.unicode_to_string(func.search_href_param("", "word").trim());
            // console.log("check_param=", [word, func.search_href_param("", "word").trim()]);
            // http://localhost:9770/search?engine=bing&history=no&word=%s
            // return;
            let engine = func.search_href_param("", "engine").trim();
            let history = func.search_href_param("", "history").trim();
            let url_timeout = func.search_href_param("", "url_timeout").trim();
            // 显示title
            func.title(func.get_translate("search_opening_page") + " " + word.slice(0, 30) + " ... ");
            // 插入历史记录
            if (history === "yes" || history === "true" || history === "True" || history === "1"){
                that.input_history(word);
            }
            // 执行跳转或展示
            if (url_timeout){ // 从搜索页过来
                func.loading_show();
                if (func.url_timeout_decode("search", url_timeout)){
                    // 是url链接就直接打开
                    if (func.is_url(word)){
                        //
                        show_txt = func.get_translate("search_opening_page") + "  " + def.get_href_domain(word);
                        that.open_url(word);
                    }else{
                        // word白名单级校验
                        if (!that.check_white_word(word)){ // 其它关键词
                            if (!search_engines_dict[engine]){engine = "bing";}
                            let href = search_engines_dict[engine].url+encodeURIComponent(word);
                            //
                            show_txt = func.get_translate("search_opening_page") + "  " + def.get_href_domain(word);
                            that.open_url(href);
                        }else{ // 白名单关键词
                            func.loading_hide();
                            func.title(func.get_translate("search_res_show"));
                        }
                    }
                }else{ // 过期
                    func.open_url_404("./", func.get_translate("url_timeout"), func.get_href());
                }
            }else{ // 从浏览器搜索栏过来
                // word白名单级校验
                if (!that.check_white_word(word)){ // 正常打开关键词
                    if (!search_engines_dict[engine]){engine = "bing";}
                    let href = search_engines_dict[engine].url+encodeURIComponent(word);
                    that.open_url(href);
                }else{
                    func.loading_hide();
                    func.title(func.get_translate("search_res_show"));
                }
            }
        },
        filter_array: function(value=""){ // 去重历史记录
            let value_string = "";
            if (value.length>0 && value.indexOf(search_history_split) !== -1){
                let array = value.split(search_history_split);
                // 数组去重
                array = Array.from(new Set(array));
                // 截取数组
                let start = 0;
                if (array.length > search_history_max_len){
                    start = search_history_max_len - array.length;
                }
                array = array.slice(start);
                // 数组转字符串
                value_string = array.join(search_history_split);
            }else if (value.length>0 && value.indexOf(search_history_split) === -1){
                value_string = value;
            }
            return value_string;
        },
        input_history: function(_value=""){ // 更新与显示
            let that = this;
            //
            return new Promise(resolve1 => {
                func.get_db_data(search_history_key).then(value => {
                    if (_value.trim().length>0){
                        if (value){
                            value = value + search_history_split + _value;
                        }else{
                            value = search_history_split + _value;
                        }
                        // 数组去重
                        let new_value = that.filter_array(value);
                        func.set_db_data(search_history_key, new_value).then(_v=>{
                            resolve1(new_value);
                        });
                    }else{
                        //
                    }
                });
            });
        },
    };


    // 页面函数执行的入口，实时更新数据
    function page_start(){
        func.console_log("page_start=", route);
        func.loading_hide(); // 避免其他页面跳转到本页面时出现loading图
        // 开始
        def.check_param();
    }

    // 标签处于切换显示状态
    function page_show(){
        func.console_log("page_show=", route);
        if (!runtime_ok() || !browser_ok()){return;} // 系统基础条件检测
        // show

        // 优化open_url体验
        page_show_num++;
        clearTimeout(page_show_num_timer);
        if (page_show_num <= 2){
            page_show_num_timer = setTimeout(function (){
                def.check_param();
            }, 800);
        }

        //

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
                    page_show();
                } else { // onShow
                    page_hide();
                }
            });
        }
    });


</script>

<div class="page-back select-none">
    <a href="./?from=search" title="Back home">
        <div class="font-mini center" style="height: 50px; line-height: 50px; overflow: hidden; padding: 0 20px; opacity: 0.4;">{@html show_txt}</div>
    </a>
</div>

<div class="page-div search-box select-none {browser_search_engine_show} ">
    <div class="browser-search-engine">
        <br/>
        <h3 class="font-title">可以添加如下链接到浏览器的自定义搜索引擎：</h3>
        <br/>
        <div class="font-text select-text font-blue break"
             use:copy={{
                        text: browser_search_engine?browser_search_engine:"",
                        onCopy: ({ text }) => {text.length>=2?func.notice(func.get_translate("copied"), "", 2000):func.console_log("Copied null");},
                        onError: ({ error }) => {func.notice(func.get_translate("copied_error"), "", 2000);console.warn(error);}
                      }}
        >{browser_search_engine} </div>
        <br/>
    </div>
</div>

<style>
    .page-back{
        position: fixed;
        z-index: 2;
        width: 100%;
        height: 50px;
        top: 0;
        margin-left: auto;
        margin-right: auto;
    }
    .search-box{
        padding: 10px 10px;
    }
</style>