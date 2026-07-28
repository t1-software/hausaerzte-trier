import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import {
    clearAdminSession,
    isAdminAuthenticated,
    isAdminConfigured,
    isValidAdminPassword,
    setAdminSession,
} from "$lib/server/admin-auth";

export const load: PageServerLoad = async ({ cookies }) => {
    if (isAdminAuthenticated(cookies)) {
        redirect(303, "/");
    }

    return {
        configured: isAdminConfigured(),
    };
};

export const actions: Actions = {
    login: async ({ cookies, request }) => {
        const formData = await request.formData();
        const password = formData.get("password");
        const redirectTo = formData.get("redirectTo");

        if (typeof password !== "string" || !isValidAdminPassword(password)) {
            return fail(401, {
                message: "Das Passwort ist nicht korrekt.",
            });
        }

        setAdminSession(cookies);
        const target =
            typeof redirectTo === "string" && redirectTo.startsWith("/") && !redirectTo.startsWith("//")
                ? redirectTo
                : "/";
        redirect(303, target);
    },
    logout: async ({ cookies }) => {
        clearAdminSession(cookies);
        redirect(303, "/");
    },
};
