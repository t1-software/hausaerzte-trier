<script lang="ts">
    import { CONTACT_INFO } from "../constants/contact";

    export let isMobile = false;
</script>

<div class={isMobile ? "location-mobile" : "location-desktop"}>
    <h1 class="location-title">Ihr Weg zu uns</h1>
    <div class="location-content">
        <p class="location-address">
            Sie finden uns in der <strong>{CONTACT_INFO.ADDRESS}</strong>.
        </p>

        <div class="location-map-container">
            <a href={CONTACT_INFO.GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" class="location-map-link">
                <div class="location-map-placeholder">
                    <div class="location-map-icon">📍</div>
                    <div class="location-map-address">{CONTACT_INFO.ADDRESS}</div>
                    <div class="location-map-hint">Klicken Sie hier, um die Karte zu öffnen</div>
                </div>
            </a>
        </div>

        <div class="location-directions">
            <div class="location-direction-section">
                <h3 class="location-direction-title">Anfahrt mit dem Bus:</h3>
                <p class="location-direction-text">
                    Bushaltestelle "Barbarathermen" in der Südallee: Linien 1, 10, 40, 81<br />
                    Von dort zu Fuß in 3 Minuten (ca. 210 m). Auf Friedrich-Wilhelm-Straße ca. 170 m nach Süden Richtung
                    Gilbertstraße. Dann rechts abbiegen und ca. 42 m auf Gilbertstraße. Die Gemeinschaftspraxis befindet
                    sich auf der linken Seite.
                </p>
            </div>

            <div class="location-direction-section">
                <h3 class="location-direction-title">Anfahrt mit dem Auto:</h3>
                <p class="location-direction-text">
                    Kurzzeitparkplätze (2 Stunden) in der Gilbertstraße und Friedrich-Wilhelm-Straße. 3 Parkplätze vor
                    der Praxis.
                </p>
            </div>
        </div>
    </div>
</div>

<style>
    .location-desktop {
        display: none;
    }

    .location-mobile {
        display: block;
    }

    @media (min-width: 768px) {
        .location-desktop {
            display: block;
        }

        .location-mobile {
            display: none;
        }
    }

    .location-title {
        font-size: 1.5rem;
        font-weight: 700;
        margin-top: 2rem;
        margin-bottom: 1.5rem;
        letter-spacing: -0.025em;
    }

    .location-content {
        padding-top: 1.5rem;
        text-align: justify;
        width: 100%;
    }

    @media (min-width: 1024px) {
        .location-content {
            width: 80%;
        }
    }

    .location-address {
        margin-bottom: 1rem;
    }

    .location-map-container {
        width: 100%;
        height: 400px;
        margin-top: 1rem;
    }

    .location-map-link {
        display: block;
        width: 100%;
        height: 100%;
        background-color: #e5e7eb;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        text-decoration: none;
        transition: background-color 0.2s;
    }

    .location-map-link:hover {
        background-color: #d1d5db;
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
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
    }

    .location-map-address {
        font-size: 1.125rem;
        font-weight: 600;
        color: #374151;
        margin-bottom: 0.25rem;
    }

    .location-map-hint {
        font-size: 0.875rem;
        color: #6b7280;
    }

    .location-directions {
        margin-top: 1rem;
    }

    .location-direction-section {
        margin-top: 1rem;
    }

    .location-direction-title {
        font-weight: 700;
        margin-bottom: 0.5rem;
    }

    .location-direction-text {
        margin-bottom: 0.5rem;
    }
</style>
