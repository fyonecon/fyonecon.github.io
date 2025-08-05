
function show_info(){
    // 参数与值
    let infos = [
        {
            "title": "类型：",
            "title_class": "font-class",
            "value": "值：",
            "value_class": "font-class",
        },
        {
            "title": "浏览器语言",
            "title_class": "font-text",
            "value": window.navigator.languages,
            "value_class": "font-text",
        },
        {
            "title": "浏览器时区",
            "title_class": "font-text",
            "value": Intl.DateTimeFormat().resolvedOptions().timeZone || "-不支持-",
            "value_class": "font-text",
        },
        {
            "title": "浏览器在线",
            "title_class": "font-text",
            "value": window.navigator.onLine || "-不支持-",
            "value_class": "font-text",
        },
        {
            "title": "设备CPU数(核)",
            "title_class": "font-text",
            "value": window.navigator.hardwareConcurrency || "-不支持-",
            "value_class": "font-text",
        },
        {
            "title": "设备内存(GB)",
            "title_class": "font-text",
            "value": window.navigator.deviceMemory || "-不支持-",
            "value_class": "font-text",
        },
        {
            "title": "Screen尺度参数",
            "title_class": "font-text",
            "value": "screen.width=" + window.screen.width + "<br/>screen.height=" + window.screen.height+ "<br/>screen.availWidth=" + window.screen.availWidth+ "<br/>screen.availHeight=" + window.screen.availHeight,
            "value_class": "font-text",
        },
        {
            "title": "Pages尺度参数",
            "title_class": "font-text",
            "value": "innerWidth=" + window.innerWidth + "<br/>innerHeight=" + window.innerHeight,
            "value_class": "font-text",
        },
        {
            "title": "浏览器userAgent",
            "title_class": "font-text",
            "value": window.navigator.userAgent,
            "value_class": "font-text",
        },
        {
            "title": "浏览器appVersion",
            "title_class": "font-text",
            "value": window.navigator.appVersion,
            "value_class": "font-text",
        },
        {
            "title": "平台参数特性(ls、DB、wd)",
            "title_class": "font-text",
            "value": [!!window.localStorage, !!window.indexedDB, navigator.webdriver],
            "value_class": "font-text",
        },
        {
            "title": "是否处于PWA(Mobile、PC)",
            "title_class": "font-text",
            "value": [view.is_mobile_pwa(), view.is_pc_pwa()],
            "value_class": "font-text",
        },
        {
            "title": "IsMobileScreen",
            "title_class": "font-text",
            "value": view.is_mobile_screen(),
            "value_class": "font-text",
        },
        {
            "title": "IsUserScreen",
            "title_class": "font-text",
            "value": view.is_user_screen(),
            "value_class": "font-text",
        },
        {
            "title": "浏览器主题",
            "title_class": "font-text",
            "value": view.scheme_model(),
            "value_class": "font-text",
        },
        {
            "title": "View框架解析用时",
            "title_class": "font-text",
            "value": (time_loaded - time_start) + " ms",
            "value_class": "font-text",
        },
        {
            "title": "当前访问地址",
            "title_class": "font-text",
            "value": window.location.href,
            "value_class": "font-text",
        },
        {
            "title": "当前地址的Refer",
            "title_class": "font-text",
            "value": document.referrer,
            "value_class": "font-text",
        },
        {
            "title": "当前地址的Host",
            "title_class": "font-text",
            "value": window.location.host,
            "value_class": "font-text",
        },
        {
            "title": "主API地址",
            "title_class": "font-text",
            "value": api_url,
            "value_class": "font-text",
        },
        {
            "title": "APP UID",
            "title_class": "font-text",
            "value": view.get_data(app_class + "app_uid"),
            "value_class": "font-text",
        },
        {
            "title": "Files Version",
            "title_class": "font-text",
            "value": files_version,
            "value_class": "font-text",
        },
        {
            "title": "Files appVersion",
            "title_class": "font-text",
            "value": app_version,
            "value_class": "font-text",
        },
        {
            "title": "Files assets_file_dir_name",
            "title_class": "font-text",
            "value": assets_file_dir_name,
            "value_class": "font-text",
        },
        {
            "title": "Files assets_html_dir_name",
            "title_class": "font-text",
            "value": assets_html_dir_name,
            "value_class": "font-text",
        },
        {
            "title": "CDN加速",
            "title_class": "font-text",
            "value": [cdn_page_file, cdn_depend_file],
            "value_class": "font-text",
        },
        //
        {
            "title": "安卓浏览器下载",
            "title_class": "font-text",
            "value": '<div class="a-click click select-none blue break" data-href="https://www.downkuai.com/android/114447.html" data-target="_blank" style="margin-bottom: 10px;">Firefox(全球安卓推荐使用：强屏蔽广告< 需🪜下插件 >、支持PWA、多端同步、可自定义搜索引擎)</div>' +
                '<div class="a-click click select-none blue break" data-href="https://www.downkuai.com/android/158257.html" data-target="_blank" style="margin-bottom: 10px;">Brave(大陆安卓推荐使用：弱屏蔽广告、支持PWA、弱多端同步、可自定义搜索引擎)</div>' +
                '<div class="a-click click select-none blue break" data-href="https://www.downkuai.com/android/113104.html" data-target="_self" style="margin-bottom: 10px;">OperaMini(老安卓机子推荐使用：无屏蔽广告、弱支持PWA、弱多端同步、不可自定义搜索引擎)</div>' +
                '<div class="a-click click select-none blue break" data-href="https://www.downkuai.com/android/158257.html" data-target="_blank" style="margin-bottom: 10px;">Edge(大陆安卓推荐使用：弱屏蔽广告、支持PWA、多端同步、不可自定义搜索引擎)</div>',
            "value_class": "font-text",
        },
        {
            "title": "iOS和iPadOS浏览器名单",
            "title_class": "font-text",
            "value": '<div class="click" style="margin-bottom: 10px;">Safari</div><div class="click" style="margin-bottom: 10px;">Brave</div><div class="click" style="margin-bottom: 10px;">Firefox</div><div class="click" style="margin-bottom: 10px;">Edge</div>',
            "value_class": "font-text",
        },
        {
            "title": "Mac和Windows浏览器名单",
            "title_class": "font-text",
            "value": '<div class="click" style="margin-bottom: 10px;">Safari(仅Mac)</div><div class="click" style="margin-bottom: 10px;">Chrome</div><div class="click" style="margin-bottom: 10px;">Edge</div><div class="click" style="margin-bottom: 10px;">Brave</div><div class="click" style="margin-bottom: 10px;">Firefox</div>',
            "value_class": "font-text",
        },
        //
    ];

    // 展示数据
    infos.forEach((info, index)=>{
        $(".div-box").append('<div class="div-line"><div class="div-title '+info.title_class+'">'+info.title+'</div><div class="div-value '+info.value_class+'">'+info.value+'</div><div class="clear"></div></div>');
    });

    //
    test_fetch(window.location.href);
    // test_fetch(cdn_page_file + "pages/home/home.css?cache=" + files_version);

}

