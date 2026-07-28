import { error, json, type RequestHandler } from "@sveltejs/kit";
import { del, list, put } from "@vercel/blob";
import { env } from "$env/dynamic/private";
import { isAdminAuthenticated } from "$lib/server/admin-auth";

/**
 * Medienbibliothek: alle hochgeladenen Bilder liegen unter `site-images/` im
 * (privaten) Blob Store und werden über /media/<name> ausgeliefert. Sie bleiben
 * verfügbar, bis sie hier ausdrücklich gelöscht werden.
 */
const MEDIA_PREFIX = "site-images/";

/** Öffentliche Adresse eines gespeicherten Bilds auf dieser Website. */
function publicUrl(pathname: string): string {
    return `/media/${pathname.slice(MEDIA_PREFIX.length)}`;
}

const ALLOWED_TYPES: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
};

function requireToken(): string {
    const token = env.BLOB_READ_WRITE_TOKEN;

    if (!token) {
        error(500, { message: "BLOB_READ_WRITE_TOKEN ist nicht konfiguriert." });
    }

    return token;
}

export const GET: RequestHandler = async ({ cookies }) => {
    if (!isAdminAuthenticated(cookies)) {
        error(401, { message: "Bitte erneut anmelden." });
    }

    const result = await list({ prefix: MEDIA_PREFIX, token: requireToken() });
    const images = result.blobs
        .map((blob) => ({
            url: publicUrl(blob.pathname),
            pathname: blob.pathname,
            uploadedAt: blob.uploadedAt,
            size: blob.size,
        }))
        .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    return json({ images });
};

export const POST: RequestHandler = async ({ cookies, request }) => {
    if (!isAdminAuthenticated(cookies)) {
        error(401, { message: "Bitte erneut anmelden." });
    }

    const token = requireToken();
    const formData = await request.formData();
    const action = formData.get("action");

    if (action === "delete") {
        const url = formData.get("url");

        if (typeof url !== "string" || !url.startsWith("/media/") || url.includes("..")) {
            error(400, { message: "Nur Bilder aus der Medienbibliothek können gelöscht werden." });
        }

        await del(`${MEDIA_PREFIX}${url.slice("/media/".length)}`, { token });
        return json({ ok: true });
    }

    if (action === "upload") {
        const file = formData.get("file");

        if (!(file instanceof File) || !ALLOWED_TYPES[file.type]) {
            error(400, { message: "Bitte ein Bild im Format JPEG, PNG oder WebP hochladen." });
        }

        const baseName =
            (formData.get("name") ?? file.name)
                .toString()
                .toLowerCase()
                .replace(/\.[a-z0-9]+$/i, "")
                .replace(/[^a-z0-9äöüß]+/gi, "-")
                .replace(/^-+|-+$/g, "")
                .slice(0, 60) || "bild";

        const blob = await put(`${MEDIA_PREFIX}${Date.now()}-${baseName}${ALLOWED_TYPES[file.type]}`, file, {
            access: "private",
            token,
            contentType: file.type,
        });

        return json({ url: publicUrl(blob.pathname) });
    }

    error(400, { message: "Die Aktion ist ungültig." });
};
