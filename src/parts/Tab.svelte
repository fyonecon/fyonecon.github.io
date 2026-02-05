<script>
    import func from "../common/func.svelte.js";
    import {afterNavigate} from "$app/navigation";
    import {browser_ok, runtime_ok} from "../common/middleware.svelte.js";
    import config from "../config.js";


    // 本页面参数
    let route = $state(func.get_route());
    const tab_data = [ // tab数据。3个最佳，3个以上需要重新计算单个tab的宽度
        {
            icon: '<svg xmlns="http://www.w3.org/2000/svg" style="display: inline-block;" width="26" height="26" viewBox="0 0 24 24"><g fill="currentColor"><path d="M10 13v-1.978l1.5-1.094l1.5 1.094V13a.25.25 0 0 1-.25.25h-2.5A.25.25 0 0 1 10 13"/><path d="M3.25 11.5a8.25 8.25 0 1 1 14.578 5.294l2.675 2.676a.75.75 0 0 1-1.06 1.06l-2.678-2.678A8.25 8.25 0 0 1 3.25 11.5m10.942-1.466l-2.25-1.64a.75.75 0 0 0-.884 0l-2.25 1.64a.75.75 0 0 0-.308.606V13c0 .966.784 1.75 1.75 1.75h2.5A1.75 1.75 0 0 0 14.5 13v-2.36a.75.75 0 0 0-.308-.606"/></g></svg>', // 图标，26px
            title: func.get_translate("PureHome"), // 名字
            route: "/purehome", // 对应的route名字
            href: "./purehome", // 跳转地址
        },
        {
            icon: '<svg xmlns="http://www.w3.org/2000/svg" style="display: inline-block;" width="26" height="26" viewBox="0 0 24 24"><path fill="currentColor" d="m12 12.625l1.275.775q.275.175.538-.025T14 12.85l-.325-1.45l1.1-.95q.25-.225.163-.525t-.438-.35l-1.45-.125l-.6-1.375q-.125-.3-.45-.3t-.45.3l-.6 1.375l-1.45.125q-.35.05-.437.35t.162.525l1.1.95L10 12.85q-.075.325.188.525t.537.025zM12 18l-4.2 1.8q-1 .425-1.9-.162T5 17.975V5q0-.825.588-1.412T7 3h10q.825 0 1.413.588T19 5v12.975q0 1.075-.9 1.663t-1.9.162z"/></svg>',
            title: func.get_translate("Bookmark"),
            route: "/bookmark",
            href: "./bookmark",
        },
    ];
    let tab_width = $state(205);
    let glass_div_display = $state("hide");
    let qr_img_display = $state("hide");
    let qr_img_src = $state("");
    let qr_enbig_num = $state(0);
    let qr_enbig_width = $state(20);
    let qr_enbig_height = $state(20);


    // 本页面函数：Svelte的HTML组件onXXX=中正确调用：={()=>def.xxx()}
    const def = {
        open_url: function (href=""){
            func.open_url(href);
        },
        calc_tab: function (){ // 计算tab的实际宽度
            let len = tab_data.length;
            tab_width = (85 + 10) * len + 10;
        },
        show_glass_div: function (){ // 是否隐藏tab区域
            if (route === "/purehome" || route === "/bookmark"){
                glass_div_display = "show";
            }else{
                glass_div_display = "hide";
            }
            //
            // if (route === "/bookmark"){ // 正常Tab路由
            //     glass_div_display = "show";
            // }else{
            //     if (route === "/purehome"){
            //         glass_div_display = (func.get_local_data(config.app.app_class+"home_tab_show")==="show")?"show":"hide";
            //     }else{
            //         glass_div_display = "hide";
            //     }
            // }
        },
        show_qr_div: function (){
            if (route === "/purehome" || route === "/bookmark" || route === "/info"){
                func.make_qr_base64(func.get_href()).then(base64=>{
                    qr_img_display = "show";
                    qr_img_src = base64;
                });
            }else{
                qr_img_display = "hide";
            }
        },
        qr_enbig: function (){
            if (qr_enbig_num === 0){
                qr_enbig_width = 100;
                qr_enbig_height = 100;
                qr_enbig_num = 1;
            }else{
                qr_enbig_width = 20;
                qr_enbig_height = 20;
                qr_enbig_num = 0;
            }
        },
    };


    // 刷新页面数据
    afterNavigate(() => {
        if (!runtime_ok() || !browser_ok()){return;} // 系统基础条件检测
        // 开始
        route = func.get_route();
        def.calc_tab();
        def.show_glass_div();
        def.show_qr_div();
    });


