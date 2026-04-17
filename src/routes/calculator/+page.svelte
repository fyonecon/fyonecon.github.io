<script lang="ts">
    import { resolve } from '$app/paths';
    import func from "../../common/func.svelte.js";
    import Calculator from "../../pages/calculator/Calculator.svelte";

</script>

<svelte:head>
    <title>Calculator</title>
    <meta name="keywords" content="Calculator,科学计算器" />
    <meta name="description" content="Calculator科学计算器，支持手机与电脑端，可以使用键盘输入表达式。" />
    <link rel="apple-touch-icon" href="./calc1.png" />
    <link rel="manifest" href="./manifest-calculator.json" />
</svelte:head>

<section class="section-main scroll-y-style">
    <Calculator />
</section>