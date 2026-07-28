import { Schema, type Node as ProseNode, type NodeSpec } from "prosemirror-model";
import {
    defaultMarkdownParser,
    defaultMarkdownSerializer,
    MarkdownParser,
    MarkdownSerializer,
    schema as markdownSchema,
} from "prosemirror-markdown";

/** Vollständiges Markdown (Absätze, Listen, Fett, Kursiv) für mehrzeilige Inhalte. */
export const blockSchema = markdownSchema;

/**
 * Gespeichert wird eine Vertretungspraxis weiterhin als Listenzeile
 * "- Name, Adresse, Tel.: Nummer" — kompatibel zum bestehenden Inhalt.
 * Editor und Anzeige stellen diese Zeile als Karte dar.
 */
export const PRAXIS_LINE = /^(.+?),\s*(.+),\s*Tel\.:\s*(.+)$/;

export interface PraxisAttrs {
    name: string;
    address: string;
    phone: string;
}

export function parsePraxisLine(text: string): PraxisAttrs | null {
    const match = PRAXIS_LINE.exec(text.trim());

    if (!match) {
        return null;
    }

    return { name: match[1].trim(), address: match[2].trim(), phone: match[3].trim() };
}

export function praxisLine({ name, address, phone }: PraxisAttrs): string {
    return `${name}, ${address}, Tel.: ${phone}`;
}

const praxisNodeSpec: NodeSpec = {
    group: "block",
    atom: true,
    selectable: true,
    draggable: true,
    attrs: {
        name: { default: "" },
        address: { default: "" },
        phone: { default: "" },
    },
    parseDOM: [
        {
            tag: "div[data-praxis]",
            getAttrs: (dom) => ({
                name: (dom as HTMLElement).getAttribute("data-name") ?? "",
                address: (dom as HTMLElement).getAttribute("data-address") ?? "",
                phone: (dom as HTMLElement).getAttribute("data-phone") ?? "",
            }),
        },
    ],
    toDOM: (node) => [
        "div",
        {
            "data-praxis": "true",
            "data-name": node.attrs.name,
            "data-address": node.attrs.address,
            "data-phone": node.attrs.phone,
            "class": "praxis-card",
        },
        ["strong", node.attrs.name],
        ["span", node.attrs.address],
        ["span", node.attrs.phone],
    ],
};

/** Neuigkeiten: Markdown-Schema plus Vertretungskarte. */
export const newsSchema = new Schema({
    nodes: markdownSchema.spec.nodes.addToEnd("praxis", praxisNodeSpec),
    marks: markdownSchema.spec.marks,
});

const newsParser = new MarkdownParser(newsSchema, defaultMarkdownParser.tokenizer, defaultMarkdownParser.tokens);

/**
 * Ersetzt Listenpunkte im Vertretungsformat durch Karten-Knoten.
 * Gemischte Listen werden in Textpunkte und Karten aufgeteilt.
 */
function liftPraxisNodes(doc: ProseNode): ProseNode {
    const blocks: ProseNode[] = [];

    doc.forEach((block) => {
        if (block.type.name !== "bullet_list") {
            blocks.push(block);
            return;
        }

        let plainItems: ProseNode[] = [];

        const flushPlain = () => {
            if (plainItems.length > 0) {
                blocks.push(newsSchema.node("bullet_list", block.attrs, plainItems));
                plainItems = [];
            }
        };

        block.forEach((item) => {
            const attrs = item.childCount === 1 ? parsePraxisLine(item.child(0).textContent) : null;

            if (attrs) {
                flushPlain();
                blocks.push(newsSchema.node("praxis", attrs));
            } else {
                plainItems.push(item);
            }
        });

        flushPlain();
    });

    return newsSchema.node("doc", null, blocks);
}

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

const newsSerializer = new MarkdownSerializer(
    {
        ...defaultMarkdownSerializer.nodes,
        bullet_list(state, node) {
            state.renderList(node, "  ", () => "- ");
        },
        praxis(state, node) {
            state.write(`- ${praxisLine(node.attrs as PraxisAttrs)}`);
            state.closeBlock(node);
        },
    },
    defaultMarkdownSerializer.marks
);

export function parseNews(markdown: string): ProseNode {
    return liftPraxisNodes(newsParser.parse(markdown ?? ""));
}

export function serializeNews(doc: ProseNode): string {
    return newsSerializer.serialize(doc).trim();
}

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
