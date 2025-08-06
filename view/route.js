/*页面和模块信息配置*/
/*路由注册（白名单）*/

"use strict";

// 1. 所有页面公用js、css文件，全局有效
// 2. 注册全局组件
const page_public_file = {
    "js": [
        "common/page_all.js", // 全局共用函数
        "common/frame_loaded.js", // 解析完路由后的操作
        "common/page_init.js", // 解析完路由后的操作
        "common/page_login.js", // 用户全局安全校验
        "static/js/input_enter.js", // 监测enter按钮事件
    ],
    "css": [
        "static/css/page_all.css",
        // "static/fontawesome-6-web/css/all.css", // https://fontawesome.com/search?q=
    ],
};

const default_route = "direct"; // 默认路由名称，home、direct

// pages模块页面白名单配置
const pages = [
    // 开始-必要路由
    { // 页面模块-默认
        "route"     : "",
        "route_alias": "direct",
        "title"     :  "请选择需要进入的页面",
        "html" : "pages/direct/direct.view",
        "file"      : {
            "js": [
                "pages/direct/direct.js",
            ],
            "css": [
                "pages/direct/direct.css",
            ],
        },
    }, //
    { // 页面模块-404
        "route"     : "404",  // 路由名主称
        "route_alias": "404", // 路由名别称
        "title"     : "页面404 - 页面没找到路由地址",  // 页面title
        "html" : "pages/404/404.view", // 实际文件路径+文件名，文件后缀统一用“.htm、.html、.view”
        "file"      : {
            "js": [
                "pages/404/404.js",  // 模块页面js
            ],
            "css": [
                "pages/404/404.css",  // 模块页面css
            ],
        },
    },
    // 结束-必要路由

    { // 页面模块
        "route"     : "info",
        "route_alias": "info",
        "title"     :  "App与浏览器参数",
        "html" : "pages/info/info.view",
        "file"      : {
            "js": [
                "pages/info/info.js",
            ],
            "css": [
                "pages/info/info.css",
            ],
        },
    }, //
    { // 页面模块
        "route"     : "home",
        "route_alias": "home",
        "title"     : "主页",
        "html" : "pages/home/home.view",
        "file"      : {
            "js": [
                "pages/home/home_kw.js",
                "pages/home/home.js",
            ],
            "css": [
                "pages/home/home.css",
            ],
        },
    }, //
    { // 页面模块-搜索辅助跳转
        "route"     : "search",
        "route_alias": "search",
        "title"     : "搜索 ",
        "html" : "pages/search/search.view",
        "file"      : {
            "js": [
                "pages/search/search.js",
            ],
            "css": [
                "pages/search/search.css",
            ],
        },
    }, //
    { // 页面模块-文档预览
        "route"     : "docs",
        "route_alias": "docs",
        "title"     : "文档预览 ",
        "html" : "pages/docs/docs.view",
        "file"      : {
            "js": [
                "pages/docs/docs.js",
            ],
            "css": [
                "pages/docs/docs.css",
            ],
        },
    }, //
    { // 页面模块
        "route"     : "purehome",
        "route_alias": "purehome",
        "title"     :  "PureHome详情介绍",
        "html" : "pages/app/purehome/purehome.view",
        "file"      : {
            "js": [
                "pages/app/purehome/purehome.js",
            ],
            "css": [
                "pages/app/purehome/purehome.css",
            ],
        },
    }, //

    //
];

