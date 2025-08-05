/*view路由及文件解析，页面整体只加载一次，#符号判断路由：
index.html--加载配置文件--depend解析--加载common文件--删除已有路由的css和html，加载当前路由的css和html--frame_loaded和page_init（只运行一次）--page函数
*/

// 依赖
const depend_func = {
    get_url_param: function (url, key) { // 获取url中的参数
        let url_str = "";
        if(!url){url_str = window.location.href;}else {url_str = url;}
        let regExp = new RegExp("([?]|&|#)" + key + "=([^&|^#]*)(&|$|#)");
        let result = url_str.match(regExp);
        if (result) {
            return decodeURIComponent(result[2]); // 转义还原参数
        } else {
            return "";
        }
    },
    time_ms: function(){
        return Math.floor((new Date()).getTime()); // ms
    }, // 毫秒时间戳，ms
    run_page: function (route){ // 启动页面函数
        let that = this;
        // 路由和默认路由
        if (!route){
            route = that.get_url_param("", "route");
            if (!route){route = default_route;}
        }
        // 拦截
        if(
            typeof cdn_page_file === "undefined" ||
            typeof cdn_page_file === "undefined"
        ){
            console.error("参数未定义：%s，框架产生了异步时差，需要决解框架Bug。5s秒后将重试网页。", [cdn_page_file, cdn_page_file]);
            setTimeout(function () {
                window.location.reload();
            }, 5000);
        }else{
            time_loaded = that.time_ms(); // ms
            // 调用页面函数
            try {
                frame_loaded([], route);
            }catch (e){}
            try {
                page_init([], route);
            }catch (e){}
            // 调用页面函数
            try {
                eval('page_for_'+route+'("'+route+'")');
            }catch (e){
                console.log("页面函数不存在（每个子页面的起始函数都不一样，格式：'page_for_'route_name'(route){} ）", ['page_for_'+route+'("'+route+'")', e]);
            }
        }
    },
    write_js: function (js_array) {
        let that = this;
        let head = document.head || document.getElementsByTagName("head")[0];
        return new Promise(resolveJS => {
            let js_all = [];
            for (let i=0; i<js_array.length; i++){
                let the_p = new Promise(resolve => {
                    let script = document.createElement("script");
                    script.setAttribute("class", "write-js");
                    script.setAttribute("src", cdn_page_file + js_array[i] + "?cache=" + files_version);
                    head.appendChild(script);
                    script.onload = function (e) {
                        resolve(i);
                    };
                    script.onerror = function (e){
                        resolve(i);
                    }
                });
                js_all.push(the_p);
            }
            Promise.all(js_all).then((result) => {
                resolveJS(true);
            }).catch((error) => {
                console.error(error);
            });
        });
    },
    write_css: function (css_array, class_name) {
        let that = this;
        let head = document.head || document.getElementsByTagName("head")[0];
        return new Promise(resolveCSS => {
            let css_all = [];
            for (let i=0; i<css_array.length; i++){
                let p = new Promise(resolve => {
                    let link = document.createElement('link');
                    link.setAttribute("class", "write-css-"+class_name);
                    // link.setAttribute("class", "write-css");
                    link.setAttribute("href", cdn_page_file + css_array[i] + "?cache=" + files_version);
                    link.setAttribute("rel", "stylesheet");
                    head.appendChild(link);
                    link.onload = function (e){
                        resolve(i);
                    };
                    link.onerror = function (e){
                        resolve(i);
                    }
                });
                css_all.push(p);
            }
            Promise.all(css_all).then((result) => {
                resolveCSS(true);
            }).catch((error) => {
                console.error(error);
            });
        });
    },
    write_html: function (html_src, class_name) {
        let that = this;
        let view_cache = that.time_ms();
        return new Promise(resolveHTML => {
            $.ajax({ // 利用ajax的get请求获取文本内容
                url: cdn_page_file + html_src+"?cache="+files_version,
                async: true,
                success: function (data) {
                    let div = document.createElement("div");
                    div.classList.add("write-html-"+class_name);
                    // div.classList.add("write-html");
                    div.classList.add("clear");
                    div.setAttribute("id", "route-page");
                    div.setAttribute("data-view", ""+view_cache);
                    div.classList.add("page-div-" + view_cache);
                    div.innerHTML = data;
                    let depend = document.getElementById("depend");
                    depend.classList.add("depend-div-" + view_cache);
                    depend.setAttribute("data-view", ""+view_cache);
                    depend.appendChild(div); // 将模块渲染入主文件
                    resolveHTML(true);
                },
                error: function (error) {
                    console.error("缺失html模块文件：", error);
                    console.error("可能原因：", "1.非同源政策限制模块文件的拉取；2.本应用需要服务器环境（网络环境）；3.html组件文件404。");
                    time_error = Math.floor((new Date()).getTime());
                    view.alert_txt("缺失html模块文件！<br/>页面载入终止。", "long");
                    resolveHTML(false);
                }
            });
        });
    },
    load_all_files: function (){ // 载入所有common-js/css、route-js文件
        let that = this;
        return new Promise(resolveAllFiles => {
            let route_load = [];
            // 公用js、css
            let js_p = new Promise(resolve=>{
                that.write_js(page_public_file.js).then(resolve);
            });
            let css_p =  new Promise(resolve=>{
                that.write_css(page_public_file.css, "load-all-files").then(resolve);
            })
            // 路由js
            for (let i=0; i<pages.length; i++){
                let the_route = pages[i];
                let the_js_array = the_route.file.js;
                let the_js_write = new Promise(resolve=>{
                    that.write_js(the_js_array).then(resolve);
                });
                route_load.push(the_js_write);
            }
            route_load.push(js_p);
            route_load.push(css_p);
            // 完成加载
            Promise.all(route_load).then(r => {
                // console.log("载入所有common-js/css、route-js文件：", window.location.href);
                resolveAllFiles();
            });
        });

    },
    load_route_files: function (route_name){ // 载入当前route的css和html文件
        let that = this;
        return new Promise(resolveRoute => {
            // 路由文件
            let route_css_load = [];
            for (let i=0; i<pages.length; i++){
                let the_route = pages[i];
                //
                let the_route_title = the_route.title;
                let the_route_name = the_route.route;
                let the_route_name_alias = the_route.route_alias;
                //
                if (route_name === the_route_name || route_name === the_route_name_alias){
                    // css
                    let the_css_array = the_route.file.css;
                    let the_css_write = new Promise(resolve=>{
                        that.write_css(the_css_array, "load-route-files").then(resolve);
                    });
                    route_css_load.push(the_css_write);
                    // html
                    let the_html_write = the_route.file_path;
                    let route_html_load = new Promise(resolve => {
                        that.write_html(the_html_write, "load-route-files").then(resolve);
                    });
                    route_css_load.push(route_html_load);
                    // title
                    view.title(the_route_title);
                    break;
                }else{
                    if (i === pages.length - 1 ){ // 404路由
                        window.location.replace(assets_html_index_name+"#route=404");
                    }
                }
            }
            // 完成加载
            Promise.all(route_css_load).then(r => {
                console.log("载入当前route的css和html文件：", route_name);
                resolveRoute();
            });
        });
    },
    app_run: function (route){
        let that = this;
        if (!view.is_local_ipv4() && (view.is_weixin() || view.is_qq() || view.is_dingding() || view.is_work_weixin() || view.is_feishu()) ){
            view.title("😅");
            view.alert_txt("本网站禁止在「微信、QQ、钉钉、企业微信、飞书」中打开。<br/>请使用外部浏览器。", "long");
        }else {
            if (!window.localStorage || !window.indexedDB || navigator.webdriver){
                view.title("😅");
                view.log("浏览器特性支持不完整：", ["localStorage", "indexedDB", "webdriver"]);
            }else{
                view.hide_loading();
                that.run_page(route);
            }
        }
    },
};

