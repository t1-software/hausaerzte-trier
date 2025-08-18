<script lang="ts">
    import { hasContent } from "../utils/content";

    export let vacations: string[][] = [];
</script>

{#if hasContent(vacations)}
    <div class="vacation-section">
        <h1 class="vacation-title">Urlaub</h1>
        <table class="vacation-table">
            <tbody>
                {#each vacations as vacation}
                    <tr class="vacation-row">
                        <td class="vacation-cell">{vacation[0]} bis {vacation[1]}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
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
</style>
