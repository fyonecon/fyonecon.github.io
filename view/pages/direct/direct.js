function page_for_direct(info) {
    let dom = $(".div-box");
    let domain = window.location.host;
    if (view.string_include_string(domain, ".github.io") >=0){
        dom.removeClass("hide");
    }else{
        window.location.replace("./#route=home");
    }
}