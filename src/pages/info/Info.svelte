<script lang="ts">
    import { resolve } from '$app/paths';
    import func from "../../common/func.svelte.js";
    import config from "../../config";
    import {afterNavigate} from "$app/navigation";
    import {onMount} from "svelte";
    import {browser_ok, runtime_ok} from "../../common/middleware.svelte";


    // 本页面参数
    let route = $state(func.get_route());
    const loading_img = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="16" stroke-dashoffset="16" d="M12 3c4.97 0 9 4.03 9 9"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="16;0"/><animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path><path stroke-dasharray="64" stroke-dashoffset="64" stroke-opacity="0.3" d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="1.2s" values="64;0"/></path></g></svg>';
    let ping_google = $state("...");
    let ping_bing = $state("...");
    let ping_youtube = $state("...");
    let ping_ithome = $state("...");
    let ping_github = $state("...");
    let ping_host = $state("...");
    let ping_hosts = $state("...");
    let test_db_data = $state("...");

    // 本页面函数：Svelte的HTML组件onXXX=中正确调用：={()=>def.xxx()}
    const def = {
        ping_url: function(url: string) {
            return new Promise((resolve) => {
                func.ping(url).then(back => {
                    console.log(url, back);
                    if (back.state === 1){
                        resolve(" ✅ ");
                    }else{
                        resolve(" ❌ ");
                    }
                });
            });
        },
        ping_show: function(){
            let that = this;
            console.log("ping_show=", that);
            //
            ping_google = loading_img;
            ping_bing = loading_img;
            ping_youtube = loading_img;
            ping_ithome = loading_img;
            ping_github = loading_img;
            ping_host = loading_img;
            ping_hosts = loading_img;
            //
            that.ping_url("https://www.google.com").then(msg => {
                ping_google = msg;
            });
            that.ping_url("https://www.bing.com").then(msg => {
                ping_bing = msg;
            });
            that.ping_url("https://www.youtube.com").then(msg => {
                ping_youtube = msg;
            });
            that.ping_url("https://www.ithome.com").then(msg => {
                ping_ithome = msg;
            });
            that.ping_url("https://www.github.com").then(msg => {
                ping_github = msg;
            });
            that.ping_url("http://"+func.get_host()).then(msg => {
                ping_host = msg;
            });
            that.ping_url("https://"+func.get_host()).then(msg => {
                ping_hosts = msg;
            });
        },
        test_db: function(){
            let that = this;
            //
            test_db_data = "Loading...";
            let mark = func.get_time_date("Y-m-d H:i");
            func.set_db_data("test_" + mark, "This db data. " + mark).then(value=>{
                console.log(value);
                test_db_data = value;
            });
        },
    };


    // 页面函数执行的入口，实时更新数据
    function page_start(){
        func.console_log("page_start()=", route);
        // 开始
    }


    // 检测$state()值变化
    $effect(() => {
        //
    });


    // 刷新页面数据
    afterNavigate(() => {
        if (!runtime_ok() || !browser_ok()){return;} // 系统基础条件检测
        //
        page_start();
    });


    // 页面装载完成后，只运行一次
    onMount(() => {
        //
    });


</script>

