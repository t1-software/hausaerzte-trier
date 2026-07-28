<script lang="ts">
    import EditableBlock from "./EditableBlock.svelte";
    import InlineEditorActions from "./InlineEditorActions.svelte";
    import RichText from "./RichText.svelte";
    import { ajaxSave } from "$lib/ajax-save";
    import { marked } from "marked";
    import { isSectionHidden } from "$lib/content";

    /** The one notice banner, shown on every page. Content comes from the "Wichtig" section. */
    export let content: Record<string, string[][]> = {};
    export let isEditor = false;
    export let redirectTo = "/";

    $: important = content["Wichtig"]?.[0]?.[0]?.replaceAll("\r", "") || "";
    $: hidden = isSectionHidden(content, "Wichtig");

    let baseline: string | null = null;
    let draft = "";
    let resetKey = 0;

    $: dirty = baseline !== null && draft !== baseline;

    function discard() {
        draft = baseline ?? "";
        resetKey += 1;
    }
</script>

{#if isEditor || (important.length > 0 && !hidden)}
    <div class="notice-banner w-full border-b border-pine-600/40 bg-pine-500">
        <div class="mx-auto w-full max-w-7xl px-4 py-2.5">
            <div class="w-full">
                <EditableBlock {isEditor} sectionKey="Wichtig" {hidden} {redirectTo}>
                    <div class="notice-text">
                        {@html marked(important)}
                    </div>
                    <form
                        slot="editor"
                        class="notice-editor"
                        method="post"
                        action="/admin/content"
                        use:ajaxSave
                        on:saved={() => (baseline = draft)}
                    >
                        <input type="hidden" name="action" value="saveBlock" />
                        <input type="hidden" name="sectionKey" value="Wichtig" />
                        <input type="hidden" name="redirectTo" value={redirectTo} />
                        <div class="notice-text">
                            {#key resetKey}
                                <RichText
                                    name="text"
                                    ariaLabel="Wichtiger Hinweis"
                                    value={baseline ?? important}
                                    on:init={(event) => {
                                        baseline = event.detail;
                                        draft = event.detail;
                                    }}
                                    on:change={(event) => (draft = event.detail)}
                                />
                            {/key}
                        </div>
                        <InlineEditorActions {dirty} onDiscard={discard} />
                    </form>
                </EditableBlock>
            </div>
        </div>
    </div>
{/if}

<style>
    .notice-text {
        font-size: 0.925rem;
        color: var(--color-sand-50);
    }

    .notice-text :global(strong) {
        color: white;
    }

    .notice-text :global(p) {
        margin-bottom: 0.5rem;
        overflow: visible;
    }

    .notice-text :global(p:last-child) {
        margin-bottom: 0;
    }

    .notice-editor {
        margin-top: 0.25rem;
    }

    /* Editorfeld auf grünem Grund: dunkel hinterlegen statt aufhellen, damit der helle Text lesbar bleibt. */
    .notice-editor :global(.rich-text) {
        border-bottom-color: rgba(243, 237, 224, 0.5);
    }

    .notice-editor :global(.rich-text:hover) {
        background-color: rgba(14, 31, 24, 0.12);
    }

    .notice-editor :global(.rich-text--focused),
    .notice-editor :global(.rich-text--focused:hover) {
        background-color: rgba(14, 31, 24, 0.25);
        border-bottom-color: var(--color-sand-100);
    }

    /* Direkt unter dem festen Header ist über dem Feld kein Platz: Werkzeugleiste unterhalb öffnen. */
    .notice-editor :global(.rich-text__toolbar) {
        bottom: auto;
        top: calc(100% + 0.25rem);
    }

    /* Platz für die Werkzeugleiste freihalten, damit sie Übernehmen/Verwerfen nicht überdeckt. */
    .notice-editor :global(.inline-icon-actions) {
        margin-top: 2.75rem;
    }
</style>
