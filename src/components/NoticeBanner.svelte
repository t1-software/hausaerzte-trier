<script lang="ts">
    import EditableBlock from "./EditableBlock.svelte";
    import InlineEditorActions from "./InlineEditorActions.svelte";
    import RichText from "./RichText.svelte";
    import { marked } from "marked";

    /**
     * The one notice banner, shown on every page. Renders the "Wichtig" and
     * "Hinweis" sections together so both stay visible and editable in one place.
     */
    export let content: Record<string, string[][]> = {};
    export let isEditor = false;
    export let redirectTo = "/";

    $: important = content["Wichtig"]?.[0]?.[0]?.replaceAll("\r", "") || "";
    $: notice = content["Hinweis"]?.[0]?.[0]?.replaceAll("\r", "") || "";

    const sections = [
        { key: "Wichtig", label: "Wichtig" },
        { key: "Hinweis", label: "Hinweis" },
    ];

    let baselines: Record<string, string | null> = { Wichtig: null, Hinweis: null };
    let drafts: Record<string, string> = { Wichtig: "", Hinweis: "" };
    let resetKeys: Record<string, number> = { Wichtig: 0, Hinweis: 0 };

    function textFor(key: string): string {
        return key === "Wichtig" ? important : notice;
    }

    function discard(key: string) {
        drafts[key] = baselines[key] ?? "";
        resetKeys[key] += 1;
    }
</script>

{#if isEditor || important.length > 0 || notice.length > 0}
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
                    {#each sections as section (section.key)}
                        {#if isEditor || textFor(section.key).length > 0}
                            <EditableBlock {isEditor}>
                                <div class="notice-text">
                                    {@html marked(textFor(section.key))}
                                </div>
                                <form slot="editor" class="notice-editor" method="post" action="/admin/content">
                                    <input type="hidden" name="action" value="saveBlock" />
                                    <input type="hidden" name="sectionKey" value={section.key} />
                                    <input type="hidden" name="redirectTo" value={redirectTo} />
                                    <span class="notice-editor-label">{section.label}</span>
                                    <div class="notice-text">
                                        {#key resetKeys[section.key]}
                                            <RichText
                                                name="text"
                                                ariaLabel={section.label}
                                                value={baselines[section.key] ?? textFor(section.key)}
                                                on:init={(event) => {
                                                    baselines[section.key] = event.detail;
                                                    drafts[section.key] = event.detail;
                                                }}
                                                on:change={(event) => (drafts[section.key] = event.detail)}
                                            />
                                        {/key}
                                    </div>
                                    <InlineEditorActions
                                        dirty={baselines[section.key] !== null &&
                                            drafts[section.key] !== baselines[section.key]}
                                        onDiscard={() => discard(section.key)}
                                    />
                                </form>
                            </EditableBlock>
                        {/if}
                    {/each}
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
        margin-top: 0.5rem;
    }

    .notice-editor-label {
        display: block;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--color-pine-600);
        margin-bottom: 0.25rem;
    }
</style>
