import adapter from "@sveltejs/adapter-auto";

const config = {
    kit: {
        adapter: adapter(),
        csrf: {
            // Nur im Dev-Server aus: hinter einem HTTPS-Proxy (portless) schickt der Browser
            // Origin: https://name.localhost, der Dev-Server kennt sich selbst aber als
            // http://… — die Prüfung würde jedes Anmelden und Speichern mit 403 abweisen.
            // Im Produktions-Build bleibt sie an.
            checkOrigin: process.env.NODE_ENV === "production",
        },
    },
};

export default config;
