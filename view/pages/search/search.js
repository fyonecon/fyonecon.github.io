// 更新历史记录
function s_update_history(input_value){
    let data_key = app_class + "input_history";
    let array_key = "@=history=@";

    try {
        if (input_value){
            if (input_value.indexOf("kw@")===0 || input_value.indexOf("@")===0){ // kws口令不计入历史
                return;
            }
            let data_string = view.get_data(data_key)
            // 去重历史记录
            if (view.string_include_string(data_string, input_value+"@=") !== -1){
                view.log("已存在历史记录：" + input_value);
            }else {
                // 限制历史记录长度
                let len = 200;
                let array_history = data_string.split(array_key)
                let new_data_string = "";
                for (let i=0; i<array_history.length; i++){
                    let the_history = array_history[i];
                    if (i<len){
                        new_data_string = the_history + array_key;
                        let new_data = input_value + array_key + data_string;
                        view.set_data(data_key, new_data);
                    }
                }
            }
        }else {
            view.log("input_value不能为空");
        }
    }catch (e){
        view.notice_txt("更新历史记录时报错", 3000);
    }

    try {
        // 自动处理历史记录，规则：start_history - new_history > 60 day，即表示无法在”长时间连续使用“的情况下，以前的历史即为fake历。
        let len_day = 6*30; // 默认存6个月
        let input_history_start_time_key = app_class + "input_history_start_time";
        let input_history_len_time = len_day * 24 * 60 * 60; // 间隔时间，s
        view.data_timeout_state(input_history_start_time_key, input_history_len_time, [true, true],function (state, log){
            view.log([state, log]);
            if (state){ // 已过期，证明不经常用
                s_clear_history();
            }else{ // 未过期，自动更新时间，证明经常用。
                // auto update
            }
        });
    }catch (e) {}
}

// 清除历史记录
function s_clear_history(){
    let data_key = app_class + "input_history";
    return view.del_data(data_key);
}

//
function s_alert_url_timeout_state(word, state){
    view.alert_txt("原始链接过期或参数错误", 10000);
    window.location.replace(app_url.jump_url+"&error_url="+encodeURIComponent(window.location.href)+"&error_msg=原始链接过期或参数错误");
}

