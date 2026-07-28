<script lang="ts">
    import { onMount } from "svelte";
    import { flip } from "svelte/animate";
    import EditableBlock from "./EditableBlock.svelte";
    import InlineEditorActions from "./InlineEditorActions.svelte";
    import MediaLibrary from "./MediaLibrary.svelte";
    import RowDragHandle from "./RowDragHandle.svelte";
    import { ajaxSave } from "$lib/ajax-save";
    import { cellsOf, isDirty, moveRow, nextRowId, toRows, type EditableRow } from "$lib/editable-rows";
    import { createRowDnd } from "$lib/row-dnd";

    /** Team-Karten: Name, Rolle, Bild, Sichtbarkeit — Zeilen aus dem Bereich "Team-Mitglieder". */
    export let members: string[][] = [];
    export let isEditor = false;
    export let redirectTo = "/team";

    /** Wert in Spalte 4, der eine Karte für Besucher ausblendet. */
    const HIDDEN_MARK = "ausgeblendet";

    let rows: EditableRow[] = toRows(normalise(members), 4);
    let baseline = cellsOf(rows);
    let initialised = false;
    let resetKey = 0;
    let libraryFor: number | null = null;

    $: dirty = initialised && isDirty(rows, baseline);

    const dnd = createRowDnd((from, to) => (rows = moveRow(rows, from, to)));
    const { dragIndex } = dnd;

    onMount(() => {
        initialised = true;
    });

    function normalise(source: string[][]): string[][] {
        return source.map((row) => [row[0] ?? "", row[1] ?? "", row[2] ?? "", row[3] ?? ""]);
    }

    function setCell(rowIndex: number, column: number, value: string) {
        rows[rowIndex].cells[column] = value;
        rows = rows;
    }

    function addMember() {
        rows = [...rows, { id: nextRowId(), cells: ["", "", "", ""] }];
    }

    function removeMember(index: number) {
        rows = rows.filter((_, rowIndex) => rowIndex !== index);
    }

    function discard() {
        rows = toRows(baseline, 4);
        resetKey += 1;
    }

    function handleImageSelect(event: CustomEvent<string>) {
        if (libraryFor !== null) {
            setCell(libraryFor, 2, event.detail);
        }

        libraryFor = null;
    }

    function initials(name: string): string {
        const parts = name.replace(/[^A-Za-zÀ-ž\s-]/g, "").split(/[\s-]+/);
        const first = parts[0]?.[0] ?? "";
        const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
        return (first + last).toUpperCase();
    }
</script>

