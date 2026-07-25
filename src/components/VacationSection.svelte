<script lang="ts">
    import { onMount } from "svelte";
    import { flip } from "svelte/animate";
    import EditableBlock from "./EditableBlock.svelte";
    import InlineEditorActions from "./InlineEditorActions.svelte";
    import RichText from "./RichText.svelte";
    import RowDragHandle from "./RowDragHandle.svelte";
    import { hasContent } from "../utils/content";
    import { cellsOf, isDirty, moveRow, nextRowId, toRows, type EditableRow } from "$lib/editable-rows";
    import { createRowDnd } from "$lib/row-dnd";

    export let vacations: string[][] = [];
    export let isEditor = false;
    export let redirectTo = "/";

    let rows: EditableRow[] = toRows(vacations, 2);
    let baseline = cellsOf(rows);
    let initialised = false;
    let resetKey = 0;

    $: dirty = initialised && isDirty(rows, baseline);

    const dnd = createRowDnd((from, to) => (rows = moveRow(rows, from, to)));
    const { dragIndex } = dnd;

    onMount(() => {
        initialised = true;
    });

    function setCell(rowIndex: number, column: number, value: string, fromInit: boolean) {
        rows[rowIndex].cells[column] = value;
        rows = rows;

        if (fromInit && !initialised) {
            baseline[rowIndex][column] = value;
            baseline = baseline;
        }
    }

    function addVacation() {
        rows = [...rows, { id: nextRowId(), cells: ["", ""] }];
    }

    function removeVacation(index: number) {
        rows = rows.filter((_, rowIndex) => rowIndex !== index);
    }

    function discard() {
        rows = toRows(baseline, 2);
        resetKey += 1;
    }
</script>

{#if isEditor || hasContent(vacations)}
    <EditableBlock {isEditor}>
        <div class="vacation-section card">
            <h2 class="vacation-title">Urlaub</h2>
            {#if hasContent(vacations)}
                <ul class="vacation-list">
                    {#each vacations as vacation, index (vacation.join("|") + "|" + index)}
                        <li class="vacation-row">{vacation[0]} bis {vacation[1]}</li>
                    {/each}
                </ul>
                <p class="vacation-note">In dieser Zeit bleibt die Praxis geschlossen.</p>
            {/if}
        </div>
        <form slot="editor" class="vacation-section card" method="post" action="/admin/content">
            <h2 class="vacation-title">Urlaub</h2>
            <input type="hidden" name="action" value="saveRows" />
            <input type="hidden" name="sectionKey" value="Urlaub" />
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <input type="hidden" name="rowCount" value={rows.length} />
            {#key resetKey}
                <ul class="vacation-list">
                    {#each rows as row, index (row.id)}
                        <li
                            class="vacation-row"
                            class:row-dragging={$dragIndex === index}
                            animate:flip={{ duration: 180 }}
                            on:dragover={(event) => dnd.handleDragOver(event, index)}
                            on:drop={dnd.handleDrop}
                        >
                            <span class="vacation-range">
                                <RowDragHandle {dnd} {index} />
                                <RichText
                                    inline
                                    allowBold={false}
                                    name={`cell:${index}:0`}
                                    ariaLabel="Von"
                                    value={row.cells[0]}
                                    on:init={(event) => setCell(index, 0, event.detail, true)}
                                    on:change={(event) => setCell(index, 0, event.detail, false)}
                                />
                                <span>bis</span>
                                <RichText
                                    inline
                                    allowBold={false}
                                    name={`cell:${index}:1`}
                                    ariaLabel="Bis"
                                    value={row.cells[1]}
                                    on:init={(event) => setCell(index, 1, event.detail, true)}
                                    on:change={(event) => setCell(index, 1, event.detail, false)}
                                />
                                <button
                                    class="inline-icon-btn vacation-remove"
                                    type="button"
                                    aria-label="Zeile entfernen"
                                    title="Zeile entfernen"
                                    on:click={() => removeVacation(index)}
                                >
                                    <svg aria-hidden="true" viewBox="0 0 24 24">
                                        <path d="M5 11h14v2H5v-2Z" />
                                    </svg>
                                </button>
                            </span>
                        </li>
                    {/each}
                </ul>
            {/key}
            <InlineEditorActions
                {dirty}
                addActions={[{ label: "Zeile hinzufügen", run: addVacation }]}
                onDiscard={discard}
            />
        </form>
    </EditableBlock>
{/if}

<style>
    .vacation-section {
        padding: 1.5rem;
        border-left: 4px solid var(--color-copper-500);
    }

    .vacation-title {
        margin-bottom: 0.75rem;
    }

    .vacation-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .vacation-row {
        padding: 0.4rem 0;
        font-weight: 700;
        font-variant-numeric: tabular-nums;
        border-bottom: 1px solid var(--color-sand-200);
    }

    .vacation-row:last-child {
        border-bottom: none;
    }

    .vacation-note {
        margin-top: 0.75rem;
        font-size: 0.9rem;
        color: var(--color-sand-900);
    }

    .vacation-range {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        flex-wrap: wrap;
    }

    .vacation-remove {
        margin-left: 0.25rem;
    }
</style>
