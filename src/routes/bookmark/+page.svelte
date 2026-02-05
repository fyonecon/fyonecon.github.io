<script lang="ts">
    import { resolve } from '$app/paths';
    import func from "../../common/func.svelte.js";
    import Bookmark from "../../pages/bookmark/Bookmark.svelte";

</script>

<svelte:head>
    <title>{func.get_translate("Bookmark")}</title>
    <meta name="keywords" content="" />
    <meta name="description" content="" />
</svelte:head>

<section class="section-main scroll-y-style">
    <Bookmark />
</section>