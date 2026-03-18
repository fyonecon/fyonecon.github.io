<script lang="ts">
    import { resolve } from '$app/paths';
    import func from "../../common/func.svelte.js";
    import Divination from "../../pages/divination/Divination.svelte";

</script>

<svelte:head>
    <title>Divination</title>
    <meta name="keywords" content="" />
    <meta name="description" content="Divination，祀测未来。用现有四维度四数据预测确定的未来。（祀、戎、耕、商）。" />
<!--    <link rel="apple-touch-icon" href="./launcher.png" />-->
<!--    <link rel="manifest" href="./manifest-purehome.json" />-->
</svelte:head>

<section class="section-main scroll-y-style">
<!--<section class="section-main scroll-y-style bg-white dark:bg-surface-950">-->
<!--<section class="section-main scroll-y-style bg-neutral-100 dark:bg-neutral-900">-->
<!--<section class="section-main scroll-y-style bg-white dark:bg-black">-->
    <Divination />
</section>