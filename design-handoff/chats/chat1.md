# Visibuild Onboarding Portal

_Started 2026-07-20 16:52 UTC_

---

## User

i need the ultimate visibuild onboarding portal (for internal use at this stage).
requirements:
- this is a desktop application, it can be saved as a html if easiest
- this needs to be a live document, this needs to auto-save
- this can be used with claude code if easier or lovable
- refet to the attached images, this is how the structure can follow BUT you take the lead here, you are an expert of customer success and onboarding
- similar set-up to the visibuild page but make it onboard specific - refer images attached
- needs to be interactive, e.g. i can drag and drop in files and they will sync onto the onboarding document
- needs to be a pdf export for the page
- needs to allow for comments, adjustments, edits, rearrangements within the desktop app

ask questions and be ruthless with the design and development

## Assistant

I'll start by grounding myself in the design system and the existing Visibuild web-app UI kit, then ask you focused questions.

_[tool: list_files]_

_[tool: list_files]_

_[tool: image_metadata]_

_[tool: list_files]_

_[tool: list_files]_

_[tool: read_file]_

_[tool: list_files]_

_[tool: list_files]_

_[tool: read_file]_

I've got the brand tokens, product screenshots, and icon set in hand. The design system is a document formatter, but its palette and type fully cover the app-style chrome in your reference. Before I build, I need to lock the product decisions — this is a big one and I want to get the foundation right.

_[tool: questions_v2]_

## User

Questions answered:
- deliverable_model: A working HTML tool now — auto-saves on my machine, good enough to trial with the team
- home_view: Single project: one project is the whole document, switch via a picker
- workstreams: Location tree build (levels / lots / zones), Template & ITP/ITC library configuration, Trade & subcontractor onboarding (invite → trained → first inspection), Training sessions (admin + field), Programme / milestone linking, Document control & drawings setup, Data import (historical tickets, registers, exports), Go-live & adoption tracking (30/60/90 day)
- rollout_meaning: Rollout milestones: setup by 30, first live inspections by 60, full adoption by 90
- programme_viz: Gantt-style timeline with 30/60/90 phase bands and status per task
- risk_logic: Automatic from due dates vs today (overdue = red, due soon = amber)
- files_dropzone: Attach evidence to a task (screenshot, CSV export, signed sheet), Correspondence: emails / letters / meeting notes
- collaboration: Single machine is fine — auto-saves locally, I share/export the file
- correspondences: A timeline of client comms (date, who, channel, summary, attachments)
- seed_data: Realistic sample from the reference (Multiplex – 99 City Road, Global Switch, etc.)
- summary_metrics: Tasks: complete / outstanding / overdue (counts + %), Onboarding progress % per project, Programme health / risk of slippage per project, Who's behind — owners/trades with outstanding work
- build_order: Summary dashboard + one fully-worked sample project across all sections

## Assistant

Answers locked. Let me check what the design-system bundle and base styles expose, then grab the assets I'll need.

_[tool: read_file]_

_[tool: grep]_

No importable DS React components (`components:[]`) — I'll compose with the brand tokens, type classes, and inline styles, loading just `colors_and_type.css` (the A4 `documents.css`/`covers.css` would fight an app layout). Copying the assets I need and checking the clean chrome reference.

_[tool: copy_files]_

_[tool: view_image]_

_[tool: update_todos]_

Foundation is clear. This is a substantial build — an interactive, auto-saving single-project onboarding portal with the Visibuild app chrome. Let me lay out the plan and build the core.Now the build. Writing the full logic engine and template in one pass.

_[tool: dc_write]_

_[tool: show_html]_

_[tool: show_html]_

Chrome and summary look excellent — matches the product. Let me check the other sections and console.

_[tool: get_webview_logs]_

_[tool: multi_screenshot]_

All sections working — Gantt with phase bands and today line, editable task cards, project picker with live progress. Let me confirm correspondences, comments, and a rollout phase render.

_[tool: multi_screenshot]_

Everything renders and the auto-save indicator flips to "Saving…" on changes. Two usability refinements before verification: make only the grip initiate drag (so text selection in cards works), and let clicking outside close the status menu.

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: update_todos]_

_[tool: ready_for_verification]_

Built and open for review: **Onboarding Portal.dc.html** — a working, auto-saving desktop onboarding tool in the Visibuild app chrome.

**What's in it**
- **Single-project focus** with a project picker (5 sample projects — 99 City Road fully worked, plus Global Switch, Capital Towers, 43 Bishopsgate for contrast) showing live progress/risk.
- **Onboarding Summary**: progress ring, complete/outstanding/overdue KPIs, days-to-go-live, status-by-workstream bars, 30/60/90 programme health, "who's behind", and "next up & at risk".
- **90-day Programme**: Gantt with 30/60/90 phase bands, today line, and risk auto-flagged from due dates (overdue bars ringed red).
- **8 workstream pages + Rollout 30/60/90 views**: editable task cards (inline title/owner/due, status menu, drag-to-reorder via the grip) with **drag-and-drop evidence** zones.
- **Correspondences** timeline and **Comments**, both fully editable.
- **Auto-save** to this device (localStorage for the doc, IndexedDB for dropped files) with a live save indicator; **Export PDF** produces a clean phase-by-phase document.
- Two code-only tweaks exposed: risk window (days) and today-line toggle.

**Worth flagging**
- It saves to *this browser on this machine* — perfect for a solo trial. True multi-person live editing needs the Claude Code/Lovable backend route; the data model is clean for that handoff when you're ready.
- Data is sample. Want a one-click "clear to blank template" and a real Multiplex export seeded in? Also happy to add a task-detail drawer (notes + per-task comment threads) if you want deeper editing than the cards.

It's out for review now — I'll fix anything the check flags.

## User

Found issues — fixing…

## User

Found issues — fixing…

## Assistant

Fixing the logo to a literal src.

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

Fixed — the header logo is now a literal `src`, so it paints during streaming with no load error, and the unused `markSrc` is gone. The transient evidence-image errors the verifier flagged are already gated by `sc-if e.isImage` in real renders, so no visible breakage.

`skip_verifier_agent` since this is a one-line resource fix.

_[tool: ready_for_verification]_

Adding the DS bundle to `<helmet>` to satisfy the contract (harmless — it exposes no components, but the skill wants it loaded).

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

The `{{ e.url }}` img fetches its literal placeholder during streaming. I'll render evidence thumbnails as a background-image style object instead — an undefined style hole fetches nothing.

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Clean — no console errors, DS bundle loaded, logo and evidence thumbnails paint without any placeholder fetches. The portal is ready to trial.

Quick reminders on what you can do in it: drag files onto any task's evidence zone or a correspondence entry, edit any field inline, drag the grip to reorder tasks, switch projects from the top-left, and **Export PDF** for a phase-by-phase document. Everything auto-saves to this browser.

Happy to add next: a one-click "clear to blank template", a task-detail drawer with per-task comment threads, or seed it from a real Multiplex export if you send one.

## User

Workstreams is fine, but we should also have 'Subcontractor' then an 'expand button' to drop down and see 'trade 1' - each 'trade' dropdown should have inside as a start - ITPs (inside ITP submission & digitiations) & training
thr workstreams and subcontractor should have an arrow to expand and contract

## User

Workstreams is fine, but we should also have 'Subcontractor' then an 'expand button' to drop down and see 'trade 1' - each 'trade' dropdown should have inside as a start - ITPs (inside ITP submission & digitiations) & training
thr workstreams and subcontractor should have an arrow to expand and contract

## User

Check didn’t complete

## Assistant

## User

expand and contract workstream embded sections

