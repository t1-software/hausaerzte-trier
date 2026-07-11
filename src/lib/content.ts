export type SiteContent = Record<string, string[][]>;

export interface ContentSection {
    key: string;
    title: string;
    description: string;
    type: "richText" | "table";
    columns: string[];
    multilineColumns?: number[];
}

export const EDITABLE_CONTENT_SECTIONS: ContentSection[] = [
    {
        key: "Wichtig",
        title: "Wichtig",
        description: "Schmale Hinweisleiste unter dem Titelbild.",
        type: "richText",
        columns: ["Text"],
        multilineColumns: [0],
    },
    {
        key: "Hinweis",
        title: "Hinweis",
        description: "Gelbe Hinweisbox auf der Startseite.",
        type: "richText",
        columns: ["Text"],
        multilineColumns: [0],
    },
    {
        key: "Neuigkeiten",
        title: "Neuigkeiten",
        description: "Aktuelle Meldungen.",
        type: "richText",
        columns: ["Text"],
        multilineColumns: [0],
    },
    {
        key: "Urlaub",
        title: "Urlaub",
        description: "Schließzeiten in der rechten Startseiten-Spalte.",
        type: "table",
        columns: ["Von", "Bis"],
    },
    {
        key: "Sprechzeiten",
        title: "Sprechzeiten",
        description: "Standardisierte Öffnungszeiten. Art ist entweder Sprechzeit oder Hinweis.",
        type: "table",
        columns: ["Art", "Tag oder Hinweis", "Vormittag", "Nachmittag"],
    },
    {
        key: "Leistungsspektrum",
        title: "Leistungsspektrum",
        description: "Einträge auf der Leistungsspektrum-Seite.",
        type: "table",
        columns: ["Titel", "Beschreibung"],
        multilineColumns: [1],
    },
];

export function normalizeContent(input: unknown): SiteContent {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
        return emptyKnownContent();
    }

    const output: SiteContent = emptyKnownContent();

    Object.entries(input as Record<string, unknown>).forEach(([key, value]) => {
        if (!Array.isArray(value)) {
            return;
        }

        const rows = value
            .map((row) => {
                if (!Array.isArray(row)) {
                    return [cleanCell(row)];
                }

                return row.map((cell) => cleanCell(cell));
            })
            .map((row) => trimTrailingEmptyCells(row))
            .filter((row) => row.some((cell) => cell !== ""));

        output[key] = normalizeRowsForSection(key, rows);
    });

    return output;
}

export function getSectionsForContent(content: SiteContent): ContentSection[] {
    const knownKeys = new Set(EDITABLE_CONTENT_SECTIONS.map((section) => section.key));
    const unknownSections = Object.keys(content)
        .filter((key) => !knownKeys.has(key))
        .sort((a, b) => a.localeCompare(b, "de"))
        .map((key) => createGenericSection(key, content[key]));

    return [...EDITABLE_CONTENT_SECTIONS, ...unknownSections];
}

function emptyKnownContent(): SiteContent {
    return Object.fromEntries(EDITABLE_CONTENT_SECTIONS.map((section) => [section.key, []]));
}

function cleanCell(cell: unknown): string {
    return String(cell ?? "")
        .replaceAll("\r", "")
        .trim();
}

function trimTrailingEmptyCells(row: string[]): string[] {
    const next = [...row];

    while (next.length > 0 && next[next.length - 1] === "") {
        next.pop();
    }

    return next;
}

function createGenericSection(key: string, rows: string[][]): ContentSection {
    const columnCount = Math.max(1, ...rows.map((row) => row.length));

    return {
        key,
        title: key,
        description: "Zusätzlicher Inhaltsbereich aus den gespeicherten Daten.",
        type: "table",
        columns: Array.from({ length: columnCount }, (_, idx) => `Spalte ${idx + 1}`),
    };
}

function normalizeRowsForSection(key: string, rows: string[][]): string[][] {
    if (key === "Wichtig" || key === "Hinweis" || key === "Neuigkeiten") {
        const text = rows
            .map((row) => row.join(" ").trim())
            .filter((row) => row !== "")
            .join("\n");

        return text ? [[text]] : [];
    }

    if (key === "Sprechzeiten") {
        return rows.map((row) => {
            if (row.length >= 4) {
                return [row[0] || "Sprechzeit", row[1] || "", row[2] || "", row[3] || ""];
            }

            if (row[1]) {
                return ["Sprechzeit", row[0] || "", row[1] || "", row[2] || ""];
            }

            return ["Hinweis", row[0] || "", "", ""];
        });
    }

    return rows;
}
