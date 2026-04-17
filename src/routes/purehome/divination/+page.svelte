<script lang="ts">
    import { resolve } from '$app/paths';
    import func from "../../../common/func.svelte.js";
    import Divination from "../../../pages/purehome/divination/Divination.svelte";

</script>

<svelte:head>
    <title>Divination</title>
    <meta name="keywords" content="" />
    <meta name="description" content="Divination，祀测未来。用现有四维度四数据预测确定的未来。（祀、戎、耕、商）。" />
    <link rel="icon" type="image/png" href="../ph1.png" />
    <link rel="apple-touch-icon" href="../ph1.png" />
    <link rel="manifest" href="../manifest-purehome.json" />
</svelte:head>

<section class="section-main scroll-y-style">
    <Divination />
</section>