<div class="info-box">

    <div class="info-div">
        <div class="info-div-title">
            <span class="font-title">【 Ping 网络 】</span>
            <button type="button" class="btn btn-sm preset-filled-primary-500" onclick={()=>def.ping_show()} title="Click">Start</button>
        </div>
        <div class="info-div-content">
            <div class="info-div-content-li break">
                <span class="info-div-content-li-title select-text">https://www.google.com</span>
                <span class="info-div-content-li-res">{@html ping_google}</span>
                <div class="clear"></div>
            </div>
            <div class="info-div-content-li break">
                <span class="info-div-content-li-title select-text">https://www.bing.com</span>
                <span class="info-div-content-li-res">{@html ping_bing}</span>
                <div class="clear"></div>
            </div>
            <div class="info-div-content-li break">
                <span class="info-div-content-li-title select-text">https://www.youtube.com</span>
                <span class="info-div-content-li-res">{@html ping_youtube}</span>
                <div class="clear"></div>
            </div>
            <div class="info-div-content-li break">
                <span class="info-div-content-li-title select-text">https://www.ithome.com</span>
                <span class="info-div-content-li-res">{@html ping_ithome}</span>
                <div class="clear"></div>
            </div>
            <div class="info-div-content-li break">
                <span class="info-div-content-li-title select-text">https://github.com</span>
                <span class="info-div-content-li-res">{@html ping_github}</span>
                <div class="clear"></div>
            </div>
            <div class="info-div-content-li break">
                <span class="info-div-content-li-title select-text">http://{func.get_host()}</span>
                <span class="info-div-content-li-res">{@html ping_host}</span>
                <div class="clear"></div>
            </div>
            <div class="info-div-content-li break">
                <span class="info-div-content-li-title select-text">https://{func.get_host()}</span>
                <span class="info-div-content-li-res">{@html ping_hosts}</span>
                <div class="clear"></div>
            </div>
        </div>
    </div>

    <div class="info-div">
        <div class="info-div-title">
            <span class="font-title">【 浏览器信息 】</span>
        </div>
        <div class="info-div-content">
            <div class="info-div-content-li break select-text">
                <span class="info-div-content-li-title ">浏览器时区 ：</span>
                <span class="info-div-content-li-res">{@html Intl.DateTimeFormat().resolvedOptions().timeZone || "-不支持-"}</span>
                <div class="clear"></div>
            </div>
            <div class="info-div-content-li break select-text">
                <span class="info-div-content-li-title ">浏览器语言 ：</span>
                <span class="info-div-content-li-res">{@html window.navigator.languages}</span>
                <div class="clear"></div>
            </div>
            <div class="info-div-content-li break select-text">
                <span class="info-div-content-li-title ">设备CPU数(核) ：</span>
                <span class="info-div-content-li-res">{@html window.navigator.hardwareConcurrency || "-不支持-"}</span>
                <div class="clear"></div>
            </div>
            <div class="info-div-content-li break select-text">
                <span class="info-div-content-li-title ">设备内存(GB) ：</span>
                <span class="info-div-content-li-res">{@html window.navigator.deviceMemory || "-不支持-"}</span>
                <div class="clear"></div>
            </div>
            <div class="info-div-content-li break select-text">
                <span class="info-div-content-li-title ">UserAgent ：</span>
                <span class="info-div-content-li-res">{@html window.navigator.userAgent}</span>
                <div class="clear"></div>
            </div>
            <div class="info-div-content-li break select-text">
                <span class="info-div-content-li-title ">Screen尺度参数 ：</span>
                <span class="info-div-content-li-res">{@html "screen.width=" + window.screen.width + "<br/>screen.height=" + window.screen.height+ "<br/>screen.availWidth=" + window.screen.availWidth+ "<br/>screen.availHeight=" + window.screen.availHeight}</span>
                <div class="clear"></div>
            </div>
            <div class="info-div-content-li break select-text">
                <span class="info-div-content-li-title ">Pages尺度参数 ：</span>
                <span class="info-div-content-li-res">{@html "innerWidth=" + window.innerWidth + "<br/>innerHeight=" + window.innerHeight}</span>
                <div class="clear"></div>
            </div>

            <div class="info-div-content-li break select-text">
                <span class="info-div-content-li-title ">是否处于PWA(Mobile、PC) ：</span>
                <span class="info-div-content-li-res">{@html [func.is_mobile_pwa(), func.is_pc_pwa()]}</span>
                <div class="clear"></div>
            </div>
            <div class="info-div-content-li break select-text">
                <span class="info-div-content-li-title ">IsMobileScreen ：</span>
                <span class="info-div-content-li-res">{@html func.is_mobile_screen()}</span>
                <div class="clear"></div>
            </div>
            <div class="info-div-content-li break select-text">
                <span class="info-div-content-li-title ">浏览器主题 ：</span>
                <span class="info-div-content-li-res">{@html func.get_theme_model()}</span>
                <div class="clear"></div>
            </div>
            <div class="info-div-content-li break select-text">
                <span class="info-div-content-li-title ">当前地址的Refer ：</span>
                <span class="info-div-content-li-res">{@html document.referrer.slice(0, 120)+ " ..."}</span>
                <div class="clear"></div>
            </div>
            <div class="info-div-content-li break select-text">
                <span class="info-div-content-li-title ">当前地址的Host ：</span>
                <span class="info-div-content-li-res">{@html window.location.host}</span>
                <div class="clear"></div>
            </div>
            <div class="info-div-content-li break select-text">
                <span class="info-div-content-li-title ">appVersion ：</span>
                <span class="info-div-content-li-res">{@html "v"+config.app.app_version}</span>
                <div class="clear"></div>
            </div>
            <div class="info-div-content-li break select-text">
                <span class="info-div-content-li-title ">appUID ：</span>
                <span class="info-div-content-li-res">{@html "-"}</span>
                <div class="clear"></div>
            </div>
            <div class="info-div-content-li break select-text">
                <span class="info-div-content-li-title ">Date ：</span>
                <span class="info-div-content-li-res">{@html func.get_time_date("Y/m/d")}</span>
                <div class="clear"></div>
            </div>
        </div>
    </div>

    <div class="info-div">
        <div class="info-div-title">
            <span class="font-title"> </span>
        </div>
        <div class="info-div-content">
            <div class="info-div-content-li break select-text">
                <span class="info-div-content-li-title "> </span>
                <span class="info-div-content-li-res"> </span>
                <div class="clear"></div>
            </div>
        </div>
    </div>

</div>

<style>
    .info-box{
        width: 100%;
        max-width: 640px;
        margin-right: auto;
        margin-left: auto;
        margin-bottom: 100px;
    }
    .info-div{
        padding: 10px 10px;
    }

    .info-div-title{
        padding: 10px 0;
    }
    .info-div-content{
        padding: 0 0;
    }

    .info-div-content-li{
        clear: both;
        padding-bottom: 10px;
        line-height: 24px;
    }

    .info-div-content-li-title{
        float: left;
        margin-right: 10px;
        opacity: 0.8;
    }
    .info-div-content-li-res{
        opacity: 0.6;
        float: left;
    }

</style>