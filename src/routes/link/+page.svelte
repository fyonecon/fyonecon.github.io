<script lang="ts">
    import { resolve } from '$app/paths';
    import func from "../../common/func.svelte.js";
    import Link from "../../pages/link/Link.svelte";

</script>

<svelte:head>
    <title>Link</title>
    <meta name="keywords" content="链签, Link" />
    <meta name="description" content="链签 Link" />
    <link rel="manifest" href="./manifest-purehome.json" />
</svelte:head>

<section class="section-main scroll-y-style">
    <Link />
</section>