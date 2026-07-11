<script lang="ts">
    import type { LayoutData } from "./$types";
    import EditableBlock from "../components/EditableBlock.svelte";
    import Footer from "../components/Footer.svelte";
    import Header from "../components/Header.svelte";
    import { page } from "$app/stores";
    import { marked } from "marked";

    export let data: LayoutData;

    $: content = data.content;
    $: isEditor = data.isEditor;
    $: important = content["Wichtig"]?.[0]?.[0]?.replaceAll("\r", "") || "";
    $: isAdmin = $page.route.id?.startsWith("/admin") ?? false;
    $: redirectTo = $page.url.pathname + $page.url.search + $page.url.hash;

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
            {#if isEditor}
                <div
                    class="fixed right-4 top-14 z-50 rounded border border-gulfstream-300 bg-white px-3 py-2 text-sm shadow-lg"
                >
                    <span class="font-bold text-gulfstream-800">Bearbeitungsmodus</span>
                </div>
            {/if}
            <div
                class="absolute -z-10 bg-cover bg-no-repeat opacity-80 w-full lg:h-[500px] md:h-[400px] h-[300px]"
                style="background-image: url('/{headerImage}'); background-position: {headerPosition};"
            >
                <div class="w-full h-full max-w-7xl relative mx-auto">
                    <div
                        class="absolute right-0 bottom-0 mb-4 mr-4 bg-gulfstream-400 opacity-90 py-2 px-4 lg:text-3xl md:text-2xl text-2xl text-left"
                    >
                        Hausarztpraxis in Trier<br />
                        Thiemo Stiemert
                    </div>
                </div>
            </div>
        </div>
        <div class="lg:mt-[500px] md:mt-[400px] mt-[300px] bg-gradient-to-r from-gulfstream-400 to-gulfstream-500 h-1"
        ></div>
        {#if isEditor || important.length > 0}
            <EditableBlock {isEditor} label="Wichtig bearbeiten">
                {#if important.length > 0}
                    <div class="bg-gulfstream-100 w-full py-4 flex align-center justify-center text-center font-bold">
                        <div class="important-content">
                            {@html marked(important)}
                        </div>
                    </div>
                {:else if isEditor}
                    <div class="bg-gulfstream-100 w-full py-4 text-center text-sm font-bold text-gulfstream-700">
                        Wichtig
                    </div>
                {/if}
                <form
                    slot="editor"
                    let:close
                    class="bg-gulfstream-100 w-full p-4 text-center font-bold"
                    method="post"
                    action="/admin/content"
                >
                    <input type="hidden" name="action" value="saveBlock" />
                    <input type="hidden" name="sectionKey" value="Wichtig" />
                    <input type="hidden" name="redirectTo" value={redirectTo} />
                    <label class="mx-auto flex max-w-4xl flex-col gap-2 text-left text-sm text-gulfstream-900">
                        Wichtig
                        <textarea class="inline-editor-textarea" name="text">{important}</textarea>
                    </label>
                    <div class="inline-editor-actions mx-auto max-w-4xl justify-center">
                        <button class="inline-editor-apply" type="submit">Übernehmen</button>
                        <button class="inline-editor-discard" type="button" on:click={close}>Verwerfen</button>
                    </div>
                </form>
            </EditableBlock>
        {/if}
        <div class="w-full max-w-7xl mx-auto p-4 mt-8 mb-8">
            <slot />
        </div>
    </div>
    <Footer {isEditor} />
{/if}

<style lang="scss" global>
    @import "../app.css";

    .important-content :global(p) {
        margin: 0;
        overflow: visible;
    }
</style>
