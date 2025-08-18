<script lang="ts">
    export let content: Record<string, string[][]> = {};

    $: news = content["Neuigkeiten"] || [];
</script>

<div class="fixed bg-gradient-to-r from-gulfstream-400 to-gulfstream-500 w-full p-3">
    <div class="w-full h-full max-w-7xl relative mx-auto">
        <div
            class="header-nav flex flex-start justify-center md:justify-start item-center gap-2 md:gap-8 text-sm md:text-lg"
        >
            <a href="/" class="text-white hover:text-white no-underline font-medium">Startseite</a>
            {#if news.length > 0}
                <a href="/#neuigkeiten" class="text-white hover:text-white no-underline font-medium">Neuigkeiten</a>
            {/if}
            <a href="/team" class="text-white hover:text-white no-underline font-medium">Über uns</a>
            <a href="/leistungsspektrum" class="text-white hover:text-white no-underline font-medium"
                >Leistungsspektrum</a
            >
        </div>
    </div>
</div>

<style>
    /* Target header navigation links specifically */
    .header-nav a {
        color: white;
        text-decoration: none;
    }

    .header-nav a:hover {
        color: white;
        text-decoration: none;
    }
</style>
