<script lang="ts">
    const times = [
        { day: "Montag", time: "8:00-12:00 Uhr, 16:00-19:00 Uhr" },
        { day: "Dienstag", time: "8:00-12:00 Uhr, 16:00-18:00 Uhr mit Termin" },
        { day: "Mittwoch", time: "8:00-12:00 Uhr" },
        { day: "Donnerstag", time: "8:00-12:00 Uhr, 16:00-18:00 Uhr mit Termin" },
        { day: "Freitag", time: "8:00-12:00 Uhr" },
    ];

    const vacations = [{ from: "16.10.2023", to: "27.10.2023" }];
</script>

<div class="flex flex-col">
    <div class="flex flex-col">
        <div class="fixed bg-gradient-to-r from-gulfstream-400 to-gulfstream-500 w-full p-3">
            <div class="w-full h-full max-w-7xl relative mx-auto"> Header </div>
        </div>
        <div
            class="absolute -z-10 bg-[url('/praxis.png')] bg-cover bg-top-left bg-no-repeat opacity-80 w-full lg:h-[500px] md:h-[400px] h-[300px]"
        >
            <div class="w-full h-full max-w-7xl relative mx-auto">
                <div
                    class="absolute right-0 bottom-0 mb-4 mr-4 bg-gulfstream-400 opacity-90 py-2 px-4 lg:text-3xl md:text-2xl text-2xl text-left"
                >
                    Hausartztpraxis in Trier<br />
                    Thiemo Stiemert
                </div>
            </div>
        </div>
    </div>
    <div class="lg:mt-[500px] md:mt-[400px] mt-[300px] bg-gradient-to-r from-gulfstream-400 to-gulfstream-500 h-1" />
    <div class="w-full max-w-7xl mx-auto p-4 mt-8 mb-8">
        <div class="flex md:flex-row flex-col gap-8">
            <div class="w-full lg:w-2/3">
                <h1> Herzlich Willkommen</h1>

                <div class="pt-6 text-justify w-full lg:w-[80%]">
                    Wir freuen uns auf Ihren Besuch in unserer modern ausgestatteten hausärztlichen Praxis. Unabhängig
                    von der Behandlung versuchen wir unsere Patienten umfassend zu informieren, denn nur gut informierte
                    Patienten sind in der Lage richtige Entscheidungen zu treffen. Ihre Gesundheit steht bei uns im
                    Mittelpunkt. Uns ist es ein großes Anliegen, dass Sie sich in unserer hausärztlichen Praxis wohl und
                    gut aufgehoben fühlen. Für Rückmeldungen sind wir stets dankbar.
                </div>

                <h1 class="mt-8">Ihr Weg zu uns</h1>

                <div class="pt-6 text-justify w-full lg:w-[80%]"
                    >Sie finden uns in der <b>Gilbertstraße 59, 54290 Trier</b> (<a href="">Google Maps</a>).<br />
                    <div class="mt-4">
                        <b>Anfahrt mit dem Bus:</b><br />
                        Bushaltestelle "Barbarathermen" in der Südallee: Linien 1, 10, 40, 81<br />
                        Von dort zu Fuß in 3 Minuten (ca. 210 m). Auf Friedrich-Wilhelm-Straße ca. 170 m nach Süden Richtung
                        Gilbertstraße. Dann rechts abbiegen und ca. 42 m auf Gilbertstraße. Die Gemeinschaftspraxis befindet
                        sich auf der linken Seite.
                    </div>
                    <div class="mt-4">
                        <b>Anfahrt mit dem Auto:</b><br />
                        Kurzzeitparkplätze (2 Stunden) in der Gilbertstraße und Friedrich-Wilhelm-Straße. 3 Parkplätze vor
                        der Praxis.
                    </div>
                </div>
            </div>
            <div class="grow min-w-[400px]">
                {#if vacations.length >= 1}
                    <h1 class="mt-6">Urlaub</h1>
                    <table class="mt-6 w-full">
                        <tbody class="">
                            {#each vacations as vacation}
                                <tr
                                    class="odd:bg-gulfstream-100 even:bg-gulfstrem-200 border b-1 text-center font-bold"
                                >
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

                <div class="mt-6"
                    >Mit dem Telefon unter <a class="font-bold hover:text-gulfstream-700" href="tel:+49651975150"
                        >+49(0)651 975150</a
                    >
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
    </div>
</div>
