# Visibuild Design System

A working design system for **Visibuild** — construction quality management software for contractors, builders & developers. This system codifies how Visibuild looks, sounds, and behaves so designers and agents can produce on-brand **documents** (client briefs, capability statements, reports and other A4 artifacts) without reinventing the foundation each time.

> Visibuild is QA software built for the real world: fast-moving sites, busy teams, and people with zero patience for clunky software.

---

## Index — what's in this folder

| Path | What it is |
| --- | --- |
| `README.md` | This file. Brand context, content + visual foundations, iconography. |
| `SKILL.md` | Agent-skill manifest. Read first when invoked as a skill. |
| `colors_and_type.css` | All design tokens — colors, type, spacing, radii, shadows, motion — plus semantic type classes (`.vb-h1`, `.vb-body`, etc). |
| `fonts/` | Funnel Sans (Regular, Medium) and Karelia (Regular). |
| `assets/` | Logos, marks, placeholder imagery, decorative SVGs. |
| `preview/` | Single-purpose HTML cards that populate the Design System tab. |
| `assets/product/` | Real Visibuild product screenshots, grouped by module — catalogued in the **Brand → Product imagery** card. Use the best match to back up product copy (see *Product imagery* below). |
| `ui_kits/web-app/` | Hi-fi recreation of the Visibuild web app (project dashboard, ITP/inspection list, defect detail, handover). React JSX components + an `index.html` click-thru. |

This system is scoped to **paginated print documents** — client briefs, capability statements, reports and other A4 artifacts. Slide decks are out of scope. Marketing/website kit not included — the core product UI and document formatting are where the design system earns its keep first.

---

## Sources used

