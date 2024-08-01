<script lang="ts">
    import { content } from "../../content";

    let leistungen = $content["Leistungsspektrum"];
</script>

<h1>Leistungsspektrum</h1>
<br /><br />

{#each leistungen as leistung}
    <h2>{leistung[0]}</h2>
    <div class="pt-2 pb-6 text-justify w-full">
        {leistung[1]}
    </div>
{/each}
