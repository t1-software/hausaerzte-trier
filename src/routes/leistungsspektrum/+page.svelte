<script lang="ts">
    import type { PageData } from "./$types";
    import Leistungsspektrum from "../../components/Leistungsspektrum.svelte";
    import { editMode } from "$lib/edit-mode";
    import { isSectionHidden } from "$lib/content";

    export let data: PageData;

    $: content = data.content;
    $: leistungen = content["Leistungsspektrum"] || [];
    $: isEditor = data.isEditor && $editMode;
</script>

<Leistungsspektrum
    {leistungen}
    {isEditor}
    hidden={isSectionHidden(content, "Leistungsspektrum")}
    redirectTo="/leistungsspektrum"
/>
