<script lang="ts">
    import { resolve } from '$app/paths';
    import func from "../../common/func.svelte.js";
    import PureHome from "../../pages/purehome/PureHome.svelte";

</script>

<svelte:head>
    <title>PureHome</title>
    <meta name="keywords" content="PureHome, PureStartPage, HomePage" />
    <meta name="description" content="PureHome，纯净主页，替代浏览器主页。不收集任何隐私！" />
</svelte:head>

<section class="section-main scroll-y-style ">
    <PureHome />
</section>