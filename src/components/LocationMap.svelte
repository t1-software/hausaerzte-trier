<script lang="ts">
    import { CONTACT_INFO } from "../constants/contact";
    import EditableText from "./EditableText.svelte";

    export let isEditor = false;
    export let redirectTo = "/";
    export let busText = "";
    export let carText = "";
</script>

<div class="location-section">
    <h2 class="location-title">Ihr Weg zu uns</h2>
    <p class="location-address">
        Sie finden uns in der <strong>{CONTACT_INFO.ADDRESS}</strong>.
    </p>

    <div class="location-map-container">
        <a href={CONTACT_INFO.GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" class="location-map-link">
            <div class="location-map-placeholder">
                <svg aria-hidden="true" viewBox="0 0 24 24" class="location-map-icon">
                    <path
                        d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5Z"
                    />
                </svg>
                <div class="location-map-address">{CONTACT_INFO.ADDRESS}</div>
                <div class="location-map-hint">Karte in Google Maps öffnen</div>
            </div>
        </a>
    </div>

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
        margin-top: 3rem;
    }

    .location-title {
        margin-bottom: 1rem;
    }

    .location-address {
        margin-bottom: 1rem;
    }

    .location-map-container {
        width: 100%;
        height: 260px;
        margin-top: 0.5rem;
    }

    .location-map-link {
        display: block;
        width: 100%;
        height: 100%;
        background-color: var(--color-sand-100);
        border: 1px solid var(--color-sand-200);
        border-radius: 0.75rem;
        text-decoration: none;
        transition: background-color 0.2s;
    }

    .location-map-link:hover {
        background-color: var(--color-sand-200);
    }

    .location-map-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        text-align: center;
    }

    .location-map-icon {
        width: 2.5rem;
        height: 2.5rem;
        margin-bottom: 0.5rem;
        fill: var(--color-pine-600);
    }

    .location-map-address {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--color-pine-900);
        margin-bottom: 0.25rem;
    }

    .location-map-hint {
        font-size: 0.875rem;
        color: var(--color-sand-900);
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
