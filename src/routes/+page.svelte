<script lang="ts">
    import { goto } from "$app/navigation";
    import { Loader } from "@googlemaps/js-api-loader";
    import { onMount } from "svelte";
    import { content } from "../content";
    import Location from "../components/Location.svelte";
    import SvelteMarkdown from "svelte-markdown";
    import MdList from "../components/MDList.svelte";
    import MdParagraph from "../components/MDParagraph.svelte";

    let news = $content["Neuigkeiten"];
    let vacations = $content["Urlaub"];
    let times = $content["Sprechzeiten"];

    let newsString = news.map((n) => n[0]).join("\n");
    console.log(newsString);

    onMount(async () => {
        const loader = new Loader({
            apiKey: "AIzaSyApmS8897U1qdEjB3BYH2QHmNDjG2o3N4I",
            version: "weekly",
            id: "__googleMapsScriptId",
        });

        await loader.load();

        const mapOptions = {
            center: {
                lat: 49.749053955078125,
                lng: 6.63014554977417,
            },
            zoom: 17,
            mapId: "1",
        };

        const { Map } = await loader.importLibrary("maps");
        const { AdvancedMarkerElement } = await loader.importLibrary("marker");

        const element1 = document.getElementById("map1");
        const element2 = document.getElementById("map2");
        if (element1 !== null) {
            const map1 = new Map(element1, mapOptions);

            new AdvancedMarkerElement({
                map: map1,
                position: { lat: 49.749053955078125, lng: 6.63014554977417 },
                title: "Hausärztliche Praxis",
            });
        }
        if (element2 !== null) {
            const map2 = new Map(element2, mapOptions);

            new AdvancedMarkerElement({
                map: map2,
                position: { lat: 49.749053955078125, lng: 6.63014554977417 },
                title: "Hausärztliche Praxis",
            });
        }
    });
</script>

<div class="flex md:flex-row flex-col gap-8 md:px-16">
    <div class="w-full lg:w-2/3">
        <h1>Herzlich Willkommen</h1>

        <div class="pt-6 text-justify w-full lg:w-[80%]">
            Herzlich Willkommen in unserer Hausärztlichen Praxis.<br /><br />
            Auf den folgenden Seiten möchten wir uns bei Ihnen vorstellen. Sie erhalten Auskünfte zum Leistungsspektrum sowie
            zur Diagnostik der hausärztlichen Praxis.<br /><br />
            Wir freuen uns auf Ihren Besuch in unserer modern ausgestatteten hausärztlichen Praxis. Unabhängig von der Behandlung
            versuchen wir unsere Patienten umfassend zu informieren, denn nur gut informierte Patienten sind in der Lage
            richtige Entscheidungen zu treffen.<br /><br />
            Ihre Gesundheit steht bei uns im Mittelpunkt.<br /><br />
            Uns ist es ein großes Anliegen, dass Sie sich in unserer hausärztlichen Praxis wohl und gut aufgehoben fühlen.
            Für Rückmeldungen sind wir stets dankbar.<br /><br />
            Ihr Praxisteam
        </div>

        <div class="pt-6" />

        {#if news.length > 0}
            <h1 class="anchor" id="neuigkeiten">Aktuelle Neuigkeiten</h1>
            <div class="pt-6 text-justify w-full lg:w-[80%] news">
                <SvelteMarkdown source={newsString} renderers={{ list: MdList, paragraph: MdParagraph }} />
            </div>
        {/if}

        <div class="hidden md:block">
            <Location id="map1" />
        </div>
    </div>

    <div class="grow min-w-[350px]">
        {#if vacations.length >= 1}
            <h1 class="mt-6">Urlaub</h1>
            <table class="mt-6 w-full">
                <tbody class="">
                    {#each vacations as vacation}
                        <tr class="odd:bg-gulfstream-100 even:bg-gulfstrem-200 border b-1 text-center font-bold">
                            <td class="p-4">{vacation[0]} bis {vacation[1]}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {/if}

        <h1 class="mt-8">Sprechzeiten</h1>
        <table class="mt-6 w-full">
            <tbody class="">
                {#each times as time}
                    <tr class="even:bg-gulfstream-100 odd:bg-gulfstrem-200 border b-1">
                        {#if time[1] !== ""}
                            <td class="p-4">{time[0]}</td><td class="p-4 text-right">{time[1]}<br />{time[2]}</td>
                        {:else}
                            <td colspan="2" class="p-4 text-center">{time[0]}</td>
                        {/if}
                    </tr>
                {/each}
            </tbody>
        </table>

        <h1 class="mt-8">Termin vereinbaren / Rezepte</h1>

        <div class="mt-6">
            Terminvereinbarungen aller Art sowie Therapie-,<br /> Diagnoseanfragen sind nur persönlich oder telefonisch
            möglich! Beachten Sie die Bandansage.<br /><br />
            <ul>
                <li
                    >Telefon: <a class="font-bold hover:text-gulfstream-700" href="tel:+49651975150">+49(0)651 975150</a
                    ></li
                >
                <li
                    >E-Mail: <a class="font-bold hover:text-gulfstream-700" href="mailto:praxis@hausaerzte-trier.de"
                        >praxis@hausaerzte-trier.de</a
                    ></li
                >
                <li
                    >Fax: <a class="font-bold hover:text-gulfstream-700" href="tel:+496519751520">+49(0)651 9751520</a
                    ></li
                >
            </ul>
        </div>
        <div class="block md:hidden">
            <Location id="map2" />
        </div>
    </div>
</div>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class="fixed right-[-200px] lg:top-[510px] top-[310px] md:top-[410px] w-[270px] h-16 border b-1 border-gulfstream-500 flex bg-gulfstream-400 hover:right-0 transition-all duration-200 ease-in-out shadow-md cursor-pointer"
    on:click={() => goto("tel:+49651975150")}
>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="w-100 h-100 stroke-gulstream-400 bg-gulstream-500"
        ><path
            d="M17.707 12.293a.999.999 0 0 0-1.414 0l-1.594 1.594c-.739-.22-2.118-.72-2.992-1.594s-1.374-2.253-1.594-2.992l1.594-1.594a.999.999 0 0 0 0-1.414l-4-4a.999.999 0 0 0-1.414 0L3.581 5.005c-.38.38-.594.902-.586 1.435.023 1.424.4 6.37 4.298 10.268s8.844 4.274 10.269 4.298h.028c.528 0 1.027-.208 1.405-.586l2.712-2.712a.999.999 0 0 0 0-1.414l-4-4.001zm-.127 6.712c-1.248-.021-5.518-.356-8.873-3.712-3.366-3.366-3.692-7.651-3.712-8.874L7 4.414 9.586 7 8.293 8.293a1 1 0 0 0-.272.912c.024.115.611 2.842 2.271 4.502s4.387 2.247 4.502 2.271a.991.991 0 0 0 .912-.271L17 14.414 19.586 17l-2.006 2.005z"
        /></svg
    >
    <div class="h-100 flex items-center pl-4 text-xl font-bold">+49(0)651 975150</div>
</div>

<style lang="scss">
    .no-overflow {
        overflow: hidden;
    }

    .anchor::before {
        content: "";
        display: block;
        height: 75px;
        margin-top: -75px;
        visibility: hidden;
    }
</style>
