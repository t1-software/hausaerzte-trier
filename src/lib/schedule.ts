/**
 * Zeitgesteuertes Ausblenden.
 *
 * Gespeichert wird immer ein absoluter Zeitpunkt (ISO in UTC). Eingegeben und
 * angezeigt wird deutsche Ortszeit — der Server läuft in UTC und würde eine
 * naiv gespeicherte Uhrzeit sonst ein bis zwei Stunden zu früh ausblenden.
 */
const TIME_ZONE = "Europe/Berlin";

/** Format von <input type="datetime-local">, z. B. 2026-08-15T12:00. */
const LOCAL_INPUT = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/;

const partsFormat = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
});

const displayFormat = new Intl.DateTimeFormat("de-DE", {
    timeZone: TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
});

/** Ortszeit-Bestandteile eines Zeitpunkts. */
function zoneParts(instant: number): Record<string, number> {
    const parts = partsFormat.formatToParts(new Date(instant));
    const values: Record<string, number> = {};

    parts.forEach((part) => {
        if (part.type !== "literal") {
            values[part.type] = Number(part.value);
        }
    });

    // Mitternacht liefert je nach Umgebung 24 statt 0.
    values.hour = (values.hour ?? 0) % 24;

    return values;
}

/** Verschiebung der Ortszeit gegenüber UTC zu diesem Zeitpunkt, in Millisekunden. */
function zoneOffset(instant: number): number {
    const parts = zoneParts(instant);
    const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);

    return asUtc - Math.floor(instant / 1000) * 1000;
}

/** "2026-08-15T12:00" (Ortszeit) → ISO-Zeitpunkt in UTC. Leer, wenn unbrauchbar. */
export function localInputToIso(input: string): string {
    const match = LOCAL_INPUT.exec(input.trim());

    if (!match) {
        return "";
    }

    const [, year, month, day, hour, minute] = match.map(Number);
    const wallClock = Date.UTC(year, month - 1, day, hour, minute);

    // Zweimal rechnen: die erste Verschiebung kann noch aus der falschen
    // Hälfte einer Zeitumstellung stammen.
    let instant = wallClock - zoneOffset(wallClock);
    instant = wallClock - zoneOffset(instant);

    return new Date(instant).toISOString();
}

/** ISO-Zeitpunkt → "2026-08-15T12:00" für <input type="datetime-local">. */
export function isoToLocalInput(iso: string): string {
    const instant = Date.parse(iso);

    if (Number.isNaN(instant)) {
        return "";
    }

    const parts = zoneParts(instant);
    const pad = (value: number) => String(value).padStart(2, "0");

    return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}T${pad(parts.hour)}:${pad(parts.minute)}`;
}

/** ISO-Zeitpunkt → "15.08.2026, 12:00" für die Anzeige. */
export function formatHideAt(iso: string): string {
    const instant = Date.parse(iso);

    if (Number.isNaN(instant)) {
        return "";
    }

    return displayFormat.format(new Date(instant));
}

/** Ist der Zeitpunkt erreicht? Unbrauchbare Werte blenden nichts aus. */
export function isHideAtReached(iso: string, now: number): boolean {
    const instant = Date.parse(iso);

    return !Number.isNaN(instant) && now >= instant;
}
