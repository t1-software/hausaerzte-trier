<script lang="ts">
    import "@fontsource-variable/source-serif-4";
    import "@fontsource-variable/source-sans-3";
    import "@fontsource-variable/caveat";
    // Die beiden Schriften über der Falz werden vorgeladen (?url liefert den gehashten Pfad).
    // Ohne das lädt der Browser sie erst nach dem Stylesheet und der Text springt beim Wechsel
    // von der Ersatzschrift auf die richtige um.
    import sansUrl from "@fontsource-variable/source-sans-3/files/source-sans-3-latin-wght-normal.woff2?url";
    import serifUrl from "@fontsource-variable/source-serif-4/files/source-serif-4-latin-wght-normal.woff2?url";
    import type { LayoutData } from "./$types";
    import Footer from "../components/Footer.svelte";
    import Header from "../components/Header.svelte";
    import NoticeBanner from "../components/NoticeBanner.svelte";
    import QuickInfoBand from "../components/QuickInfoBand.svelte";
    import { browser } from "$app/environment";
    import { page } from "$app/stores";
    import { marked } from "marked";
    import { editMode } from "$lib/edit-mode";
    import { isSectionHidden, textOf } from "$lib/content";

    export let data: LayoutData;

    $: content = data.content;
    $: isAuthenticated = data.isEditor;
    // Beim Rendern auf dem Server zählt der Cookie-Wert aus den Layout-Daten,
    // im Browser der Store — beide starten gleich, deshalb kein Flackern.
    $: editing = browser ? $editMode : data.editMode;
    $: isEditor = isAuthenticated && editing;
    $: heroText = textOf(content, "Titelbild");
    $: isAdmin = $page.route.id?.startsWith("/admin") ?? false;
    $: redirectTo = $page.url.pathname + $page.url.search + $page.url.hash;

    $: hero = getHero($page.route.id);

    function getHero(routeId: string | null): {
        image: string;
        position: string;
        eyebrow: string;
        title: string;
        home: boolean;
    } {
        if (routeId === "/impressum" || routeId === "/datenschutz") {
            return {
                image: "praxis2.jpeg",
                position: "center",
                eyebrow: "Hausarztpraxis Thiemo Stiemert",
                title: routeId === "/impressum" ? "Impressum" : "Datenschutz",
                home: false,
            };
        }

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

<svelte:head>
    <link rel="preload" as="font" type="font/woff2" href={sansUrl} crossorigin="anonymous" />
    <link rel="preload" as="font" type="font/woff2" href={serifUrl} crossorigin="anonymous" />
</svelte:head>

{#if isAdmin}
    <slot />
{:else}
    <div class="flex min-h-screen flex-col">
        <Header {isAuthenticated} {editing} />

        <div class="sticky top-14 z-30 mt-14">
            <NoticeBanner {content} {isEditor} {redirectTo} />
        </div>
        <section class="hero relative w-full" class:hero--slim={!hero.home}>
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
                    <h1 class="hero-title mt-1">
                        {@html marked(heroText)}
                    </h1>
                {:else}
                    <h1 class="hero-title mt-1">{hero.title}</h1>
                {/if}
            </div>
        </section>

        {#if hero.home}
            <QuickInfoBand
                times={content["Sprechzeiten"] || []}
                appointmentText={textOf(content, "Termine")}
                timesHidden={isSectionHidden(content, "Sprechzeiten")}
                appointmentHidden={isSectionHidden(content, "Termine")}
                {isEditor}
                {redirectTo}
            />
        {/if}
        <main class="mx-auto w-full max-w-7xl grow px-4 pb-16">
            <slot />
        </main>
    </div>
    <Footer {isAuthenticated} />
{/if}

<style lang="scss" global>
    @import "../app.css";

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
            height: 220px;
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

    @media (max-width: 420px) {
        .hero-title {
            font-size: 1.7rem;
        }
    }
</style>
