<script lang="ts">
    import type { ActionData, PageData } from "./$types";

    export let data: PageData;
    export let form: ActionData;
</script>

<svelte:head>
    <title>Login | Hausarztpraxis Trier</title>
</svelte:head>

<main class="min-h-screen bg-gulfstream-50 px-4 py-8 text-gulfstream-950">
    <section class="mx-auto mt-20 max-w-md rounded border border-gulfstream-200 bg-white p-6 shadow-sm">
        <h1>Admin</h1>
        {#if !data.configured}
            <p class="mt-4 rounded border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-900">
                ADMIN_PASSWORD ist nicht konfiguriert.
            </p>
        {:else}
            <form class="mt-5 flex flex-col gap-4" method="post" action="?/login">
                <label class="flex flex-col gap-2 text-sm font-bold text-gulfstream-900">
                    Passwort
                    <input
                        class="rounded border border-gulfstream-300 px-3 py-2 text-base font-normal outline-none focus:border-gulfstream-600 focus:ring-2 focus:ring-gulfstream-200"
                        name="password"
                        type="password"
                        autocomplete="current-password"
                        required
                    />
                </label>
                {#if form?.message}
                    <p class="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{form.message}</p>
                {/if}
                <button
                    class="rounded bg-gulfstream-700 px-4 py-2 font-bold text-white hover:bg-gulfstream-800"
                    type="submit"
                >
                    Anmelden
                </button>
            </form>
        {/if}
    </section>
</main>
