import { get, put } from "@vercel/blob";
import { readFile, writeFile } from "node:fs/promises";
import { dev } from "$app/environment";
import { env } from "$env/dynamic/private";
import { normalizeContent, type SiteContent } from "$lib/content";
import { SAMPLE_CONTENT } from "./sample-content";

const CONTENT_BLOB_PATH = "site-content/content.json";

/**
 * Wie lange das CDN die Inhalte ausliefert, bevor es erneut im Blob Store nachfragt. Nur ein
 * solcher Miss zählt als Blob-Operation, und der Free Tier erlaubt 10.000 im Monat — 60 Sekunden
 * waren dafür zu kurz: zwischen zwei Seitenaufrufen liegt hier meist mehr als eine Minute, jeder
 * Aufruf war also wieder ein Miss. Der Preis sind bis zu 10 Minuten alte Inhalte für Besucher,
 * auch beim zeitgesteuerten Ausblenden. Redakteure lesen weiter direkt (siehe `LoadOptions`).
 */
const CONTENT_CACHE_SECONDS = 600;

export function isContentStoreConfigured(): boolean {
    return Boolean(env.CONTENT_FILE || env.BLOB_READ_WRITE_TOKEN);
}

/**
 * Mit CONTENT_FILE liegen die Inhalte in einer lokalen JSON-Datei statt im Blob Store.
 * Zum Entwickeln und Testen gedacht: Speichern im Editor fasst dann die Produktionsdaten
 * nicht an. Die Datei hat dasselbe Format wie site-content/content.json.
 */
function contentFile(): string {
    return env.CONTENT_FILE ?? "";
}

export type LoadOptions = {
    /**
     * Am CDN-Cache vorbei direkt aus dem Blob Store lesen. Nur für Editoren gedacht: sie müssen
     * ihre eigene Änderung sofort sehen. Für Besucher ist der Cache richtig — jeder Treffer dort
     * kostet keine Blob-Operation (gezählt wird nur ein Cache-Miss).
     */
    fresh?: boolean;
};

export async function loadSiteContent(options: LoadOptions = {}): Promise<SiteContent> {
    const file = contentFile();

    if (file) {
        return normalizeContent(await readContentFile(file));
    }

    const blobContent = await loadBlobContent(options.fresh ?? false);

    if (blobContent) {
        return blobContent;
    }

    if (dev && !isContentStoreConfigured()) {
        return normalizeContent(SAMPLE_CONTENT);
    }

    return normalizeContent({});
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
    const serialized = JSON.stringify(normalizeContent(content), null, 2);
    const file = contentFile();

    if (file) {
        await writeFile(file, serialized, "utf8");
        return;
    }

    const token = env.BLOB_READ_WRITE_TOKEN;

    if (!token) {
        throw new Error("BLOB_READ_WRITE_TOKEN is not configured.");
    }

    await put(CONTENT_BLOB_PATH, serialized, {
        access: "private",
        allowOverwrite: true,
        contentType: "application/json; charset=utf-8",
        cacheControlMaxAge: CONTENT_CACHE_SECONDS,
        token,
    });
}

/** Fehlt die Datei noch, startet sie mit den Beispielinhalten. */
async function readContentFile(file: string): Promise<unknown> {
    try {
        return JSON.parse(await readFile(file, "utf8"));
    } catch (error) {
        if ((error as NodeJS.ErrnoException)?.code !== "ENOENT") {
            console.error(`Failed to read ${file}:`, error);
        }

        return SAMPLE_CONTENT;
    }
}

/**
 * Aus dem Cache gelesene Inhalte sind bis zu `cacheControlMaxAge` Sekunden alt (siehe
 * `saveSiteContent`). Ohne Cache wäre jeder Seitenaufruf eine Blob-Operation.
 */
async function loadBlobContent(fresh: boolean): Promise<SiteContent | null> {
    const token = env.BLOB_READ_WRITE_TOKEN;

    if (!token) {
        return null;
    }

    try {
        const blob = await get(CONTENT_BLOB_PATH, {
            access: "private",
            token,
            useCache: !fresh,
        });

        if (!blob || blob.statusCode !== 200) {
            return null;
        }

        const response = new Response(blob.stream);
        return normalizeContent(await response.json());
    } catch (error) {
        console.error("Failed to load Vercel Blob content:", error);
        return null;
    }
}
