<script lang="ts">
    /*根路由*/
    import { resolve } from '$app/paths';
    import func from "../common/func.svelte.js";
    import Index from "../pages/index/Index.svelte";
</script>

<svelte:head>
    <title>Datathink.top</title>
    <meta name="keywords" content="Datathink" />
    <meta name="description" content="datathink.top" />
</svelte:head>

<section class="section-main scroll-y-style">
    <Index />
</section>