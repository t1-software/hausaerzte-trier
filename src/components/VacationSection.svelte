<script lang="ts">
    import { onMount } from "svelte";
    import { flip } from "svelte/animate";
    import EditableBlock from "./EditableBlock.svelte";
    import InlineEditorActions from "./InlineEditorActions.svelte";
    import RichText from "./RichText.svelte";
    import RowDragHandle from "./RowDragHandle.svelte";
    import { ajaxSave } from "$lib/ajax-save";
    import { hasContent } from "../utils/content";
    import { cellsOf, isDirty, moveRow, nextRowId, toRows, type EditableRow } from "$lib/editable-rows";
    import { createRowDnd } from "$lib/row-dnd";

    export let vacations: string[][] = [];
    export let isEditor = false;
    export let redirectTo = "/";
    /** "card" in der Seitenleiste, "band" als Karte im Info-Band unter dem Titelbild. */
    export let variant: "card" | "band" = "card";

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
        <div class="vacation-section" class:card={variant === "card"} class:quick-card={variant === "band"}>
            {#if variant === "band"}
                <span class="quick-label">
                    <svg aria-hidden="true" viewBox="0 0 24 24" class="quick-icon">
                        <path
                            d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 15H5V10h14v9Zm0-11H5V6h14v2Z"
                        />
                    </svg>
                    Urlaub
                </span>
            {:else}
                <h2 class="vacation-title">Urlaub</h2>
            {/if}
            {#if hasContent(vacations)}
                <ul class="vacation-list">
                    {#each vacations as vacation, index (vacation.join("|") + "|" + index)}
                        <li class="vacation-row">{vacation[0]} bis {vacation[1]}</li>
                    {/each}
                </ul>
                <p class="vacation-note">In dieser Zeit bleibt die Praxis geschlossen.</p>
            {/if}
        </div>
        <form
            slot="editor"
            class="vacation-section"
            class:card={variant === "card"}
            class:quick-card={variant === "band"}
            method="post"
            action="/admin/content"
            use:ajaxSave
            on:saved={() => (baseline = cellsOf(rows))}
        >
            {#if variant === "band"}
                <span class="quick-label">Urlaub</span>
            {:else}
                <h2 class="vacation-title">Urlaub</h2>
            {/if}
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
    .vacation-section.card {
        padding: 1.5rem;
    }

    .vacation-section.quick-card :global(.vacation-row) {
        font-size: 0.9rem;
        padding: 0.3rem 0;
    }

    .vacation-section.quick-card .vacation-note {
        font-size: 0.85rem;
        margin-top: 0.5rem;
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

    /* Two compact rows per entry: "Von" next to the handle, "bis <Bis>" below. */
    .vacation-range {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        column-gap: 0.4rem;
        row-gap: 0.2rem;
        width: 100%;
    }

    .vacation-range :global(.rich-text) {
        min-width: 0;
    }

    .vacation-range > :global(:nth-child(3)) {
        grid-row: 2;
        grid-column: 1;
        justify-self: center;
        font-weight: 400;
        color: var(--color-sand-900);
    }

    .vacation-range > :global(:nth-child(4)) {
        grid-row: 2;
        grid-column: 2;
    }

    .vacation-remove {
        grid-row: 1;
        grid-column: 3;
    }
</style>
