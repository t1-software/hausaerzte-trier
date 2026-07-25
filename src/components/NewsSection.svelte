<script lang="ts">
    import EditableBlock from "./EditableBlock.svelte";
    import InlineEditorActions from "./InlineEditorActions.svelte";
    import RichText from "./RichText.svelte";
    import SuggestionListEditor from "./SuggestionListEditor.svelte";
    import { marked } from "marked";
    import { hasContent, formatNewsContent } from "../utils/content";

    export let news: string[][] = [];
    export let isEditor = false;
    export let redirectTo = "/";
    /** Gepflegte Einträge, die beim Tippen als Vorschlag erscheinen. */
    export let suggestionEntries: string[][] = [];

    $: suggestions = suggestionEntries.map((row) => row[0]).filter(Boolean);

    $: newsString = formatNewsContent(news);

    let baseline: string | null = null;
    let draft = "";
    let resetKey = 0;

    $: dirty = baseline !== null && draft !== baseline;

    function discard() {
        draft = baseline ?? "";
        resetKey += 1;
    }
</script>

{#if isEditor || hasContent(news)}
    <EditableBlock {isEditor}>
        <div class="news-section">
            <h2 class="news-title anchor" id="neuigkeiten">Aktuelle Neuigkeiten</h2>
            <div class="news-content">
                {@html marked(newsString)}
            </div>
        </div>
        <form slot="editor" class="news-section" method="post" action="/admin/content">
            <input type="hidden" name="action" value="saveBlock" />
            <input type="hidden" name="sectionKey" value="Neuigkeiten" />
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <h2 class="news-title anchor" id="neuigkeiten">Aktuelle Neuigkeiten</h2>
            <div class="news-content">
                {#key resetKey}
                    <RichText
                        allowList
                        {suggestions}
                        name="text"
                        ariaLabel="Neuigkeiten"
                        value={baseline ?? newsString}
                        on:init={(event) => {
                            baseline = event.detail;
                            draft = event.detail;
                        }}
                        on:change={(event) => (draft = event.detail)}
                    />
                {/key}
                <InlineEditorActions {dirty} onDiscard={discard} />
                <SuggestionListEditor entries={suggestionEntries} {redirectTo} />
            </div>
        </form>
    </EditableBlock>
{/if}

<style>
    .news-section {
        margin-top: 3rem;
    }

    .news-title {
        margin-bottom: 1rem;
    }

    .news-content {
        max-width: 65ch;
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
