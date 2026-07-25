# Design Decisions — Layout Rework

Living log for the layout/design rework (branch `rework`). Future Claude sessions: read this first,
append decisions here, never delete history — strike through superseded entries instead.

Format: each decision gets a status — `OPEN` (proposed, not decided), `DECIDED` (agreed with Thomas), `DONE` (implemented).

## Context

- SvelteKit + Tailwind 4 site for Hausarztpraxis Thiemo Stiemert, Trier (hausaerzte-trier.de).
- Content (Sprechzeiten, Neuigkeiten, Urlaub, Hinweis, Leistungsspektrum) is editor-managed via
  Vercel Blob content store → locally these sections render empty. Layout must work with and without content.
- Palette: custom `gulfstream` green scale defined in `src/app.css` `@theme`.
- Audience: patients (often older, mobile). Top user tasks: find phone number, Sprechzeiten, address/Anfahrt, Urlaubszeiten.

## Findings (audit 2026-07-25, desktop 1280 + mobile 375)

1. **Typography scale flat** — `h1` is 1.5rem, `h2` 1.25rem; hero title, section titles and body barely differentiated. `OpeningHours`/`ContactSection` use `h1` for section titles → broken heading hierarchy (a11y).
2. **`text-justify` on German body text** — produces large word gaps, very ugly on mobile.
3. **No brand in navbar** — practice name only lives in the hero image corner; nav has no logo/name, no active-page state.
4. **Hero fragile + washed out** — image is `absolute -z-10` with `opacity-80` plus `lg:mt-[500px]` spacer hack in layout; title sits in a small green box bottom-right; no CTA, no key info (phone/hours).
5. **Content floats on flat background** — everything sits directly on gulfstream-50; sidebar (Urlaub/Sprechzeiten/Kontakt) has no visual grouping/cards.
6. **Mobile order wrong for patients** — welcome text + news + map come before Sprechzeiten/Kontakt.
7. **FloatingPhoneButton** — square block, sits top-right below hero, overlaps headings on mobile; convention is a round FAB bottom-right.
8. **LocationMap rendered twice** (isMobile true/false duplicates DOM).
9. **Team page** — mixed photo aspect ratios/crops; missing photos are plain green rectangles; no card styling.
10. **Sprechzeiten table** — zebra rows use gulfstream-100/200 (odd darker than even), heavy borders.
11. **Footer minimal** — only Impressum/Datenschutz + login icon; no address, phone, hours recap, no emergency numbers (112 / 116117), which a practice site should surface.
12. **Semantics/a11y** — no `<header>/<nav>/<main>/<footer>` landmarks, multiple h1 per page, focus styles default.

## Decisions

### D1 — Overall direction · DONE

Options: (a) conservative polish (keep structure, fix typography/spacing/cards),
(b) moderate redesign (new hero, card-based layout, restructured nav/footer — keep green palette),
(c) full rebrand. Recommendation: (b).
**Decided (Thomas, 2026-07-25): (c) full rebrand** — new palette + typography, green family kept as base.

### D2 — Hero treatment · DONE

Options: (a) keep full-width photo, add dark gradient overlay at bottom, larger title, CTA row
(phone button + link to Sprechzeiten); (b) slimmer hero with heading left on solid/gradient panel and photo right.
Recommendation: (a) — photos are good quality and give warmth.
**Decided: (a)**, but the CTA row was dropped again — the quick-info band directly under the hero carries phone/hours/address (D8), CTAs duplicated it. Hero text on the homepage is the editor-managed "Titelbild" section.

### D3 — Mobile content order · DONE

Proposal: on mobile show Hinweis → Sprechzeiten → Kontakt (compact cards) directly under hero,
welcome text after. Desktop keeps 2-column layout.
**Decided: yes** — implemented via the quick-info band (D8), which stacks first on mobile.

### D4 — Section cards · DONE

Proposal: sidebar sections (Urlaub, Sprechzeiten, Kontakt) become white cards with rounded corners,
subtle border/shadow, small icon + h2; zebra table replaced by simple divided rows.
**Done.** Urlaub gets a copper left border as closure signal. Sprechzeiten moved out of the sidebar entirely (D8).

### D5 — Navbar · DONE

Proposal: practice name (+ small caduceus/logo) left, links right, active state underline,
sticky with shadow on scroll, proper `<nav>`; phone number visible in navbar on desktop.
**Done** (no logo glyph — serif wordmark only). Brand hidden < md to keep links on one line; component CSS must own `display` (Tailwind `hidden` loses to scoped rules).

