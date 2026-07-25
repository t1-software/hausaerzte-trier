<script lang="ts">
    import type { LayoutData } from "./$types";
    import EditableBlock from "../components/EditableBlock.svelte";
    import EditableText from "../components/EditableText.svelte";
    import InlineEditorActions from "../components/InlineEditorActions.svelte";
    import RichText from "../components/RichText.svelte";
    import Footer from "../components/Footer.svelte";
    import Header from "../components/Header.svelte";
    import QuickInfoBand from "../components/QuickInfoBand.svelte";
    import { page } from "$app/stores";
    import { marked } from "marked";
    import { editMode } from "$lib/edit-mode";
    import { textOf } from "$lib/content";

    export let data: LayoutData;

    $: content = data.content;
    $: isAuthenticated = data.isEditor;
    $: isEditor = isAuthenticated && $editMode;
    $: important = content["Wichtig"]?.[0]?.[0]?.replaceAll("\r", "") || "";
    $: heroText = textOf(content, "Titelbild");
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

    $: hero = getHero($page.route.id);

    function getHero(routeId: string | null): {
        image: string;
        position: string;
        eyebrow: string;
        title: string;
        home: boolean;
    } {
        if (routeId === "/team") {
            return {
                image: "praxis3.jpeg",
                position: "0% 30%",
                eyebrow: "Hausarztpraxis Thiemo Stiemert",
                title: "Über uns",
                home: false,
            };
        } else if (routeId === "/leistungsspektrum") {
            return {
                image: "praxis1.jpeg",
                position: "center",
                eyebrow: "Hausarztpraxis Thiemo Stiemert",
                title: "Leistungsspektrum",
                home: false,
            };
        }
        return {
            image: "praxis2.jpeg",
            position: "center",
            eyebrow: "Hausärztliche Versorgung in Trier",
            title: "Hausarztpraxis Thiemo Stiemert",
            home: routeId === "/",
        };
    }
</script>

{#if isAdmin}
    <slot />
{:else}
    <div class="flex min-h-screen flex-col">
        <Header {content} />
        {#if isAuthenticated}
            <div
                class="fixed right-4 top-16 z-50 flex items-center gap-3 rounded border border-pine-300 bg-white px-3 py-2 text-sm shadow-lg"
            >
                <span class="font-bold text-pine-800">Admin</span>
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

        <section class="hero relative mt-14 w-full" class:hero--slim={!hero.home}>
            <img
                src="/{hero.image}"
                alt="Praxisräume der Hausarztpraxis"
                class="absolute inset-0 h-full w-full object-cover"
                style="object-position: {hero.position};"
            />
            <div class="hero-overlay absolute inset-0"></div>
            <div
                class="relative mx-auto flex h-full w-full max-w-7xl flex-col justify-end px-4 {hero.home
                    ? 'pb-20 md:pb-24'
                    : 'pb-10 md:pb-14'}"
            >
                <p class="eyebrow !text-sand-200">{hero.eyebrow}</p>
                {#if hero.home}
                    <div class="hero-title mt-1" role="heading" aria-level="1">
                        <EditableText
                            sectionKey="Titelbild"
                            ariaLabel="Text im Titelbild"
                            text={heroText}
                            {isEditor}
                            {redirectTo}
                        />
                    </div>
                {:else}
                    <h1 class="hero-title mt-1">{hero.title}</h1>
                {/if}
            </div>
        </section>

        {#if hero.home}
            <QuickInfoBand times={content["Sprechzeiten"] || []} {isEditor} {redirectTo} />
        {/if}

        {#if isEditor || important.length > 0}
            <EditableBlock {isEditor}>
                {#if important.length > 0}
                    <div class="w-full bg-pine-100 py-4 text-center font-bold text-pine-900">
                        <div class="important-content mx-auto max-w-4xl px-4">
                            {@html marked(important)}
                        </div>
                    </div>
                {/if}
                <form
                    slot="editor"
                    class="w-full bg-pine-100 py-4 text-center font-bold text-pine-900"
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
        <main class="mx-auto w-full max-w-7xl grow px-4 pb-16">
            <slot />
        </main>
    </div>
    <Footer {isAuthenticated} />
{/if}

<style lang="scss" global>
    @import "../app.css";

    .admin-toggle {
        display: inline-flex;
        overflow: hidden;
        border: 1px solid var(--color-pine-300);
        border-radius: 0.25rem;
    }

    .admin-toggle__option {
        padding: 0.15rem 0.5rem;
        background: white;
        color: var(--color-pine-700);
        font-size: 0.8rem;
        font-weight: 700;
    }

    .admin-toggle__option:hover {
        background: var(--color-pine-100);
    }

    .admin-toggle__option--active,
    .admin-toggle__option--active:hover {
        background: var(--color-pine-700);
        color: white;
    }

    .important-content :global(p) {
        margin: 0;
        overflow: visible;
    }

    .hero {
        height: 440px;
    }

    .hero--slim {
        height: 300px;
    }

    @media (max-width: 767px) {
        .hero {
            height: 340px;
        }

        .hero--slim {
            height: 240px;
        }
    }

    .hero-overlay {
        background:
            linear-gradient(to top, rgb(14 31 24 / 0.82) 0%, rgb(14 31 24 / 0.35) 45%, rgb(14 31 24 / 0.08) 75%),
            linear-gradient(to right, rgb(14 31 24 / 0.25), transparent 60%);
    }

    .hero-title {
        color: white;
        font-family: var(--font-display);
        font-size: 2.5rem;
        line-height: 1.15;
        font-weight: 650;
        letter-spacing: -0.01em;
        max-width: 40rem;
        text-wrap: balance;
    }

    .hero-title :global(p) {
        margin: 0;
        overflow: visible;
    }

    @media (min-width: 768px) {
        .hero-title {
            font-size: 3.25rem;
        }
    }
</style>
