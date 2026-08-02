import { browser } from "$app/environment";
import { writable } from "svelte/store";

/**
 * Sitzungs-Cookie statt sessionStorage: Der Server muss die gewählte Darstellung schon
 * beim Rendern kennen, sonst blitzt nach jedem Neuladen kurz die Bearbeitungsansicht auf.
 * Ohne Ablaufdatum — gilt wie vorher nur bis zum Schließen des Browsers.
 */
export const EDIT_MODE_COOKIE = "edit_mode";

const legacyStorageKey = "hausaerzte-trier-edit-mode";
const legacyPopupStorageKey = "hausaerzte-trier-homepage-popup-dismissed";

/** Bearbeiten ist die Vorgabe; nur ein ausdrückliches "false" schaltet auf Ansicht. */
export function editModeFromCookie(value: string | undefined): boolean {
    return value !== "false";
}

function readCookie(): boolean {
    if (!browser) {
        return true;
    }

    // Aufräumen: Schlüssel des entfernten Startseiten-Popups und der alten Speicherung.
    sessionStorage.removeItem(legacyPopupStorageKey);
    sessionStorage.removeItem(legacyStorageKey);

    const entry = document.cookie.split("; ").find((part) => part.startsWith(`${EDIT_MODE_COOKIE}=`));

    return editModeFromCookie(entry?.slice(EDIT_MODE_COOKIE.length + 1));
}

/**
 * Schaltet im Admin-Modus zwischen Bearbeitungs- und Ansichtsdarstellung.
 * Gilt nur für angemeldete Admins und hält pro Browser-Sitzung.
 */
export const editMode = writable(readCookie());

if (browser) {
    editMode.subscribe((value) => {
        document.cookie = `${EDIT_MODE_COOKIE}=${value}; path=/; samesite=strict`;
    });
}

export function toggleEditMode() {
    editMode.update((value) => !value);
}
