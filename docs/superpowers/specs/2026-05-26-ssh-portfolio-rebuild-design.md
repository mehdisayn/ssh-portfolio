# SSH Portfolio Rebuild — Design

**Date:** 2026-05-26
**Status:** Approved (architecture through file layout)
**Scope:** Rebuild the SSH-served TUI from a single cramped screen into a multi-screen, navigable portfolio. Server transport stays as-is (already fixed in the prior session).

## Problem

The current build crams every piece of content (portrait, banner, four sections of bio riffs, menu) onto a single screen with a 50/50 column split. At standard terminal widths the portrait column squashes to a fragment and the right column wraps awkwardly. The menu items (`Creations`, `Reflections`, `Contacts`) are decorative — they highlight but don't navigate anywhere. The result reads as rambled and structureless.

## Goal

A multi-screen TUI where:
- The home screen is compact and legible at standard terminal widths.
- The menu items actually navigate to dedicated sub-screens.
- Long-form personality content lives on its own screen instead of clogging the landing view.
- Adding or editing content (projects, reflections, links) doesn't require touching layout code.

Local-only for this milestone. Hosting is a later concern.

## Brand

| Field | Value |
|---|---|
| Display handle | `SAYNFFS` |
| Email | `syedmehedihussain@gmail.com` |
| Web | `syedmehedihussain.codes` |
| Banner font | figlet ANSI Shadow |
| Tone | dry, playful, terse |

The real name "Syed Mehedi Hussain" is **not** displayed anywhere in the UI.

## Architecture

`app.jsx` is the top-level router. It owns one piece of state: `currentScreen` (one of `"home" | "creations" | "reflections" | "contacts"`). It renders exactly one screen at a time, plus the persistent footer. Global keys (`q` to quit, `Ctrl-C` to quit, `Esc` to return to home) are handled in `app.jsx` via `useInput`. Per-screen keys (arrows, enter, list navigation) are handled inside each screen component.

Screens never know about each other. They receive content from `src/data/` and a callback (e.g. `onOpen("creations")`) for navigation. Routing logic stays in `app.jsx`.

```
ssh client connects
       ↓
server.js  (unchanged — PTY accept, stream stubs, error handlers)
       ↓
App           ← owns currentScreen, handles q / Esc / Ctrl-C
├─ Home       ← portrait + banner + tagline + Menu(horizontal)
├─ Creations  ← Menu(vertical) + detail panel, data from projects.js
├─ Reflections← static content from reflections.js
├─ Contacts   ← rows from contacts.js
└─ Footer     ← keybind hint line (per-screen)
```

## Screen specifications

### Home

Neofetch-style. Portrait on the left in a fixed-width column (widest line of `portrait.txt` + 2 padding), info block on the right, menu and footer at the bottom. If the terminal is narrower than `portrait_width + info_min_width + gutter`, the layout stacks vertically instead of side-by-side.

```
  .-""""-.            ██╗  ██╗ █████╗ ███████╗███╗   ███╗██╗
 /        \           ██║ ██╔╝██╔══██╗╚══███╔╝████╗ ████║██║
|  portrait|          █████╔╝ ███████║  ███╔╝ ██╔████╔██║██║
|   here   |          ██╔═██╗ ██╔══██║ ███╔╝  ██║╚██╔╝██║██║
 \        /           ██║  ██╗██║  ██║███████╗██║ ╚═╝ ██║██║
  '-....-'            ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝╚═╝

                      saynffs
                      developer · researcher · tech explorer
                      syedmehedihussain@gmail.com

                      plays with many things, iykyk

  ──────────────────────────────────────────────────────────
   ◆ creations    reflections    contacts
  ──────────────────────────────────────────────────────────
   ← →  move    enter  open    q  quit
```

The figlet banner shows `SAYNFFS` (not `KAZMI`). The "plays with many things, iykyk" line is the single personality taste on the home screen; the longer riffs live in Reflections.

Keys: `←` `→` move the menu cursor, `Enter` opens the selected screen, `q` quits.

### Creations

Two-pane: project list on the left (~⅓ width), detail panel on the right (~⅔). The detail panel updates live as the cursor moves — no extra keystroke required to "open" a project.

```
 ── saynffs · creations ────────────────────────────────────

 ▸ ssh-portfolio          ssh-portfolio
   project two              ──────────────────────────────
   project three            a terminal-based portfolio
                            served over ssh. node + ink +
                            ssh2.

                            tech: node, ink, ssh2, figlet
                            link: github.com/.../ssh-portfolio

 ───────────────────────────────────────────────────────────
   ↑ ↓  pick    esc  back    q  quit
```

