// 初始化page页面的开始函数，负责page事件。早于start_page()一步。
function page_init(e, route){
    // 处理非法节点，建议只在页面启动后运行一次，不建议多次运行。
    view.pure_page_extensions();
    setTimeout(function (){view.pure_page_extensions();}, 1000);
    setTimeout(function (){view.pure_page_extensions();}, 2000);
    setTimeout(function (){view.pure_page_extensions();}, 4000);
    setTimeout(function (){view.pure_page_extensions();}, 6000);

    // 设置一个uid
    let uid_key = app_class + "app_uid";
    let app_uid = view.get_data(uid_key);
    if (!app_uid){view.set_data(uid_key, view.make_app_uid(app_class)[0]);}
    if (view.is_wails()){
        js_call_go.SetUserAppUid(app_uid).then(info=>{
            // console.log("SetUserAppUid", info);
        });
    }

    // 处理登录
    if(!navigator.webdriver || window.localStorage || window.indexedDB){
        let right_parts_name = view.get_url_param("", "right_parts_name");
        if (
            route === "" || route === "home"
            || route === "404" || route === "login"
            || route === "search" || route === "help"
            || route === "share_dir" || route === "share_file" || route === "preview_file"
            || (route === "setting" && right_parts_name === "language-item")
            || route === "coding" || route === "direct" || route === "info" || route === "docs"
            || route === "app" || route === "purehome" || route === "purehyperos"
        ){ // 不需要登录
            start_page(e);
        } else { // 需要登录。不是login的话就直接检查是否已经登录
            // 处理是否过期
            let login_key = app_class+"login_time";
            view.data_timeout_state(login_key, login_timeout, [false, false],function (state){
                if (state){ // 已过期
                    must_login();
                }else{
                    user_login(route);
                }
            });
        }
    }else {
        view.alert_txt("Browser Be Fake！", "long", "clear");
    }

}
