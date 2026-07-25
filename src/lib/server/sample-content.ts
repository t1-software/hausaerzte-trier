import type { SiteContent } from "$lib/content";

/**
 * Dev-only placeholder content, used when no BLOB_READ_WRITE_TOKEN is configured.
 * Production always reads from the blob store — this file never reaches visitors.
 */
export const SAMPLE_CONTENT: SiteContent = {
    Wichtig: [["Beispiel: Am 01.08. bleibt die Praxis geschlossen."]],
    Hinweis: [["Beispiel-Hinweis: Bitte bringen Sie zu jedem Termin Ihre Versichertenkarte mit."]],
    Neuigkeiten: [
        [
            "**Grippeschutzimpfung:** Ab Oktober bieten wir wieder Termine zur Grippeschutzimpfung an.\n\n- Terminvereinbarung telefonisch\n- Bitte Impfpass mitbringen",
        ],
    ],
    Urlaub: [
        ["04.08.2026", "15.08.2026"],
        ["24.12.2026", "31.12.2026"],
    ],
    Sprechzeiten: [
        ["Montag", "08:00 – 12:00", "14:30 – 17:00"],
        ["Dienstag", "08:00 – 12:00", ""],
        ["Mittwoch", "08:00 – 12:00", ""],
        ["Donnerstag", "08:00 – 12:00", "14:30 – 17:00"],
        ["Freitag", "08:00 – 12:00", ""],
        ["sowie nach Vereinbarung"],
    ],
    Leistungsspektrum: [
        ["Hausärztliche Grundversorgung", "Diagnostik und Therapie akuter und chronischer Erkrankungen."],
        ["Gesundheitsuntersuchungen", "Check-up 35, Hautkrebsscreening und Krebsvorsorge."],
        ["EKG und Langzeitmessungen", "Ruhe-EKG, Langzeit-EKG und Langzeit-Blutdruckmessung."],
        ["Impfungen", "Alle empfohlenen Schutzimpfungen inklusive Reiseimpfberatung."],
        ["Labordiagnostik", "Blut- und Urinuntersuchungen in Zusammenarbeit mit Partnerlaboren."],
    ],
};
