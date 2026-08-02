import type { LayoutServerLoad } from "./$types";
import { loadSiteContent } from "$lib/server/content-store";
import { isAdminAuthenticated } from "$lib/server/admin-auth";
import { EDIT_MODE_COOKIE, editModeFromCookie } from "$lib/edit-mode";

export const load: LayoutServerLoad = async ({ cookies, route }) => {
    // Die Darstellung kommt aus dem Cookie, damit der Server sie mitrendert (kein Flackern).
    const editMode = editModeFromCookie(cookies.get(EDIT_MODE_COOKIE));

    if (route.id?.startsWith("/admin")) {
        return {
            content: {},
            isEditor: isAdminAuthenticated(cookies),
            editMode,
        };
    }

    return {
        content: await loadSiteContent(),
        isEditor: isAdminAuthenticated(cookies),
        editMode,
    };
};
