<script lang="ts">
    import EditableBlock from "./EditableBlock.svelte";
    import { hasContent } from "../utils/content";
    import { marked } from "marked";

    export let leistungen: string[][] = [];
    export let isEditor = false;
    export let redirectTo = "/leistungsspektrum";

    let draftLeistungen = cloneRows(leistungen);

    function cloneRows(rows: string[][]): string[][] {
        return rows.map((row) => [row[0] ?? "", row[1] ?? ""]);
    }

    function addLeistung() {
        draftLeistungen = [...draftLeistungen, ["", ""]];
    }

    function removeLeistung(index: number) {
        draftLeistungen = draftLeistungen.filter((_, rowIndex) => rowIndex !== index);
    }

    function discardLeistungChanges(close: () => void) {
        draftLeistungen = cloneRows(leistungen);
        close();
    }
</script>

<EditableBlock {isEditor} label="Leistungsspektrum bearbeiten">
    <div class="leistungsspektrum-section">
        <h1 class="leistungsspektrum-title">Leistungsspektrum</h1>

        {#if hasContent(leistungen)}
            <div class="leistungsspektrum-content">
                {#each leistungen as leistung, index (leistung.join("|") + "|" + index)}
                    <div class="leistung-item">
                        <h2 class="leistung-title">{leistung[0]}</h2>
                        <div class="leistung-description">
                            {@html marked(leistung[1] ?? "")}
                        </div>
                    </div>
                {/each}
            </div>
        {:else}
            <p class="leistung-placeholder">Leistungsspektrum</p>
        {/if}
    </div>
    <form
        slot="editor"
        let:close
        class="leistungsspektrum-section inline-editor-panel"
        method="post"
        action="/admin/content"
    >
        <h1 class="leistungsspektrum-title">Leistungsspektrum</h1>
        <input type="hidden" name="action" value="saveRows" />
        <input type="hidden" name="sectionKey" value="Leistungsspektrum" />
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <input type="hidden" name="rowCount" value={draftLeistungen.length} />
        {#each draftLeistungen as leistung, index (index)}
            <div class="editor-row">
                <label class="inline-editor-label">
                    Titel
                    <input class="inline-editor-input" name={`cell:${index}:0`} bind:value={leistung[0]} />
                </label>
                <label class="inline-editor-label">
                    Beschreibung
                    <textarea class="inline-editor-textarea" name={`cell:${index}:1`} bind:value={leistung[1]}
                    ></textarea>
                </label>
                <button class="inline-editor-remove" type="button" on:click={() => removeLeistung(index)}>
                    Entfernen
                </button>
            </div>
        {/each}
        <div class="inline-editor-actions">
            <button class="inline-editor-apply" type="submit">Übernehmen</button>
            <button class="inline-editor-secondary" type="button" on:click={addLeistung}>Zeile hinzufügen</button>
            <button class="inline-editor-discard" type="button" on:click={() => discardLeistungChanges(close)}>
                Verwerfen
            </button>
        </div>
    </form>
</EditableBlock>

<style>
    .leistungsspektrum-section {
        padding: 2rem 0;
    }

    .leistungsspektrum-title {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 2rem;
        letter-spacing: -0.025em;
    }

    .leistungsspektrum-content {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .leistung-item {
        border-bottom: 1px solid var(--color-gulfstream-200);
        padding-bottom: 1.5rem;
    }

    .leistung-item:last-child {
        border-bottom: none;
    }

    .leistung-title {
        font-size: 1.25rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        letter-spacing: -0.025em;
        color: var(--color-gulfstream-700);
    }

    .leistung-description {
        padding-top: 0.5rem;
        padding-bottom: 1.5rem;
        text-align: justify;
        width: 100%;
        line-height: 1.6;
    }

    .editor-row {
        display: grid;
        grid-template-columns: 1fr 2fr auto;
        gap: 0.75rem;
        margin-bottom: 0.75rem;
    }

    .leistung-placeholder {
        color: var(--color-gulfstream-600);
        font-weight: 700;
    }

    @media (max-width: 900px) {
        .editor-row {
            grid-template-columns: 1fr;
        }
    }
</style>