//
function test_fetch(file_url){
    view.fetch_file(file_url).then(array=>{
       let state = array[0], response=array[1], url=array[2], msg=array[3];
        view.log([state, response, url, msg]);
        $(".div-box").append('<hr/>');
        if (state){
            $(".div-box").append('' +
                '<div class="div-line">' +
                '   <div class="div-title font-text">Fetch URL</div>' +
                '   <div class="div-value font-text">'+response.url+'</div>' +
                '   <div class="clear"></div>' +
                '</div>' +
                '<div class="div-line">' +
                '   <div class="div-title font-text">Fetch Status</div>' +
                '   <div class="div-value font-text">'+response.status+'</div>' +
                '   <div class="clear"></div>' +
                '</div>' +
                '<div class="div-line">' +
                '   <div class="div-title font-text">Fetch Type</div>' +
                '   <div class="div-value font-text">'+response.type+'</div>' +
                '   <div class="clear"></div>' +
                '</div>' +
                '');
            response.headers.forEach((value, type)=>{
                view.log([type, value]);
                $(".div-box").append('' +
                    '<div class="div-line">' +
                    '   <div class="div-title font-text">'+type+'</div>' +
                    '   <div class="div-value font-text">'+value+'</div>' +
                    '   <div class="clear"></div>' +
                    '</div>' +
                    '');
            });
        }else{
            $(".div-box").append('' +
                '<div class="div-line">' +
                '   <div class="div-title font-text">Fetch Error</div>' +
                '   <div class="div-value font-text">'+response.message+'</div>' +
                '   <div class="clear"></div>' +
                '</div>' +
                '');
        }
    });
}

function page_for_info(info) {
    if (view.is_wails()){
        $(".div-back").removeClass("hide");
    }else{
        $(".div-back").removeClass("hide");
        $(".fa-chevron-left").addClass("hide");
        $(".i-back-txt").html("&nbsp;⬅️");
    }

    $(".div-box").html("");
    show_info();
    // setInterval(function (){show_info();}, 8000);
}