export function formatNewsContent(news: string[][]): string {
    return news.map((n) => n[0]).join("\n");
}

export function hasContent(section: string[][]): boolean {
    return section && section.length > 0;
}

export function formatPhoneNumber(phone: string): string {
    return phone.replace(/(\d{2})(\d{3})(\d{6})/, "+$1 $2 $3");
}
