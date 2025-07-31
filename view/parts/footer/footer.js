

function do_footer(){
    if (!view.is_wails()){
        $(".footer-content").removeClass("hide");
        $(".footer-app").append(app_name).attr("data-href", web_url+"purehome.html?from=footer");
        $(".footer-host").html(window.location.host);
    }
}

// start
function start_footer(footer_file){
    view.write_html(footer_file+"footer.html", "footer-dom",  function (){
        do_footer();
    });
}