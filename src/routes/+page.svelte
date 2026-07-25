<script lang="ts">
    import type { PageData } from "./$types";
    import EditableBlock from "../components/EditableBlock.svelte";
    import EditableText from "../components/EditableText.svelte";
    import InlineEditorActions from "../components/InlineEditorActions.svelte";
    import RichText from "../components/RichText.svelte";
    import NewsSection from "../components/NewsSection.svelte";
    import VacationSection from "../components/VacationSection.svelte";
    import LocationMap from "../components/LocationMap.svelte";
    import ContactSection from "../components/ContactSection.svelte";
    import FloatingPhoneButton from "../components/FloatingPhoneButton.svelte";
    import { marked } from "marked";
    import { editMode } from "$lib/edit-mode";
    import { textOf } from "$lib/content";

    export let data: PageData;
    const redirectTo = "/";

    let noticeBaseline: string | null = null;
    let noticeDraft = "";
    let noticeResetKey = 0;

    $: noticeDirty = noticeBaseline !== null && noticeDraft !== noticeBaseline;

    function discardNotice() {
        noticeDraft = noticeBaseline ?? "";
        noticeResetKey += 1;
    }

    $: content = data.content;
    $: news = content["Neuigkeiten"] || [];
    $: vacations = content["Urlaub"] || [];
    $: notice = content["Hinweis"] || [];
    $: suggestionEntries = content["Vertretungen"] || [];
    $: welcome = textOf(content, "Willkommen");
    $: busDirections = textOf(content, "AnfahrtBus");
    $: carDirections = textOf(content, "AnfahrtAuto");
    $: appointments = textOf(content, "Termine");
    $: isEditor = data.isEditor && $editMode;
</script>

{#if isEditor || (notice && notice.length > 0)}
    <!-- Important Information Callout -->
    <EditableBlock {isEditor}>
        <div
            class="notice-callout mt-8 rounded-xl border border-copper-500/30 border-l-4 border-l-copper-500 bg-sand-100 p-4"
        >
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-copper-500" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fill-rule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </div>
                <div class="ml-3">
                    <h3 class="text-sm font-bold text-copper-700"> Wichtiger Hinweis </h3>
                    <div class="mt-2 text-sm text-sand-900">
                        {#each notice as item, index (item.join("|") + "|" + index)}
                            <p class="mb-2 last:mb-0">
                                {@html marked(item[0] ?? "")}
                            </p>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
        <form
            slot="editor"
            class="notice-callout mt-8 rounded-xl border border-copper-500/30 border-l-4 border-l-copper-500 bg-sand-100 p-4"
            method="post"
            action="/admin/content"
        >
            <input type="hidden" name="action" value="saveBlock" />
            <input type="hidden" name="sectionKey" value="Hinweis" />
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-copper-500" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fill-rule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </div>
                <div class="ml-3 w-full">
                    <h3 class="text-sm font-bold text-copper-700">Wichtiger Hinweis</h3>
                    <div class="mt-2 text-sm text-sand-900">
                        {#key noticeResetKey}
                            <RichText
                                name="text"
                                ariaLabel="Hinweis"
                                value={noticeBaseline ?? notice[0]?.[0] ?? ""}
                                on:init={(event) => {
                                    noticeBaseline = event.detail;
                                    noticeDraft = event.detail;
                                }}
                                on:change={(event) => (noticeDraft = event.detail)}
                            />
                        {/key}
                    </div>
                    <InlineEditorActions dirty={noticeDirty} onDiscard={discardNotice} />
                </div>
            </div>
        </form>
    </EditableBlock>
{/if}

<div class="mt-12 flex flex-col gap-10 lg:flex-row lg:gap-14">
    <div class="min-w-0 flex-1">
        <p class="eyebrow">Herzlich Willkommen</p>
        <h2 class="mt-1 !text-3xl">Ihre Gesundheit steht bei uns im Mittelpunkt</h2>

        <div class="welcome-text mt-6 max-w-prose">
            <EditableText sectionKey="Willkommen" ariaLabel="Begrüßung" text={welcome} {isEditor} {redirectTo} />
        </div>

        <NewsSection {news} {isEditor} {redirectTo} {suggestionEntries} />

        <LocationMap {isEditor} {redirectTo} busText={busDirections} carText={carDirections} />
    </div>

    <div class="w-full shrink-0 lg:w-[380px]">
        <VacationSection {vacations} {isEditor} {redirectTo} />

        <ContactSection {isEditor} {redirectTo} appointmentText={appointments} />
    </div>
</div>

<FloatingPhoneButton />
