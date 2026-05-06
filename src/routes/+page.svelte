<script lang="ts">
    import type { PageData } from "./$types";
    import NewsSection from "../components/NewsSection.svelte";
    import OpeningHours from "../components/OpeningHours.svelte";
    import VacationSection from "../components/VacationSection.svelte";
    import LocationMap from "../components/LocationMap.svelte";
    import ContactSection from "../components/ContactSection.svelte";
    import FloatingPhoneButton from "../components/FloatingPhoneButton.svelte";

    export let data: PageData;

    $: content = data.content;
    $: news = content["Neuigkeiten"] || [];
    $: vacations = content["Urlaub"] || [];
    $: times = content["Sprechzeiten"] || [];
    $: notice = content["Hinweis"] || [];
</script>

{#if notice && notice.length > 0}
    <!-- Important Information Callout -->
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
                    {#each notice as item}
                        <p class="mb-2 last:mb-0">
                            {@html item}
                        </p>
                    {/each}
                </div>
            </div>
        </div>
    </div>
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

        <NewsSection {news} />

        <LocationMap isMobile={false} />
    </div>

    <div class="grow min-w-[350px]">
        <VacationSection {vacations} />

        <OpeningHours {times} />

        <ContactSection />
        <LocationMap isMobile={true} />
    </div>
</div>

<FloatingPhoneButton />
