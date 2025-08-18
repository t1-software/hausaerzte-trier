<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher<{ hideModal: null }>();

    export let isVisible = false;

    export function hideModal() {
        dispatch("hideModal");
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Escape" && event.code === "Escape") {
            hideModal();
        }
    }
</script>

{#if isVisible}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
        class="fixed left-0 top-0 right-0 bottom-0 z-10 bg-gray-700 opacity-50"
        on:mousedown|self={hideModal}
        on:keydown={handleKeydown}
    ></div>

    <div class="fixed left-0 top-0 right-0 bottom-0 z-20 flex justify-center items-center">
        <div class="bg-white rounded-lg shadow-lg p-4 w-full max-w-7xl max-h-full overflow-y-auto">
            <slot />
        </div>
    </div>
{/if}
