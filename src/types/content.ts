export interface NewsItem {
    title: string;
    content: string;
    date?: string;
}

export interface OpeningHours {
    day: string;
    morning?: string;
    afternoon?: string;
    note?: string;
}

export interface VacationPeriod {
    startDate: string;
    endDate: string;
}

export interface ContactInfo {
    phone: string;
    email: string;
    fax: string;
    address: string;
}

export interface ContentData {
    news: NewsItem[];
    openingHours: OpeningHours[];
    vacations: VacationPeriod[];
    contact: ContactInfo;
    important?: string;
}