// 最终跳转
function jump_url_location(engine, word, url) { // 增补关键词
    try {word = decodeURIComponent(word);}catch (e) {}
    const search_url= "http://"+window.location.host+assets_html_dir_name+assets_html_index_name;

    // 校验时间戳
    let url_timeout_state = view.url_timeout_decode("search", view.get_url_param("", "url_timeout"));
    // if (url_timeout_state){
    //     //
    // }else{
    //     // 已过期
    // }

    // 是链接就直接打开, http/https开头
    if (view.is_url(word)){
        view.hide_loading();
        view.title("直接打开网址");
        window.location.replace(word);
    }

    // 匹配展示本网站文字
    else if (word === "kw@bing" || word === "@bing" || word === "@必应"){
        if (url_timeout_state){
            view.hide_loading();
            view.title("请查看 kw 对应的内容");
            let show_txt = search_url + "?route=search&engine=bing&history=yes&word=%s";
            $(".match-kw-span-msg").html("自定义 PH-必应 搜索引擎");
            $(".match-kw-span-txt").html(show_txt).attr("data-clipboard-text", show_txt);
        }else{
            s_alert_url_timeout_state(word, url_timeout_state)
        }
    }
    else if (word === "kw@baidu" || word === "@baidu" || word === "@百度"){
        if (url_timeout_state){
            view.hide_loading();
            view.title("请查看 kw 对应的内容");
            let show_txt = search_url + "?route=search&engine=baidu&history=no&word=%s";
            $(".match-kw-span-msg").html("自定义 PH-百度 搜索引擎：");
            $(".match-kw-span-txt").html(show_txt).attr("data-clipboard-text", show_txt);
        }else{
            s_alert_url_timeout_state(word, url_timeout_state)
        }
    }
    else if (word === "kw@sogou" || word === "kw@sougou" || word === "@sogou" || word === "@sougou" || word === "@搜狗"){
        if (url_timeout_state){
            view.hide_loading();
            view.title("请查看 kw 对应的内容");
            let show_txt = search_url + "?route=search&engine=sogou&history=no&word=%s";
            $(".match-kw-span-msg").html("自定义 PH-搜狗 搜索引擎：");
            $(".match-kw-span-txt").html(show_txt).attr("data-clipboard-text", show_txt);
        }else{
            s_alert_url_timeout_state(word, url_timeout_state)
        }
    }
    else if (word === "kw@yandex" || word === "@yandex"){
        if (url_timeout_state){
            view.hide_loading();
            view.title("请查看 kw 对应的内容");
            let show_txt = search_url + "?route=search&engine=yandex&history=yes&word=%s";
            $(".match-kw-span-msg").html("自定义 PH-Yandex 搜索引擎：");
            $(".match-kw-span-txt").html(show_txt).attr("data-clipboard-text", show_txt);
        }else{
            s_alert_url_timeout_state(word, url_timeout_state)
        }
    }
    else if (word === "kw@yahoo" || word === "@yahoo"){
        if (url_timeout_state){
            view.hide_loading();
            view.title("请查看 kw 对应的内容");
            let show_txt = search_url + "?route=search&engine=yahoo&history=yes&word=%s";
            $(".match-kw-span-msg").html("自定义 PH-Yahoo 搜索引擎：");
            $(".match-kw-span-txt").html(show_txt).attr("data-clipboard-text", show_txt);
        }else{
            s_alert_url_timeout_state(word, url_timeout_state)
        }
    }
    else if (word === "kw@google" || word === "@google" || word === "@谷歌"){
        if (url_timeout_state){
            view.hide_loading();
            view.title("请查看 kw 对应的内容");
            let show_txt = search_url + "?route=search&engine=google&history=yes&word=%s";
            $(".match-kw-span-msg").html("自定义 PH-Google 搜索引擎：");
            $(".match-kw-span-txt").html(show_txt).attr("data-clipboard-text", show_txt);
        }else{
            s_alert_url_timeout_state(word, url_timeout_state)
        }
    }

    //
    else if (word === "@ph" || word === "@purehome" || word === "@yindaoye" || word === "@引导页" || word === "@suoyin" || word === "@索引" || word === "@index"){
        view.hide_loading();
        view.title("请查看 kw 对应的内容");

        window.location.replace("./");
    }
    else if (word === "kw@home" || word === "@home" || word === "@zhuye" || word === "@主页" || word === "@kaishiye" || word === "@开始页" || word === "@qishiye" || word === "@起始页" || word === "@shouye" || word === "@首页"){
        view.hide_loading();
        view.title("请查看 kw 对应的内容");

        window.location.replace("./?route=home");
    }
    else if (word === "kw@app" || word === "@app"){
        view.hide_loading();
        view.title("请查看 kw 对应的内容");

        window.location.replace("./?route=app");
    }
    else if (word === "kw@info" || word === "@info"){
        view.hide_loading();
        view.title("请查看 kw 对应的内容");

        window.location.replace("./?route=info");
    }
    else if (word === "kw@coding" || word === "@coding"){
        view.hide_loading();
        view.title("请查看 kw 对应的内容");

        window.location.replace("./?route=info");
    }
    else if (word === "kw@404" || word === "@404"){
        view.hide_loading();
        view.title("请查看 kw 对应的内容");

        window.location.replace("./?route=404");
    }

    // 触发1
    else if (word === "kw@xdy" || word === "kw@jyp" || word === "@xdy" || word === "@jyp"){
        if (url_timeout_state){
            view.hide_loading();
            let white_data = view.get_data(app_class+"kw@key=jyp.js.0"); // 格式 @key=test@value=123
            if ((view.is_mobile_screen() && view.is_user_screen()) || (view.is_user_screen() && view.is_pc_pwa()) || (view.is_mobile_screen() && view.is_mobile_pwa()) || white_data === "OK"){
                view.title(" 🎬 教育片 ");
                $(".match-kw-span-msg").html("正在加载...");
                view.write_js([cdn_page_file + ".cache/jyp.js?cache="+view.time_date("YmdHi")], function (state){
                    if (state){
                        $(".match-kw-span-msg").html(kws_title);
                        $(".match-kw-span-txt").html(kws_dom);
                    }else{
                        $(".match-kw-span-msg").html("Error：");
                        $(".match-kw-span-txt").html("kw.js文件未正确加载，详情请看log。");
                    }
                });
            }else{
                view.title(" 😂··· ");
                window.location.replace(app_url.jump_url+"&error_msg=不支持口令");
            }
        }else{
            s_alert_url_timeout_state(word, url_timeout_state)
        }
    }
    // 触发2
    else if (word === "kw@news" || word === "kw@bookmark" || word === "@news" || word === "@bookmark"){
        if (url_timeout_state){
            view.hide_loading();
            if (view.is_mobile_screen() || view.is_user_screen()){
                view.title(" 🔖 书签 ");
                $(".match-kw-span-msg").html("正在加载...");
                view.write_js([cdn_page_file + ".cache/bookmark.js?cache="+view.time_date("YmdHi")], function (state){
                    if (state){
                        $(".match-kw-span-msg").html(bookmark_title);
                        $(".match-kw-span-txt").html(bookmark_dom);
                        //
                        bookmark_list();
                    }else{
                        $(".match-kw-span-msg").html("Error：");
                        $(".match-kw-span-txt").html("kw.js文件未正确加载，详情请看log。");
                    }
                });
            }else{
                view.title(" 😂··· ");
                window.location.replace(app_url.jump_url+"&error_msg=不支持口令");
            }
        }else{
            s_alert_url_timeout_state(word, url_timeout_state)
        }
    }

    // 打开网站
    else if (word === "kw@translator" || word === "kw@biyingfanyi" || word === "kw@必应翻译" || word === "@biyingfanyi" || word === "@必应翻译" || word === "@translator"){
        url = "https://www.bing.com/translator";
        window.location.replace(url);
    }
    else if (word === "kw@fanyi" || word === "kw@翻译" || word === "@fanyi" || word === "@翻译"){
        url = "https://fanyi.baidu.com/";
        window.location.replace(url);
    }
    else if (word === "kw@youdao" || word === "kw@有道" || word === "@youdao" || word === "@有道")
    {
        url = "https://fanyi.youdao.com/";
        window.location.replace(url);
    }
    else if (word === "kw@font" || word === "kw@fontawesome" || word === "@font" || word === "@fontawesome"){
        url = "https://fontawesome.com/icons";
        window.location.replace(url);
    }
    else if (word === "kw@png" || word === "kw@icon" || word === "@png" || word === "@icon"){
        url = "https://www.flaticon.com/";
        window.location.replace(url);
    }
    else if (word === "kw@speedtest" || word === "@speedtest"){
        url = "https://test.ustc.edu.cn";
        window.location.replace(url);
    }
    else if (word === "kw@hyperos" || word === "@hyperos"){
        window.location.replace("./?route=docs&name=0.HyperOS新手机设置.tud");
    }
    else if (word === "kw@dumogu" || word === "@dumogu" || word === "@dumegu" || word === "@毒蘑菇" || word === "@毒蘑菇测试"){
        window.location.replace("./dumogutest.html");
    }

    // 3-匹配搜索引擎
    else {
        view.show_loading(0);
        let name = "";
        //
        if (engine === "baidu"){
            url = "https://www.baidu.com/s?ie=utf-8";
            url = url + "&wd=" + word;
            name = "Baidu";
        }
        else if (engine === "bing"){
            url = "https://www.bing.com/?ensearch=1";
            url = url + "&q=" + word;
            name = "Bing";
        }
        else if (engine === "google"){
            url = "https://www.google.com/search?q=";
            url = url + word ;
            name = "Google";
        }
        else if (engine === "duckduckgo"){
            url = "https://duckduckgo.com/?ia=web";
            url = url + "&q=" + word ;
            name = "DuckDuckGo";
        }
        else if (engine === "yandex"){
            url = "https://yandex.com/search/?text=";
            url = url+ word ;
            name = "Yandex";
        }
        else if (engine === "yahoo"){
            url = "https://search.yahoo.com/search?p=";
            url = url+ word;
            name = "Yahoo";
        }
        else if (engine === "m_toutiao"){
            url = "https://m.toutiao.com/search/?keyword=";
            url = url + word ;
            name = "头条搜索";
        }
        else if (engine === "toutiao"){
            url = "https://www.toutiao.com/search/?keyword=";
            url = url + word ;
            name = "头条搜索";
        }
        else if (engine === "m_sogou" || engine === "m_sougou"){
            url = "https://wap.sogou.com/web/searchList.jsp?from=index&keyword=";
            url = url + word ;
            name = "搜狗搜索";
        }
        else if (engine === "sogou" || engine === "sougou"){
            url = "https://sogou.com/web?query=";
            url = url + word ;
            name = "搜狗搜索";
        }
        else if (engine === "weixin"){
            url = "https://weixin.sogou.com/weixin?type=2&s_from=input&ie=utf8&query=";
            url = url + word ;
            name = "微信文章搜索";
        }
        else if (engine === "music"){
            url = "https://www.hifini.com/search-";
            url = url + word + "-1-1-1.htm";
            name = "Music搜索";
        }
        else if (engine === "video"){
            url = "https://www.bing.com/search?ensearch=1&q=tokyvideo+";
            url = url + word ;
            name = "Bing+Toky搜索";
        }
        else if (engine === "ipdomain"){
            url = "https://ipchaxun.com/";
            url = url + word;
            name = "IP&网址";
        }
        else if (engine === "whois"){
            url = "https://www.whois.com/whois/";
            url = url + word;
            name = "域名Whois";
        }
        else if (engine === "dpxz_download"){
            url = "http://s.uzzf.com/sousuo/pc/?k=";
            url = url + word;
            name = "东坡下载";
        }
        else if (engine === "github"){
            url = "https://github.com/search?&type=Repositories";
            url = url + "&q=" + word;
            name = "Github";
        }
        else if (engine === "x"){
            url = "https://twitter.com/search?q=";
            url = url+ word;
            name = "X";
        }
        else if (engine === "youtube"){
            url = "https://www.youtube.com/results?search_query=";
            url = url+ word;
            name = "Youtube";
        }
        else if (engine === "douyin"){
            url = "https://www.douyin.com/search/";
            url = url+ word;
            name = "Douyin";
        }
        else if (engine === "tiktok"){
            url = "https://www.tiktok.com/search?q=";
            url = url+ word;
            name = "TikTok";
        }
        else if (engine === "icons"){
            url = "https://www.flaticon.com/search?word=";
            url = url+ word;
            name = "icon图标";
        }
        else if (engine === "android_cn"){
            url = "https://h5.appstore.vivo.com.cn/#/result?keyfrom=2&keyword=";
            url = url + word ;
            name = "中国安卓应用";
        }
        else if (engine === "android_gl"){
            url = "https://www.apk20.com/search/";
            url = url + word ;
            name = "国际安卓应用";
        }

        //
        else {
            view.alert_txt("engine参数为空，不能选择跳转的目标地址");
            view.log("/?route=search&engine=&word=");
            return;
        }
        view.title("Opening keywords" + " with " + name);
        window.location.replace(url);
    }
}

// 校验搜索引擎
function jump_search_engine(state) {
    view.log(state);
    let engine = ""; // 哪个搜索引擎
    let word = ""; // 搜索的关键词
    let url = "";

    engine = view.get_url_param("", "engine");
    try {
        word = view.get_url_param("", "word");
    }catch (e) {
        view.error(["可忽略的错误", e]);
        word = "";
    }

    if (view.get_url_param("", "history") === "yes"){
        s_update_history(word); // 更新历史
    }

    if (!engine){engine = "bing";}
    jump_url_location(engine, word, url);
}

function start_page(e) {
    view.log(e);
    jump_search_engine();
}

function show_page(){
    jump_search_engine();
}