<script lang="ts">
    import type { LayoutData } from "./$types";
    import EditableBlock from "../components/EditableBlock.svelte";
    import InlineEditorActions from "../components/InlineEditorActions.svelte";
    import Footer from "../components/Footer.svelte";
    import Header from "../components/Header.svelte";
    import { page } from "$app/stores";
    import { marked } from "marked";
    import RichText from "../components/RichText.svelte";
    import EditableText from "../components/EditableText.svelte";
    import { editMode } from "$lib/edit-mode";
    import { textOf } from "$lib/content";

    export let data: LayoutData;

    $: content = data.content;
    $: isAuthenticated = data.isEditor;
    $: isEditor = isAuthenticated && $editMode;
    $: important = content["Wichtig"]?.[0]?.[0]?.replaceAll("\r", "") || "";
    $: headerText = textOf(content, "Titelbild");
    $: isAdmin = $page.route.id?.startsWith("/admin") ?? false;
    $: redirectTo = $page.url.pathname + $page.url.search + $page.url.hash;

    let importantBaseline: string | null = null;
    let importantDraft = "";
    let importantResetKey = 0;

    $: importantDirty = importantBaseline !== null && importantDraft !== importantBaseline;

    function discardImportant() {
        importantDraft = importantBaseline ?? "";
        importantResetKey += 1;
    }

    let headerImage: string;
    let headerPosition: string;

    $: ({ headerImage, headerPosition } = getHeaderImage($page.route.id));

    function getHeaderImage(routeId: string | null): { headerImage: string; headerPosition: string } {
        if (routeId === "/team") {
            return { headerImage: "praxis3.jpeg", headerPosition: "0% 30%" };
        } else if (routeId === "/leistungsspektrum") {
            return { headerImage: "praxis1.jpeg", headerPosition: "center" };
        }
        return { headerImage: "praxis2.jpeg", headerPosition: "center" };
    }
</script>

{#if isAdmin}
    <slot />
{:else}
    <div class="flex flex-col min-h-screen">
        <div class="flex flex-col">
            <Header {content} />
            {#if isAuthenticated}
                <div
                    class="fixed right-4 top-14 z-50 flex items-center gap-3 rounded border border-gulfstream-300 bg-white px-3 py-2 text-sm shadow-lg"
                >
                    <span class="font-bold text-gulfstream-800">Admin</span>
                    <div class="admin-toggle" role="group" aria-label="Darstellung wählen">
                        <button
                            class="admin-toggle__option"
                            class:admin-toggle__option--active={!$editMode}
                            type="button"
                            aria-pressed={!$editMode}
                            on:click={() => ($editMode = false)}
                        >
                            Ansicht
                        </button>
                        <button
                            class="admin-toggle__option"
                            class:admin-toggle__option--active={$editMode}
                            type="button"
                            aria-pressed={$editMode}
                            on:click={() => ($editMode = true)}
                        >
                            Bearbeiten
                        </button>
                    </div>
                </div>
            {/if}
            <div
                class="absolute -z-10 bg-cover bg-no-repeat opacity-80 w-full lg:h-[500px] md:h-[400px] h-[300px]"
                style="background-image: url('/{headerImage}'); background-position: {headerPosition};"
            >
                <div class="w-full h-full max-w-7xl relative mx-auto">
                    <div
                        class="header-caption absolute right-0 bottom-0 mb-4 mr-4 bg-gulfstream-400 opacity-90 py-2 px-4 lg:text-3xl md:text-2xl text-2xl text-left"
                    >
                        <EditableText
                            sectionKey="Titelbild"
                            ariaLabel="Text im Titelbild"
                            text={headerText}
                            {isEditor}
                            {redirectTo}
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="lg:mt-[500px] md:mt-[400px] mt-[300px] bg-gradient-to-r from-gulfstream-400 to-gulfstream-500 h-1"
        ></div>
        {#if isEditor || important.length > 0}
            <EditableBlock {isEditor}>
                {#if important.length > 0}
                    <div class="bg-gulfstream-100 w-full py-4 flex align-center justify-center text-center font-bold">
                        <div class="important-content">
                            {@html marked(important)}
                        </div>
                    </div>
                {/if}
                <form
                    slot="editor"
                    class="bg-gulfstream-100 w-full py-4 text-center font-bold"
                    method="post"
                    action="/admin/content"
                >
                    <input type="hidden" name="action" value="saveBlock" />
                    <input type="hidden" name="sectionKey" value="Wichtig" />
                    <input type="hidden" name="redirectTo" value={redirectTo} />
                    <div class="mx-auto max-w-4xl px-4">
                        <div class="important-content">
                            {#key importantResetKey}
                                <RichText
                                    allowBold={false}
                                    name="text"
                                    ariaLabel="Wichtig"
                                    value={importantBaseline ?? important}
                                    on:init={(event) => {
                                        importantBaseline = event.detail;
                                        importantDraft = event.detail;
                                    }}
                                    on:change={(event) => (importantDraft = event.detail)}
                                />
                            {/key}
                        </div>
                        <InlineEditorActions align="center" dirty={importantDirty} onDiscard={discardImportant} />
                    </div>
                </form>
            </EditableBlock>
        {/if}
        <div class="w-full max-w-7xl mx-auto p-4 mt-8 mb-8">
            <slot />
        </div>
    </div>
    <Footer {isAuthenticated} />
{/if}

<style lang="scss" global>
    @import "../app.css";

    .admin-toggle {
        display: inline-flex;
        overflow: hidden;
        border: 1px solid var(--color-gulfstream-300);
        border-radius: 0.25rem;
    }

    .admin-toggle__option {
        padding: 0.15rem 0.5rem;
        background: white;
        color: var(--color-gulfstream-700);
        font-size: 0.8rem;
        font-weight: 700;
    }

    .admin-toggle__option:hover {
        background: var(--color-gulfstream-100);
    }

    .admin-toggle__option--active,
    .admin-toggle__option--active:hover {
        background: var(--color-gulfstream-700);
        color: white;
    }

    .header-caption :global(p) {
        margin: 0;
    }

    .important-content :global(p) {
        margin: 0;
        overflow: visible;
    }
</style>
