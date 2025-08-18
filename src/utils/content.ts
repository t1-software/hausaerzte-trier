export const CONTENT_SECTIONS = {
    NEWS: "Neuigkeiten",
    OPENING_HOURS: "Sprechzeiten",
    VACATIONS: "Urlaub",
    IMPORTANT: "Wichtig",
} as const;

export function formatNewsContent(news: string[][]): string {
    return news.map((n) => n[0]).join("\n");
}

export function hasContent(section: string[][]): boolean {
    return section && section.length > 0;
}

export function formatPhoneNumber(phone: string): string {
    return phone.replace(/(\d{2})(\d{3})(\d{6})/, "+$1 $2 $3");
}

export function transformGoogleSheetData(rawData: Record<string, string[][]>) {
    return {
        news: rawData[CONTENT_SECTIONS.NEWS] || [],
        openingHours: rawData[CONTENT_SECTIONS.OPENING_HOURS] || [],
        vacations: rawData[CONTENT_SECTIONS.VACATIONS] || [],
        important: rawData[CONTENT_SECTIONS.IMPORTANT]?.[0]?.[0] || "",
    };
}
