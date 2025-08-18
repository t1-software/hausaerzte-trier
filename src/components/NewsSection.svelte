<script lang="ts">
    import { marked } from "marked";
    import { hasContent, formatNewsContent } from "../utils/content";

    export let news: string[][] = [];

    $: newsString = formatNewsContent(news);
</script>

{#if hasContent(news)}
    <div class="news-section">
        <h1 class="news-title anchor" id="neuigkeiten">Aktuelle Neuigkeiten</h1>
        <div class="news-content">
            {@html marked(newsString)}
        </div>
    </div>
{/if}

<style>
    .news-section {
        margin-top: 2rem;
    }

    .news-title {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 1.5rem;
        letter-spacing: -0.025em;
    }

    .news-content {
        padding-top: 1.5rem;
        text-align: justify;
        width: 100%;
    }

    @media (min-width: 1024px) {
        .news-content {
            width: 80%;
        }
    }

    .news-content :global(ul) {
        list-style-type: disc;
        margin-left: 1.5rem;
        margin-bottom: 1rem;
    }

    .news-content :global(li) {
        margin-bottom: 0.5rem;
    }

    .news-content :global(p) {
        margin-bottom: 1rem;
        overflow: visible;
    }

    .news-content :global(strong) {
        font-weight: 700;
    }
</style>
