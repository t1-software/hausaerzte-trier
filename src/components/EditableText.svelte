<script lang="ts">
    import EditableBlock from "./EditableBlock.svelte";
    import InlineEditorActions from "./InlineEditorActions.svelte";
    import RichText from "./RichText.svelte";
    import { ajaxSave } from "$lib/ajax-save";
    import { marked } from "marked";

    /** Ein Textbereich, der im Bearbeitungsmodus direkt an der Stelle editiert wird. */
    export let sectionKey: string;
    export let text = "";
    export let isEditor = false;
    export let redirectTo = "/";
    export let ariaLabel = sectionKey;
    export let allowBold = true;
    export let allowList = false;
    export let align: "start" | "center" | "end" = "start";
    /** Für Besucher ausgeblendet; im Bearbeitungsmodus gedimmt sichtbar. */
    export let hidden = false;

    let baseline: string | null = null;
    let draft = "";
    let resetKey = 0;

    $: dirty = baseline !== null && draft !== baseline;

    function discard() {
        draft = baseline ?? "";
        resetKey += 1;
    }
</script>

<EditableBlock {isEditor} {sectionKey} {hidden} {redirectTo}>
    <div class="editable-text">{@html marked(text)}</div>
    <form
        slot="editor"
        class="editable-text"
        method="post"
        action="/admin/content"
        use:ajaxSave
        on:saved={() => (baseline = draft)}
    >
        <input type="hidden" name="action" value="saveBlock" />
        <input type="hidden" name="sectionKey" value={sectionKey} />
        <input type="hidden" name="redirectTo" value={redirectTo} />
        {#key resetKey}
            <RichText
                {allowBold}
                {allowList}
                {ariaLabel}
                name="text"
                value={baseline ?? text}
                on:init={(event) => {
                    baseline = event.detail;
                    draft = event.detail;
                }}
                on:change={(event) => (draft = event.detail)}
            />
        {/key}
        <InlineEditorActions {align} {dirty} onDiscard={discard} />
    </form>
</EditableBlock>

<style>
    .editable-text :global(p) {
        margin-bottom: 1rem;
        overflow: visible;
    }

    .editable-text :global(p:last-child) {
        margin-bottom: 0;
    }

    .editable-text :global(strong) {
        font-weight: 700;
    }

    .editable-text :global(em) {
        font-style: italic;
    }

    .editable-text :global(ul) {
        list-style-type: disc;
        margin-left: 1.5rem;
        margin-bottom: 1rem;
    }
</style>
