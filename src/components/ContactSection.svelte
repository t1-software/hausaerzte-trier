<script lang="ts">
    import { CONTACT_INFO } from "../constants/contact";
    import EditableText from "./EditableText.svelte";

    export let isEditor = false;
    export let redirectTo = "/";
    export let appointmentText = "";
    /** "card" in der Seitenleiste, "band" als Karte im Info-Band unter dem Titelbild. */
    export let variant: "card" | "band" = "card";
</script>

<div class="contact-section" class:card={variant === "card"} class:quick-card={variant === "band"}>
    {#if variant === "band"}
        <span class="quick-label">
            <svg aria-hidden="true" viewBox="0 0 24 24" class="quick-icon">
                <path
                    d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.36 11.36 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.57 1 1 0 0 1-.25 1.02z"
                />
            </svg>
            Termin & Rezepte
        </span>
    {:else}
        <h2 class="contact-title">Termin & Rezepte</h2>
    {/if}

    <div class="contact-description">
        <EditableText
            sectionKey="Termine"
            ariaLabel="Termin vereinbaren"
            text={appointmentText}
            {isEditor}
            {redirectTo}
        />
    </div>

    <ul class="contact-list">
        <li class="contact-item">
            <span class="contact-label">Telefon</span>
            <a class="contact-link tabular-nums" href="tel:{CONTACT_INFO.PHONE}">{CONTACT_INFO.PHONE}</a>
        </li>
        <li class="contact-item">
            <span class="contact-label">E-Mail</span>
            <a class="contact-link" href="mailto:{CONTACT_INFO.EMAIL}">{CONTACT_INFO.EMAIL}</a>
        </li>
        <li class="contact-item">
            <span class="contact-label">Fax</span>
            <span class="contact-link tabular-nums">{CONTACT_INFO.FAX}</span>
        </li>
    </ul>
</div>

<style>
    .contact-section.card {
        margin-top: 1.5rem;
        padding: 1.5rem;
    }

    .contact-section.quick-card .contact-description,
    .contact-section.quick-card .contact-item {
        font-size: 0.9rem;
    }

    .contact-section.quick-card .contact-item {
        padding: 0.3rem 0;
    }

    .contact-title {
        margin-bottom: 0.75rem;
    }

    .contact-description {
        margin-bottom: 1rem;
        font-size: 0.95rem;
        color: var(--color-sand-900);
    }

    .contact-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .contact-item {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        padding: 0.55rem 0;
        border-bottom: 1px solid var(--color-sand-200);
    }

    .contact-item:last-child {
        border-bottom: none;
    }

    .contact-label {
        font-weight: 600;
        color: var(--color-pine-700);
    }

    .contact-link {
        font-weight: 700;
        color: var(--color-pine-950);
        text-decoration: none;
        transition: color 0.2s;
        overflow-wrap: anywhere;
        text-align: right;
    }

    a.contact-link:hover {
        color: var(--color-pine-600);
    }
</style>
