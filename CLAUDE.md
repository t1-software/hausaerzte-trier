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

- Anmeldung im Footer läuft über `use:enhance`: falsches Passwort zeigt den Fehler inline im Footer
  (keine /admin-Seite), Erfolg leitet per `redirectTo` auf die Seite zurück, von der man kam.
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
- Vertretungskarten: Zeilen im Format `- Name, Adresse, Tel.: Nummer` (Regex `PRAXIS_LINE`) werden
  überall als Karte dargestellt — Anzeige über `renderNews()` (`$lib/news-render`), Editor über den
  `praxis`-Knoten im `newsSchema` (NodeView mit drei Eingabefeldern, `praxisCards`-Prop an RichText).
  Gespeichert wird unverändert Markdown; das Format ist die Schnittstelle. `Vertretungen` hat drei
  Spalten (Name, Adresse, Telefon); ein übernommener Vorschlag wird als Karte eingefügt.
- Serverseitig gibt es kein ProseMirror: bis `onMount` zeigt das Feld den mit `marked` gerenderten Text.

## Team-Seite & Medienbibliothek

- Team-Karten kommen aus dem Bereich `Team-Mitglieder` (Name, Rolle, Bild, Sichtbarkeit);
  `DEFAULT_TEAM` in `content.ts` greift, solange nie gespeichert wurde. Spalte 4 = `ausgeblendet`
  versteckt die einzelne Karte für Besucher (Auge pro Karte, wird mit Übernehmen gespeichert).
- Bilder: Upload mit Zuschneiden (`CropDialog`, Seitenverhältnis 4/5, Export max. 1200px JPEG) über
  die `MediaLibrary`. Der Blob Store ist **privat** — `access: "public"` schlägt fehl. Bilder liegen
  unter `site-images/` und werden über die eigene Route `/media/<name>` ausgeliefert
  (immutable gecacht; Dateinamen sind zeitstempel-eindeutig). Gespeichert wird die `/media/…`-URL.
- Die Bibliothek (`GET/POST /admin/media`) behält alle Uploads, bis sie dort ausdrücklich gelöscht
  werden — Bilder aus Karten zu entfernen löscht nichts im Store.

## Ausblenden statt Löschen

Jeder Bereich kann für Besucher ausgeblendet werden (Auge im Bearbeitungsmodus, `action=toggleHidden`).
Die Schlüssel stehen im reservierten Bereich `Ausgeblendet` (`HIDDEN_SECTION_KEY` in `src/lib/content.ts`).
Ausgeblendete Bereiche bleiben gespeichert und im Bearbeitungsmodus gedimmt editierbar — als Vorlage
für das nächste Mal. `EditableBlock` übernimmt Auge + Dimmung, sobald ein `sectionKey` gesetzt ist;
umgebende Überschriften müssen die Elternkomponenten selbst mit ausblenden.

## Sortieren per Drag & Drop

`src/lib/row-dnd.ts` verschiebt die Zeile schon beim Überfahren, damit die neue Reihenfolge sichtbar ist
(`animate:flip` in den Komponenten). Zwei Details verhindern Flackern: Getauscht wird erst, wenn der
Zeiger die Mitte der Zielzeile überschritten hat, und zwischen zwei Bewegungen liegt eine kurze Sperre.
Ein abgebrochener Vorgang (`dragend` ohne `drop`) stellt die Ausgangsreihenfolge wieder her.
In Rastern (Team, Leistungsspektrum) entscheidet die Achse mit dem größeren Abstand zwischen
gezogener Karte (`.row-dragging`) und Ziel, ob die horizontale oder vertikale Mitte zählt.
Tastatur: Alt + Pfeiltasten auf dem Griff.

## Layout-Hinweise

- Der Header ist `fixed` und braucht `z-40`, sonst liegen die Bearbeiten-Overlays darüber
  (Badge selbst liegt auf `z-50`).
