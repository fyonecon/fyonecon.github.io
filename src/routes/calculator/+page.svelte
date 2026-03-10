<script lang="ts">
    import { resolve } from '$app/paths';
    import func from "../../common/func.svelte.js";
    import Calculator from "../../pages/calculator/Calculator.svelte";

</script>

<svelte:head>
    <title>Calculator</title>
    <meta name="keywords" content="Calculator,科学计算器" />
    <meta name="description" content="Calculator科学计算器" />
</svelte:head>

<section class="section-main scroll-y-style">
    <Calculator />
</section>