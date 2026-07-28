import { browser } from "$app/environment";
import { writable } from "svelte/store";

const storageKey = "hausaerzte-trier-edit-mode";
const legacyPopupStorageKey = "hausaerzte-trier-homepage-popup-dismissed";

function readStored(): boolean {
    if (!browser) {
        return true;
    }
    // Aufräumen: Flag des entfernten Startseiten-Popups.
    sessionStorage.removeItem(legacyPopupStorageKey);
    return sessionStorage.getItem(storageKey) !== "false";
}

/**
 * Schaltet im Admin-Modus zwischen Bearbeitungs- und Ansichtsdarstellung.
 * Gilt nur für angemeldete Admins und hält pro Browser-Sitzung.
 */
export const editMode = writable(readStored());

if (browser) {
    editMode.subscribe((value) => sessionStorage.setItem(storageKey, String(value)));
}

export function toggleEditMode() {
    editMode.update((value) => !value);
}