Project entries are scaffolded with placeholders. Schema in `src/data/projects.js`:

```js
[
  { name, blurb, tech, link }
]
```

Keys: `↑` `↓` move the list cursor, `Esc` returns to home, `q` quits.

### Reflections

Static content screen. The playful riffs from the current `app.jsx`, restructured as headed sections with consistent spacing. No interaction beyond `Esc`/`q`.

```
 ── saynffs · reflections ──────────────────────────────────

 what does he do?
   plays. with many things, iykyk.

 is he cool?
   eh "is he cool?" bitch he is the word cool.

 special skill?
   creates anything with anything.
   follows tutorials and makes tutorials.
   complex linux BS? random sunday for him.
   some people say "he is better than pewdiepie".

 what can't he do?
   wellllll, there is something… MATH. FAAAAAHHH.

 ───────────────────────────────────────────────────────────
                       esc  back    q  quit
```

Content lives in `src/data/reflections.js` as `[{ heading, lines: string[] }]` so wording changes never touch JSX.

### Contacts

Four label/value rows.

```
 ── saynffs · contacts ─────────────────────────────────────

   email      syedmehedihussain@gmail.com
   github     github.com/<placeholder>
   linkedin   linkedin.com/in/<placeholder>
   web        syedmehedihussain.codes

 ───────────────────────────────────────────────────────────
                       esc  back    q  quit
```

Rows live in `src/data/contacts.js` as `[{ label, value }]`. Email and web carry real values; GitHub and LinkedIn are placeholders the user fills in.

## Keybindings (consolidated)

| Screen | Keys |
|---|---|
| Global | `q` or `Ctrl-C` quit |
| Home | `← →` move · `Enter` open |
| Creations | `↑ ↓` move list · `Esc` back |
| Reflections | `Esc` back |
| Contacts | `Esc` back |

The footer always shows the current screen's available keys — no hidden bindings.

## File layout

```
src/
├── server.js                  unchanged (PTY + stream stubs + error handlers)
├── app.jsx                    rewritten — currentScreen state + global keys
├── screens/
│   ├── Home.jsx               new
│   ├── Creations.jsx          new
│   ├── Reflections.jsx        new
│   └── Contacts.jsx           new
├── components/
│   ├── Header.jsx             updated — figlet text "SAYNFFS"
│   ├── Portrait.jsx           unchanged
│   ├── Menu.jsx               rewritten — orientation="horizontal"|"vertical" prop, arrow keys
│   ├── ScreenShell.jsx        new — title bar + body slot + footer
│   └── Footer.jsx             new — keybind hint line
└── data/
    ├── projects.js            new
    ├── reflections.js         new
    └── contacts.js            new
```

Nothing is deleted. `server.js`, `Portrait.jsx`, `host.key`, `assets/portrait.txt`, `package.json` are untouched.

## Menu component

One component, props-driven, used in both orientations:

- `items: string[]` — labels to render.
- `orientation: "horizontal" | "vertical"` — layout.
- `index: number` — currently highlighted item (controlled by parent).
- `cursor: string` — marker char (default `◆` for horizontal, `▸` for vertical).

The parent screen owns the index state and calls `useInput` to update it. The Menu is presentational. This keeps screen-specific keybindings inside screens, not buried in Menu.

## Visual palette

- Cyan: figlet banner, active menu item.
- White: headings, primary body text.
- Dim gray: secondary lines (tagline, link values), inactive menu items.
- Magenta: `◆` and `▸` cursor markers.

Same palette as the current app; the rebuild applies it consistently.

## Out of scope for this milestone

- Hosting / deployment.
- Animated loading screen, command-line nav, themes, splash effects (all listed in current README "Future Improvements" — defer).
- React production-mode build (current dev mode prints stack overlays to clients on errors; address before hosting, not now).
- Hooking the menu cursor through keyboard arrows on terminals that send unusual escape sequences (Ink handles this for mainstream terminals).
- Tests. This is a small interactive TUI; manual verification via `npm start` + `ssh localhost -p 2222` is sufficient at this milestone.

## Manual verification (what "done" looks like)

1. `npm start` prints `SSH portfolio running`.
2. `ssh localhost -p 2222` shows the Home screen with the SAYNFFS banner.
3. `←` `→` moves the home menu cursor between three items; `Enter` opens the highlighted screen.
4. On Creations, `↑` `↓` moves the list cursor and the detail panel updates live.
5. `Esc` from any sub-screen returns to Home.
6. `q` from any screen disconnects cleanly; server keeps listening.
7. Two concurrent SSH clients can connect without one's disconnect crashing the other.
