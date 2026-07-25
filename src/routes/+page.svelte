<script lang="ts">
    import type { PageData } from "./$types";
    import EditableText from "../components/EditableText.svelte";
    import NewsSection from "../components/NewsSection.svelte";
    import VacationSection from "../components/VacationSection.svelte";
    import LocationMap from "../components/LocationMap.svelte";
    import ContactSection from "../components/ContactSection.svelte";
    import FloatingPhoneButton from "../components/FloatingPhoneButton.svelte";
    import { editMode } from "$lib/edit-mode";
    import { textOf } from "$lib/content";

    export let data: PageData;
    const redirectTo = "/";

    $: content = data.content;
    $: news = content["Neuigkeiten"] || [];
    $: vacations = content["Urlaub"] || [];
    $: suggestionEntries = content["Vertretungen"] || [];
    $: welcome = textOf(content, "Willkommen");
    $: busDirections = textOf(content, "AnfahrtBus");
    $: carDirections = textOf(content, "AnfahrtAuto");
    $: appointments = textOf(content, "Termine");
    $: isEditor = data.isEditor && $editMode;
</script>

<div class="mt-12 flex flex-col gap-10 lg:flex-row lg:gap-14">
    <div class="min-w-0 flex-1">
        <p class="eyebrow">Herzlich Willkommen</p>
        <h2 class="mt-1 !text-3xl">Ihre Gesundheit steht bei uns im Mittelpunkt</h2>

        <div class="welcome-text mt-6 max-w-prose">
            <EditableText sectionKey="Willkommen" ariaLabel="Begrüßung" text={welcome} {isEditor} {redirectTo} />
        </div>

        <NewsSection {news} {isEditor} {redirectTo} {suggestionEntries} />
    </div>

    <div class="w-full shrink-0 lg:w-[380px]">
        <VacationSection {vacations} {isEditor} {redirectTo} />

        <ContactSection {isEditor} {redirectTo} appointmentText={appointments} />

        <LocationMap {isEditor} {redirectTo} busText={busDirections} carText={carDirections} />
    </div>
</div>

<FloatingPhoneButton />
