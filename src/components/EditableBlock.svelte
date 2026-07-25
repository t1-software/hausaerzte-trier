<script lang="ts">
    export let isEditor = false;
</script>

{#if isEditor}
    <div class="editable-block"><slot name="editor" /></div>
{:else}
    <slot />
{/if}

<style>
    .editable-block {
        position: relative;
    }

    :global(.inline-icon-btn) {
        display: inline-flex;
        width: 2rem;
        height: 2rem;
        flex: none;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--color-gulfstream-300);
        border-radius: 9999px;
        background: rgba(255, 255, 255, 0.96);
        color: var(--color-gulfstream-700);
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.14);
    }

    :global(.inline-icon-btn:hover) {
        background: var(--color-gulfstream-100);
    }

    :global(.inline-icon-btn:disabled) {
        opacity: 0.4;
        box-shadow: none;
    }

    :global(.inline-icon-btn:disabled:hover) {
        background: rgba(255, 255, 255, 0.96);
    }

    :global(.inline-icon-btn--apply) {
        background: var(--color-gulfstream-700);
        border-color: var(--color-gulfstream-700);
        color: white;
    }

    :global(.inline-icon-btn--apply:hover) {
        background: var(--color-gulfstream-800);
    }

    :global(.inline-icon-btn--apply:disabled),
    :global(.inline-icon-btn--apply:disabled:hover) {
        background: var(--color-gulfstream-700);
    }

    :global(.inline-icon-btn svg) {
        width: 1.1rem;
        height: 1.1rem;
        fill: currentColor;
    }

    :global(.inline-icon-btn--wide) {
        width: auto;
        gap: 0.25rem;
        padding: 0 0.6rem 0 0.45rem;
        border-radius: 9999px;
    }

    :global(.inline-icon-btn__text) {
        font-size: 0.8rem;
        font-weight: 700;
    }

    /* Während des Hintergrund-Speicherns dreht sich der Übernehmen-Knopf. */
    :global(form.saving .inline-icon-btn--apply) {
        pointer-events: none;
    }

    :global(form.saving .inline-icon-btn--apply svg) {
        animation: saving-spin 0.8s linear infinite;
    }

    @keyframes saving-spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    /* Gezogene Zeile bleibt sichtbar, während die Liste sich schon neu ordnet. */
    :global(.row-dragging) {
        opacity: 0.55;
        outline: 2px dashed var(--color-gulfstream-500);
        outline-offset: -2px;
    }
</style>