- Der Wichtig-Hinweis ist eine schmale Leiste direkt unter dem Header, `sticky top-14 z-30` —
  bleibt beim Scrollen auf allen Seiten sichtbar. Kein Icon, keine Überschrift. Grün (`pine-500`),
  bewusst heller als der Header; das Editorfeld wird darin dunkel statt hell hinterlegt,
  damit der helle Text beim Bearbeiten lesbar bleibt. Die Formatierungsleiste öffnet hier unterhalb
  des Feldes (oben wäre sie unter dem Header verborgen), Übernehmen/Verwerfen rücken dafür nach unten.
- Der Admin-Umschalter (Ansicht | Bearbeiten) sitzt in der Header-Navigation; unter `md` als
  schwebende Pille unten links, weil die Navigationszeile sonst überläuft.
- Keine Akzent-Linksränder an Karten ("Claude-Design-Marker", ausdrücklich unerwünscht) und
  keine Hover-Effekte auf rein informativen Karten.
- Das Info-Band auf der Startseite überlappt das Titelbild (`-mt-12 z-10`). Es enthält nur noch
  Sprechzeiten (zwei Spalten breit) und Termin & Rezepte; Urlaub wurde entfernt.
- Sprechzeiten-Zeiten fluchten über alle Zeilen: ab `md` ist jede Zeile ein Grid
  (`1fr 9rem 14.5rem`), die beiden Zeitspalten liegen per `display: contents` im Zeilenraster.
  Unter `md` gestapelt (`span:empty` wird ausgeblendet), sonst läuft die Karte auf Handys über.
- Leere Bereiche zeigen im Bearbeitungsmodus keinen Platzhaltertext, aber die Fläche bleibt sichtbar.
- Impressum/Datenschutz bekommen eigene Hero-Titel über `getHero()` im Layout; die Seiteninhalte
  haben deshalb kein eigenes `<h1>` mehr.
- Abschnittsrhythmus: Eyebrow (`.eyebrow`) + große Serifen-Überschrift (`!text-3xl`) für
  Willkommens- und Anfahrtsbereich. Neue Startseiten-Abschnitte sollten diesem Muster folgen.
- Svelte-`<style>`-Blöcke: Media-Query-Overrides müssen NACH der Basisregel stehen
  (gleiche Spezifität, Reihenfolge entscheidet — hat den mobilen Hero-Titel schon einmal gekostet).

## Entwicklung

- `npm run dev`, `npm run check` (svelte-check muss ohne Fehler und Warnungen durchlaufen),
  `npx prettier --write src`.
- **Port 5173 niemals für die eigene Verifikation benutzen** — dort läuft parallel Thomas' eigener
  Dev-Server. Immer einen anderen Port explizit setzen, z. B. `npm run dev -- --port 5199 --strictPort`.
- Mit `BLOB_READ_WRITE_TOKEN` in `.env` liest UND schreibt der lokale Dev-Server die
  Produktionsinhalte — beim Testen keine Editor-Speicherungen absenden.
- Schriften sind selbst gehostete @fontsource-Pakete und werden als JS-Imports in
  `src/routes/+layout.svelte` geladen (nicht per CSS-`@import` in `app.css` — der Sass-Umweg
  zerbricht die relativen woff2-Pfade im Produktions-Build).
- Nach dem Installieren neuer Abhängigkeiten `node_modules/.vite` löschen und den Dev-Server neu starten.
  Veraltete optimierte Abhängigkeiten führen sonst zu `Failed to hydrate` und einer leeren Seite.
- `.env`: `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `BLOB_READ_WRITE_TOKEN`, `BLOB_STORE_ID`.
- Zum Prüfen von Inhalten hilft ein Textvergleich der lokalen Seite mit der Produktionsseite
  (`https://hausaerzte-trier.de`); Unterschiede in Leerzeilen sind unkritisch, fehlende Absätze nicht.
