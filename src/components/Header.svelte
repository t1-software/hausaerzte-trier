<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { CONTACT_INFO } from "../constants/contact";

    export let content: Record<string, string[][]> = {};

    $: news = content["Neuigkeiten"] || [];
    $: routeId = $page.route.id;

    // Scroll spy: "Neuigkeiten" becomes active once its section crosses the upper
    // third of the viewport — or when the page is scrolled to the end and the
    // section is visible (short pages can't scroll it all the way to the top).
    let newsInView = false;
    const NAV_OFFSET = 80;

    function updateNewsInView() {
        const anchor = document.getElementById("neuigkeiten");
        const section = anchor?.closest(".news-section");

        if (!section) {
            newsInView = false;
            return;
        }

        const rect = section.getBoundingClientRect();
        const line = Math.max(NAV_OFFSET, window.innerHeight * 0.35);
        const atPageEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
        const visible = rect.top < window.innerHeight && rect.bottom > NAV_OFFSET;

        newsInView = (rect.top <= line && rect.bottom > NAV_OFFSET) || (atPageEnd && visible);
    }

    onMount(() => {
        const schedule = () => requestAnimationFrame(updateNewsInView);
        schedule();
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        window.addEventListener("hashchange", schedule);
        return () => {
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
            window.removeEventListener("hashchange", schedule);
        };
    });

    // Re-measure after client-side navigation (the section mounts with the new page).
    $: if (typeof window !== "undefined" && routeId) {
        requestAnimationFrame(updateNewsInView);
    }

    $: newsActive = routeId === "/" && newsInView;
</script>

<header class="fixed top-0 z-40 w-full bg-pine-900/95 shadow-md backdrop-blur-sm">
    <div class="mx-auto flex h-14 w-full max-w-7xl items-center justify-center gap-4 px-4 md:justify-between">
        <a href="/" class="site-brand shrink-0" aria-label="Zur Startseite">
            <span class="hidden lg:inline">Hausarztpraxis</span>
            <span>Thiemo Stiemert</span>
        </a>
        <nav class="site-nav flex items-center gap-3 md:gap-7" aria-label="Hauptnavigation">
            <a href="/" class:active={routeId === "/" && !newsActive}>Startseite</a>
            {#if news.length > 0}
                <a href="/#neuigkeiten" class:active={newsActive}>Neuigkeiten</a>
            {/if}
            <a href="/team" class:active={routeId === "/team"}>Über uns</a>
            <a href="/leistungsspektrum" class:active={routeId === "/leistungsspektrum"}>Leistungsspektrum</a>
            <a href="tel:{CONTACT_INFO.PHONE}" class="phone-link hidden lg:inline-flex" title="Anrufen">
                <svg aria-hidden="true" viewBox="0 0 24 24" class="h-4 w-4 fill-current">
                    <path
                        d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.36 11.36 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.57 1 1 0 0 1-.25 1.02z"
                    />
                </svg>
                {CONTACT_INFO.PHONE}
            </a>
        </nav>
    </div>
</header>

<style>
    .site-brand {
        display: none;
        gap: 0.35rem;
        font-family: var(--font-display);
        font-size: 1.125rem;
        font-weight: 650;
        color: white;
        text-decoration: none;
    }

    @media (min-width: 768px) {
        .site-brand {
            display: inline-flex;
        }
    }

    .site-nav a {
        color: var(--color-pine-100);
        text-decoration: none;
        font-weight: 600;
        font-size: 0.85rem;
        padding: 0.25rem 0;
        border-bottom: 2px solid transparent;
        transition: color 0.15s ease;
        white-space: nowrap;
    }

    @media (min-width: 768px) {
        .site-nav a {
            font-size: 0.95rem;
        }
    }

    .site-nav a:hover {
        color: white;
    }

    .site-nav a.active {
        color: white;
        border-bottom-color: var(--color-sand-300);
    }

    .site-nav .phone-link {
        align-items: center;
        gap: 0.4rem;
        background: var(--color-pine-700);
        border-radius: 9999px;
        padding: 0.3rem 0.9rem;
        border-bottom: none;
        color: white;
        font-variant-numeric: tabular-nums;
    }

    .site-nav .phone-link:hover {
        background: var(--color-pine-600);
    }
</style>
