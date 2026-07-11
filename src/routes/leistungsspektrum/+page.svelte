<script lang="ts">
    import type { PageData } from "./$types";
    import Leistungsspektrum from "../../components/Leistungsspektrum.svelte";

    export let data: PageData;

    $: content = data.content;
    $: leistungen = content["Leistungsspektrum"] || [];
    $: isEditor = data.isEditor;
</script>

<Leistungsspektrum {leistungen} {isEditor} redirectTo="/leistungsspektrum" />
