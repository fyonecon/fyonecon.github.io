
function kws_show_list(){
    let array_a = [ // unicode
        // {
        //     encode_title: "",
        //     encode_href: ""
        // },
        { // 1
            show_lang: "all",
            encode_title: "12304,55357,56589,25628,32034,77,105,115,115,65,86,12305",
            encode_href: "104,116,116,112,115,58,47,47,109,105,115,115,97,118,46,119,115,47,100,109,49,50,47,99,110"
        },
        // 吃瓜
        //2
        {
            show_lang: "all",
            encode_title: "57,49,49,29190,26009,32593",
            encode_href: "104,116,116,112,115,58,47,47,57,49,49,98,108,48,51,46,99,111,109"
        },
        //3
        {
            show_lang: "all",
            encode_title: "57,49,21507,29916,32593",
            encode_href: "104,116,116,112,58,47,47,57,49,99,103,119,49,54,46,99,111,109"
        },
        //4
        {
            show_lang: "all",
            encode_title: "53,49,21507,29916,32593",
            encode_href: "104,116,116,112,58,47,47,53,49,99,103,122,54,46,99,111,109"
        },
        //5
        {
            show_lang: "all",
            encode_title: "27599,26085,22823,36187,21507,29916,32593",
            encode_href: "104,116,116,112,58,47,47,109,114,100,115,50,51,46,99,111,109"
        },
        // 影院
        //6
        {
            show_lang: "all",
            encode_title: "57,49,80,111,114,110",
            encode_href: "104,116,116,112,115,58,47,47,118,105,112,46,57,49,112,48,55,46,99,111,109,47,105,110,100,101,120,46,112,104,112"
        },
        //7
        {
            show_lang: "all",
            encode_title: "66,24433,38498",
            encode_href: "104,116,116,112,115,58,47,47,98,98,97,105,99,117,46,99,111,109"
        },
        //8
        {
            show_lang: "all",
            encode_title: "56,88,56,88,24433,38498",
            encode_href: "104,116,116,112,58,47,47,121,121,104,111,111,104,46,108,111,108"
        },
        // 论坛
        //9
        {
            show_lang: "en",
            encode_title: "33609,27060,23448,26041",
            encode_href: "104,116,116,112,115,58,47,47,99,111,46,109,122,97,99,108,46,99,111,109"
        },
        //10
        {
            show_lang: "en",
            encode_title: "28023,35282,23448,26041",
            encode_href: "104,116,116,112,115,58,47,47,104,97,105,106,105,97,111,46,99,111,109"
        },
        //11
        {
            show_lang: "en",
            encode_title: "28023,35282,28909,38376",
            encode_href: "104,116,116,112,115,58,47,47,104,97,105,106,49,46,99,111,109"
        },
        //12
        {
            show_lang: "all",
            encode_title: "22969,22969,22312,32447",
            encode_href: "104,116,116,112,115,58,47,47,119,119,119,46,109,109,122,120,49,50,46,99,99"
        },
        //13
        {
            show_lang: "all",
            encode_title: "22969,22969,22270,38598",
            encode_href: "104,116,116,112,115,58,47,47,109,109,116,117,106,105,46,99,111,109"
        },
        //14
        {
            show_lang: "all",
            encode_title: "37324,30058,21160,28459",
            encode_href: "104,116,116,112,115,58,47,47,116,116,100,109,46,109,101"
        },
        //15
        {
            show_lang: "en",
            encode_title: "12304,30005,25253,25628,32676,12305,33821,33673,25628,25628",
            encode_href: "104,116,116,112,115,58,47,47,116,46,109,101,47,108,117,111,108,105,115,115,111"
        },
        //16
        {
            show_lang: "en",
            encode_title: "12304,30005,25253,25628,32676,12305,20013,25991,25628,32034",
            encode_href: "104,116,116,112,115,58,47,47,116,46,109,101,47,115,111,117,115,117,111,51,51"
        },
    ];
    //
    $(".kws-show-btn").html("隐藏列表");
    $(".kws-show-list").html("").removeClass("hide");
    array_a.forEach((info, index)=>{
        let num = index+1; if (num<10){num="0"+num;}
        let show_lang = info.show_lang;
        let title = info.encode_title;
        let href = info.encode_href;
        if ( // 根据系统语言展示相关内容
            show_lang === "all" ||
            (show_lang === "en" && lang_eq === 1) ||
            (show_lang === "zh" && lang_eq === 0) ||
            (show_lang === "zh-tw" && lang_eq === 2) ||
            (show_lang === "jp" && lang_eq === 3)
        ){
            let dom_a = '<a class="kws-a break click font-text" data-encode_href="'+href+'" data-encode_title="'+title+'" data-target="_blank" ><div>' + num + '：' +view.unicode_to_string(info.encode_title)+'</div></a>';
            $(".kws-show-list").append(dom_a);
        }
    });
    $(".kws-show-list").append('<hr/>');
}

function kws_hide_list(){
    $(".kws-show-btn").html("展示列表");
    $(".kws-show-list").html("").addClass("hide");
}

$(document).on("click", ".kws-show-btn", function (){
    let that = $(this);
    if ($(".kws-show-list").hasClass("hide")){
        kws_show_list();
    }else{
        kws_hide_list();
    }
});
$(document).on("click", ".kws-a", function (){
    let that = $(this);
    kws_hide_list();
    //
    let target = that.attr("data-target");
    let href = view.unicode_to_string(that.attr("data-encode_href"));
    //
    view.show_loading(2000);
    setTimeout(function (){
        // window.location.replace(href);
        view.window_open(href, "_self");
    }, 200);
});

let kws_title = "<div style='width: calc(100% - 20px);'><div style='margin-bottom: 10px;'><span style='font-weight: 700;'>教育片 <i style='color: orangered;'>@jyp</i></span><br>内容仅供教育学习。<br>谨防网络赌博诈骗。</div><hr/><div style='margin-bottom: 10px;'>推荐 联通、电信 等网络。<br>推荐 Safari、Chrome、Edge、火狐 等浏览器。</div><hr/><div style='margin-bottom: 10px;'><span style='font-weight: 700;'>[ "+view.time_date("Y/m/d H:i")+" ]</span></div></div>";
let kws_dom = `<hr/><div class="kws-show-btn select-none click font-blue font-text">展示列表</div><div class="clear"></div><hr/><div class="kws-show-list font-text hide"></div>
<div class="clear"></div><br/><br/><br/>`;
