<script lang="ts">
    export let isEditor = false;
    export let label = "Inhalt bearbeiten";

    let isEditing = false;

    function openEditor() {
        isEditing = true;
    }

    function closeEditor() {
        isEditing = false;
    }
</script>

{#if isEditor}
    <div class:editable-block--editing={isEditing} class="editable-block">
        {#if isEditing}
            <slot name="editor" close={closeEditor} />
        {:else}
            <button class="editable-block__edit" type="button" aria-label={label} title={label} on:click={openEditor}>
                <svg aria-hidden="true" viewBox="0 0 24 24">
                    <path
                        d="M4 17.25V20h2.75L17.81 8.94l-2.75-2.75L4 17.25Zm15.71-10.04a1 1 0 0 0 0-1.42l-1.5-1.5a1 1 0 0 0-1.42 0l-1.02 1.02 2.92 2.92 1.02-1.02Z"
                    />
                </svg>
            </button>
            <slot />
        {/if}
    </div>
{:else}
    <slot />
{/if}

<style>
    .editable-block {
        position: relative;
    }

    .editable-block:hover {
        outline: 1px dashed rgba(45, 79, 50, 0.35);
        outline-offset: 0.35rem;
    }

    .editable-block--editing:hover {
        outline: none;
    }

    .editable-block__edit {
        position: absolute;
        top: 0.25rem;
        left: 0.25rem;
        z-index: 30;
        display: inline-flex;
        width: 2rem;
        height: 2rem;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--color-gulfstream-300);
        border-radius: 9999px;
        background: rgba(255, 255, 255, 0.96);
        color: var(--color-gulfstream-700);
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.14);
    }

    .editable-block__edit:hover {
        background: var(--color-gulfstream-100);
    }

    .editable-block__edit svg {
        width: 1.1rem;
        height: 1.1rem;
        fill: currentColor;
    }

    :global(.inline-editor-panel) {
        border: 1px solid var(--color-gulfstream-300);
        background: rgba(255, 255, 255, 0.96);
        padding: 1rem;
        box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
    }

    :global(.inline-editor-label) {
        display: flex;
        flex-direction: column;
        gap: 0.45rem;
        font-weight: 700;
    }

    :global(.inline-editor-input),
    :global(.inline-editor-textarea),
    :global(.inline-editor-select) {
        border: 1px solid var(--color-gulfstream-200);
        background: white;
        color: var(--color-gulfstream-950);
        padding: 0.55rem 0.65rem;
        font-weight: 400;
    }

    :global(.inline-editor-textarea) {
        min-height: 9rem;
    }

    :global(.inline-editor-actions) {
        display: flex;
        flex-wrap: wrap;
        gap: 0.65rem;
        margin-top: 0.9rem;
    }

    :global(.inline-editor-apply),
    :global(.inline-editor-discard),
    :global(.inline-editor-secondary),
    :global(.inline-editor-remove) {
        border-radius: 0.25rem;
        border: 1px solid var(--color-gulfstream-300);
        padding: 0.5rem 0.8rem;
        font-weight: 700;
    }

    :global(.inline-editor-apply) {
        background: var(--color-gulfstream-700);
        color: white;
    }

    :global(.inline-editor-discard),
    :global(.inline-editor-secondary),
    :global(.inline-editor-remove) {
        background: white;
        color: var(--color-gulfstream-700);
    }
</style>
