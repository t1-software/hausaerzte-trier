<script lang="ts">
    import { onMount } from "svelte";
    import { flip } from "svelte/animate";
    import InlineEditorActions from "./InlineEditorActions.svelte";
    import RichText from "./RichText.svelte";
    import RowDragHandle from "./RowDragHandle.svelte";
    import { ajaxSave } from "$lib/ajax-save";
    import { cellsOf, isDirty, moveRow, nextRowId, toRows, type EditableRow } from "$lib/editable-rows";
    import { createRowDnd } from "$lib/row-dnd";

    /** Pflegt die Vorschlagsliste, die in den Neuigkeiten als Autovervollständigung dient. */
    export let entries: string[][] = [];
    export let redirectTo = "/";

    let open = false;
    let rows: EditableRow[] = toRows(entries, 1);
    let baseline = cellsOf(rows);
    let initialised = false;
    let resetKey = 0;

    $: dirty = initialised && isDirty(rows, baseline);

    const dnd = createRowDnd((from, to) => (rows = moveRow(rows, from, to)));
    const { dragIndex } = dnd;

    onMount(() => {
        initialised = true;
    });

    function setCell(rowIndex: number, value: string, fromInit: boolean) {
        rows[rowIndex].cells[0] = value;
        rows = rows;

        if (fromInit && !initialised) {
            baseline[rowIndex][0] = value;
            baseline = baseline;
        }
    }

    function addEntry() {
        rows = [...rows, { id: nextRowId(), cells: [""] }];
    }

    function removeEntry(index: number) {
        rows = rows.filter((_, rowIndex) => rowIndex !== index);
    }

    function discard() {
        rows = toRows(baseline, 1);
        resetKey += 1;
    }
</script>

<div class="suggestion-list">
    <button class="suggestion-list__toggle" type="button" aria-expanded={open} on:click={() => (open = !open)}>
        {open ? "▾" : "▸"} Vorschlagsliste für Aufzählungen ({rows.length})
    </button>
    {#if open}
        <form
            class="suggestion-list__form"
            method="post"
            action="/admin/content"
            use:ajaxSave
            on:saved={() => (baseline = cellsOf(rows))}
        >
            <input type="hidden" name="action" value="saveRows" />
            <input type="hidden" name="sectionKey" value="Vertretungen" />
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <input type="hidden" name="rowCount" value={rows.length} />
            {#key resetKey}
                <ul class="suggestion-list__rows">
                    {#each rows as row, index (row.id)}
                        <li
                            class="suggestion-list__row"
                            class:row-dragging={$dragIndex === index}
                            animate:flip={{ duration: 180 }}
                            on:dragover={(event) => dnd.handleDragOver(event, index)}
                            on:drop={dnd.handleDrop}
                        >
                            <RowDragHandle {dnd} {index} />
                            <div class="suggestion-list__field">
                                <RichText
                                    inline
                                    allowBold={false}
                                    name={`cell:${index}:0`}
                                    ariaLabel="Vorschlag"
                                    value={row.cells[0]}
                                    on:init={(event) => setCell(index, event.detail, true)}
                                    on:change={(event) => setCell(index, event.detail, false)}
                                />
                            </div>
                            <button
                                class="inline-icon-btn"
                                type="button"
                                aria-label="Vorschlag entfernen"
                                title="Vorschlag entfernen"
                                on:click={() => removeEntry(index)}
                            >
                                <svg aria-hidden="true" viewBox="0 0 24 24">
                                    <path d="M5 11h14v2H5v-2Z" />
                                </svg>
                            </button>
                        </li>
                    {/each}
                </ul>
            {/key}
            <InlineEditorActions
                {dirty}
                addActions={[{ label: "Vorschlag hinzufügen", run: addEntry }]}
                onDiscard={discard}
            />
        </form>
    {/if}
</div>

<style>
    .suggestion-list {
        margin-top: 1.5rem;
        border-top: 1px dashed var(--color-gulfstream-300);
        padding-top: 0.75rem;
    }

    .suggestion-list__toggle {
        color: var(--color-gulfstream-700);
        font-size: 0.8rem;
        font-weight: 700;
    }

    .suggestion-list__form {
        margin-top: 0.75rem;
    }

    .suggestion-list__rows {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .suggestion-list__row {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        font-size: 0.9rem;
    }

    .suggestion-list__field {
        flex: 1;
        min-width: 0;
    }
</style>
