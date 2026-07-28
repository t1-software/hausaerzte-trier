<script lang="ts">
    import { CONTACT_INFO } from "../constants/contact";
    import EditableText from "./EditableText.svelte";

    export let isEditor = false;
    export let redirectTo = "/";
    export let busText = "";
    export let carText = "";
    export let busHidden = false;
    export let carHidden = false;
</script>

<div class="location-section">
    <p class="eyebrow">So finden Sie uns</p>
    <h2 class="location-title mt-1 !text-3xl">Ihr Weg zu uns</h2>
    <p class="location-address">
        Sie finden uns in der
        <a
            href={CONTACT_INFO.GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            class="location-address-link"
            title="In Google Maps öffnen"
        >
            <strong>Gilbertstraße 59</strong>
        </a>
        in Trier.
    </p>

    <div class="location-directions">
        {#if isEditor || !busHidden}
            <div class="location-direction-section">
                <h3 class="location-direction-title">Anfahrt mit dem Bus</h3>
                <div class="location-direction-text">
                    <EditableText
                        sectionKey="AnfahrtBus"
                        ariaLabel="Anfahrt mit dem Bus"
                        text={busText}
                        hidden={busHidden}
                        {isEditor}
                        {redirectTo}
                    />
                </div>
            </div>
        {/if}

        {#if isEditor || !carHidden}
            <div class="location-direction-section">
                <h3 class="location-direction-title">Anfahrt mit dem Auto</h3>
                <div class="location-direction-text">
                    <EditableText
                        sectionKey="AnfahrtAuto"
                        ariaLabel="Anfahrt mit dem Auto"
                        text={carText}
                        hidden={carHidden}
                        {isEditor}
                        {redirectTo}
                    />
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    .location-section {
        margin-top: 3rem;
    }

    .location-title {
        margin-bottom: 0.75rem;
    }

    .location-address {
        margin-bottom: 0.75rem;
    }

    .location-address-link {
        color: var(--color-pine-700);
        text-decoration: underline;
        text-decoration-color: var(--color-pine-300);
        text-underline-offset: 3px;
    }

    .location-address-link:hover {
        text-decoration-color: var(--color-pine-700);
    }

    .location-directions {
        margin-top: 1.5rem;
        display: grid;
        gap: 1rem 2.5rem;
    }

    @media (min-width: 768px) {
        .location-directions {
            grid-template-columns: 1fr 1fr;
        }
    }

    .location-direction-section {
        max-width: 65ch;
    }

    .location-direction-title {
        margin-bottom: 0.25rem;
    }

    .location-direction-text {
        margin-bottom: 0.5rem;
    }
</style>
