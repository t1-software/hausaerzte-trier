<script lang="ts">
    import type { PageData } from "./$types";
    import EditableText from "../../components/EditableText.svelte";
    import { editMode } from "$lib/edit-mode";
    import { textOf } from "$lib/content";

    export let data: PageData;

    $: isEditor = data.isEditor && $editMode;
    $: intro = textOf(data.content, "Team");

    const team: { name: string; role: string; image?: string }[] = [
        { name: "Thiemo Stiemert", role: "Praxisinhaber · Facharzt Allgemeinmedizin", image: "/stiemert_thiemo.jpg" },
        {
            name: "San.-Rat Dr. med. Detlef Stiemert",
            role: "Angestellter Arzt · Facharzt Allgemeinmedizin, Notfallmedizin",
            image: "/stiemert_detlef2.jpeg",
        },
        {
            name: "Anne-Britt van der Werff-Stiemert",
            role: "Weiterbildungsassistentin",
            image: "/van_der_werff-stiemert_anne-brit.jpg",
        },
        { name: "Susanne Dahm", role: "Medizinische Fachangestellte", image: "/dahm_susanne.jpg" },
        { name: "Julia Weber", role: "Medizinische Fachangestellte", image: "/weber_julia.jpg" },
        { name: "Linda Hontheim", role: "Medizinische Fachangestellte" },
        { name: "Julia Heinz", role: "Medizinische Fachangestellte", image: "/heinz_julia.jpg" },
        { name: "Ieman Toomeh", role: "Auszubildende" },
    ];

    function initials(name: string): string {
        const parts = name.replace(/[^A-Za-zÀ-ž\s-]/g, "").split(/[\s-]+/);
        const first = parts[0]?.[0] ?? "";
        const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
        return (first + last).toUpperCase();
    }
</script>

<div class="team-intro mt-8 max-w-prose">
    <EditableText sectionKey="Team" ariaLabel="Über uns" text={intro} {isEditor} redirectTo="/team" />
</div>

<div class="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {#each team as member (member.name)}
        <div class="card team-card">
            {#if member.image}
                <img src={member.image} alt={member.name} class="team-photo" loading="lazy" />
            {:else}
                <div class="team-photo team-photo--placeholder" aria-hidden="true">
                    <span>{initials(member.name)}</span>
                </div>
            {/if}
            <div class="team-meta">
                <div class="team-name">{member.name}</div>
                <div class="team-role">{member.role}</div>
            </div>
        </div>
    {/each}
</div>

<style>
    .team-card {
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .team-photo {
        width: 100%;
        aspect-ratio: 4 / 5;
        object-fit: cover;
        object-position: center top;
    }

    .team-photo--placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(160deg, var(--color-pine-100), var(--color-pine-200));
    }

    .team-photo--placeholder span {
        font-family: var(--font-display);
        font-size: 3rem;
        font-weight: 650;
        color: var(--color-pine-600);
    }

    .team-meta {
        padding: 0.9rem 1rem 1.1rem;
        text-align: center;
    }

    .team-name {
        font-weight: 700;
        color: var(--color-pine-900);
    }

    .team-role {
        margin-top: 0.15rem;
        font-size: 0.875rem;
        color: var(--color-sand-900);
    }
</style>
