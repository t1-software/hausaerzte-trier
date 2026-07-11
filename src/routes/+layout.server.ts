import type { LayoutServerLoad } from "./$types";
import { loadSiteContent } from "$lib/server/content-store";
import { isAdminAuthenticated } from "$lib/server/admin-auth";

export const load: LayoutServerLoad = async ({ cookies, route }) => {
    if (route.id?.startsWith("/admin")) {
        return {
            content: {},
            isEditor: isAdminAuthenticated(cookies),
        };
    }

    return {
        content: await loadSiteContent(),
        isEditor: isAdminAuthenticated(cookies),
    };
};
