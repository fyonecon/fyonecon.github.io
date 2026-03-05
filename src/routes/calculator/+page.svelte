<script lang="ts">
    import { resolve } from '$app/paths';
    import func from "../../common/func.svelte.js";
    import Calculator from "../../pages/calculator/Calculator.svelte";

</script>

<svelte:head>
    <title>{func.get_translate("Calculator")}</title>
    <meta name="keywords" content="" />
    <meta name="description" content="" />
</svelte:head>

<section class="section-main scroll-y-style">
<!--<section class="section-main scroll-y-style bg-white dark:bg-surface-950">-->
<!--<section class="section-main scroll-y-style bg-neutral-100 dark:bg-neutral-900">-->
<!--<section class="section-main scroll-y-style bg-white dark:bg-black">-->
    <Calculator />
</section>