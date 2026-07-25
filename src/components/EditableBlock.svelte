<script lang="ts">
    import { ajaxSave } from "$lib/ajax-save";

    export let isEditor = false;
    /** Mit sectionKey erscheint ein Auge, das den Bereich für Besucher aus- und einblendet. */
    export let sectionKey: string | null = null;
    export let hidden = false;
    export let redirectTo = "/";
</script>

{#if isEditor}
    <div class="editable-block" class:editable-block--hidden={hidden}>
        {#if sectionKey}
            <form class="editable-block__visibility" method="post" action="/admin/content" use:ajaxSave>
                <input type="hidden" name="action" value="toggleHidden" />
                <input type="hidden" name="sectionKey" value={sectionKey} />
                <input type="hidden" name="redirectTo" value={redirectTo} />
                {#if hidden}
                    <span class="editable-block__hidden-note">Für Besucher ausgeblendet</span>
                {/if}
                <button
                    class="inline-icon-btn"
                    type="submit"
                    aria-pressed={hidden}
                    aria-label={hidden ? "Bereich wieder anzeigen" : "Bereich für Besucher ausblenden"}
                    title={hidden ? "Bereich wieder anzeigen" : "Bereich für Besucher ausblenden"}
                >
                    {#if hidden}
                        <svg aria-hidden="true" viewBox="0 0 24 24">
                            <path
                                d="M2.71 3.16 1.29 4.57l3.1 3.1A12.6 12.6 0 0 0 1 12s3.5 6.5 11 6.5a11.2 11.2 0 0 0 4.31-.85l3.12 3.12 1.41-1.41L2.71 3.16ZM12 16.5A4.5 4.5 0 0 1 7.5 12c0-.6.12-1.17.33-1.69l1.6 1.6a2.5 2.5 0 0 0 2.66 2.66l1.6 1.6c-.52.21-1.09.33-1.69.33Zm10.99-4.5s-3.5 6.5-11 6.5c-.29 0-.57 0-.85-.03l2.13-2.13c2.06-.3 3.7-1.94 4-4l2.66-2.66c1.85 1.48 2.9 3.13 3.06 3.32ZM12 5.5c.6 0 1.17.09 1.71.24L15.6 3.85A11.3 11.3 0 0 0 12 3.5C4.5 3.5 1 10 1 10l.02.03 2.17 2.17A12.5 12.5 0 0 1 12 5.5Z"
                            />
                        </svg>
                    {:else}
                        <svg aria-hidden="true" viewBox="0 0 24 24">
                            <path
                                d="M12 4.5C4.5 4.5 1 12 1 12s3.5 7.5 11 7.5S23 12 23 12s-3.5-7.5-11-7.5Zm0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                            />
                        </svg>
                    {/if}
                </button>
            </form>
        {/if}
        <div class="editable-block__content"><slot name="editor" /></div>
    </div>
{:else if !hidden}
    <slot />
{/if}

<style>
    .editable-block {
        position: relative;
    }

    .editable-block__visibility {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 20;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
    }

    .editable-block__hidden-note {
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: var(--color-copper-600);
        background: var(--color-sand-100);
        border: 1px solid var(--color-sand-200);
        border-radius: 9999px;
        padding: 0.15rem 0.6rem;
        white-space: nowrap;
    }

    /* Ausgeblendete Bereiche bleiben editierbar, wirken aber gedimmt. */
    .editable-block--hidden .editable-block__content {
        opacity: 0.5;
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
