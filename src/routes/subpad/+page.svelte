<script lang="ts">
    import { resolve } from '$app/paths';
    import func from "../../common/func.svelte.js";
    import SubPad from "../../pages/subpad/subpad.svelte";

</script>

<svelte:head>
    <meta name="referrer" content="no-referrer">
    <title>SubPad</title>
    <meta name="keywords" content="SubPad, 订阅集合" />
    <meta name="description" content="SubPad，常用站点订阅集合。" />
    <link rel="icon" type="image/png" href="./subpad2.png" />
    <link rel="apple-touch-icon" href="./subpad2.png" />
    <link rel="manifest" href="./manifest-subpad.json" />
</svelte:head>

<section class="section-main scroll-y-style">
    <SubPad />
</section>