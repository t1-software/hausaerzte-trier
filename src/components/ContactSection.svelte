<script lang="ts">
    import { CONTACT_INFO } from "../constants/contact";
    import EditableText from "./EditableText.svelte";

    export let isEditor = false;
    export let redirectTo = "/";
    export let appointmentText = "";
</script>

<div class="contact-section card">
    <h2 class="contact-title">Termin & Rezepte</h2>

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
    .contact-section {
        margin-top: 1.5rem;
        padding: 1.5rem;
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
