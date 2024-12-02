<script lang="ts">
    import { onMount } from "svelte";
    import Footer from "../components/Footer.svelte";
    import Header from "../components/Header.svelte";
    import { content, getData } from "../content";

    let dataLoaded = false;
    let important = "";

    onMount(async () => {
        await getData();
        dataLoaded = true;

        important = $content["Wichtig"][0][0].replaceAll("\r", "");
    });
</script>

{#if dataLoaded}
    <div class="flex flex-col min-h-screen">
        <div class="flex flex-col">
            <Header />
            <div
                class="absolute -z-10 bg-[url('/praxis.jpeg')] bg-cover bg-top-left bg-no-repeat opacity-80 w-full lg:h-[500px] md:h-[400px] h-[300px]"
            >
                <div class="w-full h-full max-w-7xl relative mx-auto">
                    <div
                        class="absolute right-0 bottom-0 mb-4 mr-4 bg-gulfstream-400 opacity-90 py-2 px-4 lg:text-3xl md:text-2xl text-2xl text-left"
                    >
                        Hausarztpraxis in Trier<br />
                        Thiemo Stiemert
                    </div>
                </div>
            </div>
        </div>
        <div
            class="lg:mt-[500px] md:mt-[400px] mt-[300px] bg-gradient-to-r from-gulfstream-400 to-gulfstream-500 h-1"
        />
        {#if important.length > 0}
            <div class="bg-gulfstream-100 w-full py-4 flex align-center justify-center text-center font-bold">
                {important}
            </div>
        {/if}
        <div class="w-full max-w-7xl mx-auto p-4 mt-8 mb-8">
            <slot />
        </div>
    </div>
    <Footer />
{/if}

<style lang="scss" global>
    @import "../app.scss";
</style>
