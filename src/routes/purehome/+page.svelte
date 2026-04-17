<script lang="ts">
    import { resolve } from '$app/paths';
    import func from "../../common/func.svelte.js";
    import PureHome from "../../pages/purehome/PureHome.svelte";

</script>

<svelte:head>
    <title>PureHome</title>
    <meta name="keywords" content="PureHome, PureStartPage, HomePage" />
    <meta name="description" content="PureHome，替代浏览器主页。不收集任何隐私！" />
    <link rel="icon" type="image/png" href="./ph1.png" />
    <link rel="apple-touch-icon" href="./ph1.png" />
    <link rel="manifest" href="./manifest-purehome.json" />
</svelte:head>

<section class="section-main scroll-y-style">
    <PureHome />
</section>