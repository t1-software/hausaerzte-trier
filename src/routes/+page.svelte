<script lang="ts">
    import type { PageData } from "./$types";
    import EditableBlock from "../components/EditableBlock.svelte";
    import NewsSection from "../components/NewsSection.svelte";
    import OpeningHours from "../components/OpeningHours.svelte";
    import VacationSection from "../components/VacationSection.svelte";
    import LocationMap from "../components/LocationMap.svelte";
    import ContactSection from "../components/ContactSection.svelte";
    import FloatingPhoneButton from "../components/FloatingPhoneButton.svelte";
    import HomepagePopup from "../components/HomepagePopup.svelte";
    import { marked } from "marked";

    export let data: PageData;
    const redirectTo = "/";

    $: content = data.content;
    $: news = content["Neuigkeiten"] || [];
    $: vacations = content["Urlaub"] || [];
    $: times = content["Sprechzeiten"] || [];
    $: notice = content["Hinweis"] || [];
    $: isEditor = data.isEditor;
</script>

{#if isEditor || (notice && notice.length > 0)}
    <!-- Important Information Callout -->
    <EditableBlock {isEditor} label="Hinweis bearbeiten">
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
                        {#if notice && notice.length > 0}
                            {#each notice as item, index (item.join("|") + "|" + index)}
                                <p class="mb-2 last:mb-0">
                                    {@html marked(item[0] ?? "")}
                                </p>
                            {/each}
                        {:else}
                            <p class="mb-0">Hinweis</p>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
        <form
            slot="editor"
            let:close
            class="bg-yellow-100 border-l-4 border-yellow-500 p-4 mx-4 md:mx-16 mb-8 rounded-md shadow-sm"
            method="post"
            action="/admin/content"
        >
            <input type="hidden" name="action" value="saveBlock" />
            <input type="hidden" name="sectionKey" value="Hinweis" />
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <label class="flex flex-col gap-2 text-sm font-bold text-yellow-900">
                Hinweis
                <textarea class="inline-editor-textarea rounded border-yellow-300 text-yellow-950" name="text"
                    >{notice[0]?.[0] ?? ""}</textarea
                >
            </label>
            <div class="inline-editor-actions">
                <button class="inline-editor-apply" type="submit">Übernehmen</button>
                <button class="inline-editor-discard" type="button" on:click={close}>Verwerfen</button>
            </div>
        </form>
    </EditableBlock>
{/if}

<div class="flex md:flex-row flex-col gap-8 md:px-16">
    <div class="w-full lg:w-2/3">
        <h1>Herzlich Willkommen</h1>

        <div class="pt-6 text-justify w-full lg:w-[80%]">
            Herzlich Willkommen in unserer Hausärztlichen Praxis.<br /><br />
            Auf den folgenden Seiten möchten wir uns bei Ihnen vorstellen. Sie erhalten Auskünfte zum Leistungsspektrum sowie
            zur Diagnostik der hausärztlichen Praxis.<br /><br />
            Wir freuen uns auf Ihren Besuch in unserer modern ausgestatteten hausärztlichen Praxis. Unabhängig von der Behandlung
            versuchen wir unsere Patienten umfassend zu informieren, denn nur gut informierte Patienten sind in der Lage
            richtige Entscheidungen zu treffen.<br /><br />
            Ihre Gesundheit steht bei uns im Mittelpunkt.<br /><br />
            Uns ist es ein großes Anliegen, dass Sie sich in unserer hausärztlichen Praxis wohl und gut aufgehoben fühlen.
            Für Rückmeldungen sind wir stets dankbar.<br /><br />
            Ihr Praxisteam
        </div>

        <div class="pt-6"></div>

        <NewsSection {news} {isEditor} {redirectTo} />

        <LocationMap isMobile={false} />
    </div>

    <div class="grow min-w-[350px]">
        <VacationSection {vacations} {isEditor} {redirectTo} />

        <OpeningHours {times} {isEditor} {redirectTo} />

        <ContactSection />
        <LocationMap isMobile={true} />
    </div>
</div>

<FloatingPhoneButton />
<HomepagePopup />
