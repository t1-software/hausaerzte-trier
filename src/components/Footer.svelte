<script lang="ts">
    import { enhance } from "$app/forms";
    import { page } from "$app/stores";
    import { CONTACT_INFO } from "../constants/contact";

    export let isAuthenticated = false;

    let loginFailed = false;

    /** Anmeldung ohne Seitenwechsel: falsches Passwort zeigt den Fehler direkt hier. */
    const handleLogin: import("@sveltejs/kit").SubmitFunction = () => {
        loginFailed = false;

        return async ({ result, update }) => {
            if (result.type === "failure") {
                loginFailed = true;
                return;
            }

            await update();
        };
    };
</script>

<footer class="bg-pine-950 text-pine-100">
    <div class="mx-auto w-full max-w-7xl px-4 py-10">
        <div class="grid gap-8 md:grid-cols-3">
            <div>
                <h2 class="footer-heading">Hausarztpraxis Thiemo Stiemert</h2>
                <address class="not-italic leading-relaxed">
                    Gilbertstraße 59<br />
                    54290 Trier
                </address>
                <ul class="mt-3 space-y-1">
                    <li>
                        <a class="footer-link tabular-nums" href="tel:{CONTACT_INFO.PHONE}">{CONTACT_INFO.PHONE}</a>
                    </li>
                    <li>
                        <a class="footer-link" href="mailto:{CONTACT_INFO.EMAIL}">{CONTACT_INFO.EMAIL}</a>
                    </li>
                </ul>
            </div>
            <div>
                <h2 class="footer-heading">Seiten</h2>
                <ul class="space-y-1">
                    <li><a class="footer-link" href="/">Startseite</a></li>
                    <li><a class="footer-link" href="/team">Über uns</a></li>
                    <li><a class="footer-link" href="/leistungsspektrum">Leistungsspektrum</a></li>
                    <li><a class="footer-link" href="/#sprechzeiten">Sprechzeiten</a></li>
                </ul>
            </div>
            <div>
                <h2 class="footer-heading">Im Notfall</h2>
                <ul class="space-y-2">
                    <li>
                        <span class="block text-sm text-pine-300">Ärztlicher Bereitschaftsdienst</span>
                        <a class="footer-link footer-link--big tabular-nums" href="tel:116117">116 117</a>
                    </li>
                    <li>
                        <span class="block text-sm text-pine-300">Notruf (lebensbedrohliche Notfälle)</span>
                        <a class="footer-link footer-link--big tabular-nums" href="tel:112">112</a>
                    </li>
                </ul>
            </div>
        </div>

        <div
            class="mt-10 flex flex-col items-center gap-2 border-t border-pine-800 pt-4 md:flex-row md:justify-between"
        >
            <div class="flex gap-6 text-sm">
                <a class="footer-link" href="/impressum">Impressum</a>
                <a class="footer-link" href="/datenschutz">Datenschutz</a>
            </div>
            {#if isAuthenticated}
                <form class="footer-login" method="post" action="/admin?/logout">
                    <button
                        class="footer-login__summary footer-login__summary--active"
                        type="submit"
                        aria-label="Admin abmelden"
                        title="Admin abmelden"
                    >
                        <svg aria-hidden="true" viewBox="0 0 24 24">
                            <path
                                d="M17 9h-7V7a2 2 0 1 1 3.75-1h2.1A4 4 0 0 0 8 7v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm0 10H7v-8h10v8Zm-6-2h2v-3h-2v3Z"
                            />
                        </svg>
                    </button>
                </form>
            {:else}
                <details class="footer-login">
                    <summary class="footer-login__summary" aria-label="Admin anmelden" title="Admin anmelden">
                        <svg aria-hidden="true" viewBox="0 0 24 24">
                            <path
                                d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2ZM10 7a2 2 0 1 1 4 0v2h-4V7Zm7 12H7v-8h10v8Z"
                            />
                        </svg>
                    </summary>
                    <form class="footer-login__form" method="post" action="/admin?/login" use:enhance={handleLogin}>
                        <input type="hidden" name="redirectTo" value={$page.url.pathname} />
                        <input
                            name="password"
                            type="password"
                            autocomplete="current-password"
                            required
                            aria-label="Passwort"
                            placeholder="Passwort"
                            aria-invalid={loginFailed}
                            on:input={() => (loginFailed = false)}
                        />
                        {#if loginFailed}
                            <span class="footer-login__error" role="alert">Das Passwort ist nicht korrekt.</span>
                        {/if}
                    </form>
                </details>
            {/if}
        </div>
    </div>
</footer>

<style>
    .footer-heading {
        font-family: var(--font-display);
        font-size: 1.05rem;
        font-weight: 650;
        color: white;
        margin-bottom: 0.75rem;
    }

    .footer-link {
        color: var(--color-pine-100);
        text-decoration: none;
    }

    .footer-link:hover {
        color: white;
        text-decoration: underline;
    }

    .footer-link--big {
        font-family: var(--font-display);
        font-size: 1.35rem;
        font-weight: 650;
        color: white;
    }

    .footer-login {
        position: relative;
        display: inline-flex;
        min-height: 2rem;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }

    .footer-login__summary {
        display: inline-flex;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        border-radius: 9999px;
        color: var(--color-pine-300);
        padding: 0.2rem;
        transition:
            background-color 0.15s ease,
            color 0.15s ease;
    }

    .footer-login__summary:hover {
        background: rgba(255, 255, 255, 0.16);
        color: white;
    }

    .footer-login__summary--active {
        background: white;
        color: var(--color-pine-700);
    }

    .footer-login__summary--active:hover {
        background: var(--color-pine-100);
    }

    .footer-login__summary::marker {
        content: "";
    }

    .footer-login__summary::-webkit-details-marker {
        display: none;
    }

    .footer-login__summary svg {
        width: 1.35rem;
        height: 1.35rem;
        fill: currentColor;
    }

    .footer-login__form {
        display: inline-flex;
        align-items: center;
    }

    .footer-login__error {
        font-size: 0.8rem;
        color: var(--color-sand-300);
        white-space: nowrap;
    }

    .footer-login__form input {
        width: 10rem;
        height: 2rem;
        border: 1px solid rgba(255, 255, 255, 0.65);
        background: rgba(255, 255, 255, 0.95);
        color: var(--color-pine-950);
        padding: 0 0.5rem;
        font-weight: 400;
    }
</style>
