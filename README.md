# Visibuild — Onboarding Portal

An internal tool for tracking client onboarding: a 90-day rollout programme across workstreams
(location tree, templates/ITPs, training, document control, data import, programme & milestones,
go-live & adoption), subcontractor trade onboarding, correspondences, comments, and a live
summary dashboard. Auto-saves to a shared dataset so the whole team sees the same live data —
no per-person copies.

Originally designed in Claude Design (see `design-handoff/` for the original prototype and the
chat transcripts that shaped it) and rebuilt here as a real React app with a Netlify-backed
shared datastore.

## How data sharing works

- **Shared data**: all project data (tasks, notes, comments, correspondences, subcontractors,
  evidence files) lives in [Netlify Blobs](https://docs.netlify.com/blobs/overview/), read and
  written through two serverless functions (`netlify/functions/state.js` and `files.js`). Anyone
  who opens the deployed URL sees the same data.
- **Sync model**: edits save ~500ms after you stop typing, and the app polls for other people's
  changes every 8 seconds (paused while you're actively editing, so it won't clobber what you're
  typing). This is last-write-wins — good for a small team editing casually, not real-time
  character-by-character collaboration.
- **Identity**: the first time you open the app it asks for your name (stored only in your
  browser) so comments/edits show who made them. There's no login/password.

## Local development

```bash
npm install
npm install -g netlify-cli   # one-time, only if you don't have it
netlify dev
```

`netlify dev` runs the Vite dev server *and* emulates the Netlify Functions + Blobs locally, so
the shared-data flow works exactly like production. Open the URL it prints (usually
`http://localhost:8888`).

If you only need to work on styling/layout and don't care about persistence, `npm run dev` alone
also works (Vite on `:5173`), but reads/writes to the functions will fail without `netlify dev`
running alongside.

## Deploying (so you can send the team a link)

1. Push this repo to GitHub.
2. In Netlify: **Add new site → Import an existing project → GitHub**, pick this repo.
   Netlify will read `netlify.toml` automatically — build command and publish directory are
   already configured, nothing to fill in.
3. Deploy. Netlify Blobs works out of the box on any Netlify site, no extra setup or database to
   provision.
4. Share the resulting `*.netlify.app` URL (or attach a custom domain) with the team — everyone
   who opens it shares the same live dataset.

Every push to the connected branch redeploys automatically.

## Project structure

```
src/
  lib/          data model: constants, seed data, date/risk helpers, the API client,
                 and the central store hook (src/lib/store.js) that holds all state + mutations
  components/   shared UI pieces (Header, Sidebar, TaskCard, ItemCard, EvidenceDrop, ...)
  components/views/   one component per page (Summary, Programme, Task list, Subcontractors,
                       Correspondences, Comments, Settings)
netlify/functions/
  state.js      GET/POST the shared project dataset (Netlify Blobs)
  files.js      upload/download/delete evidence files (Netlify Blobs)
design-handoff/ the original Claude Design export (prototype HTML, chat transcripts, assets) —
                 kept for reference, not part of the running app
```

## Seed data

The app seeds itself once (only if the shared store is empty) with the **99 City Road /
Multiplex** project, fully populated from the real onboarding data synced from Notion during
design. Use **+ New project** in the project switcher to add more; use **Settings** to edit dates
and details on any project.
