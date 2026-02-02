<script lang="ts">
    /*根路由*/
    import func from "../common/func.svelte.js";
    import config from "../config";
    import {browser} from "$app/environment";
    import { onMount } from 'svelte';
    import { afterNavigate, } from "$app/navigation";


    // 本页面参数
    let href = $state(func.get_href());
    let host = $state(config.sys.base_route+"/");
    if (browser){
        host = "//"+window.location.host+config.sys.base_route+"/";
    }


    // 本页面函数：Svelte的HTML组件onXXX=中正确调用：={()=>def.xxx()}
    const def = {
        go_home: function(){
            // 重新定向 /到 /home 页面
            func.redirect_pathname({
                url_pathname: func.url_path(config.sys.base_route+config.sys.home_route),
                url_params: func.get_params(),
            });
        }
    };


    // 刷新页面数据
    afterNavigate(() => {
        //
        href = func.get_href();
        host = config.sys.base_route+"/";
        if (browser){
            host = "//"+window.location.host+config.sys.base_route+"/";
        }
        // 兼容老View框架的路由
        if (href.indexOf("route=home") != -1){
            let array = href.split("route=home");
            let url = "";
            if (array.length >= 2){
                url = host + "home?" + array[1];
            }else{
                url = host + "home";
            }
            func.open_url(url);
        }
        else if (href.indexOf("route=search") != -1){
            let array = href.split("route=search");
            let url = "";
            if (array.length >= 2){
                url = host + "search?" + array[1];
            }else{
                url = host + "search";
            }
            func.open_url(url);
        }
        else if (href.indexOf("route=info") != -1){
            let array = href.split("route=info");
            let url = "";
            if (array.length >= 2){
                url = host + "info?" + array[1];
            }else{
                url = host + "info"
            }
            func.open_url(url);
        }
        //
        else{
            def.go_home();
        }
    });


    // 页面装载完成后，只运行一次
    onMount(() => {
        //
    });


</script>

<svelte:head>
    <title>Datathink.top</title>
    <meta name="keywords" content="Datathink" />
    <meta name="description" content="datathink.top" />
</svelte:head>