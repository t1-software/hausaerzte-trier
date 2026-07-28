import { dev } from "$app/environment";
import { env } from "$env/dynamic/private";
import type { Cookies } from "@sveltejs/kit";
import { createHmac, timingSafeEqual } from "crypto";

const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

export function isAdminConfigured(): boolean {
    return Boolean(env.ADMIN_PASSWORD);
}

export function isValidAdminPassword(password: string): boolean {
    const configuredPassword = env.ADMIN_PASSWORD;

    if (!configuredPassword) {
        return false;
    }

    return safeCompare(password, configuredPassword);
}

export function setAdminSession(cookies: Cookies): void {
    const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
    const sessionValue = `${expiresAt}.${sign(String(expiresAt))}`;

    cookies.set(ADMIN_SESSION_COOKIE, sessionValue, {
        httpOnly: true,
        maxAge: SESSION_MAX_AGE_SECONDS,
        path: "/",
        sameSite: "strict",
        secure: !dev,
    });
}

export function clearAdminSession(cookies: Cookies): void {
    cookies.delete(ADMIN_SESSION_COOKIE, {
        path: "/",
    });
}

export function isAdminAuthenticated(cookies: Cookies): boolean {
    const sessionValue = cookies.get(ADMIN_SESSION_COOKIE);

    if (!sessionValue) {
        return false;
    }

    const [rawExpiresAt, signature] = sessionValue.split(".");
    const expiresAt = Number(rawExpiresAt);

    if (!Number.isFinite(expiresAt) || expiresAt < Date.now() || !signature) {
        return false;
    }

    return safeCompare(signature, sign(rawExpiresAt));
}

function sign(value: string): string {
    return createHmac("sha256", env.ADMIN_SESSION_SECRET || env.ADMIN_PASSWORD || "")
        .update(value)
        .digest("hex");
}

function safeCompare(value: string, expected: string): boolean {
    const valueBuffer = Buffer.from(value);
    const expectedBuffer = Buffer.from(expected);

    if (valueBuffer.length !== expectedBuffer.length) {
        return false;
    }

    return timingSafeEqual(valueBuffer, expectedBuffer);
}
