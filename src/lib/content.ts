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
    {
        key: "Vertretungen",
        title: "Vertretungen",
        description: "Vorschlagsliste für Aufzählungen in den Neuigkeiten.",
        type: "table",
        columns: ["Eintrag"],
    },
    {
        key: "Titelbild",
        title: "Titelbild",
        description: "Text im Titelbild.",
        type: "richText",
        columns: ["Text"],
        multilineColumns: [0],
    },
    {
        key: "Willkommen",
        title: "Willkommen",
        description: "Begrüßungstext auf der Startseite.",
        type: "richText",
        columns: ["Text"],
        multilineColumns: [0],
    },
    {
        key: "AnfahrtBus",
        title: "Anfahrt mit dem Bus",
        description: "Wegbeschreibung für den Bus.",
        type: "richText",
        columns: ["Text"],
        multilineColumns: [0],
    },
    {
        key: "AnfahrtAuto",
        title: "Anfahrt mit dem Auto",
        description: "Wegbeschreibung für das Auto.",
        type: "richText",
        columns: ["Text"],
        multilineColumns: [0],
    },
    {
        key: "Termine",
        title: "Termin vereinbaren",
        description: "Text über den Kontaktdaten.",
        type: "richText",
        columns: ["Text"],
        multilineColumns: [0],
    },
    {
        key: "Team",
        title: "Über uns",
        description: "Einleitung auf der Team-Seite.",
        type: "richText",
        columns: ["Text"],
        multilineColumns: [0],
    },
];

/** Ausgangstexte, solange für einen Bereich nichts gespeichert ist. */
export const SECTION_DEFAULT_TEXT: Record<string, string> = {
    Titelbild: "Hausarztpraxis in Trier\\\nThiemo Stiemert",
    // Die Überschrift der Startseite übernimmt "Herzlich Willkommen" und
    // "Ihre Gesundheit steht bei uns im Mittelpunkt" — hier nicht wiederholen.
    Willkommen: [
        "Auf den folgenden Seiten möchten wir uns bei Ihnen vorstellen. Sie erhalten Auskünfte zum Leistungsspektrum sowie zur Diagnostik der hausärztlichen Praxis.",
        "Wir freuen uns auf Ihren Besuch in unserer modern ausgestatteten hausärztlichen Praxis. Unabhängig von der Behandlung versuchen wir unsere Patienten umfassend zu informieren, denn nur gut informierte Patienten sind in der Lage richtige Entscheidungen zu treffen.",
        "Uns ist es ein großes Anliegen, dass Sie sich in unserer hausärztlichen Praxis wohl und gut aufgehoben fühlen. Für Rückmeldungen sind wir stets dankbar.",
        "Ihr Praxisteam",
    ].join("\n\n"),
    AnfahrtBus:
        'Bushaltestelle "Barbarathermen" in der Südallee: Linien 1, 10, 40, 81. Von dort zu Fuß in 3 Minuten (ca. 210 m). Auf Friedrich-Wilhelm-Straße ca. 170 m nach Süden Richtung Gilbertstraße. Dann rechts abbiegen und ca. 42 m auf Gilbertstraße. Die Gemeinschaftspraxis befindet sich auf der linken Seite.',
    AnfahrtAuto:
        "Kurzzeitparkplätze (2 Stunden) in der Gilbertstraße und Friedrich-Wilhelm-Straße. 3 Parkplätze vor der Praxis.",
    Termine:
        "Terminvereinbarungen aller Art sowie Therapie-,\\\nDiagnoseanfragen sind nur persönlich oder telefonisch möglich! Beachten Sie die Bandansage.",
    Team: "Der persönliche Kontakt ist uns besonders wichtig. Als Team aus Ärzten und Arzthelferinnen ist es unser Ziel, Sie bei jeder Gelegenheit gut zu betreuen. Wir hoffen, Sie werden sich jederzeit gut aufgehoben fühlen. Lernen Sie unser Team kennen.",
};

export function textOf(content: SiteContent, key: string): string {
    return content[key]?.[0]?.[0]?.replaceAll("\r", "") || SECTION_DEFAULT_TEXT[key] || "";
}

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
            // Zeilen mit Art-Spalte, auch wenn hintere Spalten leer sind.
            if (row[0] === "Sprechzeit" || row[0] === "Hinweis") {
                return [row[0], row[1] || "", row[2] || "", row[3] || ""];
            }

            if (row[1]) {
                return ["Sprechzeit", row[0] || "", row[1] || "", row[2] || ""];
            }

            return ["Hinweis", row[0] || "", "", ""];
        });
    }

    return rows;
}
