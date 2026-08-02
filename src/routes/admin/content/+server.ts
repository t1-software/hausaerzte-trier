import { error, redirect, type RequestHandler } from "@sveltejs/kit";
import {
    EDITABLE_CONTENT_SECTIONS,
    HIDDEN_SECTION_KEY,
    isSectionHidden,
    normalizeContent,
    type ContentSection,
    type SiteContent,
} from "$lib/content";
import { localInputToIso } from "$lib/schedule";
import { isAdminAuthenticated } from "$lib/server/admin-auth";
import { loadSiteContent, saveSiteContent } from "$lib/server/content-store";

export const POST: RequestHandler = async ({ cookies, request, url }) => {
    if (!isAdminAuthenticated(cookies)) {
        error(401, {
            message: "Bitte erneut anmelden.",
        });
    }

    const formData = await request.formData();
    const action = valueOf(formData.get("action")) || url.searchParams.get("action") || "";
    const sectionKey = valueOf(formData.get("sectionKey"));
    const redirectTo = valueOf(formData.get("redirectTo")) || "/";

    if (!sectionKey) {
        error(400, {
            message: "Der Inhaltsbereich fehlt.",
        });
    }

    const section = EDITABLE_CONTENT_SECTIONS.find((candidate) => candidate.key === sectionKey);

    if (!section) {
        error(400, {
            message: "Der Inhaltsbereich wurde nicht gefunden.",
        });
    }

    const content = await loadSiteContent();
    const nextContent = normalizeContent(content);

    if (action === "saveBlock") {
        nextContent[section.key] = blockRows(formData);
    } else if (action === "saveRows") {
        nextContent[section.key] = parseRows(section, formData);
    } else if (action === "addRow") {
        nextContent[section.key] = [...parseRows(section, formData), emptyRow(section)];
    } else if (action === "removeRow") {
        const rowIndex = Number(valueOf(formData.get("rowIndex")));
        nextContent[section.key] = parseRows(section, formData).filter((_, index) => index !== rowIndex);
    } else if (action === "toggleHidden") {
        // Ausgeblendet (auch durch einen erreichten Zeitpunkt) wird wieder sichtbar,
        // sichtbar wird sofort ausgeblendet — ein geplanter Zeitpunkt entfällt dabei.
        const others = otherHiddenRows(nextContent, section.key);
        const visibleAgain = isSectionHidden(nextContent, section.key);

        nextContent[HIDDEN_SECTION_KEY] = visibleAgain ? others : [...others, [section.key]];
    } else if (action === "setHideAt") {
        const hideAt = localInputToIso(valueOf(formData.get("hideAt")));
        const others = otherHiddenRows(nextContent, section.key);

        nextContent[HIDDEN_SECTION_KEY] = hideAt ? [...others, [section.key, hideAt]] : others;
    } else {
        error(400, {
            message: "Die Aktion ist ungültig.",
        });
    }

    await saveSiteContent(nextContent);

    redirect(303, safeRedirect(url, redirectTo));
};

/** Alle Ausblend-Zeilen außer der des Bereichs. */
function otherHiddenRows(content: SiteContent, key: string): string[][] {
    return (content[HIDDEN_SECTION_KEY] ?? []).filter((row) => row[0] && row[0] !== key);
}

function blockRows(formData: FormData): string[][] {
    const text = valueOf(formData.get("text")).trim();
    return text ? [[text]] : [];
}

function parseRows(section: ContentSection, formData: FormData): string[][] {
    const rowCount = Number(valueOf(formData.get("rowCount")));
    const rows: string[][] = [];

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
        const row = section.columns.map((_, columnIndex) =>
            valueOf(formData.get(`cell:${rowIndex}:${columnIndex}`))
                .replaceAll("\r", "")
                .trim()
        );

        if (row.some((cell) => cell !== "")) {
            rows.push(row);
        }
    }

    return rows;
}

function emptyRow(section: ContentSection): string[] {
    if (section.key === "Sprechzeiten") {
        return ["Sprechzeit", "", "", ""];
    }

    return section.columns.map(() => "");
}

function valueOf(value: FormDataEntryValue | null): string {
    return typeof value === "string" ? value : "";
}

function safeRedirect(url: URL, redirectTo: string): string {
    if (!redirectTo.startsWith("/") || redirectTo.startsWith("//")) {
        return "/";
    }

    return new URL(redirectTo, url).pathname + new URL(redirectTo, url).search + new URL(redirectTo, url).hash;
}
