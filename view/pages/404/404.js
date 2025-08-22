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
        $(".show-error_msg").text("Route 404");
        $(".show-error_url").text(view.time_date("Y-m-d H:i W"));
    }
    else if (error_url && error_msg){
        $(".show-error_msg").text(error_msg);
        $(".show-error_url").text(error_url?".."+error_url.substring(1, error_url.length-3)+"%20":"&nbsp;").attr("title", error_url);
    }
    else if (error_url && !error_msg){
        $(".show-error_msg").text("Route 404（请检查链接、内容或参数是否有效）");
        $(".show-error_url").text(error_url?error_url:"-").attr("title", error_url);
    }
    else if (!error_url && error_msg) {
        $(".show-error_msg").text("404（"+error_msg+"）");
        $(".show-error_url").text(view.time_date("Y-m-d H:i:s"));
    }
    else{
        $(".show-error_msg").text("Page 404");
        $(".show-error_url").text(view.time_date("Y-m-d H:i:s"));
    }
    //
    setTimeout(function (){
        window.location.replace("./#route=&from=404&msg=autoload");
    }, 5*60*1000); // 默认2min自动跳转
}
