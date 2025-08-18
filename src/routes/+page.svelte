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
</script>

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
