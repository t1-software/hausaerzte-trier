<script lang="ts">
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    import { EditorState, type Command } from "prosemirror-state";
    import { EditorView } from "prosemirror-view";
    import { keymap } from "prosemirror-keymap";
    import { baseKeymap, chainCommands, toggleMark } from "prosemirror-commands";
    import { history, redo, undo } from "prosemirror-history";
    import { inputRules, wrappingInputRule } from "prosemirror-inputrules";
    import { liftListItem, sinkListItem, splitListItem, wrapInList } from "prosemirror-schema-list";
    import type { MarkType } from "prosemirror-model";
    import { marked } from "marked";
    import { blockSchema, inlineSchema, parseMarkdown, serializeMarkdown } from "$lib/richtext";

    export let value = "";
    export let name: string;
    export let inline = false;
    export let ariaLabel = "";
    /** Felder, die ohnehin fett dargestellt werden, brauchen keine Fett-Auszeichnung. */
    export let allowBold = true;
    /** Aufzählungen nur dort, wo sie im Layout vorkommen (Neuigkeiten). */
    export let allowList = false;
    /** Vorschläge, die ab zwei getippten Zeichen als Auswahl erscheinen. */
    export let suggestions: string[] = [];

    const dispatch = createEventDispatcher<{ init: string; change: string }>();
    const schema = inline ? inlineSchema : blockSchema;

    let host: HTMLDivElement;
    let view: EditorView | null = null;
    let mounted = false;
    let focused = false;
    let current = value;
    let strongActive = false;
    let emActive = false;
    let listActive = false;
    let matches: string[] = [];
    let matchIndex = 0;
    let matchTop = 0;
    let matchLeft = 0;

    onMount(() => {
        const doc = parseMarkdown(value, inline);
        current = serializeMarkdown(doc, inline);
        dispatch("init", current);
        mounted = true;

        view = new EditorView(host, {
            state: EditorState.create({
                doc,
                plugins: [
                    history(),
                    // Muss vor den übrigen Bindungen liegen, damit Enter den Vorschlag übernimmt.
                    keymap({
                        ArrowDown: () => moveMatch(1),
                        ArrowUp: () => moveMatch(-1),
                        Enter: () => applyMatch(),
                        Tab: () => applyMatch(),
                        Escape: () => closeMatches(),
                    }),
                    keymap({
                        ...(allowBold ? { "Mod-b": toggleMark(schema.marks.strong) } : {}),
                        "Mod-i": toggleMark(schema.marks.em),
                        "Mod-z": undo,
                        "Mod-y": redo,
                        "Shift-Mod-z": redo,
                        ...(inline ? { Enter: () => true } : {}),
                        ...(allowList && !inline
                            ? {
                                  // Enter setzt die Aufzählung fort, Tab rückt ein.
                                  "Enter": chainCommands(splitListItem(blockSchema.nodes.list_item), baseKeymap.Enter),
                                  "Tab": sinkListItem(blockSchema.nodes.list_item),
                                  "Shift-Tab": liftListItem(blockSchema.nodes.list_item),
                              }
                            : {}),
                    }),
                    keymap(baseKeymap),
                    ...(allowList && !inline
                        ? [
                              inputRules({
                                  rules: [
                                      // "- " oder "* " am Zeilenanfang beginnt eine Aufzählung.
                                      wrappingInputRule(/^\s*([-*])\s$/, blockSchema.nodes.bullet_list),
                                      wrappingInputRule(/^(\d+)\.\s$/, blockSchema.nodes.ordered_list),
                                  ],
                              }),
                          ]
                        : []),
                ],
            }),
            attributes: {
                "role": "textbox",
                "aria-multiline": String(!inline),
                ...(ariaLabel ? { "aria-label": ariaLabel } : {}),
            },
            dispatchTransaction(transaction) {
                if (!view) {
                    return;
                }

                const next = view.state.apply(transaction);
                view.updateState(next);
                syncActiveMarks();
                syncMatches();

                if (transaction.docChanged) {
                    current = serializeMarkdown(next.doc, inline);
                    dispatch("change", current);
                }
            },
            handleDOMEvents: {
                focus: () => {
                    focused = true;
                    return false;
                },
                blur: () => {
                    focused = false;
                    return false;
                },
            },
        });

        syncActiveMarks();
    });

    onDestroy(() => {
        view?.destroy();
        view = null;
    });

    function isMarkActive(type: MarkType): boolean {
        if (!view) {
            return false;
        }

        const { from, to, empty, $from } = view.state.selection;

        if (empty) {
            return Boolean(type.isInSet(view.state.storedMarks || $from.marks()));
        }

        return view.state.doc.rangeHasMark(from, to, type);
    }

    function syncActiveMarks() {
        strongActive = isMarkActive(schema.marks.strong);
        emActive = isMarkActive(schema.marks.em);
        listActive = isInBulletList();
    }

    function isInBulletList(): boolean {
        if (!view || inline) {
            return false;
        }

        const { $from } = view.state.selection;

        for (let depth = $from.depth; depth > 0; depth -= 1) {
            if ($from.node(depth).type === blockSchema.nodes.bullet_list) {
                return true;
            }
        }

        return false;
    }

    /** Aufzählung an- und ausschalten. */
    function toggleBulletList() {
        run(isInBulletList() ? liftListItem(blockSchema.nodes.list_item) : wrapInList(blockSchema.nodes.bullet_list));
    }

    /** Text des aktuellen Absatzes bis zur Schreibmarke. */
    function currentQuery(): string {
        if (!view || suggestions.length === 0) {
            return "";
        }

        const { $from, empty } = view.state.selection;

        return empty ? view.state.doc.textBetween($from.start(), $from.pos, " ").trim() : "";
    }

    function syncMatches() {
        const query = currentQuery();

        if (query.length < 2) {
            matches = [];
            return;
        }

        const needle = query.toLowerCase();
        const found = suggestions.filter(
            (entry) => entry.toLowerCase().includes(needle) && entry.toLowerCase() !== needle
        );

        matches = found.slice(0, 6);
        matchIndex = 0;

        if (matches.length > 0 && view) {
            const caret = view.coordsAtPos(view.state.selection.head);
            const box = view.dom.getBoundingClientRect();
            matchTop = caret.bottom - box.top + 4;
            matchLeft = Math.max(0, caret.left - box.left);
        }
    }

    function moveMatch(delta: number): boolean {
        if (matches.length === 0) {
            return false;
        }

        matchIndex = (matchIndex + delta + matches.length) % matches.length;
        return true;
    }

    function closeMatches(): boolean {
        if (matches.length === 0) {
            return false;
        }

        matches = [];
        return true;
    }

    /** Ersetzt den angefangenen Absatz durch den gewählten Vorschlag. */
    function applyMatch(entry?: string): boolean {
        const chosen = entry ?? matches[matchIndex];

        if (!view || !chosen) {
            return false;
        }

        const { $from } = view.state.selection;
        const transaction = view.state.tr.insertText(chosen, $from.start(), $from.end());
        view.dispatch(transaction);
        matches = [];
        view.focus();
        return true;
    }

    function run(command: Command) {
        if (!view) {
            return;
        }

        command(view.state, view.dispatch, view);
        view.focus();
    }
