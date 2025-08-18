<script lang="ts">
    import { hasContent } from "../utils/content";

    export let times: string[][] = [];
</script>

<div class="opening-hours-section">
    <h1 class="opening-hours-title">Sprechzeiten</h1>
    {#if hasContent(times)}
        <table class="opening-hours-table">
            <tbody>
                {#each times as time}
                    <tr class="opening-hours-row">
                        {#if time[1] !== ""}
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
</style>
