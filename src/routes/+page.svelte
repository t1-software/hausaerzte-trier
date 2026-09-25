<script lang="ts">
    import type { PageData } from "./$types";
    import EditableBlock from "../components/EditableBlock.svelte";
    import EditableText from "../components/EditableText.svelte";
    import NewsSection from "../components/NewsSection.svelte";
    import LocationMap from "../components/LocationMap.svelte";
    import FloatingPhoneButton from "../components/FloatingPhoneButton.svelte";
    import { browser } from "$app/environment";
    import { editMode } from "$lib/edit-mode";
    import { isSectionHidden, textOf } from "$lib/content";

    export let data: PageData;
    const redirectTo = "/";

    $: content = data.content;
    $: news = content["Neuigkeiten"] || [];
    $: suggestionEntries = content["Vertretungen"] || [];
    $: welcome = textOf(content, "Willkommen");
    $: busDirections = textOf(content, "AnfahrtBus");
    $: carDirections = textOf(content, "AnfahrtAuto");
    $: isEditor = data.isEditor && (browser ? $editMode : data.editMode);
    $: bannerHidden = isSectionHidden(content, "Impfbanner");
    $: welcomeHidden = isSectionHidden(content, "Willkommen");
    $: newsHidden = isSectionHidden(content, "Neuigkeiten");
    $: busHidden = isSectionHidden(content, "AnfahrtBus");
    $: carHidden = isSectionHidden(content, "AnfahrtAuto");
</script>

{#if isEditor || !bannerHidden}
    <!-- Kampagnenbanner: nur ein Bild, kein Text zu bearbeiten — der Bereich dient allein
         dem Ein- und Ausblenden über das Auge. -->
    <div class="mt-12">
        <EditableBlock {isEditor} sectionKey="Impfbanner" hidden={bannerHidden} {redirectTo}>
            <img
                slot="editor"
                class="campaign-banner"
                src="/impfbanner.jpg"
                alt="Beim Impfen haben Praxen Praxis. Impfen beim Profi."
                width="1600"
                height="382"
            />
            <img
                class="campaign-banner"
                src="/impfbanner.jpg"
                alt="Beim Impfen haben Praxen Praxis. Impfen beim Profi."
                width="1600"
                height="382"
            />
        </EditableBlock>
    </div>
{/if}

<div class="mt-12 flex flex-col gap-10 lg:flex-row lg:gap-14">
    <div class="min-w-0 flex-1">
        {#if isEditor || !welcomeHidden}
            <p class="eyebrow">Herzlich Willkommen</p>
            <h2 class="mt-1 !text-3xl">Ihre Gesundheit steht bei uns im Mittelpunkt</h2>

            <div class="welcome-text mt-6 max-w-prose">
                <EditableText
                    sectionKey="Willkommen"
                    ariaLabel="Begrüßung"
                    text={welcome}
                    hidden={welcomeHidden}
                    {isEditor}
                    {redirectTo}
                />
                <p class="welcome-signature" aria-hidden="true">Thiemo Stiemert</p>
            </div>
        {/if}

        <LocationMap {isEditor} {redirectTo} busText={busDirections} carText={carDirections} {busHidden} {carHidden} />
    </div>

    {#if isEditor || !newsHidden}
        <!-- Ohne diese Bedingung bliebe die Spalte als leere Fläche stehen, sobald
             die Neuigkeiten (auch zeitgesteuert) verschwinden. -->
        <div class="order-first w-full shrink-0 lg:order-none lg:w-[calc((100%-1rem)/3)]">
            <NewsSection {news} {isEditor} {redirectTo} {suggestionEntries} hidden={newsHidden} variant="card" />
        </div>
    {/if}
</div>

<FloatingPhoneButton />

<style>
    .campaign-banner {
        display: block;
        width: 100%;
        height: auto;
        border-radius: 1rem;
    }

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
