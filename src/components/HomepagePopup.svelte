<script lang="ts">
    import { onMount } from "svelte";

    const popupStorageKey = "hausaerzte-trier-homepage-popup-dismissed";
    const campaignUrl = "https://newslettertogo.com/wg8ndhs7-fll46wy9-os827wcy-8tt";

    let isOpen = false;
    let primaryLink: HTMLAnchorElement;
    let previousBodyOverflow = "";

    onMount(() => {
        if (sessionStorage.getItem(popupStorageKey) === "true") {
            return;
        }

        isOpen = true;
        previousBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        window.setTimeout(() => primaryLink?.focus(), 0);

        const handleKeydown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                closePopup();
            }
        };

        window.addEventListener("keydown", handleKeydown);

        return () => {
            window.removeEventListener("keydown", handleKeydown);
            document.body.style.overflow = previousBodyOverflow;
        };
    });

    function closePopup() {
        sessionStorage.setItem(popupStorageKey, "true");
        isOpen = false;
        document.body.style.overflow = previousBodyOverflow;
    }
</script>

{#if isOpen}
    <div class="homepage-popup" role="presentation">
        <button
            class="homepage-popup__backdrop"
            type="button"
            tabindex="-1"
            aria-label="Popup schließen"
            aria-hidden="true"
            on:click={closePopup}
        ></button>

        <div
            class="homepage-popup__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="homepage-popup-title"
            aria-describedby="homepage-popup-description"
        >
            <button class="homepage-popup__close" type="button" aria-label="Popup schließen" on:click={closePopup}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                        d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z"
                    />
                </svg>
            </button>

            <p class="homepage-popup__eyebrow">Aktuelle Aktion</p>
            <h2 id="homepage-popup-title">Hausarztpraxen retten!</h2>
            <p id="homepage-popup-description">
                Bitte unterstützen Sie die Initiative zur Sicherung der hausärztlichen Versorgung.
            </p>

            <div class="homepage-popup__actions">
                <a
                    bind:this={primaryLink}
                    class="homepage-popup__primary"
                    href={campaignUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    on:click={closePopup}
                >
                    Zur Aktion
                </a>
                <button class="homepage-popup__secondary" type="button" on:click={closePopup}>Später</button>
            </div>
        </div>
    </div>
{/if}

<style>
    .homepage-popup {
        position: fixed;
        inset: 0;
        z-index: 2000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
    }

    .homepage-popup__backdrop {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        border: 0;
        background: rgba(17, 29, 19, 0.58);
        cursor: pointer;
    }

    .homepage-popup__dialog {
        position: relative;
        width: min(100%, 30rem);
        border: 1px solid var(--color-gulfstream-200);
        border-radius: 0.5rem;
        background: var(--color-gulfstream-50);
        box-shadow: 0 24px 48px rgba(17, 29, 19, 0.22);
        color: var(--color-gulfstream-950);
        padding: 2rem;
    }

    .homepage-popup__close {
        position: absolute;
        top: 0.75rem;
        right: 0.75rem;
        display: flex;
        width: 2.25rem;
        height: 2.25rem;
        align-items: center;
        justify-content: center;
        border: 0;
        border-radius: 999px;
        background: transparent;
        color: var(--color-gulfstream-700);
        cursor: pointer;
    }

    .homepage-popup__close:hover,
    .homepage-popup__close:focus-visible {
        background: var(--color-gulfstream-100);
    }

    .homepage-popup__close svg {
        width: 1.35rem;
        height: 1.35rem;
        fill: currentColor;
    }

    .homepage-popup__eyebrow {
        margin-bottom: 0.5rem;
        color: var(--color-gulfstream-600);
        font-size: 0.85rem;
        font-weight: 700;
        text-transform: uppercase;
    }

    .homepage-popup__dialog h2 {
        margin-bottom: 1rem;
        padding-right: 2rem;
        color: var(--color-gulfstream-900);
        font-size: 1.55rem;
        letter-spacing: 0;
    }

    .homepage-popup__dialog p {
        overflow: visible;
    }

    #homepage-popup-description {
        margin-bottom: 1.5rem;
        line-height: 1.55;
    }

    .homepage-popup__actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
    }

    .homepage-popup__primary,
    .homepage-popup__secondary {
        min-height: 2.75rem;
        border-radius: 0.375rem;
        padding: 0.7rem 1rem;
        font-weight: 700;
        line-height: 1.25;
        text-align: center;
        cursor: pointer;
    }

    .homepage-popup__close:focus-visible,
    .homepage-popup__primary:focus-visible,
    .homepage-popup__secondary:focus-visible {
        outline: 2px solid var(--color-gulfstream-800);
        outline-offset: 2px;
    }

    .homepage-popup__primary {
        flex: 1 1 10rem;
        background: var(--color-gulfstream-500);
        color: white;
        text-decoration: none;
    }

    .homepage-popup__primary:hover,
    .homepage-popup__primary:focus-visible {
        background: var(--color-gulfstream-600);
        color: white;
        text-decoration: none;
    }

    .homepage-popup__secondary {
        border: 1px solid var(--color-gulfstream-300);
        background: transparent;
        color: var(--color-gulfstream-800);
    }

    .homepage-popup__secondary:hover,
    .homepage-popup__secondary:focus-visible {
        background: var(--color-gulfstream-100);
    }

    @media (max-width: 420px) {
        .homepage-popup__dialog {
            padding: 1.5rem;
        }

        .homepage-popup__primary,
        .homepage-popup__secondary {
            width: 100%;
        }
    }
</style>
