"use strict";

// 用户登录
function user_login(route, white_route){
    // 设置用户邮箱
    let user_email_key = app_class+"login_email";
    let user_pwd_key = app_class+"login_pwd";
    let _login_email = view.get_data(user_email_key);
    let _login_pwd = view.get_data(user_pwd_key);
    if ((!_login_email || !_login_pwd) && white_route !== "white_route" ){
        view.login_confirm("💡"+view.language_txt("login_confirm_alert"), "", "", function (state, class_name, new_email, new_pwd){
            if (state){
                if (view.is_email(new_email) && new_email.length >= 6){
                    login_id = new_email;
                    login_pwd = view.md5(app_class+new_pwd);
                    //
                    view.set_data(user_email_key, view.string_to_unicode(new_email));
                    view.set_data(user_pwd_key, view.md5(app_class+new_pwd));
                    view.set_data(app_class+"login_time", view.time_s());
                    //
                    view.notice_txt(view.language_txt("login_confirm_alert_bind_successful"), 4000);
                    view.refresh_page(1500);
                }else{
                    view.alert_txt(view.language_txt("login_confirm_alert_bind_email_error"), 6000);
                    view.refresh_page(3000);
                }
            }else{
                view.alert_txt(view.language_txt("login_confirm_alert_bind_cancel_alert"), 6000, "clear");
                view.refresh_page(3000);
            }
        });
    }else{
        view.log("用户 邮箱+密码 已经绑定");
        login_id = view.unicode_to_string(_login_email);
        login_pwd = _login_pwd;
        // 调用页面函数
        try {
            eval('page_for_'+route+'("'+route+'")');
        }catch (e){
            view.alert_txt("此路由没有可调用的“page_for_xxx(route)”函数", "long", "clear");
            console.log("页面函数不存在（每个子页面的起始函数都不一样，格式：'page_for_'route_name'(route){} ）", ['page_for_'+route+'("'+route+'")', e]);
        }
    }
}

// 退出本设备
function user_layout(){
    view.alert_txt("Layout...", "long", "clear");
    must_login();
}

// 跳转到登录页
function must_login(msg){
    if (!msg){msg="Please Login..";}
    view.alert_txt(msg, "long");

    login_id = "";
    login_pwd = "";
    view.del_data(app_class+"login_email");
    view.del_data(app_class+"login_pwd");

    view.refresh_page(500);
}

