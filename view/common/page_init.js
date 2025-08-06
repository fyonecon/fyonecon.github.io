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
            user_login(route, "white_route");
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

    // 动态设置网站标题
    function set_lang_title(){
        // view.title("");
        if (!route){route = "home";}
        for(let key in lang_txt_data["route"]){
            try {
                let _route = lang_txt_data["route"][key];
                if (key === route){
                    view.title(_route[lang_eq]);
                    break;
                }
            }catch (e){break;}
        }
    }
    set_lang_title();

    // 设置全局登录信息
    let user_email_key = app_class+"login_email";
    login_id = view.unicode_to_string(view.get_data(user_email_key));
    let user_pwd_key = app_class+"login_pwd";
    login_pwd = view.get_data(user_pwd_key);

    // 屏蔽词（默认值）
    let search_del_fake_news =  view.get_data(app_class+"search_del_fake_news");
    if (!search_del_fake_news){
        // view.set_data(app_class+"search_del_fake_news", "-zhihu.com");
    }else{
        view.set_data(app_class+"search_del_fake_news", "");
    }


}
