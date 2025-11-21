<script lang="ts">
    import type { LayoutData } from "./$types";
    import Footer from "../components/Footer.svelte";
    import Header from "../components/Header.svelte";

    export let data: LayoutData;

    $: content = data.content;
    $: important = content["Wichtig"]?.[0]?.[0]?.replaceAll("\r", "") || "";
</script>

<div class="flex flex-col min-h-screen">
    <div class="flex flex-col">
        <Header {content} />
        <div
            class="absolute -z-10 bg-[url('/praxis2.jpeg')] bg-cover bg-center bg-no-repeat opacity-80 w-full lg:h-[500px] md:h-[400px] h-[300px]"
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
    <div class="lg:mt-[500px] md:mt-[400px] mt-[300px] bg-gradient-to-r from-gulfstream-400 to-gulfstream-500 h-1"
    ></div>
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

<style lang="scss" global>
    @import "../app.css";
</style>
