<script lang="ts" context="module">
    export interface AddAction {
        label: string;
        run: () => void;
        /** Beschriftung neben dem Plus, wenn mehrere Zeilenarten möglich sind. */
        text?: string;
    }
</script>

<script lang="ts">
    export let align: "start" | "center" | "end" = "start";
    export let onDiscard: () => void;
    export let addActions: AddAction[] = [];
    /** Übernehmen und Verwerfen bleiben gesperrt, solange nichts geändert wurde. */
    export let dirty = false;
</script>

<div class="inline-icon-actions" data-align={align}>
    {#each addActions as action (action.label)}
        <button
            class="inline-icon-btn"
            class:inline-icon-btn--wide={action.text}
            type="button"
            aria-label={action.label}
            title={action.label}
            on:click={action.run}
        >
            <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z" />
            </svg>
            {#if action.text}<span class="inline-icon-btn__text">{action.text}</span>{/if}
        </button>
    {/each}
    <button
        class="inline-icon-btn inline-icon-btn--apply"
        type="submit"
        disabled={!dirty}
        aria-label="Übernehmen"
        title={dirty ? "Übernehmen" : "Keine Änderungen"}
    >
        <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M9.55 17.6 4 12.05l1.42-1.41 4.13 4.13 9.02-9.02L20 7.17 9.55 17.6Z" />
        </svg>
    </button>
    <button
        class="inline-icon-btn"
        type="button"
        disabled={!dirty}
        aria-label="Verwerfen"
        title={dirty ? "Verwerfen" : "Keine Änderungen"}
        on:click={onDiscard}
    >
        <svg aria-hidden="true" viewBox="0 0 24 24">
            <path
                d="M18.3 7.11 16.89 5.7 12 10.59 7.11 5.7 5.7 7.11 10.59 12 5.7 16.89l1.41 1.41L12 13.41l4.89 4.89 1.41-1.41L13.41 12l4.89-4.89Z"
            />
        </svg>
    </button>
</div>

<style>
    .inline-icon-actions {
        display: flex;
        gap: 0.4rem;
        margin-top: 0.5rem;
    }

    .inline-icon-actions[data-align="center"] {
        justify-content: center;
    }

    .inline-icon-actions[data-align="end"] {
        justify-content: flex-end;
    }
</style>
