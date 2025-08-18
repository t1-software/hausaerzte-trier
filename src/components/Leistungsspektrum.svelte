<script lang="ts">
    import { hasContent } from "../utils/content";

    export let leistungen: string[][] = [];
</script>

<div class="leistungsspektrum-section">
    <h1 class="leistungsspektrum-title">Leistungsspektrum</h1>

    {#if hasContent(leistungen)}
        <div class="leistungsspektrum-content">
            {#each leistungen as leistung}
                <div class="leistung-item">
                    <h2 class="leistung-title">{leistung[0]}</h2>
                    <div class="leistung-description">
                        {leistung[1]}
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>

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
</style>
