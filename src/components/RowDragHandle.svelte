<script lang="ts">
    import type { createRowDnd } from "$lib/row-dnd";

    export let dnd: ReturnType<typeof createRowDnd>;
    export let index: number;
</script>

<button
    class="inline-icon-btn row-drag"
    type="button"
    draggable="true"
    aria-label="Zeile verschieben"
    title="Ziehen zum Sortieren (Alt + ↑/↓)"
    on:dragstart={(event) => dnd.handleDragStart(event, index)}
    on:dragend={dnd.handleDragEnd}
    on:keydown={(event) => dnd.handleKeydown(event, index)}
>
    <svg aria-hidden="true" viewBox="0 0 24 24">
        <path
            d="M9 5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm9-14a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
        />
    </svg>
</button>

<style>
    .row-drag {
        cursor: grab;
    }

    .row-drag:active {
        cursor: grabbing;
    }
</style>
