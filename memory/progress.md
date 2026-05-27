# progress

Dated diary of what changed and what's next. Newest at the top.

---

## 2026-05-27

**Changed:**
- Rewrote `readme.md` from 449-line dev-journey blog into a ~90-line essentials-only file (what it is, how to run, where to edit content, structure, stack, short how-it-works).
- Committed as `e57088e`.

**Next:**
- Decide on the `"plays with many things, iykyk"` line.
- Push or keep local.
- Start thinking about hosting once UX is locked.

---

## 2026-05-26 — evening

**Changed:**
- Restructured navigation: home is now its own tab (not the landing wrapper). Five tabs total: `home · creations · skills · reflections · contacts`. The horizontal menu moved out of Home into `app.jsx` where it's persistent across every screen.
- Replaced enter/esc-based navigation with arrow-only. `← →` switches tabs anywhere; `↑ ↓` only moves the Creations list.
- Pulled the menu and footer up to the app level. `ScreenShell` no longer renders the footer (each screen body just renders its content; app wraps with persistent nav).
- Updated `CLAUDE.md` with the new tab model.

**Why:** User said "no need to press enter or esc" — wants flat, immediate tab switching.

**Open:** Creations list cursor resets to first item on every tab switch. User aware; tolerates for now.

---

## 2026-05-26 — afternoon (resume import)

**Changed:**
- Imported real content from `SyedMehediHussain_CV_2026.pdf`. Five real projects in `src/data/projects.js` (SANDBOX Web App, SSH Portfolio, Paper Mill Operator, E-Learning Platform, Sorting Algorithm Visualizer), all with `year` field added.
- Created `src/screens/Skills.jsx` and `src/data/skills.js` — six categories (languages, frontend, backend, devops & tools, specializations, other).
- Replaced playful Reflections content with formal Education + Experience: Independent University BS CS (2023–present); Freelance Web Developer (2024–present).
- Updated home tagline: `developer · researcher · tech explorer` → `full-stack developer · cs student`.
- Contacts: real GitHub (`mehdisayn`) and LinkedIn (`syedmehedihussain`) handles.
- Moved CV file out of project dir (it had been dropped inside `ssh-portfolio/`).

**Why:** User dropped the CV and said "update info that needs to be updated. projects and all."

**Decision flagged:** Resume says SSH Portfolio is Go + Charm. Actual code is Node + Ink. Project data shows actual stack — agreed with user.

---

## 2026-05-26 — midday (brand rename round 2)

**Changed:**
- Banner text: `SAYNFFS` → `SMH` (initials). Full name `Syed Mehedi Hussain` in figlet ANSI Shadow is ~170 chars wide and won't fit beside the portrait; initials keep the block-letter aesthetic and stay compact.
- Home bio line: `saynffs` → `Syed Mehedi Hussain`.
- Sub-screen title bars: dropped the `saynffs ·` prefix → just `── creations ──`, etc.
- Updated `CLAUDE.md` to reflect the new brand.

**Why:** User said "use Syed Mehedi Hussain as my name" after seeing the rendered output and deciding SAYNFFS wasn't what they wanted.

---

## 2026-05-26 — midday (`\n→\r\n` fix)

**Problem found:** User reported "looks so messy" — the home screen showed a staircase of portrait text and the banner repeating multiple times.

**Root cause:** The SSH stream is a Node duplex stream, not a real PTY. Ink emits plain `\n` between lines, expecting the kernel's `ONLCR` flag to translate to `\r\n`. No PTY → no translation → cursor only moves down, never back to column 1. Each line starts where the previous ended. Frame-clearing math also misfires because the visual line count != logical line count.

**Why it was missed by tests:** All my smoke tests used `script` to provide a PTY. The kernel did the translation, so my captures looked clean. A real SSH client doesn't go through `script`.

**Fix:** Intercepted `stream.write` in `server.js` to convert `\n` to `\r\n` before forwarding.

**Lesson recorded:** For SSH-served TUIs, the only honest test is a real SSH client. `script` masks the line-ending bug.

---

## 2026-05-26 — morning (the rebuild)

**Changed:** Full multi-screen rebuild.

- New router architecture: `app.jsx` owns `currentScreen` state, routes global keys.
- Created `src/screens/{Home,Creations,Reflections,Contacts}.jsx`.
- Created `src/components/{Footer,ScreenShell}.jsx`.
- Rewrote `Menu.jsx` as a controlled, orientation-aware presentational component.
- Created `src/data/{projects,reflections,contacts}.js` to separate content from layout.
- Spec at `docs/superpowers/specs/2026-05-26-ssh-portfolio-rebuild-design.md`.
- Plan at `docs/superpowers/plans/2026-05-26-ssh-portfolio-rebuild.md`.
- Executed inline in this session via 10 tasks. Final acceptance script ran 10/10 pass.
- Committed as `2c293de`.

**Why:** Original layout cramped everything onto one screen with a 50/50 column split that broke at standard terminal widths. Menu items highlighted but didn't navigate. User: "looks messy and rambled."

---

## 2026-05-26 — earliest (server fixes)

**Three SSH server bugs found and fixed:**

1. No `pty` handler → `ssh localhost -p 2222` failed with "PTY allocation request failed". Added `session.on("pty", (accept, reject, info) => { ptyInfo = info; accept() })`.
2. `render(App, { stdout: stream })` only — no `stdin`. Ink's `useInput` crashed with "Raw mode is not supported". Added `stdin: stream`, plus stream-level stubs (`isTTY`, `columns`, `rows`, `setRawMode`, `ref`, `unref`).
3. Server crashed on client disconnect (EPIPE). Added `client.on("error", ...)` and stream error/close handlers.

**Discovery:** The "duplicate React keys" warning that the original readme listed as a solved problem was actually a symptom of Ink's error overlay (which renders stack frames as React keys). Once the underlying errors stopped, the overlay never appeared, and the warning vanished.
