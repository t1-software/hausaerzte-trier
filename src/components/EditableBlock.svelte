<script lang="ts">
    import { page } from "$app/stores";
    import { ajaxSave } from "$lib/ajax-save";
    import { hideAtOf, type SiteContent } from "$lib/content";
    import { formatHideAt, isoToLocalInput } from "$lib/schedule";

    export let isEditor = false;
    /** Mit sectionKey erscheint ein Auge, das den Bereich für Besucher aus- und einblendet. */
    export let sectionKey: string | null = null;
    export let hidden = false;
    export let redirectTo = "/";

    let scheduleOpen = false;
    let scheduleInput = "";

    // Der geplante Zeitpunkt kommt aus den Seitendaten, damit ihn nicht jede
    // Elternkomponente durchreichen muss.
    $: content = ($page.data.content ?? {}) as SiteContent;
    $: hideAt = sectionKey ? hideAtOf(content, sectionKey) : "";
    $: note = hidden
        ? hideAt
            ? `Ausgeblendet seit ${formatHideAt(hideAt)}`
            : "Für Besucher ausgeblendet"
        : hideAt
          ? `Sichtbar bis ${formatHideAt(hideAt)}`
          : "";

    function toggleSchedule() {
        if (!scheduleOpen) {
            scheduleInput = isoToLocalInput(hideAt);
        }

        scheduleOpen = !scheduleOpen;
    }
</script>

{#if isEditor}
    <div class="editable-block" class:editable-block--hidden={hidden}>
        {#if sectionKey}
            <div class="editable-block__visibility">
                {#if note}
                    <span class="editable-block__hidden-note">{note}</span>
                {/if}
                <button
                    class="inline-icon-btn"
                    class:inline-icon-btn--active={hideAt !== ""}
                    type="button"
                    aria-expanded={scheduleOpen}
                    aria-label="Zeitpunkt zum Ausblenden festlegen"
                    title="Zeitpunkt zum Ausblenden festlegen"
                    on:click={toggleSchedule}
                >
                    <svg aria-hidden="true" viewBox="0 0 24 24">
                        <path
                            d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67Z"
                        />
                    </svg>
                </button>
                <form method="post" action="/admin/content" use:ajaxSave>
                    <input type="hidden" name="action" value="toggleHidden" />
                    <input type="hidden" name="sectionKey" value={sectionKey} />
                    <input type="hidden" name="redirectTo" value={redirectTo} />
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

                {#if scheduleOpen}
                    <div class="editable-block__schedule">
                        <form
                            class="editable-block__schedule-form"
                            method="post"
                            action="/admin/content"
                            use:ajaxSave
                            on:saved={() => (scheduleOpen = false)}
                        >
                            <input type="hidden" name="action" value="setHideAt" />
                            <input type="hidden" name="sectionKey" value={sectionKey} />
                            <input type="hidden" name="redirectTo" value={redirectTo} />
                            <label class="editable-block__schedule-label">
                                Ausblenden am
                                <input
                                    class="editable-block__schedule-input"
                                    type="datetime-local"
                                    name="hideAt"
                                    bind:value={scheduleInput}
                                />
                            </label>
                            <div class="editable-block__schedule-actions">
                                <button
                                    class="inline-icon-btn inline-icon-btn--apply"
                                    type="submit"
                                    disabled={scheduleInput === ""}
                                    aria-label="Zeitpunkt übernehmen"
                                    title={scheduleInput === "" ? "Bitte Zeitpunkt wählen" : "Zeitpunkt übernehmen"}
                                >
                                    <svg aria-hidden="true" viewBox="0 0 24 24">
                                        <path d="M9.55 17.6 4 12.05l1.42-1.41 4.13 4.13 9.02-9.02L20 7.17 9.55 17.6Z" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                        {#if hideAt}
                            <form
                                method="post"
                                action="/admin/content"
                                use:ajaxSave
                                on:saved={() => (scheduleOpen = false)}
                            >
                                <input type="hidden" name="action" value="setHideAt" />
                                <input type="hidden" name="sectionKey" value={sectionKey} />
                                <input type="hidden" name="redirectTo" value={redirectTo} />
                                <input type="hidden" name="hideAt" value="" />
                                <button class="editable-block__schedule-clear" type="submit">
                                    Zeitpunkt entfernen
                                </button>
                            </form>
                        {/if}
                    </div>
                {/if}
            </div>
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

    .editable-block__schedule {
        position: absolute;
        top: 2.5rem;
        right: 0;
        z-index: 30;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.75rem;
        border: 1px solid var(--color-sand-200);
        border-radius: 0.75rem;
        background: white;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.16);
    }

    .editable-block__schedule-form {
        display: flex;
        align-items: flex-end;
        gap: 0.5rem;
    }

    .editable-block__schedule-label {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: var(--color-gulfstream-700);
        white-space: nowrap;
    }

    .editable-block__schedule-input {
        font-size: 0.9rem;
        font-weight: 400;
        letter-spacing: normal;
        text-transform: none;
        color: var(--color-pine-900);
        border: 1px solid var(--color-sand-200);
        border-radius: 0.5rem;
        padding: 0.35rem 0.5rem;
        background: white;
    }

    .editable-block__schedule-actions {
        display: flex;
        gap: 0.4rem;
        padding-bottom: 0.1rem;
    }

    .editable-block__schedule-clear {
        align-self: flex-start;
        font-size: 0.8rem;
        color: var(--color-copper-600);
        text-decoration: underline;
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

    /* Uhr-Knopf mit gesetztem Zeitpunkt. */
    :global(.inline-icon-btn--active) {
        border-color: var(--color-copper-600);
        color: var(--color-copper-600);
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
