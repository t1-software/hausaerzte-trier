<script lang="ts">
    import { CONTACT_INFO } from "../constants/contact";
    import EditableText from "./EditableText.svelte";

    export let isEditor = false;
    export let redirectTo = "/";
    export let busText = "";
    export let carText = "";
</script>

<div class="location-section card">
    <h2 class="location-title">Ihr Weg zu uns</h2>
    <p class="location-address">
        Sie finden uns in der <strong>{CONTACT_INFO.ADDRESS}</strong>.
    </p>

    <a href={CONTACT_INFO.GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" class="location-map-link">
        <svg aria-hidden="true" viewBox="0 0 24 24" class="location-map-icon">
            <path
                d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5Z"
            />
        </svg>
        Karte in Google Maps öffnen
    </a>

    <div class="location-directions">
        <div class="location-direction-section">
            <h3 class="location-direction-title">Anfahrt mit dem Bus</h3>
            <div class="location-direction-text">
                <EditableText
                    sectionKey="AnfahrtBus"
                    ariaLabel="Anfahrt mit dem Bus"
                    text={busText}
                    {isEditor}
                    {redirectTo}
                />
            </div>
        </div>

        <div class="location-direction-section">
            <h3 class="location-direction-title">Anfahrt mit dem Auto</h3>
            <div class="location-direction-text">
                <EditableText
                    sectionKey="AnfahrtAuto"
                    ariaLabel="Anfahrt mit dem Auto"
                    text={carText}
                    {isEditor}
                    {redirectTo}
                />
            </div>
        </div>
    </div>
</div>

<style>
    .location-section {
        margin-top: 1.5rem;
        padding: 1.5rem;
    }

    .location-title {
        margin-bottom: 0.75rem;
    }

    .location-address {
        margin-bottom: 0.75rem;
    }

    .location-map-link {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 0.25rem;
        padding: 0.5rem 1rem;
        background-color: var(--color-sand-100);
        border: 1px solid var(--color-sand-200);
        border-radius: 9999px;
        font-weight: 600;
        color: var(--color-pine-800);
        text-decoration: none;
        transition: background-color 0.2s;
    }

    .location-map-link:hover {
        background-color: white;
    }

    .location-map-icon {
        width: 1.1rem;
        height: 1.1rem;
        fill: var(--color-pine-600);
    }

    .location-directions {
        margin-top: 1.5rem;
        max-width: 65ch;
    }

    .location-direction-section {
        margin-top: 1rem;
    }

    .location-direction-title {
        margin-bottom: 0.25rem;
    }

    .location-direction-text {
        margin-bottom: 0.5rem;
    }
</style>
