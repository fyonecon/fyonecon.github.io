<script lang="ts">
    import { Toast, createToaster } from '@skeletonlabs/skeleton-svelte';
    import {notice_data} from "../stores/notice.store.svelte.js";

</script>

<div class="part-div">
    <Toast.Group toaster={notice_data.toaster}>
        {#snippet children(toast)}
            <Toast {toast}>
                <Toast.Message>
                    <Toast.Title>{@html toast.title}</Toast.Title>
                    <Toast.Description>{@html toast.description}</Toast.Description>
                </Toast.Message>
                <Toast.CloseTrigger />
            </Toast>
        {/snippet}
    </Toast.Group>
</div>