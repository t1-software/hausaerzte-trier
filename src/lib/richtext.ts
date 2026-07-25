import { Schema, type Node as ProseNode } from "prosemirror-model";
import {
    defaultMarkdownParser,
    defaultMarkdownSerializer,
    MarkdownSerializer,
    schema as markdownSchema,
} from "prosemirror-markdown";

/** Vollständiges Markdown (Absätze, Listen, Fett, Kursiv) für mehrzeilige Inhalte. */
export const blockSchema = markdownSchema;

/** Einzeiliges Feld: nur Text mit Fett und Kursiv, keine Absätze oder Listen. */
export const inlineSchema = new Schema({
    nodes: {
        doc: { content: "paragraph" },
        paragraph: {
            content: "inline*",
            parseDOM: [{ tag: "p" }],
            toDOM: () => ["p", 0],
        },
        text: { group: "inline" },
    },
    marks: {
        em: markdownSchema.spec.marks.get("em")!,
        strong: markdownSchema.spec.marks.get("strong")!,
    },
});

/** Wie die Standardausgabe, nur mit "-" als Listenzeichen wie im bisherigen Inhalt. */
const blockSerializer = new MarkdownSerializer(
    {
        ...defaultMarkdownSerializer.nodes,
        bullet_list(state, node) {
            state.renderList(node, "  ", () => "- ");
        },
    },
    defaultMarkdownSerializer.marks
);

const inlineSerializer = new MarkdownSerializer(
    {
        paragraph(state, node) {
            state.renderInline(node);
        },
        text: defaultMarkdownSerializer.nodes.text,
    },
    {
        em: defaultMarkdownSerializer.marks.em,
        strong: defaultMarkdownSerializer.marks.strong,
    }
);

export function parseMarkdown(markdown: string, inline: boolean): ProseNode {
    const source = markdown ?? "";

    if (!inline) {
        return defaultMarkdownParser.parse(source);
    }

    const parsed = defaultMarkdownParser.parse(source);
    const inlineNodes: ProseNode[] = [];

    parsed.descendants((node) => {
        if (!node.isText) {
            return true;
        }

        const marks = node.marks
            .map((mark) => inlineSchema.marks[mark.type.name]?.create(mark.attrs))
            .filter((mark) => mark !== undefined);

        inlineNodes.push(inlineSchema.text(node.text ?? "", marks));
        return false;
    });

    return inlineSchema.node("doc", null, [inlineSchema.node("paragraph", null, inlineNodes)]);
}

export function serializeMarkdown(doc: ProseNode, inline: boolean): string {
    if (inline) {
        return inlineSerializer.serialize(doc).trim();
    }

    return blockSerializer.serialize(doc).trim();
}