### D6 — Footer · DONE

Proposal: 3-column footer (Adresse/Kontakt · Sprechzeiten kurz · Notdienst 112/116117 + legal links),
dark green background, login stays as icon.
**Done** — columns: Kontakt/Adresse · Seiten · Notdienst (116 117, 112).

### D7 — Typography · DONE

Proposal: h1 2.25rem/bold, h2 1.5rem, body 1rem/1.65 line-height, drop `text-justify`,
max-width ~65ch for text columns.
**Done**, went further: full rebrand type system — Source Serif 4 Variable (display) + Source Sans 3 Variable (body) via @fontsource, tabular-nums for times/phone numbers. Palette: `pine` (deep green) + `sand` (warm neutral) + `copper` accent; legacy `gulfstream-*` vars alias to pine so untouched admin/editor UI follows automatically.

## Implementation notes

- Hero refactor should remove the `absolute` + `mt-[500px]` coupling between `+layout.svelte` and content.
- Keep EditableBlock editor flows intact — every visual change must preserve the inline admin editing.
- Test with empty content store (local) AND assume production content exists.

### D8 — Quick-info band as single Sprechzeiten source · DONE

Signature element: three sandstone cards (Termin & Rezepte · Sprechzeiten · Adresse) overlapping the
hero bottom edge on the homepage (`QuickInfoBand.svelte`). The Sprechzeiten card is the ONLY place
opening hours appear (redundancy rule) — the old sidebar table was removed, `#sprechzeiten` anchors
here, and the WYSIWYG row editor (RichText + drag handles) lives inside the card. All three cards
share the same hover treatment (consistency rule from Thomas).

### D9 — Rebased onto WYSIWYG editing (commit 8ee7152) · DONE

`origin/rework` shipped a new inline-editing system (RichText/EditableText/InlineEditorActions,
`editMode` store with Ansicht/Bearbeiten toggle, editor-managed texts: Titelbild, Willkommen,
AnfahrtBus/Auto, Termine, Team, Vertretungen; HomepagePopup removed). The rebrand was rebased on
top and re-ported: design markup stays ours, editing logic is upstream's. Rules going forward:

- All patient-facing copy comes from content sections — never hardcode text that has a section.
- `EditableBlock` has no pencil anymore: in Bearbeiten mode the editor slot renders in place.
- Static homepage heading is "Herzlich Willkommen / Ihre Gesundheit steht bei uns im Mittelpunkt";
  the Willkommen default text was trimmed so it doesn't repeat those lines.

## Iteration log

- 2026-07-25: Full rebrand implemented (D1–D8), rebased onto WYSIWYG editing (D9), verified
  desktop + mobile + edit mode + admin login page. Dev-only sample content added
  (`src/lib/server/sample-content.ts`) so the site renders without the blob token.
- 2026-07-25 (evening iteration with Thomas):
    - Big map placeholder removed — "Ihr Weg zu uns" now has a compact "Karte in Google Maps öffnen"
      pill link (the quick-band address card already links to Maps).
    - The two notice banners (pine "Wichtig" strip + copper homepage "Hinweis" box) merged into ONE
      copper callout (`NoticeBanner.svelte`), shown on every page; it renders BOTH content sections
      (Wichtig + Hinweis) and keeps both editable in place — no content loss.
    - Rule from Thomas: no thick left accent borders on boxes (removed from notice banner and Urlaub card).
    - Impressum/Datenschutz: shared `.legal-page` prose styles in app.css (top margin, paragraph/list
      spacing, underlined links, 75ch measure); pages wrapped in `<div class="legal-page">`.
- 2026-07-25 (navbar + sidebar iteration):
    - "Neuigkeiten" is the second navbar item and gets its active state from a scroll spy
      (activation line at 35% viewport height, bottom-of-page fallback for short pages);
      "Startseite" yields while the news section is in focus.
    - "Ihr Weg zu uns" moved into a card in the right sidebar (Urlaub → Kontakt → Weg zu uns);
      left column is welcome text + Neuigkeiten only.
- Known follow-ups: hydration warning in admin session (sessionStorage editMode vs SSR — inherited
  from upstream, not design-related); production Willkommen/Titelbild texts may still contain the
  now-duplicated heading sentences until an editor trims them.