// init-2/2 监听url是否发生变化，启动目标page_for_‘route’()函数
// 刷新整个页面：index.html ? route=xxx ；只刷新一次整个页面：index.html # route=xxx
(function () {
    window.onhashchange = function () {
        const now_url = window.location.href;
        let now_route = depend_func.get_url_param(now_url, "route");
        if (!now_route){now_route=default_route;}
        //
        view.show_loading("long");
        // 移除老css和html
        $(".write-css-load-route-files").remove();
        $("#depend").html("");
        // 加载路由文件
        depend_func.load_route_files(now_route).then(function (){
            depend_func.app_run(now_route);
        });
    };
})();

// init-1/2
function depend_init(){
    view.show_loading("long");
    return new Promise(resolve => {
        // 移除老css和html
        $(".write-css-load-route-files").remove();
        $("#depend").html("");
        //
        let now_route = depend_func.get_url_param("", "route");
        if (!now_route){now_route=default_route;}
        //
        let p1 = new Promise(resolve => { // 加载全局文件
            depend_func.load_all_files().then(resolve);
        });
        let p2 = new Promise(resolve => { // 加载路由文件
            depend_func.load_route_files(now_route).then(resolve);
        });
        Promise.all([p1, p2]).then(function (){
            depend_func.app_run(now_route);
            resolve(true);
        });
    });
}