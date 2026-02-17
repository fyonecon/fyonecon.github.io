<script>
    import func from "../common/func.svelte.js";
    import {afterNavigate} from "$app/navigation";
    import {browser_ok, runtime_ok} from "../common/middleware.svelte.js";
    import config from "../config.js";
    import {browser} from "$app/environment";
    import {onMount} from "svelte";


    // 本页面参数
    let route = $state(func.get_route());
    const tab_data = [ // tab数据。3、4个最佳，5个以上需要重新计算单个tab的宽度，屏幕最小宽度按300px。
        {
            icon: '<svg xmlns="http://www.w3.org/2000/svg" style="display: inline-block;" width="26" height="26" viewBox="0 0 24 24"><g fill="currentColor"><path d="M10 13v-1.978l1.5-1.094l1.5 1.094V13a.25.25 0 0 1-.25.25h-2.5A.25.25 0 0 1 10 13"/><path d="M3.25 11.5a8.25 8.25 0 1 1 14.578 5.294l2.675 2.676a.75.75 0 0 1-1.06 1.06l-2.678-2.678A8.25 8.25 0 0 1 3.25 11.5m10.942-1.466l-2.25-1.64a.75.75 0 0 0-.884 0l-2.25 1.64a.75.75 0 0 0-.308.606V13c0 .966.784 1.75 1.75 1.75h2.5A1.75 1.75 0 0 0 14.5 13v-2.36a.75.75 0 0 0-.308-.606"/></g></svg>', // 图标，26px
            title: func.get_translate("PureHome"), // 名字
            route: "/purehome", // 对应的route名字
            href: "./purehome", // 跳转地址
        },
        {
            icon: '<svg xmlns="http://www.w3.org/2000/svg" style="display: inline-block;" width="26" height="26" viewBox="0 0 24 24"><path fill="currentColor" d="M9.5 21h2.066A4.7 4.7 0 0 1 11 18.75c0-1.025.325-1.974.877-2.75H9.5zM21 9.5v4.833A4.7 4.7 0 0 0 19.25 14H16V9.5zm-6.5 0v4.666a4.7 4.7 0 0 0-.874.334H9.5v-5zM21 8V6.25A3.25 3.25 0 0 0 17.75 3H16v5zm-6.5-5h-5v5h5zM8 3H6.25A3.25 3.25 0 0 0 3 6.25V8h5zM3 9.5v5h5v-5zM3 16v1.75A3.25 3.25 0 0 0 6.25 21H8v-5zm16.25-1a3.75 3.75 0 0 1 .202 7.495l-.199.005v.005a.75.75 0 0 1-.108-1.493l.102-.007l.003-.005a2.25 2.25 0 0 0 .154-4.495l-.154-.005a.75.75 0 0 1-.102-1.493zm-3.5 0a.75.75 0 0 1 .102 1.493l-.102.007a2.25 2.25 0 0 0-.154 4.495l.154.005a.75.75 0 0 1 .102 1.493l-.102.007a3.75 3.75 0 0 1-.2-7.495zm3.5 3a.75.75 0 0 1 .102 1.493l-.102.007h-3.5a.75.75 0 0 1-.102-1.493L15.75 18z"/></svg>',
            title: func.get_translate("Link"),
            route: "/link",
            href: "./link",
        },
    ];
    let tab_width = $state(205);
    let glass_div_display = $state("hide");
    let qr_img_display = $state("hide");
    let qr_img_src = $state("");
    let qr_enbig_num = $state(0);
    let qr_enbig_width = $state(20);
    let qr_enbig_height = $state(20);
    let tab_bottom = $state(10);


    // 监听左右滑动
    let touchDo = $state(0);
    let touchStartX = $state(0);
    let touchStartY = $state(0);
    let touchXMin = $state(50); // px
    let touchXMax = $state(260);


    // 本页面函数：Svelte的HTML组件onXXX=中正确调用：={()=>def.xxx()}
    const def = {
        open_url: function (href=""){
            func.open_url(href);
        },
        calc_tab: function (){ // 计算tab的实际宽度
            let len = tab_data.length;
            let wrapper_padding = 5;
            let item_margin = 2;
            tab_width = (80 + item_margin*2) * len + wrapper_padding*2 + 2;
        },
        show_glass_div: function (){ // 是否隐藏tab区域
            if (route === "/purehome" || route === "/link"){
                glass_div_display = "show";
            }else{
                glass_div_display = "hide";
            }
            //
            // if (route === "/link"){ // 正常Tab路由
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
            if (route === "/purehome" || route === "/link" || route === "/info"){
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
        watch_touch_swiper: function (id_name) { // 监听左右滑动（PC端Safari不支持，Chrome和Firefox全端支持）
            if (!browser) {return;}
            //
            const element = document.getElementById(id_name);
            if (!element) {console.warn("id_name=", id_name);return;}

            //
            clearTimeout(touchDo);

            // 关键：设置CSS属性，告诉浏览器如何处理触摸事件
            element.style.touchAction = 'pan-y'; // 允许垂直滚动，但水平滚动由JS处理

            // 或者更严格的：element.style.touchAction = 'none'; // 完全禁止滚动

            element.addEventListener('touchstart', function(e) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }, { passive: true });

            // 完全移除touchmove监听器，让CSS处理滚动
            // 这样就不会有阻止滚动的尝试了

            element.addEventListener('touchend', function(e) {
                if (!touchStartX) {return;}

                const deltaX = e.changedTouches[0].clientX - touchStartX;
                const deltaY = e.changedTouches[0].clientY - touchStartY;
                const distance = Math.abs(deltaX);

                if (Math.abs(deltaY) < Math.abs(deltaX) / 2 &&
                    distance >= touchXMin && distance <= touchXMax) {
                    // 使用setTimeout或requestAnimationFrame避免阻塞
                    touchDo = setTimeout(() => {
                        if (deltaX > 0) { // right
                            // console.log("right", route);
                            //
                            if (route === "/purehome") {
                                func.open_url("./link");
                            }
                        } else { // left
                            // console.log("left", route);
                            //
                            if (route === "/link") {
                                func.open_url("./purehome");
                            }
                        }
                    }, 0);
                }

                // init
                touchStartX = 0;
                touchStartY = 0;
            }, { passive: true });
        },
        //
    };


    // 刷新页面数据
    afterNavigate(() => {
        if (!runtime_ok() || !browser_ok()){return;} // 系统基础条件检测
        // 开始
        route = func.get_route();
        def.calc_tab();
        def.show_glass_div();
        def.show_qr_div();
        if (func.is_pc_pwa() || func.is_mobile_pwa()){
            tab_bottom = 22;
        }else{
            tab_bottom = 10;
        }
    });


    // 页面装载完成后，只运行一次。
    // addEventListener专用函数
    onMount(() => {
        // 监听左右滑动
        def.watch_touch_swiper("tab-touch_swiper");
    });


</script>

<div class="part-div liquidGlass-div select-none {glass_div_display} " id="tab-touch_swiper">
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
    <div class="liquidGlass-box pywebview-drag-region can-drag  " id="swiper_tab" style="width: {tab_width}px; bottom: {tab_bottom}px;" >
        <div class="liquidGlass-wrapper">
            <div class="liquidGlass-effect"></div>
            <div class="liquidGlass-tint"></div>
            <div class="liquidGlass-shine"></div>
            <div class="liquidGlass-text">
                <!---->
                {#each tab_data as item}
                    <button class="tab-item select-none click {(route === item.route)?'tab-item-active':''}" onclick={()=>def.open_url(item.href)} >
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
        bottom: 10px;
        left: 0;
        right: 0;
        margin: 0 auto;
        width: calc(270px);
        z-index: 1;
        border-radius: 27px;
    }
    .liquidGlass-wrapper {
        position: relative;
        display: flex;
        overflow: hidden;
        box-shadow: 0 0 2px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(160,160,160, 0);
        transition: all 0.1s cubic-bezier(0.175, 0.885, 0.32, 2.2);
        border-radius: 27px;
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
        border-radius: 27px;
    }
    .liquidGlass-tint {
        z-index: 1;
        position: absolute;
        inset: 0;
        background: rgba(160,160,160, 0.1);
        border-radius: 27px;
    }
    .liquidGlass-shine {
        position: absolute;
        inset: 0;
        z-index: 2;
        overflow: hidden;
        /*box-shadow: inset 2px 2px 1px 0 rgba(255, 255, 255, 0.2), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.2);*/
        border: 2px solid rgba(250,250,250, 0.2);
        border-radius: 27px;
    }
    .liquidGlass-text {
        z-index: 3;
        border-radius: 27px;
    }

    /**/
    .tab-item{
        width: 80px;
        margin: 5px 2px;
        overflow: hidden;
        text-align: center;
        border: none;
        outline: none;
        float: left;
        border-radius: 22px;
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
        right: 15px;
        bottom: 90px;
        border-radius: 5px;
        padding: 1px 1px;
        background-color: rgba(160,160,160, 0.6);
        overflow: hidden;
        width: 20px;
        height: 20px;
        opacity: 0.9;
    }
    .tab-qr-img{
        width: 100%;
        height: 100%;
        border-radius: 5px;
        border: none;
        outline: none;
    }

</style>