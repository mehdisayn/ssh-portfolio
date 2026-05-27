# decisions

What's been decided and why, with revisit conditions if the assumption changes.

---

## Architecture

### Multi-screen with menu navigation (not single-screen)
Chose this over "single screen, tighten the layout" or "single screen with scroll." Original cramming-everything-onto-one-screen was the root of "messy and rambled" feedback.
**Revisit:** if the number of tabs grows past ~7 and the horizontal menu starts overflowing on narrow terminals.

### Tab navigation with arrow keys only (no enter/esc)
`← →` switches tabs anywhere. `↑ ↓` only does in-screen list movement on Creations. No enter to "open" anything, no esc to "go back" — tabs are just tabs.
**Revisit:** if a screen needs sub-views deep enough that flat tab nav isn't enough.

### Persistent menu lives in `app.jsx`, not inside Home
After the tab refactor, the horizontal menu is rendered by App on every screen, not by Home. Screens just render their bodies; App wraps them with menu + footer.
**Revisit:** if any screen needs the menu hidden (full-screen mode).

### Content separated from layout (`src/data/*.js`)
Projects, skills, reflections (education+experience), and contacts all live as plain JS arrays in `src/data/`. Schemas are stable.
**Revisit:** if data grows to needing a database or runtime configuration.

---

## Brand

### Banner shows `SMH` (initials), not full name
"Syed Mehedi Hussain" in figlet ANSI Shadow is ~170 chars wide and breaks the neofetch-style portrait+banner row at any normal terminal width. SMH keeps the block-letter punch and fits beside the portrait.
**Revisit:** if a different font or vertical-stack layout becomes appealing.

### Display name is "Syed Mehedi Hussain" everywhere except banner
First brand attempt was `SAYNFFS` as the handle. User changed mind after seeing it rendered. The full name appears in the home bio block; banner is `SMH`.
**Revisit:** if user wants to rebrand again.

### Sub-screen titles have no name prefix
`── creations ──`, not `── saynffs · creations ──`. The home banner already establishes identity; repeating it on every sub-screen is noise.
**Revisit:** if a future skin design wants the prefix back for visual consistency.

### Tone: dry, terse, lowercase, occasionally playful
The `"plays with many things, iykyk"` line on home is deliberately playful. Section headings in Reflections and tabs are lowercase. Avoid corporate / formal phrasing.
**Revisit:** if positioning the portfolio for very formal contexts (e.g., enterprise sales).

---

## Tech

### SSH stream needs five stubs before passing to Ink
`isTTY`, `setRawMode`, `ref`, `unref`, and `columns`/`rows`. Hard-won — Ink throws different errors if any are missing.
**Revisit:** if Ink updates and starts handling non-TTY duplex streams natively.

### Intercept `stream.write` to translate `\n` → `\r\n`
Real PTYs do this via `ONLCR`. The SSH stream is not a real PTY. Without translation, lines staircase and frames stack.
**Revisit:** if the SSH server is ever switched to use a real PTY (e.g., spawning a pty-backed child process per session).

### `tsx` to run JSX at runtime (no build step)
Decided early — keeps the project simple. JSX runs directly, no `dist/` folder, no transpile step in deployment.
**Revisit:** if production-mode React + minified bundles become important (likely before public hosting).

### Manual verification over a test suite
This is a small interactive TUI. Acceptance is "does it render right on a real terminal." Manual verification via `npm start` + `ssh localhost -p 2222` is the contract.
**Revisit:** if multiple developers join, or if regressions become frequent enough to justify the setup cost of a TUI test harness.

### Test through real SSH, not `script`
`script` provides a kernel PTY, which silently fixes the `\n→\r\n` issue. That masked a real bug for one round. Always verify final acceptance with an actual `ssh` client to the running server.

---

## Process

### Specs and plans live under `docs/superpowers/`
Spec, plan, and implementation history are committed (not gitignored) — useful for future engineers reading the repo.
**Revisit:** if the user later decides they don't want these in the public repo.

### `CLAUDE.md` and `memory/` are AI-personal context
`CLAUDE.md` is gitignored. The `memory/` directory (this file's home) was created for Obsidian export — user may or may not gitignore later.
**Revisit:** when user decides commit policy for memory files.

### Commits gated on explicit user request
Standing rule. The skills' default "commit after each task" is overridden by user instruction. Always ask, or batch into one final commit per round.

### Work in-place on `main` (no worktree, no feature branch)
User accepted in-place changes when explicitly asked. The skill's default is worktree isolation; user override.
**Revisit:** if multiple developers join, or if the repo gets a CI pipeline that expects PR workflow.

---

## Resume / external alignment

### Show actual stack in the portfolio, not the resume's claim
Resume says SSH Portfolio is Go + Charm. The code is Node + Ink + ssh2. The portfolio shows Node + Ink. Reasoning: visitors are *inside* the TUI when reading; misrepresenting the stack would be obvious and weird.
**Revisit:** when the resume gets corrected. Then this decision becomes moot.
