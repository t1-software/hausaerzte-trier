<script lang="ts">
    import EditableBlock from "./EditableBlock.svelte";
    import { hasContent } from "../utils/content";

    export let vacations: string[][] = [];
    export let isEditor = false;
    export let redirectTo = "/";

    let draftVacations = cloneRows(vacations);

    function cloneRows(rows: string[][]): string[][] {
        return rows.map((row) => [row[0] ?? "", row[1] ?? ""]);
    }

    function addVacation() {
        draftVacations = [...draftVacations, ["", ""]];
    }

    function removeVacation(index: number) {
        draftVacations = draftVacations.filter((_, rowIndex) => rowIndex !== index);
    }

    function discardVacationChanges(close: () => void) {
        draftVacations = cloneRows(vacations);
        close();
    }
</script>

{#if isEditor || hasContent(vacations)}
    <EditableBlock {isEditor} label="Urlaub bearbeiten">
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
            {:else}
                <p class="vacation-placeholder">Urlaub</p>
            {/if}
        </div>
        <form
            slot="editor"
            let:close
            class="vacation-section inline-editor-panel"
            method="post"
            action="/admin/content"
        >
            <h1 class="vacation-title">Urlaub</h1>
            <input type="hidden" name="action" value="saveRows" />
            <input type="hidden" name="sectionKey" value="Urlaub" />
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <input type="hidden" name="rowCount" value={draftVacations.length} />
            <div class="editor-table">
                {#each draftVacations as vacation, index (index)}
                    <div class="editor-row">
                        <label class="inline-editor-label">
                            Von
                            <input class="inline-editor-input" name={`cell:${index}:0`} bind:value={vacation[0]} />
                        </label>
                        <label class="inline-editor-label">
                            Bis
                            <input class="inline-editor-input" name={`cell:${index}:1`} bind:value={vacation[1]} />
                        </label>
                        <button class="inline-editor-remove" type="button" on:click={() => removeVacation(index)}>
                            Entfernen
                        </button>
                    </div>
                {/each}
            </div>
            <div class="inline-editor-actions">
                <button class="inline-editor-apply" type="submit">Übernehmen</button>
                <button class="inline-editor-secondary" type="button" on:click={addVacation}>Zeile hinzufügen</button>
                <button class="inline-editor-discard" type="button" on:click={() => discardVacationChanges(close)}>
                    Verwerfen
                </button>
            </div>
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

    .editor-row {
        display: grid;
        grid-template-columns: 1fr 1fr auto;
        gap: 0.75rem;
        margin-bottom: 0.75rem;
    }

    .vacation-placeholder {
        color: var(--color-gulfstream-600);
        font-weight: 700;
    }

    @media (max-width: 900px) {
        .editor-row {
            grid-template-columns: 1fr;
        }
    }
</style>
