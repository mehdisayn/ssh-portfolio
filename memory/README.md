# ssh-portfolio — project memory

## What this is

A personal portfolio for **Syed Mehedi Hussain** that's served over SSH, not HTTP. Visitors run `ssh <host> -p 2222` and land inside a TUI (terminal UI) built with React + Ink. The SSH session itself *is* the interface — no browser, no website.

Five tabs (`home`, `creations`, `skills`, `reflections`, `contacts`) navigated with `← →`. On Creations, `↑ ↓` moves through the project list and the detail panel updates live. `q` quits.

## Who it's for

- Recruiters and engineers visiting the portfolio.
- Doubles as a creative artifact / conversation starter — "you saw my portfolio over SSH" is the point.

## Stack

| Layer | Tech |
|---|---|
| Runtime | Node 20 (uses `tsx` to run JSX directly — no build step) |
| SSH server | `ssh2` |
| TUI | `ink` 6.x (React renderer for terminals) + React 19 |
| Banner | `figlet` (ANSI Shadow font) |

## Links

- Repo: `github.com/mehdisayn/ssh-portfolio`
- Personal site: `syedmehedihussain.codes`
- LinkedIn: `linkedin.com/in/syedmehedihussain`
- Email: `syedmehedihussain@gmail.com`

## Run locally

```bash
npm install
npm start              # SSH server listens on :2222
ssh localhost -p 2222  # in another terminal
```

Server prints `SSH portfolio running` when ready. `host.key` is checked into the repo for convenience; generate a fresh one for any real deployment.

## Important background (non-obvious)

The SSH stream is not a real PTY — it's just a Node duplex stream. Ink expects a TTY, so `server.js` patches the stream with five things before passing it to `render()`:

```js
stream.isTTY = true
stream.columns = ptyInfo?.cols ?? 120
stream.rows = ptyInfo?.rows ?? 40
stream.setRawMode = () => true
stream.ref = () => {}
stream.unref = () => {}
```

It also intercepts `stream.write` and translates `\n` → `\r\n`, because there's no kernel-level `ONLCR` to do it for us. Without that translation, every line starts where the previous one ended — staircase effect.

Without `session.on("pty", accept)`, ssh clients fail with "PTY allocation request failed". With it, plain `ssh localhost -p 2222` works.

Error handlers on `client` and `stream` are mandatory — disconnects emit EPIPE and crash the server without them.

## How AI should help

- **Source of truth for SSH+Ink quirks lives in this file and `CLAUDE.md`.** When something breaks, check those before re-deriving.
- **Content is separated from layout.** To change projects, skills, education, or contact rows, edit `src/data/*.js`. Don't touch JSX for content changes.
- **Manual verification beats automated tests here.** This is a small interactive TUI. The acceptance script in `docs/superpowers/plans/2026-05-26-ssh-portfolio-rebuild.md` shows the pattern (start server, ssh via `script` for a real PTY, capture and assert). Caveat: `script` masks the `\n→\r\n` bug that only shows up in real SSH — for layout regressions, test with an actual SSH client.
- **Don't commit without asking.** User's standing rule.
- **Tone of UI copy:** dry, terse, lowercase, occasionally playful. Don't make it formal-corporate. The "plays with many things, iykyk" line on home is intentional personality.
- **The resume claims SSH Portfolio is built in Go + Charm.** The actual stack is Node + Ink + ssh2. The portfolio shows the actual stack; flag any future drift between resume and reality.

## Where the design and plan live

- Spec: `docs/superpowers/specs/2026-05-26-ssh-portfolio-rebuild-design.md`
- Plan: `docs/superpowers/plans/2026-05-26-ssh-portfolio-rebuild.md`
- Older AI-context notes: `CLAUDE.md` (gitignored)
