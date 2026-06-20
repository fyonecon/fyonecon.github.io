<script lang="ts">
    import { resolve } from '$app/paths';
    import func from "../../common/func.svelte.js";
    import Search from "../../pages/search/Search.svelte";

</script>

<svelte:head>
    <meta name="robots" content="noindex, nofollow">
    <meta name="referrer" content="no-referrer">
    <title>{func.get_translate("Search")}</title>
    <meta name="keywords" content="" />
    <meta name="description" content="" />
    <link rel="icon" type="image/png" href="./appicon.png" />
    <!--修复Safari下_blank夹空白页的问题-->
    {@html '<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />'}
    {@html '<meta http-equiv="Pragma" content="no-cache" />'}
    {@html '<meta http-equiv="Expires" content="0" />'}
</svelte:head>

<section class="section-main scroll-y-style">
    <Search />
</section>