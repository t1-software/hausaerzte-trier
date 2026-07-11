import { get, put } from "@vercel/blob";
import { env } from "$env/dynamic/private";
import { normalizeContent, type SiteContent } from "$lib/content";

const CONTENT_BLOB_PATH = "site-content/content.json";

export function isContentStoreConfigured(): boolean {
    return Boolean(env.BLOB_READ_WRITE_TOKEN);
}

export async function loadSiteContent(): Promise<SiteContent> {
    const blobContent = await loadBlobContent();

    if (blobContent) {
        return blobContent;
    }

    return normalizeContent({});
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
    const token = env.BLOB_READ_WRITE_TOKEN;

    if (!token) {
        throw new Error("BLOB_READ_WRITE_TOKEN is not configured.");
    }

    await put(CONTENT_BLOB_PATH, JSON.stringify(normalizeContent(content), null, 2), {
        access: "private",
        allowOverwrite: true,
        contentType: "application/json; charset=utf-8",
        cacheControlMaxAge: 60,
        token,
    });
}

async function loadBlobContent(): Promise<SiteContent | null> {
    const token = env.BLOB_READ_WRITE_TOKEN;

    if (!token) {
        return null;
    }

    try {
        const blob = await get(CONTENT_BLOB_PATH, {
            access: "private",
            token,
            useCache: false,
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
