<script lang="ts">
    import { onMount } from "svelte";
    import { flip } from "svelte/animate";
    import EditableBlock from "./EditableBlock.svelte";
    import InlineEditorActions from "./InlineEditorActions.svelte";
    import RichText from "./RichText.svelte";
    import RowDragHandle from "./RowDragHandle.svelte";
    import ContactSection from "./ContactSection.svelte";
    import VacationSection from "./VacationSection.svelte";
    import { ajaxSave } from "$lib/ajax-save";
    import { cellsOf, isDirty, moveRow, nextRowId, toRows, type EditableRow } from "$lib/editable-rows";
    import { createRowDnd } from "$lib/row-dnd";

    export let times: string[][] = [];
    export let vacations: string[][] = [];
    export let appointmentText = "";
    export let isEditor = false;
    export let redirectTo = "/";

    // Rows are ["Sprechzeit"|"Hinweis", day, morning, afternoon] or legacy [day, morning, afternoon].
    $: hourRows = times.map((row) =>
        row.length >= 4 ? row : ["Sprechzeit", row[0] ?? "", row[1] ?? "", row[2] ?? ""]
    );

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

<div class="relative z-10 mx-auto -mt-12 w-full max-w-7xl px-4">
    <div class="quick-grid">
        <EditableBlock {isEditor}>
            <div id="sprechzeiten" class="quick-card h-full">
                <span class="quick-label">
                    <svg aria-hidden="true" viewBox="0 0 24 24" class="quick-icon">
                        <path
                            d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67Z"
                        />
                    </svg>
                    Sprechzeiten
                </span>
                {#if hourRows.length > 0}
                    <ul class="quick-hours">
                        {#each hourRows as row, index (row.join("|") + "|" + index)}
                            {#if row[0] === "Hinweis"}
                                <li class="quick-hours-note">{row[1]}</li>
                            {:else}
                                <li>
                                    <span>{row[1]}</span>
                                    <span class="quick-hours-times tabular-nums">
                                        {#each [row[2], row[3]].filter(Boolean) as time (time)}
                                            <span>{time}</span>
                                        {/each}
                                    </span>
                                </li>
                            {/if}
                        {/each}
                    </ul>
                {:else}
                    <span class="quick-value">Nach Vereinbarung</span>
                {/if}
            </div>
            <form
                slot="editor"
                id="sprechzeiten"
                class="quick-card"
                method="post"
                action="/admin/content"
                use:ajaxSave
                on:saved={() => (baseline = cellsOf(rows))}
            >
                <span class="quick-label">
                    <svg aria-hidden="true" viewBox="0 0 24 24" class="quick-icon">
                        <path
                            d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67Z"
                        />
                    </svg>
                    Sprechzeiten
                </span>
                <input type="hidden" name="action" value="saveRows" />
                <input type="hidden" name="sectionKey" value="Sprechzeiten" />
                <input type="hidden" name="redirectTo" value={redirectTo} />
                <input type="hidden" name="rowCount" value={rows.length} />
                {#key resetKey}
                    <ul class="quick-hours quick-hours--editing">
                        {#each rows as row, index (row.id)}
                            <li
                                class:row-dragging={$dragIndex === index}
                                class:quick-hours-note={row.cells[0] === "Hinweis"}
                                animate:flip={{ duration: 180 }}
                                on:dragover={(event) => dnd.handleDragOver(event, index)}
                                on:drop={dnd.handleDrop}
                            >
                                {#if row.cells[0] === "Hinweis"}
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
                                {:else}
                                    <input type="hidden" name={`cell:${index}:0`} value="Sprechzeit" />
                                    <span class="quick-edit-day">
                                        <RichText
                                            inline
                                            name={`cell:${index}:1`}
                                            ariaLabel="Tag"
                                            value={row.cells[1]}
                                            on:init={(event) => setCell(index, 1, event.detail, true)}
                                            on:change={(event) => setCell(index, 1, event.detail, false)}
                                        />
                                    </span>
                                    <span class="quick-edit-times tabular-nums">
                                        <RichText
                                            inline
                                            name={`cell:${index}:2`}
                                            ariaLabel="Vormittag"
                                            value={row.cells[2]}
                                            on:init={(event) => setCell(index, 2, event.detail, true)}
                                            on:change={(event) => setCell(index, 2, event.detail, false)}
                                        />
                                        <RichText
                                            inline
                                            name={`cell:${index}:3`}
                                            ariaLabel="Nachmittag"
                                            value={row.cells[3]}
                                            on:init={(event) => setCell(index, 3, event.detail, true)}
                                            on:change={(event) => setCell(index, 3, event.detail, false)}
                                        />
                                    </span>
                                {/if}
                                <span class="quick-edit-actions">
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
                            </li>
                        {/each}
                    </ul>
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

        <VacationSection {vacations} {isEditor} {redirectTo} variant="band" />

        <ContactSection {isEditor} {redirectTo} {appointmentText} variant="band" />
    </div>
</div>

<style>
    .quick-grid {
        display: grid;
        gap: 0.75rem;
    }

    @media (min-width: 768px) {
        .quick-grid {
            grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr) minmax(0, 1fr);
            gap: 1rem;
        }
    }

    .quick-grid :global(.editable-block) {
        height: 100%;
    }

    .quick-value {
        font-family: var(--font-display);
        font-size: 1.35rem;
        font-weight: 650;
        color: var(--color-pine-900);
    }

    .quick-hours {
        list-style: none;
        padding: 0;
        margin: 0;
        font-size: 0.9rem;
        line-height: 1.6;
    }

    .quick-hours li {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 0.3rem 0;
        border-bottom: 1px solid var(--color-sand-200);
    }

    .quick-hours li:last-child {
        border-bottom: none;
    }

    .quick-hours li > span:first-child {
        font-weight: 600;
    }

    .quick-hours li > span:last-child {
        text-align: right;
    }

    .quick-hours .quick-hours-times {
        display: flex;
        flex-direction: column;
        text-align: right;
        font-weight: 400;
    }

    .quick-hours li.quick-hours-note {
        justify-content: center;
        text-align: center;
        font-size: 0.85rem;
        color: var(--color-sand-900);
        margin: 0.5rem -0.5rem 0;
        padding-top: 0.5rem;
        border-top: 1px solid var(--color-sand-200);
    }

    .quick-hours--editing li {
        align-items: center;
        padding: 0.2rem 0;
    }

    .quick-edit-day {
        flex: 1;
    }

    .quick-edit-times {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        text-align: right;
    }

    .quick-edit-actions {
        display: inline-flex;
        gap: 0.3rem;
    }
</style>
