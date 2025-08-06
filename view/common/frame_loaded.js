// 初始化页面所有路由文件后，负责框架事件。早于start_page()一步。
function frame_loaded(e, route){
    // 页面加载完成运行一次即可
    page_init(e, route);

    // 获取手动设置的主题色值
    let theme_key = app_class + "switch_radio_theme";
    let theme_value = view.get_data(theme_key);
    if (!theme_value){ // 默认跟随系统
        theme_value = "theme_0";
        view.set_data(theme_key, theme_value);
    }

    // 页面缩放
    let page_zoom_key = app_class + "switch_radio_page_zoom";
    let page_zoom_value = view.get_data(page_zoom_key);
    if (!page_zoom_value){ // 默认跟随系统
        if (view.is_wails()){
            page_zoom_value = "0.95";
        }else{
            page_zoom_value = "1.00"; // 1
        }
        view.set_data(page_zoom_key, page_zoom_value);
    }

    // 组件加载时间
    console.info("当前显示语言：" + view.language_txt("lang"), window.navigator.languages);
    console.info("当前显示主题：" + theme_value, view.scheme_model());
    console.info("框架解析用时：" + (time_loaded - time_start) + " ms");
    view.log("框架报错时间：" + time_error);

    // 监听页面尺寸改变
    window.onresize = function (){
        let width = window.innerWidth;
        //
    };

    // 监听滚动：局域网文件列表
    if ($("#tools-right-content")){
        function scroll_trc(){
            let dom_top = $("#fixed-dir-div").offset().top;
            let dom_height = $("#fixed-dir-div").height();
            let scroll = $("#tools-right-content").scrollTop();
            //
            if (dom_top >= scroll){ // show
                // console.log("show");
                $("#fixed-dir-div").removeClass("fixed_dir-nav");
                $("#list-files-box").css({"margin-top":0+"px"});
            }else{ // fixed
                // console.log("fixed");
                $("#fixed-dir-div").addClass("fixed_dir-nav");
                $("#list-files-box").css({"margin-top":dom_height+"px"});
            }
        }
        $("#tools-right-content").scroll(function (){
            scroll_trc();
        });
    }

    // 监听页面应用进入后台
    document.addEventListener("visibilitychange",function(){
        // 进入前台（已经在前台不触发，仅在有动作后触发））
        if(document.visibilityState === "visible"){
            view.log("切换到前台："+view.time_date("YmdHis"));
            try {show_page(["可选初始切换到前台函数"]);}catch (e){view.log("show_page()：可忽略的可选初始切换到前台函数");}
        }
        // 进入后台
        if(document.visibilityState === "hidden"){
            view.log("切换到后台："+view.time_date("YmdHis"));
            try {hide_page(["可选初始切换到后台函数"]);}catch (e){view.log("hide_page()：可忽略的可选初始切换到后台函数");}
        }
    });

    // 监听系统切换主题色
    let scheme = window.matchMedia('(prefers-color-scheme: light)');
    scheme.addEventListener('change', (event) => { // if (event.matches){}。// 监听主题色，切换浏览器主题色时会触发此函数
        view.log("自动切换到主题色：", view.scheme_model());
        if (theme_value === "theme_0"){
            try {
                view.init_theme(theme_value, view.scheme_model());
            }catch (e){
                view.log("无对接主题色init_theme("+view.scheme_model()+")函数，可忽略，0-0。", e);
            }
        }
    });

    // 监听Enter按键
    watch_input_enter( function (enter_state, the_input_id){
        if (enter_state === 1){ // 条件满足
            view.show_loading(200);
            if (the_input_id === "input"){ // 首页搜索
                run_search();
            }
            else if (the_input_id === "input1"){ // 顶部搜索
                $(".back-do-input-btn-btn").click();
            }
            else if (the_input_id === "search-lan-input"){
                $(".search-lan-btn").click();
            }
            else if (the_input_id === "search-notes-input"){
                $(".search-notes-btn").click();
            }else{
                view.notice_txt("超范围的值1："+the_input_id, 5000);
            }
        }
        else if (enter_state === 0){ // input内容为空
            view.show_loading(200);
            if (the_input_id === "input"){ // 首页搜索
                view.notice_txt(view.language_txt("keywords_null"), 2000);
            }
            else if (the_input_id === "input1"){ // 顶部搜索
                $(".back-do-input-btn-btn").click();
            }
            else if (the_input_id === "search-lan-input"){
                $(".search-lan-btn").click();
            }
            else if (the_input_id === "search-notes-input"){
                $(".search-notes-btn").click();
            }else{
                view.notice_txt("超范围的值2："+the_input_id, 5000);
            }
        }
        else{ // 其他非法情况
            view.log("Enter其他非法情况：", enter_state);
        }
    });

    // 设置文件缓存（提前加载一些文件，如果已加载，也不会浪费流量）
    let pre_cache_timeout = 6*(60*60); // s, h
    let pre_cache_time_key = app_class+"pre_cache_time";
    view.data_timeout_state(pre_cache_time_key, pre_cache_timeout, [true, false],function (state){
        if (state){ // 已过期
            // view.fetch_file(cdn_page_file + "pages/search/search.css?cache=" + view_version).then(array=>{
            //     let state = array[0], response=array[1], url=array[2], msg=array[3];
            //     view.log([state, response, url, msg]);
            // });
            // view.fetch_file(cdn_page_file + "pages/search/search.js?cache=" + view_version).then(array=>{
            //     let state = array[0], response=array[1], url=array[2], msg=array[3];
            //     view.log([state, response, url, msg]);
            // });
            view.fetch_file(cdn_page_file + "pages/search/search.view?cache=" + view_version).then(array=>{
                let state = array[0], response=array[1], url=array[2], msg=array[3];
                view.log([state, response, url, msg]);
            });
        }else{
            //
        }
    });

}