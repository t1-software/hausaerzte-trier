<script lang="ts">
    import type { PageData } from "./$types";
    import Leistungsspektrum from "../../components/Leistungsspektrum.svelte";

    export let data: PageData;

    $: content = data.content;
    $: leistungen = content["Leistungsspektrum"] || [];
</script>

<Leistungsspektrum {leistungen} />
