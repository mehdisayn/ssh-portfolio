# SSH Portfolio

A terminal portfolio that lives on an SSH port. No browser. No HTML. You connect with `ssh`, and the connection itself is the interface — a React-rendered TUI streamed back over the channel.

```
ssh localhost -p 2222
```

## Preview

```
  .;;:::''.                ███████╗███╗   ███╗██╗  ██╗
 cdxxxoll;.                ██╔════╝████╗ ████║██║  ██║
 OOkkkxxc'                 ███████╗██╔████╔██║███████║
 0K000OOd:'.    portrait   ╚════██║██║╚██╔╝██║██╔══██║
 0XXXXKK0Oxdolc:           ███████║██║ ╚═╝ ██║██║  ██║
   .,;cloodxxkk            ╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝

                           Syed Mehedi Hussain
                           full-stack developer · cs student
                           syedmehedihussain@gmail.com

                           plays with many things, iykyk

  ──────────────────────────────────────────────────────────
   ◆ home    creations    skills    reflections    contacts
  ──────────────────────────────────────────────────────────
   ← →  switch    q  quit
```

`←` `→` flip between tabs. On Creations, `↑` `↓` moves through the project list and the detail panel updates live. `q` quits.

## Run locally

```bash
git clone https://github.com/mehdisayn/ssh-portfolio.git
cd ssh-portfolio
npm install
npm start              # SSH server starts on port 2222
```

Then from another terminal:

```bash
ssh localhost -p 2222
```

The server prints `SSH portfolio running` when it's up. The host key (`host.key`) is committed so the first connection doesn't prompt for one; for a real deployment you'd generate your own.

## Editing content

Content is separated from layout. Edit these to change what visitors see — no JSX required:

| File | What's in it |
|---|---|
| `src/data/projects.js` | Project list: `{ name, year, blurb, tech, link }` |
| `src/data/skills.js` | Skill categories: `{ category, items[] }` |
| `src/data/reflections.js` | Education + experience: `{ heading, lines[] }` |
| `src/data/contacts.js` | Contact rows: `{ label, value }` |
| `src/screens/Home.jsx` | Banner text, tagline, one-line bio (the home view itself) |
| `assets/portrait.txt` | The ASCII portrait shown on home |

## Project structure

```
ssh-portfolio/
├── src/
│   ├── server.js                 ssh2 server + Ink bootstrap
│   ├── app.jsx                   router: holds the active tab, owns the menu
│   ├── screens/
│   │   ├── Home.jsx              portrait + banner + bio
│   │   ├── Creations.jsx         project list + detail panel
│   │   ├── Skills.jsx            skills grouped by category
│   │   ├── Reflections.jsx       education + experience
│   │   └── Contacts.jsx          label/value rows
│   ├── components/
│   │   ├── Header.jsx            figlet banner
│   │   ├── Portrait.jsx          reads assets/portrait.txt
│   │   ├── Menu.jsx              controlled, horizontal or vertical
│   │   ├── ScreenShell.jsx       title bar + body for sub-screens
│   │   └── Footer.jsx            keybind hint line
│   └── data/                     content (see above)
├── assets/
│   └── portrait.txt              ASCII portrait
├── host.key                      SSH host key
└── package.json
```

## Stack

- Node 20
- `ssh2` — SSH server
- `ink` 6.x — React for the terminal
- React 19
- `figlet` — banner text
- `tsx` — runs JSX without a build step

## How it works (the short version)

1. `ssh2` accepts a TCP connection on port 2222 and negotiates an SSH session.
2. When the client requests a PTY and a shell, the server hands the data stream to Ink's `render()` as both `stdin` and `stdout`.
3. Ink renders React components by writing ANSI escape sequences to that stream. The client's terminal interprets them.
4. Keystrokes flow back through the stream and reach `useInput` hooks inside React components.

There are a few non-obvious adaptations in `server.js` — the SSH stream isn't a real PTY, so it needs stubs (`isTTY`, `setRawMode`, `ref`/`unref`), and `\n` has to be translated to `\r\n` because there's no kernel-level `ONLCR` to do it for us.

## Author

Syed Mehedi Hussain — Computer Science student at Independent University, Bangladesh.

`syedmehedihussain@gmail.com` · [syedmehedihussain.codes](https://syedmehedihussain.codes) · [github.com/mehdisayn](https://github.com/mehdisayn)
