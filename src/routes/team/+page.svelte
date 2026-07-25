<script lang="ts">
    import type { PageData } from "./$types";
    import EditableText from "../../components/EditableText.svelte";
    import { editMode } from "$lib/edit-mode";
    import { textOf } from "$lib/content";

    export let data: PageData;

    $: isEditor = data.isEditor && $editMode;
    $: intro = textOf(data.content, "Team");
</script>

<h1>Über uns</h1>
<br />

<EditableText sectionKey="Team" ariaLabel="Über uns" text={intro} {isEditor} redirectTo="/team" />

<br />
<br />

<div class="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
    <div class="text-center text-sm flex flex-col gap-1 align-center">
        <div class="flex justify-center"
            ><img src="/stiemert_thiemo.jpg" alt="Thiemo Stiemert" class="w-80 h-80 object-cover" /></div
        >
        <div class="font-semibold">Thiemo Stiemert</div>
        <div>Praxisinhaber - Facharzt Allgemeinmedizin</div>
    </div>

    <div class="text-center text-sm flex flex-col gap-1 align-center">
        <div class="flex justify-center"
            ><img src="/stiemert_detlef2.jpeg" alt="Detlef Stiemert" class="w-80 h-80 object-cover" /></div
        >
        <div class="font-semibold">San.-rat. Dr. med. Detlef Stiemert</div>
        <div>angestellter Arzt - Facharzt Allgemeinmedizin, Notfallmedizin</div>
    </div>

    <div class="text-center text-sm flex flex-col gap-1 align-center">
        <div class="flex justify-center"
            ><img
                src="/van_der_werff-stiemert_anne-brit.jpg"
                alt="Anne-Britt van der Werff-Stiemert"
                class="w-80 h-80 object-cover"
            /></div
        >
        <div class="font-semibold">Anne-Britt van der Werff-Stiemert</div>
        <div>Weiterbildungsassistentin</div>
    </div>

    <div class="text-center text-sm flex flex-col gap-1 align-center">
        <div class="flex justify-center"
            ><img src="/dahm_susanne.jpg" alt="Susanne Dahm" class="w-80 h-80 object-cover" /></div
        >
        <div class="font-semibold">Susanne Dahm</div>
        <div>Medizinische Fachangestellte</div>
    </div>

    <div class="text-center text-sm flex flex-col gap-1 align-center">
        <div class="flex justify-center"
            ><img src="/weber_julia.jpg" alt="Susanne Dahm" class="w-80 h-80 object-cover" /></div
        >
        <div class="font-semibold">Julia Weber</div>
        <div>Medizinische Fachangestellte</div>
    </div>

    <div class="text-center text-sm flex flex-col gap-1 align-center">
        <div class="flex justify-center"
            ><div class="w-80 h-80 bg-gradient-to-tr from-gulfstream-300 to-gulfstream-400"></div></div
        >
        <div class="font-semibold">Linda Hontheim</div>
        <div>Medizinische Fachangestellte</div>
    </div>

    <div class="text-center text-sm flex flex-col gap-1 align-center">
        <div class="flex justify-center"
            ><img src="/heinz_julia.jpg" alt="Julia Heinz" class="w-80 h-80 object-cover" /></div
        >
        <div class="font-semibold">Julia Heinz</div>
        <div>Medizinische Fachangestellte</div>
    </div>

    <div class="text-center text-sm flex flex-col gap-1 align-center">
        <div class="flex justify-center"
            ><div class="w-80 h-80 bg-gradient-to-tr from-gulfstream-300 to-gulfstream-400"></div></div
        >
        <div class="font-semibold">Ieman Toomeh</div>
        <div>Auszubildende</div>
    </div>
</div>
