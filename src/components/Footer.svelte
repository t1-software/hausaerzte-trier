<script lang="ts">
    export let isAuthenticated = false;
</script>

<div class="bg-gradient-to-r from-gulfstream-400 to-gulfstream-500 w-full">
    <div class="w-full max-w-7xl relative mx-auto">
        <div class="flex flex-col gap-2 px-3 py-3 text-sm md:flex-row md:items-center md:justify-between md:text-lg">
            <div class="flex flex-start justify-center md:justify-start item-center gap-2 md:gap-8">
                <a href="/impressum" class="text-white">Impressum</a>
                <a href="/datenschutz" class="text-white">Datenschutz</a>
            </div>
            {#if isAuthenticated}
                <form class="footer-login text-center md:text-right" method="post" action="/admin?/logout">
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
                <details class="footer-login text-center md:text-right">
                    <summary class="footer-login__summary" aria-label="Admin anmelden" title="Admin anmelden">
                        <svg aria-hidden="true" viewBox="0 0 24 24">
                            <path
                                d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2ZM10 7a2 2 0 1 1 4 0v2h-4V7Zm7 12H7v-8h10v8Z"
                            />
                        </svg>
                    </summary>
                    <form class="footer-login__form" method="post" action="/admin?/login">
                        <input
                            name="password"
                            type="password"
                            autocomplete="current-password"
                            required
                            aria-label="Passwort"
                            placeholder="Passwort"
                        />
                    </form>
                </details>
            {/if}
        </div>
    </div>
</div>

<style>
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
        color: white;
        padding: 0.2rem;
        transition:
            background-color 0.15s ease,
            color 0.15s ease;
    }

    .footer-login__summary:hover {
        background: rgba(255, 255, 255, 0.16);
    }

    .footer-login__summary--active {
        background: white;
        color: var(--color-gulfstream-700);
    }

    .footer-login__summary--active:hover {
        background: var(--color-gulfstream-100);
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

    .footer-login__form input {
        width: 10rem;
        height: 2rem;
        border: 1px solid rgba(255, 255, 255, 0.65);
        background: rgba(255, 255, 255, 0.95);
        color: var(--color-gulfstream-950);
        padding: 0 0.5rem;
        font-weight: 400;
    }

    @media (max-width: 767px) {
        .footer-login__form {
            margin-right: auto;
            margin-left: auto;
        }
    }
</style>
