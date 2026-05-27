# STATUS

_Last updated: 2026-05-27_

## Where the project stands

The rebuild is functionally complete and committed locally. All five tabs render and navigate cleanly over real SSH. No active blockers.

- `main` is **3 commits ahead of `origin/main`** — nothing pushed yet.
- Working tree is clean.
- User has verified the tab navigation works in their actual terminal.

## Verified working

- SSH server boots on :2222 and survives client disconnects.
- All five screens render correctly: home (portrait + SMH banner + bio), creations (list + detail), skills (categorized), reflections (education + experience), contacts (label/value rows).
- `← →` switches tabs anywhere. `↑ ↓` moves the project list on Creations. `q` quits.
- Two concurrent SSH clients can connect without one's disconnect breaking the other.
- Server log stays clean (no React warnings, no EPIPE crashes, no raw-mode errors).

## Next best action

**Push when ready.** Three local commits are sitting on top of `origin/main`:

```
e57088e rewrite readme for current shape
b7ff7d3 feat: multi-tab navigation, Skills screen, line-ending fix
2c293de rebuild as multi-screen TUI with SAYNFFS brand
```

Do `git push` when you want the work backed up / visible on GitHub.

## Open items (not blockers, but worth doing)

- **Real project URLs.** `src/data/projects.js` has `"(add github url)"` placeholders on 4 of 5 entries (SANDBOX, Paper Mill, E-Learning, Sorting Visualizer). Fill in when you have them.
- **Home tagline polish.** The `"plays with many things, iykyk"` line is the last bit of pre-resume playfulness. Decide if it stays or goes — it currently sits next to the formal `full-stack developer · cs student` tagline, which is a tonal mix.
- **Creations list cursor resets on tab switch.** Each visit to Creations starts at the first project. To persist, lift the list index from `Creations.jsx` up into `app.jsx`. User flagged this might bug them; ask before fixing.
- **React in dev mode.** `react-reconciler.development.js` is what's loaded. If anything throws at runtime, visitors see a stack-trace overlay in their SSH session. Switch to production mode before hosting publicly.
- **Resume vs reality drift.** Resume says SSH Portfolio is Go + Charm. Code is Node + Ink. Update the resume to match before it comes up in interviews.

## What needs review

- The home tagline ambiguity (see above).
- Whether the `"plays with many things, iykyk"` line still fits the now-more-formal portfolio.

## Future / out-of-scope for current milestone

- **Hosting.** Local-only is the explicit current state. Hosting SSH is non-trivial — most PaaS platforms only expose HTTP. Will need TCP routing or a bare VPS. User wants to talk about this *after* local UX is polished.
- Animated splash, command-based navigation (`projects`-style commands), themes — all listed as "future" in the original readme. Not on the active roadmap.