- **Uploaded files:** `uploads/FunnelSans-Medium.ttf`, `uploads/FunnelSans-Regular.ttf`, `uploads/Karelia-Regular.otf`. These define the brand's primary typefaces and were copied into `fonts/`.
- **Public site research:** [visibuild.com](https://visibuild.com/), product pages (`/product/quality-management/`, `/product/inspection-management/`, `/product/issue-management/`, `/product/progress-management/`, `/product/post-completion-management/`), `/who-we-serve/`, blog and news posts. Used to extract product vocabulary, audience, copy voice, and structural information about modules.
- **No codebase or Figma was provided.** Visual decisions (exact hex values, layout proportions, component shapes) are an interpretation of the public site + the supplied typography. Flag for follow-up if pixel parity with production matters.

---

## Product context

Visibuild is an Australian-founded **ConTech** platform that brings construction QA out of spreadsheets, paper checklists, and email threads into a single live system. Built by a former Multiplex senior PM (Damien Quinn). Used across commercial, residential, infrastructure, healthcare and data-centre projects in APAC, Europe and North America.

**The product is one platform, organised into five modules:**

1. **Quality Management** — company-wide QA standards, milestone dashboards, multi-template trackers.
2. **Inspection Management** — digital ITPs (Inspection & Test Plans) and ITCs (Inspection Test Checklists), geolocations, project template library.
3. **Issue Management** — defects, NCRs, snags, punchlists, multi-reviewer workflows, mobile offline sync.
4. **Progress Management** — programme-linked target dates, inspections tied to milestones, customisable progress trackers.
5. **Post Completion Management** — digital handover, branded purchaser portals, ticket portal, defect cost analytics.

**Audiences (each gets a slightly different lens on the same data):**

- **General Contractors** — control the chaos.
- **Trade Partners (subcontractors)** — sign it off, send it in, move on.
- **Owners / Developers / Clients** — visibility from day one.
- **Consultants** — review once, never chase again.
- **Suppliers** — track factory-to-install.

**Core vocabulary** (use these exact terms — they're industry-load-bearing): ITP, ITC, NCR, defect, snag, punchlist, hold point, sign-off, handover, DLP (defect liability period), commissioning (CX), lot, level, trade, milestone, programme.

---

## CONTENT FUNDAMENTALS

### Voice

**Plain-spoken, confident, mildly blunt.** Visibuild writes like a foreman who respects your time, not a SaaS marketer. Sentences are short. Verbs are direct. Marketing copy and product copy share the same register — there is no "fun voice" vs "business voice" split.

### Tone moves Visibuild actually uses

- **Three-beat hammer cadence.** Three short fragments. Punchy. Often used as a section header.
  - "Sign it off. Send it in. Move on."
  - "Control the chaos. Deliver with confidence."
  - "Prove your work. Win more work."
  - "No chasing. No spreadsheets. No excuses."
  - "Review once. Never chase again."
- **Stat as a stand-alone line.** "1-2% margins. 18-30% on errors. Time to cut the rework."
- **"X. Y." duplets.** "Visibility from day one to handover." "One QA platform. One workflow. Zero chasing."
- **Negation pattern** to position against the status quo: "Not a status update. Not a weekly report. A real, searchable, auditable record…"

### Casing

**Sentence case for nearly everything.** Headlines, buttons, nav, table headers — all sentence case. Capitalised proper nouns are reserved for: product modules (Quality Management, Inspection Management, etc.), industry roles (General Contractors, Trade Partners), and audited construction artifacts (ITP, ITC, NCR — these stay all-caps). Section eyebrows on the marketing site are lowercase ("Who we serve", "Product journey").

### Person

**"You" speaks to the user. "We" is rare** — Visibuild doesn't talk about itself much; it talks about the user's site, their team, their handover. When the company does speak in first person it's plural and modest ("we built this for the industry, by the industry").

### Punctuation & grammar

- En-dashes `–` for inline asides; em-dashes are fine too. Both fit the cadence.
- Australian / British spelling: **programme** (not program), **centre**, **standardise**, **prioritise**, **organisation**.
- Ampersands are common in compact contexts ("contractors, builders & developers", "Security & Legal").
- Oxford comma — used inconsistently on the site; pick one and stick to it within an artifact.
- No exclamation marks. The product earns its emphasis through cadence, not punctuation.

### Emoji & decoration

**No emoji.** Anywhere. Not in product, not in marketing. The brand sits in a regulated, hard-hat, evidence-trail world; emoji read as unserious. **No icon-as-bullet flourishes for decoration.** Where a list genuinely reads better as dot points, the bullet is the brand **Arrow** glyph (or, where available, a tick / cross glyph) from `assets/icons` — recoloured to neutral charcoal / white only, and sized to the height of the text or heading it marks (never an oversized icon filling a paragraph). Outside of that, the words carry the weight — don't sprinkle icons.

### Examples — copy that's on-brand

> **Hero:** Quality driven construction management software. Visibuild is built for the real world: fast-moving sites, busy teams, and people with zero patience for clunky project software. It's simple. It's exactly what QA should be.

> **Feature lockup:** Replace paper checklists with digital inspections you can complete anywhere. Standardised ITP templates ensure every inspection is compliant, while instant syncing keeps field and office teams aligned.

> **CTA strip:** 1-2% margins. 18-30% on errors. Time to cut the rework.

> **Empty-state line (product):** No defects raised on this lot yet. Tag one when you find it.

### Copy don'ts

- Don't explain what construction is. The audience knows.
- Don't say "users" — they're builders, trades, owners, consultants, suppliers.
- Don't say "platform" three times in one sentence; the marketing site overuses it, the product UI shouldn't.
- Don't soften: "this might help you potentially track..." — just say what it does.
- Don't oversell: no "revolutionary", no "AI-powered", no "next-generation".

---

## VISUAL FOUNDATIONS

### Aesthetic in one line

**Industrial editorial.** Warm off-white paper, near-black ink, a single hi-vis amber accent that nods to safety wear, type-driven hierarchy, restrained chrome. Looks like a well-designed trade publication, not a tech demo.

### Color

- **Paper, not white.** Default canvas is `--vb-paper` `#FAF8F4` — a warm off-white that softens long days on dashboards. White (`--vb-surface`) is reserved for elevated cards / inputs.
- **Ink, not black.** Primary fg is `--vb-ink` `#14161A`, with a 4-stop ink scale (`-2/-3/-4`) for hierarchy.
- **One brand accent, used sparingly.** `--vb-orange` `#E85A1A` for primary CTAs, focus rings, key emphasis. `--vb-amber` `#F4B400` for hi-vis chips, hold-state highlights, and decorative beats.
- **QA-semantic colors are first-class tokens**, not generic green/red: `--vb-pass`, `--vb-defect`, `--vb-hold`, each paired with a soft tint for chip backgrounds.
- **Dark surfaces** (`--vb-night`) are used for hero blocks, footers, and any place where "the photo of the worksite" should breathe — never for whole app surfaces.

### Accessibility — colour contrast

**Every colour pairing in a document must pass an accessibility test.** The target is **WCAG AA — a contrast ratio of at least 4.5:1** for normal text (3:1 for large text, ≥24px or ≥18.66px bold). No text/background combination ships below that line. See the **Colors → Accessibility — contrast** card for the worked pairings.

**Blue Charcoal `#1F2933` is the anchor — the darkest colour, and it never changes.** It is the floor of the palette. When a pairing fails the test, the fix is always to **brighten the lighter of the two colours — never to darken anything past the anchor.**

- **Never darken to fix contrast.** Do not introduce a colour darker than `#1F2933`, and do not darken the charcoal anchor itself. If two dark colours sit on each other and fail, **lighten the lighter one** until the ratio clears 4.5:1.
- **Text on the darkest charcoal:** if the text isn't legible over `#1F2933`, **step the text colour slightly lighter** until it passes. Keep the surface as-is; move the text up the tint scale.

**The charcoal-on-charcoal trap (the common failure).** The two darkest tints cannot carry text on a dark charcoal surface — they fail badly:

- **90% `#353E47`** on `#1F2933` → **1.4:1** ✗
- **80% `#4B545C`** on `#1F2933` → **1.9:1** ✗

Step the text up the scale — all of these clear AA on charcoal:

- **20% `#D2D4D6`** → **9.9:1** ✓
- **10% `#E9EAEB`** → **12.3:1** ✓
- **White `#FFFFFF`** → **14.8:1** ✓
- **Electric Green `#29FF7A`** → **11.0:1** ✓ (the brand signature is safe on charcoal)

The same rule holds on the 90% and 80% surfaces: adjacent dark tints fail against them, so go lighter — 20% tint or above — until the ratio reaches 4.5:1. On light surfaces the mirror applies: the 20% and 10% tints are too pale to read as text on white/paper (≈1.5:1) — they're decorative/divider tones only; body text on paper uses the charcoal ink scale (`--vb-ink` / `-2` / `-3`).

### Type

- **Karelia** is the **headings & display face** — every heading and display line uses it (covers, section openers, subsection headings, pull-quotes, hero words). Karelia ships Regular (400) only, so headings sit at weight 400 with relaxed tracking. Never default a heading to Funnel Sans.
- **Funnel Sans** is the **text & UI face** — body, ledes, captions, UI controls, numbers, and the eyebrow/subheading labels. Two weights: 400 Regular and 500 Medium. The weight contrast is enough; we don't lean on heavier weights.
- **Display sizes are big.** `clamp(48px, 6.4vw, 88px)` for the display lines, Karelia 400 with `-0.015em` tracking. Tight, confident, sentence-cased.
- **Eyebrows are uppercase + tracked** (`letter-spacing: 0.12em`), 12px, **Blue Charcoal** (`--vb-ink`) on light and **white** on dark — neutral only. An eyebrow / small subheading is **never** an accent colour and **never** pure black.
- **Section label — Funnel Medium, uppercase, tracked.** Use the **Section label** style (Funnel Sans **500 / Medium**, ~13px, uppercase) for section labels and footer information lines. **Kerning was tightened by 2%, from `0.12em` to `letter-spacing: 0.10em`** — apply `0.10em` to the section label specifically (the general eyebrow tracking above stays at `0.12em`). See `preview/type-body.html` for the reference.
- **Page eyebrow — the one green-square lock-up.** The eyebrow is a small **Electric Green** square (`--vb-green`) locked up with an uppercase section label. The square is **the exact same height as the label text** (its cap-height) with **lightly rounded corners** (~14% of the square), followed by a **deliberate, generous gap ≈ 4.3× the square height** before the text begins. The lock-up scales as a unit, so the square/gap ratio holds at any type size. The label stays neutral charcoal (white on dark) — the eyebrow rule holds (never accent-coloured, never pure black); **the only green in the system's typography is this square.** Use the `.vb-subhead` class (`.vb-subhead.on-dark` for dark surfaces). **Use it once per page, on the lead eyebrow at the top, to introduce the page name** — every other subheading on the page drops the square and uses the plain `.vb-eyebrow` style. **The green square is reserved exclusively for this lock-up** — it is never used as a decorative element, bullet, or accent anywhere else in the system.
- **Numerals lean tabular** in dashboards (`font-variant-numeric: tabular-nums`).

> #### Note — the page eyebrow green square is exclusive
>
> The green square in the page eyebrow is a **graphic element belonging exclusively to the page eyebrow lock-up.** It is an **identifier of the page** — unique to this lock-up — and nothing else.
>
> - **Do not** pair the green square with lists, dot points, quotes, pull-quotes, callouts, headings, or any other section or element in a document.
> - **Do not** repurpose it as a bullet, accent, divider, or decorative mark anywhere on the page.
> - It appears **once per page**, at the top, locked up with the section label to introduce the page name — and **nowhere else.**
>
> If a green square shows up anywhere other than the single page eyebrow, that's incorrect and must be removed.

### Spacing & rhythm

4-px base scale: 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 / 80 / 96. Marketing pages use generous 80–96px section padding; the product app tightens to 16–24px gutters. The single most common gap in the product is 12px.

### Backgrounds

- **No gradients** as decoration. Hero photos are real photographs of construction sites — high-vis vests, scaffold, structural steel, glazing — used full-bleed with a darkening overlay (`rgba(14,15,18,0.45)` typical) so white type sits on top.
- **No hand-drawn illustrations, no patterns, no textures.** The site is photo-and-type. We follow that.
- **Photo treatment** is warm and present — not graded blue, not grain-heavy, not B&W. Real-world job-site daylight.

### Animation

- **Subtle and fast.** 120–360ms, `cubic-bezier(0.2, 0.8, 0.2, 1)` for most enters; a flatter `cubic-bezier(0.65, 0, 0.35, 1)` for non-directional state changes.
- **No bounces.** No springs that overshoot. Construction software earns trust with calm, not delight.
- **Fade + 4–8px translate** is the default reveal. Modal/sheet transitions are a 200ms fade with a 4px Y-translate.
- **Scrubbing progress (loaders, video, carousels)** uses linear ease.

### Hover states

- **Buttons:** primary darkens by \~one shade (`--vb-orange` → `--vb-orange-deep`); ghost/secondary buttons get a 4–6% ink tint background.
- **Cards:** lift via `--vb-shadow-md` → `--vb-shadow-lg` and a 1px border colour shift to `--vb-line-strong`. No scale transform.
- **Rows in tables:** `background: var(--vb-paper-2)`, no border colour change.
- **Links:** underline appears (or thickens) on hover. Color does not change.

### Press states

- **Buttons** drop one elevation, do not shrink. The active surface gets `inset 0 1px 0 rgba(20,22,26,0.08)`.
- **Toggles & checkboxes** use the orange accent on press, a 100ms quick-flash.
- **No scale-down (`scale(0.98)`) press effect** — too playful for the brand.

### Focus states

Always visible. `box-shadow: 0 0 0 3px rgba(232, 90, 26, 0.28)` (orange at 28%) around the control's existing border. Never remove the focus ring.

### Borders

- **1px hairlines** (`--vb-line` `#E5E1D7`) divide sections in restful areas.
- **1px strong** (`--vb-line-strong` `#C9C3B4`) where the divider is structural (table headers, sidebar/main split).
- **1.5px ink** for primary inputs and emphasised cards. Visibuild's product feels slightly heavier on borders than typical SaaS — it matches the document/inspection-form metaphor.

### Shadows

A small system. Three steps:

- `--vb-shadow-sm` — barely there, for resting cards on paper.
- `--vb-shadow-md` — hover state, popovers, dropdown menus.
- `--vb-shadow-lg` — modals, focused fullscreen sheets, the rare elevated dialog.

Inner shadows are reserved for press states and inset wells (`background: var(--vb-paper-2); box-shadow: inset 0 1px 0 rgba(20,22,26,0.04)`).

### Protection gradients vs capsules

Photographs with overlaid text use a **bottom-up linear gradient** (`linear-gradient(to top, rgba(14,15,18,0.7), rgba(14,15,18,0))`) — not a chip/capsule behind the text. Capsules are reserved for status (pass / defect / hold) where they carry semantic meaning.

### Default page format

- **Default to A4 vertical (portrait) unless stated otherwise.** Any document, sheet, report, or printable artifact starts as A4 portrait — **210 × 297mm** (`width: 210mm; height: 297mm` per page, or `794 × 1123px` at 96dpi for screen mockups). Every page carries a single **40px margin** on all four sides (`--vbd-margin-x` / `--vbd-margin-y` in `documents.css`) — content, headers, footers and images all sit inside that frame — and content flows top-to-bottom across multiple A4 pages where needed. See the **Documents → Page Layout & Margins** card for the full margin, grid, column and row rules.
- Only depart from A4 portrait when the brief calls for it explicitly — e.g. a web page (fluid), the product app UI (fluid up to 1600px), or a user who names a different size/orientation. When in doubt, A4 portrait.

### Layout rules

- **Top nav is sticky** on marketing; **left sidebar is fixed** in the product app.
- **Content max-width** is 1280px on marketing, fluid in the product up to 1600px.
- **Grid** is 12-column with 24px gutters on desktop, 4-column with 16px gutters on mobile.
- **The product favours information density** — tables show many rows, sidebars are compact, breadcrumbs always show full project path.

### Transparency & blur

- **Sticky headers** get `backdrop-filter: blur(12px)` with a `rgba(250, 248, 244, 0.7)` paper tint.

**Modals** get a `rgba(14, 15, 18, 0.5)` backdrop. No blur on modal backdrops — keeps the underlying state legible at a glance, which matters when you're checking "did I just discard that inspection?".

- **Disabled controls** sit at 50% opacity over the paper. They do not change colour.

### Corner radii

**8px is the default.** Any corner that can take a radius — image, card, panel, button, input — uses `--vb-radius` (8px) unless there's a deliberate reason to step away from it. Reach for the named steps only by exception.

- **Default — everything:** **8px** (`--vb-radius` → `--vb-radius-lg`). Images, cards, modals, panels, buttons, inputs.
- **Step down for data:** **4px** (`--vb-radius-sm`) — tables, code blocks, mono surfaces. They should read as "data".
- **Step up for large background panels:** **12px** (`--vb-radius-xl`) — the soft ceiling; never go softer.
- `--vb-radius-md` (6px) exists as an in-between step; use sparingly.
- **No pills, no fully-rounded shapes.** Min 4px, max 12px across the whole system.

### Cards

A Visibuild card is: `background: var(--vb-surface); border: 1px solid var(--vb-line); border-radius: var(--vb-radius); box-shadow: var(--vb-shadow-sm); padding: 20–24px` — the default 8px corner. No coloured left-border accent. No coloured background tint. The card's identity comes from its content (an eyebrow, a headline, a photo) — not its chrome.

### Imagery

- Real photography of real construction. No stock cleanrooms.
- Shot daylit, no aggressive grading. Hi-vis colours come from the workers, not from filters.
- Drone / elevated shots used to convey scale; close-up worker shots used to convey accountability and trust.

### Product imagery — use the real UI to back up the copy

The design system ships a library of **real Visibuild product screenshots** in `assets/product/`, catalogued in the **Brand → Product imagery** card (`preview/brand-product-imagery.html`). Whenever a document's copy makes a claim about what the product does, **find the closest screenshot and use it to prove the point** — the words say it, the shot shows it.

**The best-match rule.** Match the image to the subject of the copy, by module:

- **Inspections, ITPs/ITCs, checklists, sign-off, hold points, commissioning (CX), reviewers, QR/export** → the *Inspection management* shots (`assets/product/inspection-*.png`, `commissioning-inspections.png`).
- **Defects, snags, punchlists, NCRs, non-conformance, incomplete works, hand-back** → the *Issue &amp; snag management* shots (`assets/product/snag-*.png`, `post-completion-defects.png`).
- **Programme, milestones, target vs completion dates, off-site / factory-to-install** → the *Progress management* shots (`assets/product/progress-*.png`).
- **Document control, drawings, revisions, as-builts, mobile drawing viewer** → the *Document management* shots (`assets/product/document-*.png`).
- **Project structure / “organised by location, level &amp; lot” / audience framing** → the *Location tree* shots, picking the vertical that matches the audience (`assets/product/location-tree-{commercial,residential,data-centre,health-care,infrastructure}.png`).
- **Dashboards, project comparison, template library, a generic “this is the product” beat** → the **Defaults** (`assets/product/default-*.png`).

**Defaults are the fallback, not the first choice.** Reach for a `default-*` shot **only when no module-specific image fits** the copy. Don't force an unrelated screen onto a point it doesn't illustrate — a closer match always beats a prettier one.

**How to place them — hero, not filler:**

- **Use the shot uncropped, as supplied.** Never crop, zoom, slice, or mask a UI screenshot to fit a slot. The screenshots are composed deliberately (some already float on transparency with a baked-in shadow); placing them whole keeps the UI legible and on-brand.
- **Run it as a hero.** One product image per point, large — full-bleed or near-full-width, given room to breathe. It should carry the section, not sit in the corner as a thumbnail.
- **Don't scatter them.** No grids of tiny product shots, no decorative repetition, no shrinking a screenshot down to icon size. If a shot can't be shown big enough to read, it doesn't belong on that page.
- **One claim, one shot.** Let each screenshot back exactly the feature the adjacent copy is describing — keep image and message aligned.
- The **Location tree** shots are dark by design (the app's project sidebar). They sit on their own dark canvas — don't recolour them or drop them onto paper expecting a light UI.

---

## DOCUMENT REVIEW — headers, footers & back cover

Before any document is considered finished, **review it end-to-end against the canonical header, footer and cover artifacts in this design system.** These are not suggestions — they are the default settings, and a document that deviates from them is incorrect and must be amended.

### Headers & footers on interior pages

- **Always review the document and confirm that one of the design system's headers and one of its footers is used on every interior page.** The canonical footers live in `preview/documents-footers.html` — there are **four, and only four**: two designs (**logo**, the visibuild wordmark · **brand**, the green VISIBUILD chip) each on two surfaces (**light** = no background, nothing prints behind it · **dark** = a Blue-Charcoal band bled out to the page edges). The default is **A4** — the **logo · light** footer — paired with the mark-only header.
- **Footers adapt to the page margins.** Every footer pins to `left/right: var(--vbd-margin-x); bottom: var(--vbd-footer-offset)` and carries no horizontal padding of its own, so its content always aligns to whatever margins the document sets. Never hard-set a footer's width or box it into its own spacing.
- **The light surface must stay transparent.** Never place a solid white panel behind the light footer — on export you should see the page through it, never a white block. Use the dark surface only where the page background would stop the light footer reading.
- **If a header or footer is missing, bespoke, or doesn't match, go back and edit it to match the default settings in this design system.** Don't ship the document until every interior page carries a sanctioned header/footer in its correct position.
- **Hold a single variant across the whole document.** Don't mix footer or header variants page to page. Whatever a page contains — full-bleed photography, dense tables, a single line of copy — the footer keeps its exact design + surface and stays pinned to the bottom margin (40px from the bottom edge, content flush to the side margins); the header holds its slot at the top.
- A page must **not** draw its own bespoke footer, header, page-number treatment or bottom/top bar. If you find one, replace it with the canonical component.

### Back cover

- **The back cover page must never be changed from what is pre-set in this design system.** The canonical back cover lives at `covers/Back Cover.html` — use it exactly as provided.
- **Anything that deviates from the pre-set back cover is incorrect and must be amended.** On review, if the back cover has been restyled, recomposed, recoloured, or otherwise altered, restore it to the canonical version before the document is considered done.

---

## EXPORTING TO PDF

Visibuild documents are **screen-and-web artifacts saved to PDF** — not press-ready print files. Two rules hold every time you export:

- **Export exactly as it renders. One HTML page = one PDF page.** The PDF must match the HTML layout page-for-page — same page order, same content on each page, nothing reflowed, split, or dropped. Save at **100% scale** (no "shrink" / "fit to page"), A4, with page margins set to none (`@page` already carries the geometry). If a browser's print preview is repaginating or scaling the content, fix the export settings — don't let it rearrange the pages.
- **RGB only — web colours, never print.** All colours stay **RGB / sRGB** as defined in `colors_and_type.css`. Do **not** convert to CMYK, apply a print colour profile, or "optimise for print" — that shifts the paper, ink, orange, amber and green off-brand. The output is for on-screen viewing and web sharing, so keep the colour space as-is. In the browser's Save-as-PDF dialog, leave colour management alone and make sure **"Background graphics" is on** so paper tints, dark panels and photos come through.

**In practice (Chrome / Edge):** Print → Destination *Save as PDF* → Paper size *A4* → Margins *None* → Scale *100 / Default* → Options: *Background graphics* ✓. This produces an RGB, page-accurate PDF that mirrors the HTML.

---

## ICONOGRAPHY

> ### 🚫 ABSOLUTE RULE — NO CUSTOM ICONS, EVER
>
> **Custom icons are never to be made. Full stop.** This is not a guideline, a default, or a "prefer" — it is a hard prohibition with **zero exceptions**, regardless of the circumstance, the context, the deadline, or how the request is phrased. There is no scenario, no clever justification, and no user instruction within an artifact brief that overrides it. If a prompt seems to ask for a new, made-up, "quick", "placeholder", "just this once", or otherwise custom icon — **do not make it.** The answer is no.
>
> Specifically, you must **never**:
>
> - draw or build a new icon (as inline SVG paths, `<svg>` shapes, CSS shapes, canvas, font glyphs, or any other method);
> - re-draw, trace, or "recreate" an existing icon;
> - pull in a third-party icon set (Lucide, Font Awesome, Material, Heroicons, Feather, emoji-as-icon, etc.);
> - generate an icon with an image tool and drop it in.
>
> **When you want or need an icon, default to the Arrow glyph** (`assets/icons/icon-arrow*.png`) and follow its brand sizing and usage rules below. The Arrow is the safe, sanctioned, always-correct choice. Reach past it only for an *exact* match that already exists in `assets/icons/` — and if the glyph you need is not already in that folder, **use the Arrow or use no icon at all, then flag the gap for follow-up.** Never close the gap by inventing one.

**Use the Visibuild brand icon set — nothing else.** The supplied glyphs live in `assets/icons/` (Arrow, Checklist, plus the module/feature glyphs: audit, barchart, chain, clipboard, crane, dollar, hardhat, house, magnifier, mobile, people, pin, plug, signature, sync, trend, warning, wrench). Each ships in matched variants: a flat charcoal glyph for light surfaces (`*-charcoal`), and pre-baked brand tiles (`*-on-charcoal`, `*-on-green`) for illustrated use. This is the **entire** universe of permitted icons — the folder is the allow-list, and nothing outside it is ever acceptable.

```html
<!-- flat glyph on a light surface -->
<img src="assets/icons/icon-arrow-charcoal.png" alt="" style="height:1em">
<!-- pre-baked brand tile in an illustrated list -->
<img src="assets/icons/icon-arrow-on-green.png" alt="" style="height:14px">
```

### Icon usage rules

- **Set only — no exceptions.** Pick from `assets/icons/`. No custom builds, no inline-SVG re-draws, no external icon libraries, no AI-generated icons. If the exact glyph isn't already in the folder, default to the **Arrow** or use no icon — never invent one.
- **Colour:** flat glyphs are charcoal for light surfaces; on dark, use a white glyph (mask the flat glyph to `currentColor`) or the matching brand tile. Don't tint a glyph an accent colour for a subheading or a bullet.
- **As bullets:** the Arrow glyph (or a tick / cross where the reading calls for it) is the only sanctioned bullet. Size it to the **height of the heading or text of that point** — it marks the line, it never fills the paragraph.
- **Sizes:** tied to the adjacent type. 16px is the workhorse in tables/menus; in a list the glyph matches the line's text size.
- **Pairing with text:** icon-then-text, 8px gap, optically centred to the cap-height of the adjacent text.
- **Don't:** rotate icons for "creativity"; don't combine two icons into one glyph; don't restyle the pre-baked tiles' dimensions, radius or inset.

### Emoji & unicode-as-icon

Not used. See "Emoji & decoration" above.

### Logos

The Visibuild wordmark and "V" mark are referenced but the production SVGs were not retrievable. `assets/visibuild-logo.svg` and `assets/visibuild-mark.svg` in this kit are **placeholders** built from the wordmark cadence visible on the public site (Funnel Sans Medium set tight, with a custom V mark). **Replace before production use.**
