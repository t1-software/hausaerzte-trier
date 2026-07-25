import { error, type RequestHandler } from "@sveltejs/kit";
import { get } from "@vercel/blob";
import { env } from "$env/dynamic/private";

/** Liefert Bilder aus der Medienbibliothek (privater Blob Store) öffentlich aus. */
const CONTENT_TYPES: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
};

export const GET: RequestHandler = async ({ params }) => {
    const file = params.file ?? "";
    const extension = file.split(".").pop()?.toLowerCase() ?? "";
    const token = env.BLOB_READ_WRITE_TOKEN;

    if (!token || file.includes("..") || !CONTENT_TYPES[extension]) {
        error(404, { message: "Bild nicht gefunden." });
    }

    const blob = await get(`site-images/${file}`, { access: "private", token });

    if (!blob || blob.statusCode !== 200) {
        error(404, { message: "Bild nicht gefunden." });
    }

    return new Response(blob.stream, {
        headers: {
            "content-type": CONTENT_TYPES[extension],
            // Dateinamen sind zeitstempel-eindeutig, daher darf aggressiv gecacht werden.
            "cache-control": "public, max-age=31536000, immutable",
        },
    });
};
