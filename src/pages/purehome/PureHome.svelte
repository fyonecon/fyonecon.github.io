<script lang="ts">
    import { resolve } from '$app/paths';
    import func from "../../common/func.svelte.js";
    import {afterNavigate} from "$app/navigation";
    import {onMount} from "svelte";
    import config from "../../config";
    import search_engines_dict from "../../common/search_engines";
    import {browser_ok, runtime_ok} from "../../common/middleware.svelte";
    import {Dialog, Portal} from "@skeletonlabs/skeleton-svelte";
    import {browser} from "$app/environment";
    import {input_enter_data} from "../../stores/input_enter.store.svelte";

    // 本页面参数
    const animation = 'transition transition-discrete opacity-0 translate-y-[100px] starting:data-[state=open]:opacity-0 starting:data-[state=open]:translate-y-[100px] data-[state=open]:opacity-100 data-[state=open]:translate-y-0';
    let route = $state(func.get_route());
    let input_value_search = $state("");

    const search_selected_key = config.app.app_class + "search_selected";
    const search_history_key = search_selected_key+"_history";
    const search_history_split = "#@#"+search_history_key+"#@#";
    const search_history_max_len = 200;

    let search_engines_array: object[] = $state([]);
    let search_history_array: string[] = $state([]);
    let del_input_history_dialog_is_open = $state(false);
    let input_object: any; // input标签dom对象
    let open_url_loading_timer = $state(0);
    let open_url_open_timer = $state(0);
    let arrow_direct_class = $state("search-div-input-select-blur");

    // 本页面函数：Svelte的HTML组件onXXX=中正确调用：={()=>def.xxx()}
    const def = {
        close_dialog: function(){
            del_input_history_dialog_is_open = false;
        },
        open_dialog: function(){
            del_input_history_dialog_is_open = true;
        },
        create_select: function(){
            //
            search_engines_array = [
                {
                    name: "Bing",
                    value: "bing",
                    url: "https://www.bing.com/?ensearch=1&q=",
                    selected: "selected",
                }
            ];
            //
            func.get_db_data(search_selected_key).then(value => {
                if (!value){value = "bing";}
                //
                let the_dict = search_engines_dict[value];
                if (the_dict){ // 读取到已设置的引擎
                    //
                    let the_name = the_dict.name;
                    let the_url = the_dict.url;
                    // 渲染列表
                    search_engines_array = []; // init
                    Object.keys(search_engines_dict).forEach(key => {
                        let info = search_engines_dict[key];
                        let selected = (value===key)?"selected":"";
                        search_engines_array.push({
                            name: info.name,
                            value: key,
                            url: info.url,
                            selected: selected,
                        });
                    });
                }else{ // 给一个默认值
                    func.notice("DB Error");
                    value = "bing";
                    func.set_db_data(search_selected_key, value).then(v=>{
                        func.console_log("update_select=", value, v);
                        // that.create_select();
                    });
                }
            });
        },
        update_select: function(event: any){
            let that = this;
            //
            let value = event.target.value;
            func.set_db_data(search_selected_key, value).then(v=>{
                func.console_log("update_select=", value, v);
                // that.create_select();
            });
        },
        show_history: function(value=""){ // 显示历史
            search_history_array = [];
            if (value.length>0 && value.indexOf(search_history_split) !== -1){
                let array = value.split(search_history_split);
                for (let i=0; i<array.length; i++){
                    let the_value = array[i];
                    if (the_value.trim()){
                        search_history_array.unshift(the_value);
                    }
                }
            }else if (value.length>0 && value.indexOf(search_history_split) === -1){
                search_history_array.unshift(value);
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
                            that.show_history(new_value);
                            resolve1(new_value);
                        });
                    }else{
                        that.show_history(value);
                    }
                });
            });
        },
        input_enter: function(event: any){
            let that = this;
            // 处理Enter
            if (event.key === 'Enter') {
                if (input_enter_data.input_doing === 1 || input_enter_data.input_doing === 2){ // 输入法输入完成
                    func.console_log("输入法输入完成=", input_enter_data.input_doing);
                    input_enter_data.input_doing = -1; // init
                    // 执行回车操作
                    that.input_run_search();
                }else{ // 输入法正在输入
                    func.console_log("输入法正在输入=", input_enter_data.input_doing);
                }
            }
        },
        input_run_search: function(){
            let that = this;
            //
            func.loading_show();
            clearTimeout(open_url_loading_timer);
            clearTimeout(open_url_open_timer);
            //
            let the_value = input_value_search.trim();
            if (the_value){
                //
                if (the_value === "@tabshow" || the_value === "@tab"){ // 展示tab栏
                    func.set_local_data(config.app.app_class+"home_tab_show", "show"); // hide show
                    the_value = config.sys.home_route_white_word; // 刷新页面即可
                }
                //
                that.input_history(the_value).then(v=>{
                    func.get_db_data(search_selected_key).then(value => {
                        open_url_loading_timer = setTimeout(function (){
                            that.input_auto_write("");
                            func.loading_hide();
                        }, 1200);
                        //
                        if (!value) {value = "bing";}
                        //
                        let href = "./search?word="+encodeURIComponent(func.string_to_unicode(the_value))+"&engine="+value+"&url_timeout="+func.url_timeout_encode("search", 2*60*60)+"&ap=ipt";
                        open_url_open_timer = setTimeout(function (){
                            if (browser){
                                if (func.is_mobile_screen()){
                                    window.open(href, "_self");
                                }else{
                                    window.open(href, "_blank");
                                }
                            }else{
                                func.open_url_with_default_browser(href);
                            }
                        }, 200);
                    });
                });
            }else{
                input_object.focus();
                open_url_loading_timer = setTimeout(function (){
                    func.loading_hide();
                }, 200);
            }
        },
        input_auto_write: function(value=""){ // 自动填充input
            input_value_search = value;
        },
        input_clear_write: function(){ // 清空输入框
            let that = this;
            //
            that.input_auto_write("");
            input_object.focus();
        },
        input_del_history: function(){
            let that = this;
            //
            func.loading_show("", 800);
            try {
                func.del_db_data(search_history_key).then(state=>{
                    del_input_history_dialog_is_open = false;
                    that.input_auto_write("");
                    that.show_history("");
                });
            }catch (e) {
                del_input_history_dialog_is_open = false;
                func.fresh_page(0);
            }
        },
        change_arrow_direct_class: function(state=false){
            if (state){
                arrow_direct_class = "search-div-input-select-focus";
            }else{
                arrow_direct_class = "search-div-input-select-blur";
            }
        },
    };


    // 页面函数执行的入口，实时更新数据
    function page_start(){
        func.console_log("page_start=", route);
        func.loading_hide(); // 避免其他页面跳转到本页面时出现loading图
        // 创建视图
        def.create_select();
        def.input_history("");
    }

    // 标签处于切换显示状态
    function page_show(){
        func.console_log("page_show=", route);
        // show
        page_start();
    }

    // 标签处于切换隐藏状态
    function page_hide(){
        func.console_log("page_hide=", route);
        // hide
    }


    // 刷新页面数据
    afterNavigate(() => {
        if (!runtime_ok() || !browser_ok()){return;} // 系统基础条件检测
        // 开始
        page_start();
    });


    // 页面装载完成后，只运行一次
    // addEventListener专用函数
    onMount(() => {
        if (!runtime_ok() || !browser_ok()){return;} // 系统基础条件检测
        // 监听输入法输入事件
        func.watch_input_enter(input_object);
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

<div class="page-div purehome-box select-none">
    <div class="search-div-input">
        <select class="search-div-input-select input-border font-text " onchange={(event)=>def.update_select(event)}>
            {#each search_engines_array as option_dict}
                <option value="{option_dict.value}" selected="{option_dict.selected}">{option_dict.name}</option>
            {/each}
        </select>
        <input class="search-div-input-input input-border w-full font-title select-text" type="search" maxlength="500" placeholder="{func.get_translate('input_placeholder_search')}"
               bind:value={input_value_search}
               onkeydown={(e)=>def.input_enter(e)}
               onmouseenter={(e) => e.currentTarget.focus()}
               bind:this={input_object}
               onfocus={()=>def.change_arrow_direct_class(true)}
               onblur={()=>def.change_arrow_direct_class(false)}
        />
        <span class="search-div-input-arrow {arrow_direct_class} " >
            <svg class="hide" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20"><path fill="currentColor" d="M11.199 4.6c-.6-.8-1.801-.8-2.401 0l-4.496 6.002c-.74.989-.035 2.4 1.2 2.4h8.995c1.236 0 1.941-1.412 1.2-2.4zM4 15a.5.5 0 0 0 0 1h12a.5.5 0 0 0 0-1z"/></svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17a1.72 1.72 0 0 1-1.33-.64l-4.21-5.1a2.1 2.1 0 0 1-.26-2.21A1.76 1.76 0 0 1 7.79 8h8.42a1.76 1.76 0 0 1 1.59 1.05a2.1 2.1 0 0 1-.26 2.21l-4.21 5.1A1.72 1.72 0 0 1 12 17"/></svg>
        </span>
    </div>
    <div class="search-div-btn font-text">
        <button class="search-div-btn-btn break-ellipsis btn-border click font-red" onclick={()=>def.open_dialog()}>{func.get_translate("search_del_history")}</button>
        <button class="search-div-btn-btn break-ellipsis btn-border click" onclick={()=>def.input_clear_write()}>{func.get_translate("search_clear_input")}</button>
        <button class="search-div-btn-btn break-ellipsis btn-border click" onclick={()=>def.input_run_search()}>{@html func.get_translate("search_enter_input")}</button>
    </div>
    <div class="search-div-history font-text font-blue scroll-y-style">
        {#each search_history_array as history_value}
            <button class="history-btn click break break-ellipsis" onclick={()=>def.input_auto_write(history_value)} title="{history_value}">{"# "+history_value + " "}</button>
        {/each}
    </div>
</div>


<!-- 删除已设置的本地文件夹 -->
<div class="part-div">
    <Dialog closeOnInteractOutside={false} closeOnEscape={false} open={del_input_history_dialog_is_open} onOpenChange={()=>{}}>
        <Portal>
            <Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/80  select-none" />
            <Dialog.Positioner class="fixed inset-0 z-50 flex justify-center items-center font-text select-none">
                <Dialog.Content class="card bg-neutral-100 dark:bg-neutral-900 w-full max-w-xs p-4 space-y-4 shadow-xl {animation}  px-[10px] py-[10px] border-radius">
                    <header class="flex justify-between items-center pywebview-drag-region can-drag">
                        <Dialog.Title class="font-title font-bold">⚠️</Dialog.Title>
                    </header>
                    <Dialog.Description class="font-title select-text">
                        {@html func.get_translate('remove_help_2')}
                    </Dialog.Description>
                    <footer class="flex justify-center gap-10 select-none  px-[10px] py-[10px]">
                        <button title="Cancel" class="btn btn-base preset-tonal font-title" onclick={()=>def.close_dialog()}>{func.get_translate("btn_cancel")}</button>
                        <button title="Update" type="button" class="btn btn-base preset-filled-primary-500 font-title" onclick={()=>def.input_del_history()}>{func.get_translate("clear")}</button>
                    </footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Portal>
    </Dialog>
</div>

<style>
    .purehome-box{
        padding-bottom: 40px;
        padding-top: 50px;
    }
    @media only screen and (min-width: 200px){
        .purehome-box{
            padding-top: 10px;
        }
    }
    @media only screen and (min-width: 300px){
        .purehome-box{
            padding-top: 20px;
        }
    }
    @media only screen and (min-width: 500px){
        .purehome-box{
            padding-top: 40px;
        }
    }
    @media only screen and (min-width: 600px){
        .purehome-box{
            padding-top: 60px;
        }
    }
    @media only screen and (min-width: 800px){
        .purehome-box{
            padding-top: 80px;
        }
    }
    @media only screen and (min-width: 800px){
        .purehome-box{
            padding-top: 100px;
        }
    }
    @media only screen and (min-width: 1200px){
        .purehome-box{
            padding-top: 130px;
        }
    }
    @media only screen and (min-width: 1800px){
        .purehome-box{
            padding-top: 150px;
        }
    }
    @media only screen and (min-width: 2600px){
        .purehome-box{
            padding-top: 200px;
        }
    }

    .search-div-input{
        width: calc(100%);
        margin-right: auto;
        margin-left: auto;
        padding: 10px 0;
        height: 70px;
        overflow: hidden;
        clear: both;
        margin-top: 30px;
        position: relative;
    }
    .search-div-btn{
        width: calc(100%);
        max-width: 420px;
        margin-right: auto;
        margin-left: auto;
        height: 40px;
        overflow: hidden;
        clear: both;
        margin-top: 30px;
        padding: 0 0;
    }
    .search-div-history{
        width: calc(100%);
        padding: 10px 0;
        min-height: 100px;
        max-height: 300px;
        clear: both;
        margin: 30px auto 60px auto;
    }

    .input-border{
        border: 1px solid var(--color-blue-700);
        border-radius: 30px;
    }
    .btn-border{
        border: 1px solid var(--color-blue-700);
        border-radius: 20px;
    }

    .search-div-input-select{
        width: 120px;
        height: 44px;
        text-align: center;
        padding: 0 10px;
        float: left;
        appearance: none;
        text-align-last: center;
        outline: none;
    }
    .search-div-input-input{
        width: calc(100% - 120px - 0px);
        height: 44px;
        float: left;
        padding: 0 10px;
        margin-left: 0;
        outline: none;
     }
    .search-div-input-arrow{
        position: absolute;
        font-size: 12px !important;
        line-height: 16px;
        text-align: center;
        display: inline-block;
        width: 16px;
        height: 16px;
        border-radius: 8px;
        overflow: hidden;
        left: 114px;
        top: 24px;
    }
    .search-div-input-select:focus{
        border: 2px solid var(--color-blue-500);
    }
    .search-div-input-input:focus{
        border: 2px solid var(--color-blue-500);
    }
    .search-div-btn-btn{
        width: calc(100%/3 - 20px);
        overflow: hidden;
        margin: 0 10px;
        padding: 0 5px;
        float: left;
        height: 38px;
    }

    .history-btn{
        padding: 0 10px;
        max-width: 250px;
        border-radius: 5px;
        overflow: hidden;
        float: left;
    }

    .search-div-input-select-blur {
        transition: transform 0.5s;
        transform: rotateZ(0deg);
        color: var(--color-blue-700);
    }
    .search-div-input-select-focus {
        transition: transform 0.5s;
        transform: rotateZ(90deg);
        color: var(--color-blue-500);
    }


</style>