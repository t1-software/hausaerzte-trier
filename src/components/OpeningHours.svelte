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

    export let times: string[][] = [];
    export let isEditor = false;
    export let redirectTo = "/";

    let rows: EditableRow[] = toRows(normalise(times), 4);
    let baseline = cellsOf(rows);
    let initialised = false;
    let resetKey = 0;

    $: dirty = initialised && isDirty(rows, baseline);

    const dnd = createRowDnd((from, to) => (rows = moveRow(rows, from, to)));
    const { dragIndex } = dnd;

    onMount(() => {
        initialised = true;
    });

    function normalise(source: string[][]): string[][] {
        return source.map((row) => [row[0] || "Sprechzeit", row[1] ?? "", row[2] ?? "", row[3] ?? ""]);
    }

    function setCell(rowIndex: number, column: number, value: string, fromInit: boolean) {
        rows[rowIndex].cells[column] = value;
        rows = rows;

        if (fromInit && !initialised) {
            baseline[rowIndex][column] = value;
            baseline = baseline;
        }
    }

    function addRow(kind: "Sprechzeit" | "Hinweis") {
        rows = [...rows, { id: nextRowId(), cells: [kind, "", "", ""] }];
    }

    function removeTime(index: number) {
        rows = rows.filter((_, rowIndex) => rowIndex !== index);
    }

    function discard() {
        rows = toRows(baseline, 4);
        resetKey += 1;
    }
</script>

<EditableBlock {isEditor}>
    <div class="opening-hours-section">
        <h1 class="opening-hours-title">Sprechzeiten</h1>
        {#if hasContent(times)}
            <table class="opening-hours-table">
                <tbody>
                    {#each times as time, index (time.join("|") + "|" + index)}
                        <tr class="opening-hours-row">
                            {#if time[0] === "Hinweis"}
                                <td colspan="2" class="opening-hours-cell opening-hours-center">{time[1]}</td>
                            {:else if time.length >= 4}
                                <td class="opening-hours-cell">{time[1]}</td>
                                <td class="opening-hours-cell opening-hours-time">{time[2]}<br />{time[3]}</td>
                            {:else if time[1] !== ""}
                                <td class="opening-hours-cell">{time[0]}</td>
                                <td class="opening-hours-cell opening-hours-time">{time[1]}<br />{time[2]}</td>
                            {:else}
                                <td colspan="2" class="opening-hours-cell opening-hours-center">{time[0]}</td>
                            {/if}
                        </tr>
                    {/each}
                </tbody>
            </table>
        {/if}
    </div>
    <form slot="editor" class="opening-hours-section" method="post" action="/admin/content">
        <h1 class="opening-hours-title">Sprechzeiten</h1>
        <input type="hidden" name="action" value="saveRows" />
        <input type="hidden" name="sectionKey" value="Sprechzeiten" />
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <input type="hidden" name="rowCount" value={rows.length} />
        {#key resetKey}
            <table class="opening-hours-table">
                <tbody>
                    {#each rows as row, index (row.id)}
                        <tr
                            class="opening-hours-row"
                            class:row-dragging={$dragIndex === index}
                            animate:flip={{ duration: 180 }}
                            on:dragover={(event) => dnd.handleDragOver(event, index)}
                            on:drop={dnd.handleDrop}
                        >
                            {#if row.cells[0] === "Hinweis"}
                                <td colspan="2" class="opening-hours-cell opening-hours-center">
                                    <input type="hidden" name={`cell:${index}:0`} value="Hinweis" />
                                    <input type="hidden" name={`cell:${index}:2`} value="" />
                                    <input type="hidden" name={`cell:${index}:3`} value="" />
                                    <RichText
                                        inline
                                        name={`cell:${index}:1`}
                                        ariaLabel="Hinweis"
                                        value={row.cells[1]}
                                        on:init={(event) => setCell(index, 1, event.detail, true)}
                                        on:change={(event) => setCell(index, 1, event.detail, false)}
                                    />
                                    <span class="opening-hours-row-actions">
                                        <RowDragHandle {dnd} {index} />
                                        <button
                                            class="inline-icon-btn"
                                            type="button"
                                            aria-label="Zeile entfernen"
                                            title="Zeile entfernen"
                                            on:click={() => removeTime(index)}
                                        >
                                            <svg aria-hidden="true" viewBox="0 0 24 24">
                                                <path d="M5 11h14v2H5v-2Z" />
                                            </svg>
                                        </button>
                                    </span>
                                </td>
                            {:else}
                                <td class="opening-hours-cell">
                                    <input type="hidden" name={`cell:${index}:0`} value="Sprechzeit" />
                                    <RichText
                                        inline
                                        name={`cell:${index}:1`}
                                        ariaLabel="Tag"
                                        value={row.cells[1]}
                                        on:init={(event) => setCell(index, 1, event.detail, true)}
                                        on:change={(event) => setCell(index, 1, event.detail, false)}
                                    />
                                </td>
                                <td class="opening-hours-cell opening-hours-time">
                                    <div>
                                        <RichText
                                            inline
                                            name={`cell:${index}:2`}
                                            ariaLabel="Vormittag"
                                            value={row.cells[2]}
                                            on:init={(event) => setCell(index, 2, event.detail, true)}
                                            on:change={(event) => setCell(index, 2, event.detail, false)}
                                        />
                                    </div>
                                    <div>
                                        <RichText
                                            inline
                                            name={`cell:${index}:3`}
                                            ariaLabel="Nachmittag"
                                            value={row.cells[3]}
                                            on:init={(event) => setCell(index, 3, event.detail, true)}
                                            on:change={(event) => setCell(index, 3, event.detail, false)}
                                        />
                                    </div>
                                    <span class="opening-hours-row-actions">
                                        <RowDragHandle {dnd} {index} />
                                        <button
                                            class="inline-icon-btn"
                                            type="button"
                                            aria-label="Zeile entfernen"
                                            title="Zeile entfernen"
                                            on:click={() => removeTime(index)}
                                        >
                                            <svg aria-hidden="true" viewBox="0 0 24 24">
                                                <path d="M5 11h14v2H5v-2Z" />
                                            </svg>
                                        </button>
                                    </span>
                                </td>
                            {/if}
                        </tr>
                    {/each}
                </tbody>
            </table>
        {/key}
        <InlineEditorActions
            {dirty}
            addActions={[
                { label: "Sprechzeit hinzufügen", text: "Sprechzeit", run: () => addRow("Sprechzeit") },
                { label: "Hinweis hinzufügen", text: "Hinweis", run: () => addRow("Hinweis") },
            ]}
            onDiscard={discard}
        />
    </form>
</EditableBlock>

<style>
    .opening-hours-section {
        margin-top: 2rem;
    }

    .opening-hours-title {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 1.5rem;
        letter-spacing: -0.025em;
    }

    .opening-hours-table {
        margin-top: 1.5rem;
        width: 100%;
    }

    .opening-hours-row:nth-child(even) {
        background-color: var(--color-gulfstream-100);
    }

    .opening-hours-row:nth-child(odd) {
        background-color: var(--color-gulfstream-200);
    }

    .opening-hours-row {
        border: 1px solid #d1d5db;
    }

    .opening-hours-cell {
        padding: 1rem;
    }

    .opening-hours-time {
        text-align: right;
    }

    .opening-hours-center {
        text-align: center;
    }

    .opening-hours-row-actions {
        display: inline-flex;
        gap: 0.4rem;
        margin-left: 0.5rem;
        vertical-align: middle;
    }
</style>
