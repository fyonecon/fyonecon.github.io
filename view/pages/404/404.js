/*
* 局部模块js
* */
"use strict";

function start_page(info) {
    view.log(info);
    view.load_img("img-404", cdn_page_file+"static/img/");
    //
    let error_url = view.get_url_param("", "error_url");
    let error_msg = view.get_url_param("", "error_msg");
    //
    if (error_url){
        $(".show-error_msg").text("页面404，请检查链接、内容或参数是否有效。");
        $(".show-error_url").text(error_url?error_url:"-");
    }
    if (error_msg){
        $(".show-error_msg").text(error_msg);
        $(".show-error_url").text(error_url?error_url:"-");
    }
}
