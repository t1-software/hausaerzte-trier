<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { CONTACT_INFO } from "../constants/contact";
    import { editMode } from "$lib/edit-mode";

    /** Angemeldete Admins sehen den Umschalter zwischen Ansicht und Bearbeiten. */
    export let isAuthenticated = false;
    /** Aktuelle Darstellung; kommt vom Layout, damit sie auch serverseitig stimmt. */
    export let editing = true;

    $: routeId = $page.route.id;

    // On the homepage the hero already shows the practice name; the navbar
    // brand fades in once the hero title is scrolled out of view.
    let scrolledPastHero = false;

    onMount(() => {
        const schedule = () => requestAnimationFrame(() => (scrolledPastHero = window.scrollY > 240));
        schedule();
        window.addEventListener("scroll", schedule, { passive: true });
        return () => {
            window.removeEventListener("scroll", schedule);
        };
    });

    $: brandVisible = routeId !== "/" || scrolledPastHero;
</script>

<header class="fixed top-0 z-40 w-full bg-pine-900/95 shadow-md backdrop-blur-sm">
    <div class="mx-auto flex h-14 w-full max-w-7xl items-center justify-center gap-4 px-4 md:justify-between">
        <a
            href="/"
            class="site-brand shrink-0"
            class:site-brand--hidden={!brandVisible}
            aria-label="Zur Startseite"
            tabindex={brandVisible ? 0 : -1}
        >
            <span class="hidden lg:inline">Hausarztpraxis</span>
            <span>Thiemo Stiemert</span>
        </a>
        <nav class="site-nav flex items-center gap-3 md:gap-7" aria-label="Hauptnavigation">
            <a href="/" class:active={routeId === "/"}>Startseite</a>
            <a href="/team" class:active={routeId === "/team"}>Über uns</a>
            <a href="/leistungsspektrum" class:active={routeId === "/leistungsspektrum"}>Leistungsspektrum</a>
            {#if isAuthenticated}
                <div class="admin-toggle" role="group" aria-label="Darstellung wählen">
                    <button
                        class="admin-toggle__option"
                        class:admin-toggle__option--active={!editing}
                        type="button"
                        aria-pressed={!editing}
                        on:click={() => ($editMode = false)}
                    >
                        Ansicht
                    </button>
                    <button
                        class="admin-toggle__option"
                        class:admin-toggle__option--active={editing}
                        type="button"
                        aria-pressed={editing}
                        on:click={() => ($editMode = true)}
                    >
                        Bearbeiten
                    </button>
                </div>
            {/if}
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
        opacity: 1;
        transition: opacity 0.25s ease;
    }

    .site-brand--hidden {
        opacity: 0;
        pointer-events: none;
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

    .admin-toggle {
        display: inline-flex;
        overflow: hidden;
        border: 1px solid var(--color-pine-500);
        border-radius: 9999px;
    }

    /* Auf schmalen Bildschirmen passt der Umschalter nicht in die Navigationszeile:
       als schwebende Pille unten links, gegenüber dem Telefonknopf. */
    @media (max-width: 767px) {
        .admin-toggle {
            position: fixed;
            bottom: 1.25rem;
            left: 1rem;
            z-index: 40;
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
        }

        .admin-toggle__option {
            padding: 0.45rem 0.9rem;
            font-size: 0.85rem;
        }
    }

    .admin-toggle__option {
        padding: 0.2rem 0.7rem;
        background: var(--color-pine-800);
        color: var(--color-pine-100);
        font-size: 0.8rem;
        font-weight: 600;
        white-space: nowrap;
    }

    .admin-toggle__option--active {
        background: var(--color-sand-100);
        color: var(--color-pine-900);
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
