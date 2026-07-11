<script lang="ts">
    import EditableBlock from "./EditableBlock.svelte";
    import { marked } from "marked";
    import { hasContent, formatNewsContent } from "../utils/content";

    export let news: string[][] = [];
    export let isEditor = false;
    export let redirectTo = "/";

    $: newsString = formatNewsContent(news);
</script>

{#if isEditor || hasContent(news)}
    <EditableBlock {isEditor} label="Neuigkeiten bearbeiten">
        <div class="news-section">
            <h1 class="news-title anchor" id="neuigkeiten">Aktuelle Neuigkeiten</h1>
            <div class="news-content">
                {#if hasContent(news)}
                    {@html marked(newsString)}
                {:else}
                    <p class="news-placeholder">Neuigkeiten</p>
                {/if}
            </div>
        </div>
        <form slot="editor" let:close class="news-section inline-editor-panel" method="post" action="/admin/content">
            <input type="hidden" name="action" value="saveBlock" />
            <input type="hidden" name="sectionKey" value="Neuigkeiten" />
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <h1 class="news-title anchor" id="neuigkeiten">Aktuelle Neuigkeiten</h1>
            <label class="inline-editor-label">
                Neuigkeiten
                <textarea name="text" class="inline-editor-textarea">{newsString}</textarea>
            </label>
            <div class="inline-editor-actions">
                <button class="inline-editor-apply" type="submit">Übernehmen</button>
                <button class="inline-editor-discard" type="button" on:click={close}>Verwerfen</button>
            </div>
        </form>
    </EditableBlock>
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

    .news-placeholder {
        color: var(--color-gulfstream-600);
        font-weight: 700;
    }
</style>