<EditableBlock {isEditor}>
    <div class="team-grid mt-10">
        {#each members.filter((member) => member[3] !== HIDDEN_MARK) as member, index (member.join("|") + "|" + index)}
            <div class="card team-card">
                {#if member[2]}
                    <img src={member[2]} alt={member[0]} class="team-photo" loading="lazy" />
                {:else}
                    <div class="team-photo team-photo--placeholder" aria-hidden="true">
                        <span>{initials(member[0] ?? "")}</span>
                    </div>
                {/if}
                <div class="team-meta">
                    <div class="team-name">{member[0]}</div>
                    <div class="team-role">{member[1]}</div>
                </div>
            </div>
        {/each}
    </div>
    <form
        slot="editor"
        class="team-editor"
        method="post"
        action="/admin/content"
        use:ajaxSave
        on:saved={() => (baseline = cellsOf(rows))}
    >
        <input type="hidden" name="action" value="saveRows" />
        <input type="hidden" name="sectionKey" value="Team-Mitglieder" />
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <input type="hidden" name="rowCount" value={rows.length} />
        {#key resetKey}
            <div class="team-grid mt-10" role="list">
                {#each rows as row, index (row.id)}
                    <div
                        class="card team-card"
                        role="listitem"
                        class:row-dragging={$dragIndex === index}
                        animate:flip={{ duration: 180 }}
                        on:dragover={(event) => dnd.handleDragOver(event, index)}
                        on:drop={dnd.handleDrop}
                    >
                        <input type="hidden" name={`cell:${index}:2`} value={row.cells[2]} />
                        <input type="hidden" name={`cell:${index}:3`} value={row.cells[3]} />
                        <div class="team-photo-frame" class:team-photo-frame--hidden={row.cells[3] === HIDDEN_MARK}>
                            {#if row.cells[2]}
                                <img src={row.cells[2]} alt="" class="team-photo" />
                            {:else}
                                <div class="team-photo team-photo--placeholder" aria-hidden="true">
                                    <span>{initials(row.cells[0])}</span>
                                </div>
                            {/if}
                            <div class="team-photo-actions">
                                <button class="team-photo-btn" type="button" on:click={() => (libraryFor = index)}>
                                    {row.cells[2] ? "Bild ändern" : "Bild wählen"}
                                </button>
                                {#if row.cells[2]}
                                    <button class="team-photo-btn" type="button" on:click={() => setCell(index, 2, "")}>
                                        Entfernen
                                    </button>
                                {/if}
                            </div>
                        </div>
                        <div class="team-meta">
                            <input
                                class="team-input team-input--name"
                                name={`cell:${index}:0`}
                                placeholder="Name"
                                aria-label="Name"
                                value={row.cells[0]}
                                on:input={(event) => setCell(index, 0, event.currentTarget.value)}
                            />
                            <input
                                class="team-input team-input--role"
                                name={`cell:${index}:1`}
                                placeholder="Rolle"
                                aria-label="Rolle"
                                value={row.cells[1]}
                                on:input={(event) => setCell(index, 1, event.currentTarget.value)}
                            />
                        </div>
                        <div class="team-row-actions">
                            <RowDragHandle {dnd} {index} />
                            <button
                                class="inline-icon-btn"
                                type="button"
                                aria-pressed={row.cells[3] === HIDDEN_MARK}
                                aria-label={row.cells[3] === HIDDEN_MARK
                                    ? "Karte wieder anzeigen"
                                    : "Karte für Besucher ausblenden"}
                                title={row.cells[3] === HIDDEN_MARK
                                    ? "Karte wieder anzeigen"
                                    : "Karte für Besucher ausblenden"}
                                on:click={() => setCell(index, 3, row.cells[3] === HIDDEN_MARK ? "" : HIDDEN_MARK)}
                            >
                                {#if row.cells[3] === HIDDEN_MARK}
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
                            <button
                                class="inline-icon-btn"
                                type="button"
                                aria-label="Karte entfernen"
                                title="Karte entfernen"
                                on:click={() => removeMember(index)}
                            >
                                <svg aria-hidden="true" viewBox="0 0 24 24">
                                    <path d="M5 11h14v2H5v-2Z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                {/each}
            </div>
        {/key}
        <InlineEditorActions
            {dirty}
            addActions={[{ label: "Mitglied hinzufügen", run: addMember }]}
            onDiscard={discard}
        />
    </form>
</EditableBlock>

{#if libraryFor !== null}
    <MediaLibrary on:select={handleImageSelect} on:close={() => (libraryFor = null)} />
{/if}

<style>
    .team-grid {
        display: grid;
        gap: 1.5rem;
    }

    @media (min-width: 768px) {
        .team-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    @media (min-width: 1024px) {
        .team-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
        }
    }

    @media (min-width: 1280px) {
        .team-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
        }
    }

    .team-card {
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .team-photo {
        width: 100%;
        aspect-ratio: 4 / 5;
        object-fit: cover;
        object-position: center top;
    }

    .team-photo--placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(160deg, var(--color-pine-100), var(--color-pine-200));
    }

    .team-photo--placeholder span {
        font-family: var(--font-display);
        font-size: 3rem;
        font-weight: 650;
        color: var(--color-pine-600);
    }

    .team-photo-frame {
        position: relative;
    }

    /* Ausgeblendete Karte im Editor: gedimmt, aber weiter editierbar. */
    .team-photo-frame--hidden {
        opacity: 0.45;
    }

    .team-photo-actions {
        position: absolute;
        bottom: 0.6rem;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        gap: 0.4rem;
    }

    .team-photo-btn {
        border: 1px solid var(--color-sand-200);
        border-radius: 9999px;
        background: rgba(255, 255, 255, 0.94);
        color: var(--color-pine-800);
        font-size: 0.8rem;
        font-weight: 700;
        padding: 0.3rem 0.75rem;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.18);
    }

    .team-photo-btn:hover {
        background: white;
    }

    .team-meta {
        padding: 0.9rem 1rem 1.1rem;
        text-align: center;
    }

    .team-name {
        font-weight: 700;
        color: var(--color-pine-900);
    }

    .team-role {
        margin-top: 0.15rem;
        font-size: 0.875rem;
        color: var(--color-sand-900);
    }

    .team-input {
        display: block;
        width: 100%;
        border: none;
        border-bottom: 1px dashed var(--color-pine-300);
        background: transparent;
        text-align: center;
        font: inherit;
        outline: none;
        padding: 0;
    }

    .team-input:focus {
        border-bottom-color: var(--color-pine-600);
    }

    .team-input::placeholder {
        color: var(--color-sand-700);
    }

    .team-input--name {
        font-weight: 700;
        color: var(--color-pine-900);
    }

    .team-input--role {
        margin-top: 0.3rem;
        font-size: 0.875rem;
        color: var(--color-sand-900);
    }

    .team-row-actions {
        display: flex;
        justify-content: center;
        gap: 0.4rem;
        padding: 0 1rem 1rem;
    }
</style>
