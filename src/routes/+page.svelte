<script lang="ts">
    import { goto } from "$app/navigation";
    import { Loader } from "@googlemaps/js-api-loader";
    import Modal from "../components/Modal.svelte";
    import { onMount } from "svelte";

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

        const element = document.getElementById("map");
        if (element !== null) {
            const map = new Map(element, mapOptions);

            new AdvancedMarkerElement({
                map,
                position: { lat: 49.749053955078125, lng: 6.63014554977417 },
                title: "Hausärztliche Praxis",
            });
        }
    });

    const times = [
        { day: "Montag", time: "8:00-12:00 Uhr, 16:00-19:00 Uhr" },
        { day: "Dienstag", time: "8:00-12:00 Uhr, Nachmittags: nur nach Vereinbarung" },
        { day: "Mittwoch", time: "8:00-12:00 Uhr" },
        { day: "Donnerstag", time: "8:00-12:00 Uhr, Nachmittags: nur nach Vereinbarung" },
        { day: "Freitag", time: "8:00-12:00 Uhr" },
    ];

    const vacations: { from: string; to: string }[] = []; //[{ from: "16.10.2023", to: "27.10.2023" }];
    let modalVisible = true;
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
            Für Rückmeldungen sind wir stets dankbar. Uns ist es ein großes Anliegen, dass Sie sich in unserer hausärztlichen
            Praxis wohl und gut aufgehoben fühlen. Für Rückmeldungen sind wir stets dankbar.<br /><br />
            Ihr Praxisteam
        </div>

        <h1 class="pt-6">Aktuelle Neuigkeiten</h1>
        <div class="pt-6 text-justify w-full lg:w-[80%]"> Wir machen Urlaub vom 20.05 - 31.05.2024. </div>

        <h1 class="mt-8">Ihr Weg zu uns</h1>

        <div class="pt-6 text-justify w-full lg:w-[80%]">
            Sie finden uns in der <b>Gilbertstraße 59, 54290 Trier</b>.
            <div id="map" class="w-[100%] h-[400px]" />
            <br />
            <div class="mt-4">
                <b>Anfahrt mit dem Bus:</b><br />
                Bushaltestelle "Barbarathermen" in der Südallee: Linien 1, 10, 40, 81<br />
                Von dort zu Fuß in 3 Minuten (ca. 210 m). Auf Friedrich-Wilhelm-Straße ca. 170 m nach Süden Richtung Gilbertstraße.
                Dann rechts abbiegen und ca. 42 m auf Gilbertstraße. Die Gemeinschaftspraxis befindet sich auf der linken
                Seite.
            </div>
            <div class="mt-4">
                <b>Anfahrt mit dem Auto:</b><br />
                Kurzzeitparkplätze (2 Stunden) in der Gilbertstraße und Friedrich-Wilhelm-Straße. 3 Parkplätze vor der Praxis.
            </div>
        </div>
    </div>

    <div class="grow min-w-[350px]">
        {#if vacations.length >= 1}
            <h1 class="mt-6">Urlaub</h1>
            <table class="mt-6 w-full">
                <tbody class="">
                    {#each vacations as vacation}
                        <tr class="odd:bg-gulfstream-100 even:bg-gulfstrem-200 border b-1 text-center font-bold">
                            <td class="p-4">{vacation.from} bis {vacation.to}</td>
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
                        <td class="p-4">{time.day}</td><td class="p-4 text-right"
                            >{@html time.time.split(",").join("<br />")}</td
                        >
                    </tr>
                {/each}
            </tbody>
        </table>

        <h1 class="mt-8">Termin vereinbaren</h1>

        <div class="mt-6">
            Terminvereinbarungen aller Art sowie Therapie-,<br /> Diagnoseanfragen sind nur persönlich oder telefonisch
            möglich!<br /><br />
            Mit dem Telefon unter
            <a class="font-bold hover:text-gulfstream-700" href="tel:+49651975150">+49(0)651 975150</a>
            oder <br />
            per E-Mail unter der
            <a class="font-bold hover:text-gulfstream-700" href="mailto:praxis@hausaerzte-trier.de"
                >praxis@hausaerzte-trier.de</a
            >.
        </div>

        <h1 class="mt-8">Rezeptbestellungen</h1>

        <div class="mt-6">
            Per Telefon unter der <a class="font-bold hover:text-gulfstream-700" href="tel:+496519751521"
                >+49(0)651 9751521</a
            >.</div
        >
    </div>
</div>

<!--<Modal isVisible={modalVisible} />-->

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class="fixed right-[-200px] lg:top-[510px] top-[310px] md:top-[410px] w-[270px] h-16 border b-1 border-gulfstream-500 flex bg-gulfstream-400 hover:right-0 transition-all duration-200 ease-in-out shadow-md cursor-pointer"
    on:click={() => goto("tel:+496519751521")}
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
</style>
