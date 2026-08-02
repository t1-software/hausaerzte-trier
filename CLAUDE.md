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
  (`src/lib/edit-mode.ts`). `isEditor = angemeldet && Bearbeiten`.
- Die Darstellung liegt im Sitzungs-Cookie `edit_mode` (nicht mehr `sessionStorage`): der Server liest
  ihn in `+layout.server.ts` und rendert gleich richtig. Sonst zeigt die Seite nach jedem Neuladen kurz
  die Bearbeitungsansicht, bevor die Hydration auf Ansicht zurückschaltet.
  Beim Rendern gilt deshalb `browser ? $editMode : data.editMode` — den Store erst im Browser fragen,
  weil ein Modul-Store auf dem Server über Requests hinweg geteilt würde. Der Header bekommt den Wert
  als `editing`-Prop.
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
Eine Zeile ist entweder `[Schlüssel]` (sofort ausgeblendet) oder `[Schlüssel, ISO-Zeitpunkt]`
(bis dahin sichtbar, danach ausgeblendet — die Uhr neben dem Auge, `action=setHideAt`).
Ausgeblendete Bereiche bleiben gespeichert und im Bearbeitungsmodus gedimmt editierbar — als Vorlage
für das nächste Mal. `EditableBlock` übernimmt Auge + Uhr + Dimmung, sobald ein `sectionKey` gesetzt ist;
umgebende Überschriften müssen die Elternkomponenten selbst mit ausblenden.

### Zeitgesteuert ausblenden

- Die Uhr öffnet ein kleines Feld (`datetime-local`) und speichert über `action=setHideAt`.
  Leeres Feld bzw. „Zeitpunkt entfernen“ löscht die Zeile wieder.
- Gespeichert wird ein absoluter Zeitpunkt in UTC, eingegeben und angezeigt wird deutsche Ortszeit
  (`src/lib/schedule.ts`). Der Server läuft in UTC und würde eine naiv gespeicherte Uhrzeit sonst
  ein bis zwei Stunden zu früh ausblenden.
- Das Auge bleibt der Sofort-Schalter: sichtbar → sofort ausblenden (ein geplanter Zeitpunkt entfällt),
  ausgeblendet (auch durch einen erreichten Zeitpunkt) → wieder sichtbar, Zeitpunkt gelöscht.
- Ausgewertet wird beim Rendern (`isSectionHidden(content, key, now)`). Eine bereits geöffnete Seite
  blendet den Bereich also erst beim nächsten Laden aus, kein Timer im Browser.
- Den Zeitpunkt holt sich `EditableBlock` selbst aus `$page.data.content` — bewusst kein weiteres Prop
  durch alle Elternkomponenten.

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
- **Jede neue Funktion muss Thomas selbst ausprobieren können**: am Ende einer Änderung immer einen
  Dev-Server über `portless` starten und die URL nennen — nicht nur selbst verifizieren.
  `CONTENT_FILE=content.local.json portless <name> bash -c 'npm run dev -- --port $PORT --strictPort'`
  (eigener Name je Branch/Feature, sonst kollidiert die Route mit Thomas' laufendem Server;
  `--force` nur, wenn die alte Route nachweislich tot ist). `portless list` zeigt die Routen.
  Der Umweg über `bash -c` ist nötig, weil `$PORT` sonst nicht ersetzt wird; portless spricht **http**
  mit der App — den Dev-Server nicht auf TLS umstellen, das gibt 502.
- `kit.csrf.checkOrigin` ist deshalb im Dev-Server aus (`svelte.config.js`): hinter dem HTTPS-Proxy
  passt der Origin-Header nicht zur Adresse des Dev-Servers, sonst endet jedes Anmelden mit 403.
  Im Produktions-Build bleibt die Prüfung an.
- Mit `BLOB_READ_WRITE_TOKEN` in `.env` liest UND schreibt der lokale Dev-Server die
  Produktionsinhalte — beim Testen keine Editor-Speicherungen absenden.
- Sicherer zum Testen: `CONTENT_FILE=content.local.json` (`.env` oder vorangestellt). Dann liest und
  schreibt der Store diese Datei statt des Blob Stores; fehlt sie, startet sie mit `SAMPLE_CONTENT`.
  `*.local.json` im Projektstamm ist ignoriert. `CONTENT_FILE` hat Vorrang vor dem Blob-Token.
- Schriften sind selbst gehostete @fontsource-Pakete und werden als JS-Imports in
  `src/routes/+layout.svelte` geladen (nicht per CSS-`@import` in `app.css` — der Sass-Umweg
  zerbricht die relativen woff2-Pfade im Produktions-Build).
- Die zwei Schriften über der Falz (Source Sans, Source Serif, jeweils latin) werden in
  `<svelte:head>` per `rel="preload"` vorgeladen; die URL kommt aus einem `?url`-Import, damit sie
  denselben gehashten Pfad trifft wie die `@font-face`-Regel (sonst zwei Downloads). Ohne Preload
  startet der Ladevorgang erst nach dem Stylesheet und der Text springt sichtbar um
  (`font-display: swap`). Caveat steht weit unten und bleibt ungepreloadet.
- Nach dem Installieren neuer Abhängigkeiten `node_modules/.vite` löschen und den Dev-Server neu starten.
  Veraltete optimierte Abhängigkeiten führen sonst zu `Failed to hydrate` und einer leeren Seite.
- `.env`: `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `BLOB_READ_WRITE_TOKEN`, `BLOB_STORE_ID`.
- Zum Prüfen von Inhalten hilft ein Textvergleich der lokalen Seite mit der Produktionsseite
  (`https://hausaerzte-trier.de`); Unterschiede in Leerzeilen sind unkritisch, fehlende Absätze nicht.
