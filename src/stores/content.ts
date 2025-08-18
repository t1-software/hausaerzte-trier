import { writable, derived } from "svelte/store";
import type { ContentData } from "../types/content";

export const contentStore = writable<ContentData | null>(null);
export const loadingStore = writable(false);
export const errorStore = writable<string | null>(null);

export const newsStore = derived(contentStore, ($content) => $content?.news || []);

export const openingHoursStore = derived(contentStore, ($content) => $content?.openingHours || []);

export const vacationsStore = derived(contentStore, ($content) => $content?.vacations || []);

export const importantMessageStore = derived(contentStore, ($content) => $content?.important || "");

export const contactStore = derived(contentStore, ($content) => $content?.contact || null);
