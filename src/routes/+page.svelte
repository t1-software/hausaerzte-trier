<script lang="ts">
    import type { PageData } from "./$types";
    import EditableText from "../components/EditableText.svelte";
    import NewsSection from "../components/NewsSection.svelte";
    import LocationMap from "../components/LocationMap.svelte";
    import FloatingPhoneButton from "../components/FloatingPhoneButton.svelte";
    import { editMode } from "$lib/edit-mode";
    import { textOf } from "$lib/content";

    export let data: PageData;
    const redirectTo = "/";

    $: content = data.content;
    $: news = content["Neuigkeiten"] || [];
    $: suggestionEntries = content["Vertretungen"] || [];
    $: welcome = textOf(content, "Willkommen");
    $: busDirections = textOf(content, "AnfahrtBus");
    $: carDirections = textOf(content, "AnfahrtAuto");
    $: isEditor = data.isEditor && $editMode;
</script>

<div class="mt-12 flex flex-col gap-10 lg:flex-row lg:gap-14">
    <div class="min-w-0 flex-1">
        <p class="eyebrow">Herzlich Willkommen</p>
        <h2 class="mt-1 !text-3xl">Ihre Gesundheit steht bei uns im Mittelpunkt</h2>

        <div class="welcome-text mt-6 max-w-prose">
            <EditableText sectionKey="Willkommen" ariaLabel="Begrüßung" text={welcome} {isEditor} {redirectTo} />
            <p class="welcome-signature" aria-hidden="true">Thiemo Stiemert</p>
        </div>

        <LocationMap {isEditor} {redirectTo} busText={busDirections} carText={carDirections} />
    </div>

    <div class="order-first w-full shrink-0 lg:order-none lg:w-[380px]">
        <NewsSection {news} {isEditor} {redirectTo} {suggestionEntries} variant="card" />
    </div>
</div>

<FloatingPhoneButton />

<style>
    .welcome-signature {
        font-family: var(--font-hand);
        font-size: 2.1rem;
        line-height: 1;
        color: var(--color-pine-700);
        transform: rotate(-2deg);
        transform-origin: left center;
        margin-top: 0.5rem;
        overflow: visible;
    }
</style>