</script>

<div class="part-div liquidGlass-div select-none {glass_div_display} ">
    <!---->
    <svg style="display: none;">
        <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
            <feturbulence type="fractalNoise" baseFrequency="0.001 0.005" numOctaves="1" seed="17" result="turbulence"></feturbulence>

            <fecomponenttransfer in="turbulence" result="mapped">
                <fefuncr type="gamma" amplitude="1" exponent="10" offset="0.5"></fefuncr>
                <fefuncg type="gamma" amplitude="0" exponent="1" offset="0"></fefuncg>
                <fefuncb type="gamma" amplitude="0" exponent="1" offset="0.5"></fefuncb>
            </fecomponenttransfer>

            <fegaussianblur in="turbulence" stdDeviation="3" result="softMap"></fegaussianblur>

            <fespecularlighting in="softMap" surfaceScale="5" specularConstant="1" specularExponent="100" lighting-color="white" result="specLight">
                <fepointlight x="-200" y="-200" z="300"></fepointlight>
            </fespecularlighting>

            <fecomposite in="specLight" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litImage"></fecomposite>

            <fedisplacementmap in="SourceGraphic" in2="softMap" scale="200" xChannelSelector="R" yChannelSelector="G"></fedisplacementmap>
        </filter>
    </svg>
    <!---->
    <div class="liquidGlass-box pywebview-drag-region can-drag  " style="width: {tab_width}px;" >
        <div class="liquidGlass-wrapper">
            <div class="liquidGlass-effect"></div>
            <div class="liquidGlass-tint"></div>
            <div class="liquidGlass-shine"></div>
            <div class="liquidGlass-text">
                <!---->
                {#each tab_data as item}
                    <button class="tab-item select-none {(route === item.route)?'tab-item-active':''}" onclick={()=>def.open_url(item.href)} >
                        <div>{@html item.icon}</div>
                        <div class="font-mini">{@html item.title}</div>
                    </button>
                {/each}
                <!---->
                <div class="clear"></div>
            </div>
        </div>
    </div>
</div>

<button class="tab-qr-box select-none font-mini click {qr_img_display} " style="width: {qr_enbig_width}px; height: {qr_enbig_height}px;" onclick={()=>def.qr_enbig()}>
    <img class="tab-qr-img" src="{qr_img_src}" alt="QR" />
</button>

<style>
    /**/
    .liquidGlass-box {
        position: fixed;
        bottom: 20px;
        left: 0;
        right: 0;
        margin: 0 auto;
        width: calc(205px);
        z-index: 1;
        border-radius: 20px;
    }
    .liquidGlass-wrapper {
        position: relative;
        display: flex;
        overflow: hidden;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1), 0 0 20px rgba(0, 0, 0, 0.1);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 2.2);
        border-radius: 20px;
        padding: 0 5px;
    }
    .liquidGlass-effect {
        position: absolute;
        z-index: 0;
        inset: 0;
        backdrop-filter: blur(2px);
        filter: url(#glass-distortion);
        overflow: hidden;
        isolation: isolate;
        border-radius: 20px;
    }
    .liquidGlass-tint {
        z-index: 1;
        position: absolute;
        inset: 0;
        background: rgba(160,160,160, 0.2);
        border-radius: 20px;
    }
    .liquidGlass-shine {
        position: absolute;
        inset: 0;
        z-index: 2;
        overflow: hidden;
        box-shadow: inset 2px 2px 1px 0 rgba(255, 255, 255, 0.2),
        inset -1px -1px 1px 1px rgba(255, 255, 255, 0.2);
        border-radius: 20px;
    }
    .liquidGlass-text {
        z-index: 3;
        border-radius: 20px;
    }

    /**/
    .tab-item{
        width: 85px;
        margin: 5px 5px;
        overflow: hidden;
        text-align: center;
        border: none;
        outline: none;
        float: left;
        border-radius: 20px;
        transition: all 0.1s ease-in;
        opacity: 0.9;
        cursor: pointer;
    }
    .tab-item-active{
        color: var(--color-blue-500);
    }

    /**/
    .tab-qr-box{
        position: fixed;
        z-index: 1;
        right: 10px;
        bottom: 80px;
        border-radius: 5px;
        padding: 1px 1px;
        background-color: rgba(160,160,160, 0.5);
        overflow: hidden;
        width: 20px;
        height: 20px;
    }
    .tab-qr-img{
        width: 100%;
        height: 100%;
        border-radius: 5px;
        border: none;
        outline: none;
    }

</style>