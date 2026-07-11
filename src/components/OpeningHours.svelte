<script lang="ts">
    import EditableBlock from "./EditableBlock.svelte";
    import { hasContent } from "../utils/content";

    export let times: string[][] = [];
    export let isEditor = false;
    export let redirectTo = "/";

    let draftTimes = cloneRows(times);

    function cloneRows(rows: string[][]): string[][] {
        return rows.map((row) => [row[0] || "Sprechzeit", row[1] ?? "", row[2] ?? "", row[3] ?? ""]);
    }

    function addTime() {
        draftTimes = [...draftTimes, ["Sprechzeit", "", "", ""]];
    }

    function removeTime(index: number) {
        draftTimes = draftTimes.filter((_, rowIndex) => rowIndex !== index);
    }

    function discardTimeChanges(close: () => void) {
        draftTimes = cloneRows(times);
        close();
    }
</script>

<EditableBlock {isEditor} label="Sprechzeiten bearbeiten">
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
    <form
        slot="editor"
        let:close
        class="opening-hours-section inline-editor-panel"
        method="post"
        action="/admin/content"
    >
        <h1 class="opening-hours-title">Sprechzeiten</h1>
        <input type="hidden" name="action" value="saveRows" />
        <input type="hidden" name="sectionKey" value="Sprechzeiten" />
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <input type="hidden" name="rowCount" value={draftTimes.length} />
        {#each draftTimes as time, index (index)}
            <div class="editor-row">
                <label class="inline-editor-label">
                    Art
                    <select class="inline-editor-select" name={`cell:${index}:0`} bind:value={time[0]}>
                        <option value="Sprechzeit">Sprechzeit</option>
                        <option value="Hinweis">Hinweis</option>
                    </select>
                </label>
                <label class="inline-editor-label">
                    Tag oder Hinweis
                    <input class="inline-editor-input" name={`cell:${index}:1`} bind:value={time[1]} />
                </label>
                <label class="inline-editor-label">
                    Vormittag
                    <input class="inline-editor-input" name={`cell:${index}:2`} bind:value={time[2]} />
                </label>
                <label class="inline-editor-label">
                    Nachmittag
                    <input class="inline-editor-input" name={`cell:${index}:3`} bind:value={time[3]} />
                </label>
                <button class="inline-editor-remove" type="button" on:click={() => removeTime(index)}>Entfernen</button>
            </div>
        {/each}
        <div class="inline-editor-actions">
            <button class="inline-editor-apply" type="submit">Übernehmen</button>
            <button class="inline-editor-secondary" type="button" on:click={addTime}>Zeile hinzufügen</button>
            <button class="inline-editor-discard" type="button" on:click={() => discardTimeChanges(close)}>
                Verwerfen
            </button>
        </div>
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

    .editor-row {
        display: grid;
        grid-template-columns: 1fr 1.4fr 1fr 1fr auto;
        gap: 0.75rem;
        margin-bottom: 0.75rem;
    }

    @media (max-width: 900px) {
        .editor-row {
            grid-template-columns: 1fr;
        }
    }
</style>
