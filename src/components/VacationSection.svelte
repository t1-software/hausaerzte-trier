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
        <div class="vacation-section">
            <h1 class="vacation-title">Urlaub</h1>
            {#if hasContent(vacations)}
                <table class="vacation-table">
                    <tbody>
                        {#each vacations as vacation, index (vacation.join("|") + "|" + index)}
                            <tr class="vacation-row">
                                <td class="vacation-cell">{vacation[0]} bis {vacation[1]}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            {/if}
        </div>
        <form slot="editor" class="vacation-section" method="post" action="/admin/content">
            <h1 class="vacation-title">Urlaub</h1>
            <input type="hidden" name="action" value="saveRows" />
            <input type="hidden" name="sectionKey" value="Urlaub" />
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <input type="hidden" name="rowCount" value={rows.length} />
            {#key resetKey}
                <table class="vacation-table">
                    <tbody>
                        {#each rows as row, index (row.id)}
                            <tr
                                class="vacation-row"
                                class:row-dragging={$dragIndex === index}
                                animate:flip={{ duration: 180 }}
                                on:dragover={(event) => dnd.handleDragOver(event, index)}
                                on:drop={dnd.handleDrop}
                            >
                                <td class="vacation-cell">
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
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
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
        margin-top: 1.5rem;
    }

    .vacation-title {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 1.5rem;
        letter-spacing: -0.025em;
    }

    .vacation-table {
        margin-top: 1.5rem;
        width: 100%;
    }

    .vacation-row:nth-child(odd) {
        background-color: var(--color-gulfstream-100);
    }

    .vacation-row:nth-child(even) {
        background-color: var(--color-gulfstream-200);
    }

    .vacation-row {
        border: 1px solid #d1d5db;
        text-align: center;
        font-weight: 700;
    }

    .vacation-cell {
        padding: 1rem;
    }

    .vacation-range {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.4rem;
    }

    .vacation-remove {
        margin-left: 0.25rem;
    }
</style>
