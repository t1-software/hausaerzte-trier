<script lang="ts">
    export let image: string;
    export let bleed: boolean = true; // volle Bildschirmbreite über Container hinaus
</script>

<div class={`parallax-wrapper ${bleed ? "parallax-bleed" : ""}`} style={`--parallax-image: url('${image}')`}>
    <slot />
</div>

<style>
    .parallax-wrapper {
        background-image: var(--parallax-image);
        background-attachment: fixed;
        background-size: cover;
        background-position: center;
        position: relative;
        width: 100%;
    }
    /* Full-bleed außerhalb zentrierter max-width Container */
    .parallax-bleed {
        width: 100vw;
        position: relative;
        left: 50%;
        right: 50%;
        margin-left: -50vw;
        margin-right: -50vw;
    }
    /* iOS Safari Fallback: fixed nicht unterstützt -> scroll Background */
    @supports (-webkit-touch-callout: none) {
        .parallax-wrapper {
            background-attachment: scroll;
        }
    }
</style>
