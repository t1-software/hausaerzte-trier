<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import CropDialog from "./CropDialog.svelte";

    /**
     * Medienbibliothek: zeigt alle hochgeladenen Bilder, nimmt neue per
     * Zuschneide-Dialog entgegen und löscht nur auf ausdrücklichen Wunsch.
     */
    export let aspect = 4 / 5;

    const dispatch = createEventDispatcher<{ select: string; close: void }>();

    interface MediaImage {
        url: string;
        pathname: string;
        uploadedAt: string;
        size: number;
    }

    let images: MediaImage[] = [];
    let loading = true;
    let loadError = "";
    let uploading = false;
    let cropFile: File | null = null;
    let fileInput: HTMLInputElement;

    onMount(load);

    async function load() {
        loading = true;
        loadError = "";

        try {
            const response = await fetch("/admin/media");

            if (!response.ok) {
                throw new Error(String(response.status));
            }

            images = (await response.json()).images;
        } catch {
            loadError = "Die Bibliothek konnte nicht geladen werden.";
        } finally {
            loading = false;
        }
    }

    function handleFileChange() {
        const file = fileInput.files?.[0];

        if (file) {
            cropFile = file;
        }

        fileInput.value = "";
    }

    async function handleCropped(event: CustomEvent<Blob>) {
        const name = cropFile?.name ?? "bild";
        cropFile = null;
        uploading = true;

        try {
            const formData = new FormData();
            formData.append("action", "upload");
            formData.append("name", name);
            formData.append("file", new File([event.detail], name, { type: "image/jpeg" }));

            const response = await fetch("/admin/media", { method: "POST", body: formData });

            if (!response.ok) {
                throw new Error(String(response.status));
            }

            const { url } = await response.json();
            dispatch("select", url);
        } catch {
            alert("Das Bild konnte nicht hochgeladen werden. Bitte erneut versuchen.");
        } finally {
            uploading = false;
        }
    }

    async function removeImage(image: MediaImage) {
        if (!confirm(`„${image.pathname.split("/").pop()}" endgültig löschen?`)) {
            return;
        }

        try {
            const formData = new FormData();
            formData.append("action", "delete");
            formData.append("url", image.url);

            const response = await fetch("/admin/media", { method: "POST", body: formData });

            if (!response.ok) {
                throw new Error(String(response.status));
            }

            images = images.filter((entry) => entry.url !== image.url);
        } catch {
            alert("Das Bild konnte nicht gelöscht werden.");
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Escape" && !cropFile) {
            dispatch("close");
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="media-overlay" role="dialog" aria-modal="true" aria-label="Medienbibliothek">
    <div class="media-panel">
        <div class="media-head">
            <h2 class="media-title">Medienbibliothek</h2>
            <button
                class="inline-icon-btn"
                type="button"
                aria-label="Schließen"
                title="Schließen"
                on:click={() => dispatch("close")}
            >
                <svg aria-hidden="true" viewBox="0 0 24 24">
                    <path
                        d="M18.3 7.11 16.89 5.7 12 10.59 7.11 5.7 5.7 7.11 10.59 12 5.7 16.89l1.41 1.41L12 13.41l4.89 4.89 1.41-1.41L13.41 12l4.89-4.89Z"
                    />
                </svg>
            </button>
        </div>

        <label class="media-upload" class:media-upload--busy={uploading}>
            <input
                bind:this={fileInput}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                on:change={handleFileChange}
                disabled={uploading}
            />
            {uploading ? "Wird hochgeladen …" : "+ Neues Bild hochladen"}
        </label>

        {#if loading}
            <p class="media-empty">Lädt …</p>
        {:else if loadError}
            <p class="media-empty">{loadError}</p>
        {:else if images.length === 0}
            <p class="media-empty">Noch keine Bilder hochgeladen.</p>
        {:else}
            <div class="media-grid">
                {#each images as image (image.url)}
                    <div class="media-item">
                        <button
                            class="media-choose"
                            type="button"
                            title="Bild verwenden"
                            on:click={() => dispatch("select", image.url)}
                        >
                            <img src={image.url} alt="" loading="lazy" />
                        </button>
                        <button
                            class="media-delete"
                            type="button"
                            aria-label="Bild endgültig löschen"
                            title="Bild endgültig löschen"
                            on:click={() => removeImage(image)}
                        >
                            <svg aria-hidden="true" viewBox="0 0 24 24">
                                <path
                                    d="M9 3h6l1 2h4v2H4V5h4l1-2Zm-3 6h12l-1 12a1 1 0 0 1-1 .93H8A1 1 0 0 1 7 21L6 9Zm4 2v9h2v-9h-2Zm4 0v9h-2v-9h2Z"
                                />
                            </svg>
                        </button>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>

{#if cropFile}
    <CropDialog file={cropFile} {aspect} on:cropped={handleCropped} on:cancel={() => (cropFile = null)} />
{/if}

<style>
    .media-overlay {
        position: fixed;
        inset: 0;
        z-index: 60;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(14, 31, 24, 0.55);
        padding: 1rem;
    }

    .media-panel {
        display: flex;
        flex-direction: column;
        gap: 0.9rem;
        width: min(44rem, 100%);
        max-height: min(85vh, 42rem);
        border-radius: 0.75rem;
        background: white;
        padding: 1.25rem;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
    }

    .media-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .media-title {
        margin: 0;
        font-size: 1.15rem;
    }

    .media-upload {
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px dashed var(--color-pine-400);
        border-radius: 0.5rem;
        background: var(--color-pine-50);
        color: var(--color-pine-800);
        font-weight: 700;
        padding: 0.6rem;
        cursor: pointer;
    }

    .media-upload:hover {
        background: var(--color-pine-100);
    }

    .media-upload--busy {
        opacity: 0.6;
        pointer-events: none;
    }

    .media-upload input {
        display: none;
    }

    .media-empty {
        margin: 0;
        text-align: center;
        color: var(--color-sand-900);
        padding: 1.5rem 0;
    }

    .media-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(7.5rem, 1fr));
        gap: 0.6rem;
        overflow-y: auto;
    }

    .media-item {
        position: relative;
    }

    .media-choose {
        display: block;
        width: 100%;
        aspect-ratio: 4 / 5;
        overflow: hidden;
        border: 1px solid var(--color-sand-200);
        border-radius: 0.5rem;
        padding: 0;
        background: var(--color-sand-100);
    }

    .media-choose:hover {
        border-color: var(--color-pine-500);
    }

    .media-choose img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .media-delete {
        position: absolute;
        top: 0.35rem;
        right: 0.35rem;
        display: inline-flex;
        width: 1.7rem;
        height: 1.7rem;
        align-items: center;
        justify-content: center;
        border-radius: 9999px;
        background: rgba(255, 255, 255, 0.92);
        color: var(--color-copper-600);
        border: 1px solid var(--color-sand-200);
    }

    .media-delete:hover {
        background: white;
        color: var(--color-copper-700);
    }

    .media-delete svg {
        width: 0.95rem;
        height: 0.95rem;
        fill: currentColor;
    }
</style>
