<script lang="ts">
    import type { PageData } from "./$types";
    import EditableText from "../../components/EditableText.svelte";
    import TeamSection from "../../components/TeamSection.svelte";
    import { browser } from "$app/environment";
    import { editMode } from "$lib/edit-mode";
    import { DEFAULT_TEAM, isSectionHidden, textOf } from "$lib/content";

    export let data: PageData;

    $: isEditor = data.isEditor && (browser ? $editMode : data.editMode);
    $: intro = textOf(data.content, "Team");
    $: introHidden = isSectionHidden(data.content, "Team");
    $: members = data.content["Team-Mitglieder"]?.length ? data.content["Team-Mitglieder"] : DEFAULT_TEAM;
</script>

<svelte:head>
    <title>Über uns | Hausarztpraxis Trier</title>
</svelte:head>

<div class="team-intro mt-8 max-w-prose">
    <EditableText
        sectionKey="Team"
        ariaLabel="Über uns"
        text={intro}
        hidden={introHidden}
        {isEditor}
        redirectTo="/team"
    />
</div>

<TeamSection {members} {isEditor} redirectTo="/team" />
