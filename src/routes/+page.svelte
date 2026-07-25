<script lang="ts">
    import type { PageData } from "./$types";
    import EditableBlock from "../components/EditableBlock.svelte";
    import NewsSection from "../components/NewsSection.svelte";
    import OpeningHours from "../components/OpeningHours.svelte";
    import VacationSection from "../components/VacationSection.svelte";
    import LocationMap from "../components/LocationMap.svelte";
    import ContactSection from "../components/ContactSection.svelte";
    import FloatingPhoneButton from "../components/FloatingPhoneButton.svelte";
    import { marked } from "marked";
    import InlineEditorActions from "../components/InlineEditorActions.svelte";
    import RichText from "../components/RichText.svelte";
    import EditableText from "../components/EditableText.svelte";
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
    $: times = content["Sprechzeiten"] || [];
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
        <div class="bg-yellow-100 border-l-4 border-yellow-500 p-4 mx-4 md:mx-16 mb-8 rounded-md shadow-sm">
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fill-rule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </div>
                <div class="ml-3">
                    <h3 class="text-sm font-medium text-yellow-800"> Wichtiger Hinweis </h3>
                    <div class="mt-2 text-sm text-yellow-700">
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
            class="bg-yellow-100 border-l-4 border-yellow-500 p-4 mx-4 md:mx-16 mb-8 rounded-md shadow-sm"
            method="post"
            action="/admin/content"
        >
            <input type="hidden" name="action" value="saveBlock" />
            <input type="hidden" name="sectionKey" value="Hinweis" />
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fill-rule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </div>
                <div class="ml-3 w-full">
                    <h3 class="text-sm font-medium text-yellow-800">Wichtiger Hinweis</h3>
                    <div class="mt-2 text-sm text-yellow-700">
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

<div class="flex md:flex-row flex-col gap-8 md:px-16">
    <div class="w-full lg:w-2/3">
        <h1>Herzlich Willkommen</h1>

        <div class="pt-6 text-justify w-full lg:w-[80%]">
            <EditableText sectionKey="Willkommen" text={welcome} {isEditor} {redirectTo} />
        </div>

        <div class="pt-6"></div>

        <NewsSection {news} {isEditor} {redirectTo} {suggestionEntries} />

        <LocationMap isMobile={false} {isEditor} {redirectTo} busText={busDirections} carText={carDirections} />
    </div>

    <div class="grow min-w-[350px]">
        <VacationSection {vacations} {isEditor} {redirectTo} />

        <OpeningHours {times} {isEditor} {redirectTo} />

        <ContactSection {isEditor} {redirectTo} appointmentText={appointments} />
        <LocationMap isMobile={true} {isEditor} {redirectTo} busText={busDirections} carText={carDirections} />
    </div>
</div>

<FloatingPhoneButton />
