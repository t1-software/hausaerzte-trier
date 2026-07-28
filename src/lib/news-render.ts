import { marked } from "marked";
import { parsePraxisLine, type PraxisAttrs } from "$lib/richtext";

function escapeHtml(value: string): string {
    return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function praxisCardHtml(attrs: PraxisAttrs): string {
    const phoneHref = attrs.phone.replaceAll(/[^\d+]/g, "");

    return (
        `<div class="praxis-card">` +
        `<strong>${escapeHtml(attrs.name)}</strong>` +
        `<span>${escapeHtml(attrs.address)}</span>` +
        `<a href="tel:${escapeHtml(phoneHref)}">${escapeHtml(attrs.phone)}</a>` +
        `</div>`
    );
}

/**
 * Rendert Neuigkeiten-Markdown; Listenzeilen im Vertretungsformat
 * ("- Name, Adresse, Tel.: Nummer") werden als Karten ausgegeben.
 */
export function renderNews(markdown: string): string {
    const lines = (markdown ?? "").replaceAll("\r", "").split("\n");
    const parts: string[] = [];
    let plain: string[] = [];
    let cards: PraxisAttrs[] = [];

    const flushPlain = () => {
        const text = plain.join("\n").trim();

        if (text) {
            parts.push(marked(text) as string);
        }

        plain = [];
    };

    const flushCards = () => {
        if (cards.length > 0) {
            parts.push(`<div class="praxis-cards">${cards.map(praxisCardHtml).join("")}</div>`);
            cards = [];
        }
    };

    for (const line of lines) {
        const bullet = /^\s*[-*]\s+(.*)$/.exec(line);
        const attrs = bullet ? parsePraxisLine(bullet[1]) : null;

        if (attrs) {
            flushPlain();
            cards.push(attrs);
        } else if (line.trim() === "" && cards.length > 0) {
            // Leerzeile zwischen zwei Karten hält die Gruppe zusammen.
            continue;
        } else {
            flushCards();
            plain.push(line);
        }
    }

    flushPlain();
    flushCards();

    return parts.join("\n");
}