</script>

<div class="rich-text" class:rich-text--inline={inline} class:rich-text--focused={focused}>
    {#if focused}
        <div class="rich-text__toolbar">
            {#if allowBold}
                <button
                    class="rich-text__tool"
                    class:rich-text__tool--active={strongActive}
                    type="button"
                    aria-label="Fett"
                    title="Fett (Strg+B)"
                    on:mousedown|preventDefault={() => run(toggleMark(schema.marks.strong))}
                >
                    <strong>B</strong>
                </button>
            {/if}
            <button
                class="rich-text__tool"
                class:rich-text__tool--active={emActive}
                type="button"
                aria-label="Kursiv"
                title="Kursiv (Strg+I)"
                on:mousedown|preventDefault={() => run(toggleMark(schema.marks.em))}
            >
                <em>I</em>
            </button>
            {#if allowList && !inline}
                <button
                    class="rich-text__tool"
                    class:rich-text__tool--active={listActive}
                    type="button"
                    aria-label="Liste"
                    title="Aufzählung"
                    on:mousedown|preventDefault={toggleBulletList}
                >
                    <svg aria-hidden="true" viewBox="0 0 24 24">
                        <path
                            d="M4 6.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 5.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 5.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM9 5.5h11v2H9v-2Zm0 5.5h11v2H9v-2Zm0 5.5h11v2H9v-2Z"
                        />
                    </svg>
                </button>
            {/if}
        </div>
    {/if}
    {#if !mounted}
        <div class="rich-text__fallback">{@html marked(value ?? "")}</div>
    {/if}
    <div class="rich-text__host" bind:this={host}></div>
    {#if matches.length > 0}
        <ul class="rich-text__matches" style="top: {matchTop}px; left: {matchLeft}px;">
            {#each matches as entry, entryIndex (entry)}
                <li>
                    <button
                        class="rich-text__match"
                        class:rich-text__match--active={entryIndex === matchIndex}
                        type="button"
                        on:mousedown|preventDefault={() => applyMatch(entry)}
                    >
                        {entry}
                    </button>
                </li>
            {/each}
        </ul>
    {/if}
    <input type="hidden" {name} value={current} />
</div>

<style>
    .rich-text {
        position: relative;
        border-bottom: 1px dashed var(--color-gulfstream-400);
        cursor: text;
        transition: background-color 0.12s ease;
    }

    .rich-text:hover {
        background-color: rgba(45, 79, 50, 0.05);
    }

    .rich-text--focused,
    .rich-text--focused:hover {
        background-color: rgba(255, 255, 255, 0.55);
        border-bottom-color: var(--color-gulfstream-700);
        border-bottom-style: solid;
    }

    .rich-text--inline {
        display: inline-block;
        min-width: 4rem;
    }

    .rich-text__toolbar {
        position: absolute;
        bottom: calc(100% + 0.25rem);
        left: 0;
        z-index: 45;
        display: inline-flex;
        gap: 0.15rem;
        border: 1px solid var(--color-gulfstream-300);
        border-radius: 0.25rem;
        background: white;
        padding: 0.15rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.16);
    }

    .rich-text__tool {
        display: inline-flex;
        width: 1.75rem;
        height: 1.75rem;
        align-items: center;
        justify-content: center;
        border-radius: 0.2rem;
        color: var(--color-gulfstream-800);
        font-size: 0.9rem;
        font-weight: 400;
        line-height: 1;
    }

    .rich-text__tool:hover {
        background: var(--color-gulfstream-100);
    }

    .rich-text__tool--active {
        background: var(--color-gulfstream-700);
        color: white;
    }

    .rich-text__tool svg {
        width: 1rem;
        height: 1rem;
        fill: currentColor;
    }

    .rich-text__matches {
        position: absolute;
        z-index: 46;
        margin: 0;
        max-width: min(28rem, 90vw);
        list-style: none;
        border: 1px solid var(--color-gulfstream-300);
        border-radius: 0.25rem;
        background: white;
        padding: 0.2rem;
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
    }

    .rich-text__match {
        display: block;
        width: 100%;
        border-radius: 0.2rem;
        padding: 0.25rem 0.45rem;
        text-align: left;
        font-size: 0.85rem;
        font-weight: 400;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .rich-text__match--active,
    .rich-text__match:hover {
        background: var(--color-gulfstream-700);
        color: white;
    }

    .rich-text :global(.ProseMirror) {
        outline: none;
        white-space: pre-wrap;
        word-wrap: break-word;
    }

    .rich-text :global(.ProseMirror ul) {
        list-style-type: disc;
        margin-left: 1.5rem;
    }

    .rich-text :global(.ProseMirror ol) {
        list-style-type: decimal;
        margin-left: 1.5rem;
    }

    .rich-text :global(.ProseMirror strong) {
        font-weight: 700;
    }

    .rich-text :global(.ProseMirror em) {
        font-style: italic;
    }

    .rich-text--inline :global(.ProseMirror p) {
        margin: 0;
    }
</style>
