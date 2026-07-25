<script lang="ts">
    import { createEventDispatcher, onDestroy, onMount } from "svelte";

    /** Zuschneiden vor dem Hochladen: fester Ausschnitt, Verschieben per Ziehen, Zoom per Regler. */
    export let file: File;
    /** Breite ÷ Höhe des Ausschnitts (Team-Karten: 4/5). */
    export let aspect = 4 / 5;

    const dispatch = createEventDispatcher<{ cropped: Blob; cancel: void }>();

    const viewportWidth = 320;
    $: viewportHeight = Math.round(viewportWidth / aspect);

    let objectUrl = "";
    let image: HTMLImageElement | null = null;
    let ready = false;
    let minScale = 1;
    let scale = 1;
    let maxScale = 1;
    let offsetX = 0;
    let offsetY = 0;
    let dragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let exporting = false;

    onMount(() => {
        objectUrl = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            image = img;
            minScale = Math.max(viewportWidth / img.naturalWidth, viewportHeight / img.naturalHeight);
            maxScale = minScale * 4;
            scale = minScale;
            offsetX = (viewportWidth - img.naturalWidth * scale) / 2;
            offsetY = (viewportHeight - img.naturalHeight * scale) / 2;
            ready = true;
        };
        img.src = objectUrl;
    });

    onDestroy(() => {
        if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
        }
    });

    function clampOffsets() {
        if (!image) {
            return;
        }

        offsetX = Math.min(0, Math.max(viewportWidth - image.naturalWidth * scale, offsetX));
        offsetY = Math.min(0, Math.max(viewportHeight - image.naturalHeight * scale, offsetY));
    }

    /** Zoomt um die Mitte des Ausschnitts. */
    function setScale(next: number) {
        if (!image) {
            return;
        }

        const clamped = Math.min(maxScale, Math.max(minScale, next));
        const centerX = (viewportWidth / 2 - offsetX) / scale;
        const centerY = (viewportHeight / 2 - offsetY) / scale;
        scale = clamped;
        offsetX = viewportWidth / 2 - centerX * scale;
        offsetY = viewportHeight / 2 - centerY * scale;
        clampOffsets();
    }

    function handlePointerDown(event: PointerEvent) {
        dragging = true;
        dragStartX = event.clientX - offsetX;
        dragStartY = event.clientY - offsetY;
        (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    }

    function handlePointerMove(event: PointerEvent) {
        if (!dragging) {
            return;
        }

        offsetX = event.clientX - dragStartX;
        offsetY = event.clientY - dragStartY;
        clampOffsets();
    }

    function handlePointerUp() {
        dragging = false;
    }

    function handleWheel(event: WheelEvent) {
        event.preventDefault();
        setScale(scale * (event.deltaY < 0 ? 1.08 : 0.92));
    }

    async function confirmCrop() {
        if (!image || exporting) {
            return;
        }

        exporting = true;
        // Export bewusst begrenzt (600–1200px Breite), damit der Upload klein bleibt.
        const sourceWidth = Math.round(viewportWidth / scale);
        const exportWidth = Math.min(1200, Math.max(600, Math.min(sourceWidth, image.naturalWidth)));
        const canvas = document.createElement("canvas");
        canvas.width = exportWidth;
        canvas.height = Math.round(exportWidth / aspect);
        const context = canvas.getContext("2d");

        if (!context) {
            exporting = false;
            return;
        }

        context.drawImage(
            image,
            -offsetX / scale,
            -offsetY / scale,
            viewportWidth / scale,
            viewportHeight / scale,
            0,
            0,
            canvas.width,
            canvas.height
        );

        canvas.toBlob(
            (blob) => {
                exporting = false;

                if (blob) {
                    dispatch("cropped", blob);
                }
            },
            "image/jpeg",
            0.85
        );
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            dispatch("cancel");
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="crop-overlay" role="dialog" aria-modal="true" aria-label="Bild zuschneiden">
    <div class="crop-panel">
        <h2 class="crop-title">Bild zuschneiden</h2>
        <p class="crop-hint">Ziehen zum Verschieben, Regler oder Mausrad zum Vergrößern.</p>
        {#if ready}
            <div
                class="crop-viewport"
                style="width: {viewportWidth}px; height: {viewportHeight}px;"
                on:pointerdown={handlePointerDown}
                on:pointermove={handlePointerMove}
                on:pointerup={handlePointerUp}
                on:pointercancel={handlePointerUp}
                on:wheel={handleWheel}
            >
                <img
                    src={objectUrl}
                    alt=""
                    draggable="false"
                    style="transform: translate({offsetX}px, {offsetY}px) scale({scale}); width: {image?.naturalWidth ??
                        0}px; height: auto; transform-origin: top left;"
                />
            </div>
            <label class="crop-zoom">
                Zoom
                <input
                    type="range"
                    min={minScale}
                    max={maxScale}
                    step={minScale / 50}
                    value={scale}
                    on:input={(event) => setScale(Number(event.currentTarget.value))}
                />
            </label>
        {:else}
            <div class="crop-loading" style="width: {viewportWidth}px; height: {viewportHeight}px;">Lädt …</div>
        {/if}
        <div class="crop-actions">
            <button class="crop-confirm" type="button" disabled={!ready || exporting} on:click={confirmCrop}>
                {exporting ? "Wird zugeschnitten …" : "Übernehmen"}
            </button>
            <button class="crop-cancel" type="button" on:click={() => dispatch("cancel")}>Abbrechen</button>
        </div>
    </div>
</div>

<style>
    .crop-overlay {
        position: fixed;
        inset: 0;
        z-index: 70;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(14, 31, 24, 0.55);
        padding: 1rem;
    }

    .crop-panel {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        border-radius: 0.75rem;
        background: white;
        padding: 1.25rem;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
    }

    .crop-title {
        font-size: 1.15rem;
        margin: 0;
    }

    .crop-hint {
        margin: 0;
        font-size: 0.85rem;
        color: var(--color-sand-900);
        overflow: visible;
    }

    .crop-viewport {
        position: relative;
        overflow: hidden;
        border-radius: 0.5rem;
        background: var(--color-pine-950);
        cursor: grab;
        touch-action: none;
    }

    .crop-viewport:active {
        cursor: grabbing;
    }

    .crop-viewport img {
        position: absolute;
        top: 0;
        left: 0;
        max-width: none;
        user-select: none;
        pointer-events: none;
    }

    .crop-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.5rem;
        background: var(--color-sand-100);
        color: var(--color-sand-900);
    }

    .crop-zoom {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--color-pine-900);
    }

    .crop-zoom input {
        flex: 1;
        accent-color: var(--color-pine-600);
    }

    .crop-actions {
        display: flex;
        gap: 0.6rem;
    }

    .crop-confirm {
        flex: 1;
        border-radius: 0.4rem;
        background: var(--color-pine-700);
        color: white;
        font-weight: 700;
        padding: 0.5rem 1rem;
    }

    .crop-confirm:hover {
        background: var(--color-pine-800);
    }

    .crop-confirm:disabled {
        opacity: 0.6;
    }

    .crop-cancel {
        border-radius: 0.4rem;
        border: 1px solid var(--color-sand-200);
        background: white;
        color: var(--color-pine-800);
        font-weight: 600;
        padding: 0.5rem 1rem;
    }

    .crop-cancel:hover {
        background: var(--color-sand-100);
    }
</style>
