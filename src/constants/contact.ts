export const CONTACT_INFO = {
    PHONE: "+49651975150",
    EMAIL: "praxis@hausaerzte-trier.de",
    FAX: "+496519751520",
    ADDRESS: "Gilbertstraße 59, 54290 Trier",
    GOOGLE_MAPS_URL: "https://maps.google.com/?q=Gilbertstraße+59,+54290+Trier,+Germany",
} as const;

export const BUS_INFO = {
    STOP: "Barbarathermen",
    STREET: "Südallee",
    LINES: "1, 10, 40, 81",
    WALKING_TIME: "3 Minuten",
    DISTANCE: "210 m",
} as const;

export const PARKING_INFO = {
    TYPE: "Kurzzeitparkplätze",
    DURATION: "2 Stunden",
    LOCATIONS: ["Gilbertstraße", "Friedrich-Wilhelm-Straße"],
    PRACTICE_SPOTS: "3 Parkplätze vor der Praxis",
} as const;
