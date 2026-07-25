<script lang="ts">
    import { CONTACT_INFO } from "../constants/contact";
    import EditableText from "./EditableText.svelte";

    export let isEditor = false;
    export let redirectTo = "/";
    export let appointmentText = "";
</script>

<div class="contact-section">
    <h1 class="contact-title">Termin vereinbaren / Rezepte</h1>

    <div class="contact-content">
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
                Telefon: <a class="contact-link" href="tel:{CONTACT_INFO.PHONE}">{CONTACT_INFO.PHONE}</a>
            </li>
            <li class="contact-item">
                E-Mail: <a class="contact-link" href="mailto:{CONTACT_INFO.EMAIL}">{CONTACT_INFO.EMAIL}</a>
            </li>
            <li class="contact-item">
                Fax: <a class="contact-link" href="tel:{CONTACT_INFO.FAX}">{CONTACT_INFO.FAX}</a>
            </li>
        </ul>
    </div>
</div>

<style>
    .contact-section {
        margin-top: 2rem;
    }

    .contact-title {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 1.5rem;
        letter-spacing: -0.025em;
    }

    .contact-content {
        margin-top: 1.5rem;
    }

    .contact-description {
        margin-bottom: 1rem;
    }

    .contact-list {
        list-style: none;
        padding: 0;
    }

    .contact-item {
        margin-bottom: 0.5rem;
    }

    .contact-link {
        font-weight: 700;
        color: inherit;
        text-decoration: none;
        transition: color 0.2s;
    }

    .contact-link:hover {
        color: var(--color-gulfstream-700);
    }
</style>
