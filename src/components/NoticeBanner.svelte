<script lang="ts">
    import EditableBlock from "./EditableBlock.svelte";
    import InlineEditorActions from "./InlineEditorActions.svelte";
    import RichText from "./RichText.svelte";
    import { ajaxSave } from "$lib/ajax-save";
    import { marked } from "marked";

    /** The one notice banner, shown on every page. Content comes from the "Wichtig" section. */
    export let content: Record<string, string[][]> = {};
    export let isEditor = false;
    export let redirectTo = "/";

    $: important = content["Wichtig"]?.[0]?.[0]?.replaceAll("\r", "") || "";

    let baseline: string | null = null;
    let draft = "";
    let resetKey = 0;

    $: dirty = baseline !== null && draft !== baseline;

    function discard() {
        draft = baseline ?? "";
        resetKey += 1;
    }
</script>

{#if isEditor || important.length > 0}
    <div class="mx-auto w-full max-w-7xl px-4">
        <div class="notice-banner mt-6 rounded-xl border border-copper-500/30 bg-sand-100 p-4">
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-copper-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path
                            fill-rule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </div>
                <div class="ml-3 w-full">
                    <h2 class="notice-heading">Wichtiger Hinweis</h2>
                    <EditableBlock {isEditor}>
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
    </div>
{/if}

<style>
    .notice-heading {
        font-family: var(--font-sans);
        font-size: 0.875rem;
        font-weight: 700;
        color: var(--color-copper-700);
        margin-bottom: 0.25rem;
    }

    .notice-text {
        font-size: 0.925rem;
        color: var(--color-sand-900);
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
</style>
