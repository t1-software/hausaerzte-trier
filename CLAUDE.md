# CLAUDE.md

Arbeitsnotizen für dieses Repository: Entscheidungen, die man dem Code nicht sofort ansieht.
Bitte bei neuen Erkenntnissen ergänzen.

## Projekt

SvelteKit-Website der Hausarztpraxis Trier (Svelte 4-Syntax, Tailwind 4, TypeScript, Prettier mit
4 Leerzeichen / 120 Zeichen). Alle sichtbaren Texte und Kommentare sind deutsch.

## Inhalte

- Gespeichert als eine JSON-Datei im Vercel Blob Store: `site-content/content.json`
  (`src/lib/server/content-store.ts`). Ohne `BLOB_READ_WRITE_TOKEN` oder ohne Netzzugang liefert der
  Store leeren Inhalt — die Seite rendert dann ohne Neuigkeiten/Sprechzeiten. Kein Bug, nur fehlender Zugang.
- Struktur: `EDITABLE_CONTENT_SECTIONS` in `src/lib/content.ts`. Jeder Bereich ist entweder `richText`
  (ein Textblock) oder `table` (Zeilen mit festen Spalten). Werte immer `string[][]`.
- `SECTION_DEFAULT_TEXT` + `textOf()` liefern den Ausgangstext für Bereiche, die noch nie gespeichert
  wurden (Titelbild, Willkommen, Anfahrt, Termine, Team). Leert ein Admin das Feld, erscheint wieder der Standard.
- `main` (Produktion) holt die Inhalte noch aus einem veröffentlichten Google Sheet
  (`src/routes/+layout.server.ts` auf `main`). Der Blob-Inhalt dieses Branches wurde daraus übernommen;
  das Sheet ist die Quelle, wenn Inhalte verglichen oder neu befüllt werden müssen.
- Speichern läuft über `POST /admin/content` (Cookie `admin_session` nötig, Origin-Header wegen CSRF):
    - `action=saveBlock` + `text=<markdown>`
    - `action=saveRows` + `rowCount=<n>` + `cell:<zeile>:<spalte>=<wert>`
      Danach Redirect (303) auf `redirectTo`.
- `Sprechzeiten` speichert die Zeilenart in Spalte 0 (`Sprechzeit` | `Hinweis`). `normalizeRowsForSection`
  erkennt sie explizit — sonst rutschen Zeilen ohne Nachmittagswert eine Spalte weiter (war ein echter Bug).

## Bearbeitungsmodus

- Anmeldung im Footer, Badge oben rechts zeigt `Admin` mit Umschalter `Ansicht | Bearbeiten`
  (`src/lib/edit-mode.ts`, pro Browser-Sitzung in `sessionStorage`). `isEditor = angemeldet && Bearbeiten`.
- Kein Stift und kein Einzelmodus pro Block: im Bearbeitungsmodus sind alle Felder sofort editierbar
  (`EditableBlock` rendert dann ausschließlich den `editor`-Slot).
- Übernehmen/Verwerfen (`InlineEditorActions`) bleiben gesperrt, bis sich etwas geändert hat.
  Vergleichsgrundlage ist **nicht** der gespeicherte Text, sondern der von ProseMirror normalisierte
  Text aus dem `init`-Event (`baseline`). Sonst wäre jeder Block sofort „geändert“.
- Verwerfen setzt den Entwurf zurück und erhöht einen `resetKey`, der die Felder über `{#key}` neu aufbaut.
- Tabellenzeilen tragen stabile IDs (`$lib/editable-rows`), damit Sortieren die Editoren nicht neu mountet.

## Rich Text (ProseMirror)

- `src/components/RichText.svelte` + `src/lib/richtext.ts`. Gespeichert wird weiterhin Markdown
  (`prosemirror-markdown`), damit die Anzeige über `marked` unverändert bleibt.
- Zwei Schemata: Blockschema für mehrzeilige Texte, `inlineSchema` (nur Absatz + fett/kursiv) für
  einzeilige Felder wie Datum, Tag, Titel. Der eigene Serializer schreibt `-` als Listenzeichen und
  braucht zwingend einen `text`-Knoten-Handler.
- Formatierung bewusst knapp: fett + kursiv, Aufzählung nur wo das Layout sie kennt (`allowList`,
  Neuigkeiten). `allowBold={false}` für Felder, die ohnehin fett dargestellt werden
  (Titelbild, Urlaubszeilen, Leistungs-Titel).
- Eingaberegeln: `- ` / `* ` / `1. ` starten eine Liste, Enter setzt sie fort, Tab rückt ein.
- Autovervollständigung: `suggestions` (aus dem Bereich `Vertretungen`) blendet ab zwei Zeichen
  passende Einträge ein; Enter/Tab übernimmt, Escape schließt. Die Liste selbst pflegt
  `SuggestionListEditor` unter dem Neuigkeiten-Editor.
- Serverseitig gibt es kein ProseMirror: bis `onMount` zeigt das Feld den mit `marked` gerenderten Text.

## Sortieren per Drag & Drop

`src/lib/row-dnd.ts` verschiebt die Zeile schon beim Überfahren, damit die neue Reihenfolge sichtbar ist
(`animate:flip` in den Komponenten). Zwei Details verhindern Flackern: Getauscht wird erst, wenn der
Zeiger die Mitte der Zielzeile überschritten hat, und zwischen zwei Bewegungen liegt eine kurze Sperre.
Ein abgebrochener Vorgang (`dragend` ohne `drop`) stellt die Ausgangsreihenfolge wieder her.
Tastatur: Alt + Pfeil hoch/runter auf dem Griff.

## Layout-Hinweise

- Der Header ist `fixed` und braucht `z-40`, sonst liegen die Bearbeiten-Overlays darüber
  (Badge selbst liegt auf `z-50`).
- Leere Bereiche zeigen im Bearbeitungsmodus keinen Platzhaltertext, aber die Fläche bleibt sichtbar
  (z. B. leere Hinweisleiste unter dem Titelbild).

## Entwicklung

- `npm run dev`, `npm run check` (svelte-check muss ohne Fehler und Warnungen durchlaufen),
  `npx prettier --write src`.
- Nach dem Installieren neuer Abhängigkeiten `node_modules/.vite` löschen und den Dev-Server neu starten.
  Veraltete optimierte Abhängigkeiten führen sonst zu `Failed to hydrate` und einer leeren Seite.
- `.env`: `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `BLOB_READ_WRITE_TOKEN`, `BLOB_STORE_ID`.
- Zum Prüfen von Inhalten hilft ein Textvergleich der lokalen Seite mit der Produktionsseite
  (`https://hausaerzte-trier.de`); Unterschiede in Leerzeilen sind unkritisch, fehlende Absätze nicht.
