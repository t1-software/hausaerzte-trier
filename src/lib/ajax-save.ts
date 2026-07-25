import { invalidateAll } from "$app/navigation";

/**
 * Lässt Editor-Formulare im Hintergrund speichern: kein Seiten-Reload, kein
 * Scroll-Sprung. Während des Speicherns trägt das Formular die Klasse
 * `saving` (Spinner auf dem Übernehmen-Knopf); nach Erfolg werden die
 * Seitendaten per invalidateAll() aktualisiert und das Formular feuert
 * `saved`, damit die Komponente ihre Vergleichsbasis zurücksetzen kann.
 */
export function ajaxSave(form: HTMLFormElement) {
    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault();

        if (form.classList.contains("saving")) {
            return;
        }

        form.classList.add("saving");

        try {
            // form.action wäre hier das versteckte Eingabefeld namens "action",
            // nicht die URL — deshalb das Attribut direkt lesen.
            const url = form.getAttribute("action") ?? "/admin/content";
            const response = await fetch(url, {
                method: "POST",
                body: new FormData(form),
                headers: { accept: "text/html" },
            });

            if (!response.ok && !response.redirected) {
                throw new Error(`Speichern fehlgeschlagen (${response.status})`);
            }

            await invalidateAll();
            form.dispatchEvent(new CustomEvent("saved"));
        } catch (error) {
            console.error("Speichern fehlgeschlagen:", error);
            alert("Speichern fehlgeschlagen. Bitte versuchen Sie es erneut.");
        } finally {
            form.classList.remove("saving");
        }
    }

    form.addEventListener("submit", handleSubmit);

    return {
        destroy() {
            form.removeEventListener("submit", handleSubmit);
        },
    };
}
