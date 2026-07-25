<script lang="ts">
    import { onMount } from "svelte";
    import { flip } from "svelte/animate";
    import EditableBlock from "./EditableBlock.svelte";
    import InlineEditorActions from "./InlineEditorActions.svelte";
    import RichText from "./RichText.svelte";
    import RowDragHandle from "./RowDragHandle.svelte";
    import { ajaxSave } from "$lib/ajax-save";
    import { hasContent } from "../utils/content";
    import { marked } from "marked";
    import { cellsOf, isDirty, moveRow, nextRowId, toRows, type EditableRow } from "$lib/editable-rows";
    import { createRowDnd } from "$lib/row-dnd";

    export let leistungen: string[][] = [];
    export let isEditor = false;
    export let redirectTo = "/leistungsspektrum";
    /** Für Besucher ausgeblendet; im Bearbeitungsmodus gedimmt sichtbar. */
    export let hidden = false;

    let rows: EditableRow[] = toRows(leistungen, 2);
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

    function addLeistung() {
        rows = [...rows, { id: nextRowId(), cells: ["", ""] }];
    }

    function removeLeistung(index: number) {
        rows = rows.filter((_, rowIndex) => rowIndex !== index);
    }

    function discard() {
        rows = toRows(baseline, 2);
        resetKey += 1;
    }
</script>

<EditableBlock {isEditor} sectionKey="Leistungsspektrum" {hidden} {redirectTo}>
    <div class="leistungsspektrum-section">
        {#if hasContent(leistungen)}
            <div class="leistungsspektrum-content">
                {#each leistungen as leistung, index (leistung.join("|") + "|" + index)}
                    <div class="leistung-item card">
                        <h2 class="leistung-title">{leistung[0]}</h2>
                        <div class="leistung-description">
                            {@html marked(leistung[1] ?? "")}
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
    <form
        slot="editor"
        class="leistungsspektrum-section"
        method="post"
        action="/admin/content"
        use:ajaxSave
        on:saved={() => (baseline = cellsOf(rows))}
    >
        <h2 class="leistungsspektrum-title">Leistungsspektrum</h2>
        <input type="hidden" name="action" value="saveRows" />
        <input type="hidden" name="sectionKey" value="Leistungsspektrum" />
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <input type="hidden" name="rowCount" value={rows.length} />
        {#key resetKey}
            <div class="leistungsspektrum-content" role="list">
                {#each rows as row, index (row.id)}
                    <div
                        class="leistung-item card"
                        role="listitem"
                        class:row-dragging={$dragIndex === index}
                        animate:flip={{ duration: 180 }}
                        on:dragover={(event) => dnd.handleDragOver(event, index)}
                        on:drop={dnd.handleDrop}
                    >
                        <div class="leistung-title">
                            <RichText
                                inline
                                allowBold={false}
                                name={`cell:${index}:0`}
                                ariaLabel="Titel"
                                value={row.cells[0]}
                                on:init={(event) => setCell(index, 0, event.detail, true)}
                                on:change={(event) => setCell(index, 0, event.detail, false)}
                            />
                        </div>
                        <div class="leistung-description">
                            <RichText
                                name={`cell:${index}:1`}
                                ariaLabel="Beschreibung"
                                value={row.cells[1]}
                                on:init={(event) => setCell(index, 1, event.detail, true)}
                                on:change={(event) => setCell(index, 1, event.detail, false)}
                            />
                        </div>
                        <RowDragHandle {dnd} {index} />
                        <button
                            class="inline-icon-btn"
                            type="button"
                            aria-label="Eintrag entfernen"
                            title="Eintrag entfernen"
                            on:click={() => removeLeistung(index)}
                        >
                            <svg aria-hidden="true" viewBox="0 0 24 24">
                                <path d="M5 11h14v2H5v-2Z" />
                            </svg>
                        </button>
                    </div>
                {/each}
            </div>
        {/key}
        <InlineEditorActions
            {dirty}
            addActions={[{ label: "Eintrag hinzufügen", run: addLeistung }]}
            onDiscard={discard}
        />
    </form>
</EditableBlock>

<style>
    .leistungsspektrum-section {
        padding: 2rem 0;
    }

    .leistungsspektrum-title {
        margin-bottom: 1rem;
    }

    .leistungsspektrum-content {
        display: grid;
        gap: 1rem;
    }

    @media (min-width: 768px) {
        .leistungsspektrum-content {
            grid-template-columns: 1fr 1fr;
        }
    }

    .leistung-item {
        padding: 1.5rem;
    }

    .leistung-title {
        font-size: 1.2rem;
        margin-bottom: 0.6rem;
    }

    .leistung-description {
        line-height: 1.6;
        color: var(--color-sand-900);
        font-size: 0.975rem;
    }

    .leistung-description :global(p) {
        overflow: visible;
    }
</style>
