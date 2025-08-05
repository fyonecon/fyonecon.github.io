/*
* 局部模块js
* */
"use strict";

function page_for_404(info) {
    if (view.is_wails()){
        $(".div-back").removeClass("hide");
    }else{
        $(".div-back").removeClass("hide");
        $(".fa-chevron-left").addClass("hide");
        $(".i-back-txt").html("&nbsp;⬅️");
    }

    view.log(info);
    view.load_img("img-404", cdn_page_file+"static/img/");
    //
    let error_url = view.get_url_param("", "error_url");
    let error_msg = view.get_url_param("", "error_msg");
    //
    if (!error_url && !error_msg){
        $(".show-error_msg").text("404页面（View框架默认必须存在的路由之一）。");
        $(".show-error_url").text(view.time_date("Y-m-d H:i W"));
    }else if (error_url && !error_msg){
        $(".show-error_msg").text("路由页面404（请检查链接、内容或参数是否有效）。");
        $(".show-error_url").text(error_url?error_url:"-");
    }else if (error_url && error_msg){
        $(".show-error_msg").text(error_msg);
        $(".show-error_url").text(error_url?error_url.substring(2, 150)+"...":"-");
    }else {
        $(".show-error_msg").text("404页面（要传递的参数不全）。");
        $(".show-error_url").text(view.time_date("Y-m-d H:i:s"));
    }
    //
    setTimeout(function (){
        window.location.replace("./?from=404&msg=autoload");
    }, 2*60*1000); // 默认2min自动跳转
}
