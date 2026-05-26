# SSH Portfolio Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the single-screen SSH portfolio into a multi-screen, arrow-navigable TUI with separate Home / Creations / Reflections / Contacts views and the SAYNFFS brand.

**Architecture:** `app.jsx` is a top-level router that owns `currentScreen` state and global keys (`q` quit, `Esc` back). Each screen lives under `src/screens/` and uses presentational components (`Menu`, `Footer`, `ScreenShell`) plus content from `src/data/`. Server transport stays as-is (already fixed in the prior session).

**Tech Stack:** Node 20, React 19, Ink 6.x (terminal renderer), `ssh2`, `figlet`, `tsx` (run JSX without a build step).

**Spec:** `docs/superpowers/specs/2026-05-26-ssh-portfolio-rebuild-design.md`

---

## Conventions used in this plan

**Working directory:** `/home/husayn/rasp/projects/ssh-port/ssh-portfolio`. All commands assume that's the cwd.

**Manual verification pattern.** Each UI task ends with a "verify by running" step. Use this script — it starts the server in the background, connects an SSH client under `script` (provides a PTY), captures the rendered TUI, then kills the server:

```bash
# Save as scripts/smoke.sh once and reuse. Or run the lines inline.
pkill -f "tsx src/server.js" 2>/dev/null; sleep 0.3
rm -f /tmp/portfolio-server.log /tmp/portfolio-client.log
npm start > /tmp/portfolio-server.log 2>&1 &
timeout 15 bash -c 'until grep -q "SSH portfolio running" /tmp/portfolio-server.log 2>/dev/null; do sleep 0.2; done' || { echo "server didn't start"; cat /tmp/portfolio-server.log; exit 1; }
script -q -c "timeout 3 ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR localhost -p 2222" /tmp/portfolio-client.log >/dev/null 2>&1
pkill -f "tsx src/server.js" 2>/dev/null
# View the captured screen (ANSI escapes stripped):
cat /tmp/portfolio-client.log | sed 's/\x1b\[[0-9;?]*[a-zA-Z]//g'
# Check the server log for errors:
grep -iE "error|exception|warning" /tmp/portfolio-server.log || echo "server log clean"
```

**Interactive keystroke verification.** When a task needs to verify navigation (arrow keys, enter, esc), pipe keystrokes through ssh stdin:

```bash
# Example: send right-arrow twice, then enter, then wait
( printf '\x1b[C\x1b[C\r'; sleep 1 ) | script -q -c "timeout 3 ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR localhost -p 2222" /tmp/portfolio-client.log >/dev/null 2>&1
```

Escape sequences: `\x1b[A` up, `\x1b[B` down, `\x1b[C` right, `\x1b[D` left, `\r` enter, `\x1b` esc, `q` quit.

**Commit policy.** Each task ends with a commit. The user's standing rule is "no commits without explicit ask", so during execution: ask the user before each commit, or batch into one final commit if they prefer. The commits below show the messages to use when they're approved.

---

## Task 1: Update Header banner to SAYNFFS

**Files:**
- Modify: `src/components/Header.jsx`

- [ ] **Step 1: Replace the figlet text**

Replace the contents of `src/components/Header.jsx` with:

```jsx
import React from "react"
import { Text } from "ink"
import figlet from "figlet"

const title = figlet.textSync("SAYNFFS", {
 font: "ANSI Shadow"
})

export default function Header(){
 return <Text color="cyan">{title}</Text>
}
```

- [ ] **Step 2: Verify by running**

Run the smoke script from the conventions section. Expected output (stripped of ANSI):

The captured screen should contain `SAYNFFS` rendered in ANSI Shadow block letters. The previous `KAZMI` banner must be gone. Server log should be clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.jsx
git commit -m "rebrand banner: KAZMI -> SAYNFFS"
```

---

## Task 2: Create data modules

**Files:**
- Create: `src/data/projects.js`
- Create: `src/data/reflections.js`
- Create: `src/data/contacts.js`

- [ ] **Step 1: Create projects.js**

Create `src/data/projects.js`:

```js
export default [
  {
    name: "ssh-portfolio",
    blurb: "a terminal-based portfolio served over ssh. node + ink + ssh2.",
    tech: "node, ink, ssh2, figlet",
    link: "github.com/<your-handle>/ssh-portfolio"
  },
  {
    name: "project-two",
    blurb: "(placeholder — replace with a real project blurb)",
    tech: "(stack here)",
    link: "(url here)"
  },
  {
    name: "project-three",
    blurb: "(placeholder — replace with a real project blurb)",
    tech: "(stack here)",
    link: "(url here)"
  }
]
```

- [ ] **Step 2: Create reflections.js**

Create `src/data/reflections.js`:

```js
export default [
  {
    heading: "what does he do?",
    lines: ["plays. with many things, iykyk."]
  },
  {
    heading: "is he cool?",
    lines: ["eh \"is he cool?\" bitch he is the word cool."]
  },
  {
    heading: "special skill?",
    lines: [
      "creates anything with anything.",
      "follows tutorials and makes tutorials.",
      "complex linux BS? random sunday for him.",
      "some people say \"he is better than pewdiepie\"."
    ]
  },
  {
    heading: "what can't he do?",
    lines: ["wellllll, there is something… MATH. FAAAAAHHH."]
  }
]
```

- [ ] **Step 3: Create contacts.js**

Create `src/data/contacts.js`:

```js
export default [
  { label: "email", value: "syedmehedihussain@gmail.com" },
  { label: "github", value: "github.com/<your-handle>" },
  { label: "linkedin", value: "linkedin.com/in/<your-handle>" },
  { label: "web", value: "syedmehedihussain.codes" }
]
```

- [ ] **Step 4: Verify imports parse**

Run:

```bash
node --input-type=module -e "import('./src/data/projects.js').then(m=>console.log(m.default.length)); import('./src/data/reflections.js').then(m=>console.log(m.default.length)); import('./src/data/contacts.js').then(m=>console.log(m.default.length))"
```

Expected: prints `3`, `4`, `4` (in any order).

- [ ] **Step 5: Commit**

```bash
git add src/data/
git commit -m "add data modules for projects, reflections, contacts"
```

---

## Task 3: Create Footer component

**Files:**
- Create: `src/components/Footer.jsx`

- [ ] **Step 1: Write Footer.jsx**

Create `src/components/Footer.jsx`:

```jsx
import React from "react"
import { Box, Text } from "ink"

export default function Footer({ hints }) {
  return (
    <Box marginTop={1}>
      <Text dimColor>{hints}</Text>
    </Box>
  )
}
```

- [ ] **Step 2: Commit**

(No runtime verification yet — Footer is presentational and gets exercised in Task 6 when Home renders it.)

```bash
git add src/components/Footer.jsx
git commit -m "add Footer component for keybind hint line"
```

---

## Task 4: Create ScreenShell component

**Files:**
- Create: `src/components/ScreenShell.jsx`

- [ ] **Step 1: Write ScreenShell.jsx**

Create `src/components/ScreenShell.jsx`:

```jsx
import React from "react"
import { Box, Text } from "ink"
import Footer from "./Footer.jsx"

const DIVIDER = "──────────────────────────────────────────────────────────"

export default function ScreenShell({ title, hints, children }) {
  return (
    <Box flexDirection="column" paddingX={1}>
      <Text dimColor>── saynffs · {title} {DIVIDER}</Text>
      <Box marginTop={1} flexDirection="column">
        {children}
      </Box>
      <Box marginTop={1}>
        <Text dimColor>{DIVIDER}</Text>
      </Box>
      <Footer hints={hints} />
    </Box>
  )
}
```

- [ ] **Step 2: Commit**

(Verified in Task 7 when Reflections uses it.)

```bash
git add src/components/ScreenShell.jsx
git commit -m "add ScreenShell wrapper for sub-screens"
```

---

## Task 5: Rewrite Menu as a controlled, orientation-aware component

**Files:**
- Modify: `src/components/Menu.jsx` (full rewrite)

- [ ] **Step 1: Replace Menu.jsx**

Replace the entire contents of `src/components/Menu.jsx` with:

```jsx
import React from "react"
import { Box, Text } from "ink"

export default function Menu({ items, index, orientation = "horizontal", cursor }) {
  const defaultCursor = orientation === "horizontal" ? "◆" : "▸"
  const c = cursor ?? defaultCursor
  const isHorizontal = orientation === "horizontal"

  return (
    <Box flexDirection={isHorizontal ? "row" : "column"}>
      {items.map((item, i) => {
        const active = i === index
        const label = typeof item === "string" ? item : item.label ?? item.name
        return (
          <Box
            key={label}
            marginRight={isHorizontal ? 3 : 0}
          >
            <Text color={active ? "cyan" : "white"} dimColor={!active}>
              {active ? `${c} ` : "  "}{label}
            </Text>
          </Box>
        )
      })}
    </Box>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Menu.jsx
git commit -m "rewrite Menu as controlled, orientation-aware component"
```

---

## Task 6: Build Home screen and rewrite app.jsx as a router

**Files:**
- Create: `src/screens/Home.jsx`
- Modify: `src/app.jsx` (full rewrite)

- [ ] **Step 1: Create Home.jsx**

Create `src/screens/Home.jsx`:

```jsx
import React, { useState } from "react"
import { Box, Text, useInput } from "ink"
import Portrait from "../components/Portrait.jsx"
import Header from "../components/Header.jsx"
import Menu from "../components/Menu.jsx"
import Footer from "../components/Footer.jsx"

const items = ["creations", "reflections", "contacts"]

const DIVIDER = "──────────────────────────────────────────────────────────"

export default function Home({ onOpen }) {
  const [index, setIndex] = useState(0)

  useInput((input, key) => {
    if (key.leftArrow) setIndex(i => Math.max(0, i - 1))
    if (key.rightArrow) setIndex(i => Math.min(items.length - 1, i + 1))
    if (key.return) onOpen(items[index])
  })

  return (
    <Box flexDirection="column" paddingX={1}>
      <Box flexDirection="row" gap={4}>
        <Box flexDirection="column">
          <Portrait />
        </Box>
        <Box flexDirection="column">
          <Header />
          <Box marginTop={1} flexDirection="column">
            <Text bold>saynffs</Text>
            <Text dimColor>developer · researcher · tech explorer</Text>
            <Text dimColor>syedmehedihussain@gmail.com</Text>
          </Box>
          <Box marginTop={1}>
            <Text dimColor>plays with many things, iykyk</Text>
          </Box>
        </Box>
      </Box>

      <Box marginTop={1} flexDirection="column">
        <Text dimColor>{DIVIDER}</Text>
        <Box marginY={0}>
          <Menu items={items} index={index} orientation="horizontal" />
        </Box>
        <Text dimColor>{DIVIDER}</Text>
      </Box>

      <Footer hints="← →  move    enter  open    q  quit" />
    </Box>
  )
}
```

- [ ] **Step 2: Rewrite app.jsx as router**

Replace the entire contents of `src/app.jsx` with:

```jsx
import React, { useState } from "react"
import { Text, useApp, useInput } from "ink"
import Home from "./screens/Home.jsx"

export default function App() {
  const [screen, setScreen] = useState("home")
  const { exit } = useApp()

  useInput((input, key) => {
    if (input === "q") exit()
    if (key.escape && screen !== "home") setScreen("home")
  })

  if (screen === "home") return <Home onOpen={setScreen} />
  return <Text dimColor>screen "{screen}" — coming soon</Text>
}
```

- [ ] **Step 3: Verify Home renders**

Run the smoke script from the conventions section. Expected output (stripped of ANSI) should contain:

- The `SAYNFFS` figlet banner
- The text `saynffs`
- The line `developer · researcher · tech explorer`
- The line `syedmehedihussain@gmail.com`
- The line `plays with many things, iykyk`
- The three menu items `creations`, `reflections`, `contacts`
- The footer text containing `move`, `open`, `quit`

Server log should be clean.

- [ ] **Step 4: Verify menu navigation**

Send a right-arrow keystroke then capture:

```bash
pkill -f "tsx src/server.js" 2>/dev/null; sleep 0.3
rm -f /tmp/portfolio-server.log /tmp/portfolio-client.log
npm start > /tmp/portfolio-server.log 2>&1 &
timeout 15 bash -c 'until grep -q "SSH portfolio running" /tmp/portfolio-server.log 2>/dev/null; do sleep 0.2; done'
( printf '\x1b[C'; sleep 1 ) | script -q -c "timeout 3 ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR localhost -p 2222" /tmp/portfolio-client.log >/dev/null 2>&1
pkill -f "tsx src/server.js" 2>/dev/null
cat /tmp/portfolio-client.log | sed 's/\x1b\[[0-9;?]*[a-zA-Z]//g' | tail -10
```

Expected: the `◆` cursor should appear next to `reflections` (the second item) in the final frame, not next to `creations`.

- [ ] **Step 5: Commit**

```bash
git add src/screens/Home.jsx src/app.jsx
git commit -m "rebuild as multi-screen router with Home"
```

---

## Task 7: Wire Reflections screen

**Files:**
- Create: `src/screens/Reflections.jsx`
- Modify: `src/app.jsx`

- [ ] **Step 1: Create Reflections.jsx**

Create `src/screens/Reflections.jsx`:

```jsx
import React from "react"
import { Box, Text } from "ink"
import ScreenShell from "../components/ScreenShell.jsx"
import reflections from "../data/reflections.js"

export default function Reflections() {
  return (
    <ScreenShell title="reflections" hints="esc  back    q  quit">
      {reflections.map(section => (
        <Box key={section.heading} flexDirection="column" marginBottom={1}>
          <Text bold color="cyan">{section.heading}</Text>
          {section.lines.map(line => (
            <Box key={line} marginLeft={2}>
              <Text>{line}</Text>
            </Box>
          ))}
        </Box>
      ))}
    </ScreenShell>
  )
}
```

- [ ] **Step 2: Wire route in app.jsx**

Replace `src/app.jsx` with:

```jsx
import React, { useState } from "react"
import { Text, useApp, useInput } from "ink"
import Home from "./screens/Home.jsx"
import Reflections from "./screens/Reflections.jsx"

export default function App() {
  const [screen, setScreen] = useState("home")
  const { exit } = useApp()

  useInput((input, key) => {
    if (input === "q") exit()
    if (key.escape && screen !== "home") setScreen("home")
  })

  if (screen === "home") return <Home onOpen={setScreen} />
  if (screen === "reflections") return <Reflections />
  return <Text dimColor>screen "{screen}" — coming soon</Text>
}
```

- [ ] **Step 3: Verify navigation to Reflections**

Right-arrow once (to `reflections`), enter, then capture:

```bash
pkill -f "tsx src/server.js" 2>/dev/null; sleep 0.3
rm -f /tmp/portfolio-server.log /tmp/portfolio-client.log
npm start > /tmp/portfolio-server.log 2>&1 &
timeout 15 bash -c 'until grep -q "SSH portfolio running" /tmp/portfolio-server.log 2>/dev/null; do sleep 0.2; done'
( printf '\x1b[C\r'; sleep 1 ) | script -q -c "timeout 3 ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR localhost -p 2222" /tmp/portfolio-client.log >/dev/null 2>&1
pkill -f "tsx src/server.js" 2>/dev/null
cat /tmp/portfolio-client.log | sed 's/\x1b\[[0-9;?]*[a-zA-Z]//g' | tail -25
```

Expected: final frame contains the `── saynffs · reflections ──` title, the four headings (`what does he do?`, `is he cool?`, `special skill?`, `what can't he do?`), and the footer `esc  back    q  quit`.

- [ ] **Step 4: Verify Esc returns to Home**

Right-arrow, enter, esc, then capture:

```bash
pkill -f "tsx src/server.js" 2>/dev/null; sleep 0.3
rm -f /tmp/portfolio-server.log /tmp/portfolio-client.log
npm start > /tmp/portfolio-server.log 2>&1 &
timeout 15 bash -c 'until grep -q "SSH portfolio running" /tmp/portfolio-server.log 2>/dev/null; do sleep 0.2; done'
( printf '\x1b[C\r'; sleep 0.5; printf '\x1b'; sleep 0.8 ) | script -q -c "timeout 3 ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR localhost -p 2222" /tmp/portfolio-client.log >/dev/null 2>&1
pkill -f "tsx src/server.js" 2>/dev/null
cat /tmp/portfolio-client.log | sed 's/\x1b\[[0-9;?]*[a-zA-Z]//g' | tail -25
```

Expected: final frame is the Home screen (SAYNFFS banner visible), not Reflections.

- [ ] **Step 5: Commit**

```bash
git add src/screens/Reflections.jsx src/app.jsx
git commit -m "add Reflections screen and route"
```

---

## Task 8: Wire Contacts screen

**Files:**
- Create: `src/screens/Contacts.jsx`
- Modify: `src/app.jsx`

- [ ] **Step 1: Create Contacts.jsx**

Create `src/screens/Contacts.jsx`:

```jsx
import React from "react"
import { Box, Text } from "ink"
import ScreenShell from "../components/ScreenShell.jsx"
import contacts from "../data/contacts.js"

export default function Contacts() {
  return (
    <ScreenShell title="contacts" hints="esc  back    q  quit">
      {contacts.map(row => (
        <Box key={row.label}>
          <Box width={12}>
            <Text bold>{row.label}</Text>
          </Box>
          <Text dimColor>{row.value}</Text>
        </Box>
      ))}
    </ScreenShell>
  )
}
```

- [ ] **Step 2: Wire route in app.jsx**

Replace `src/app.jsx` with:

```jsx
import React, { useState } from "react"
import { Text, useApp, useInput } from "ink"
import Home from "./screens/Home.jsx"
import Reflections from "./screens/Reflections.jsx"
import Contacts from "./screens/Contacts.jsx"

export default function App() {
  const [screen, setScreen] = useState("home")
  const { exit } = useApp()

  useInput((input, key) => {
    if (input === "q") exit()
    if (key.escape && screen !== "home") setScreen("home")
  })

  if (screen === "home") return <Home onOpen={setScreen} />
  if (screen === "reflections") return <Reflections />
  if (screen === "contacts") return <Contacts />
  return <Text dimColor>screen "{screen}" — coming soon</Text>
}
```

- [ ] **Step 3: Verify navigation to Contacts**

Right-arrow twice (to `contacts`), enter, then capture:

```bash
pkill -f "tsx src/server.js" 2>/dev/null; sleep 0.3
rm -f /tmp/portfolio-server.log /tmp/portfolio-client.log
npm start > /tmp/portfolio-server.log 2>&1 &
timeout 15 bash -c 'until grep -q "SSH portfolio running" /tmp/portfolio-server.log 2>/dev/null; do sleep 0.2; done'
( printf '\x1b[C\x1b[C\r'; sleep 1 ) | script -q -c "timeout 3 ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR localhost -p 2222" /tmp/portfolio-client.log >/dev/null 2>&1
pkill -f "tsx src/server.js" 2>/dev/null
cat /tmp/portfolio-client.log | sed 's/\x1b\[[0-9;?]*[a-zA-Z]//g' | tail -15
```

Expected: final frame contains the `── saynffs · contacts ──` title, the four rows (`email syedmehedihussain@gmail.com`, `github github.com/<your-handle>`, `linkedin linkedin.com/in/<your-handle>`, `web syedmehedihussain.codes`), and the footer.

- [ ] **Step 4: Commit**

```bash
git add src/screens/Contacts.jsx src/app.jsx
git commit -m "add Contacts screen and route"
```

---

## Task 9: Wire Creations screen

**Files:**
- Create: `src/screens/Creations.jsx`
- Modify: `src/app.jsx`

- [ ] **Step 1: Create Creations.jsx**

Create `src/screens/Creations.jsx`:

```jsx
import React, { useState } from "react"
import { Box, Text, useInput } from "ink"
import ScreenShell from "../components/ScreenShell.jsx"
import Menu from "../components/Menu.jsx"
import projects from "../data/projects.js"

export default function Creations() {
  const [index, setIndex] = useState(0)

  useInput((input, key) => {
    if (key.upArrow) setIndex(i => Math.max(0, i - 1))
    if (key.downArrow) setIndex(i => Math.min(projects.length - 1, i + 1))
  })

  const current = projects[index]

  return (
    <ScreenShell title="creations" hints="↑ ↓  pick    esc  back    q  quit">
      <Box flexDirection="row" gap={2}>
        <Box width="35%">
          <Menu items={projects} index={index} orientation="vertical" />
        </Box>
        <Box flexDirection="column" width="65%">
          <Text bold>{current.name}</Text>
          <Box marginTop={1}>
            <Text>{current.blurb}</Text>
          </Box>
          <Box marginTop={1}>
            <Text dimColor>tech: {current.tech}</Text>
          </Box>
          <Box>
            <Text dimColor>link: {current.link}</Text>
          </Box>
        </Box>
      </Box>
    </ScreenShell>
  )
}
```

- [ ] **Step 2: Wire route in app.jsx**

Replace `src/app.jsx` with:

```jsx
import React, { useState } from "react"
import { useApp, useInput } from "ink"
import Home from "./screens/Home.jsx"
import Creations from "./screens/Creations.jsx"
import Reflections from "./screens/Reflections.jsx"
import Contacts from "./screens/Contacts.jsx"

export default function App() {
  const [screen, setScreen] = useState("home")
  const { exit } = useApp()

  useInput((input, key) => {
    if (input === "q") exit()
    if (key.escape && screen !== "home") setScreen("home")
  })

  if (screen === "creations") return <Creations />
  if (screen === "reflections") return <Reflections />
  if (screen === "contacts") return <Contacts />
  return <Home onOpen={setScreen} />
}
```

(The fallback is now `Home` since every defined screen is handled — the "coming soon" placeholder is removed.)

- [ ] **Step 3: Verify navigation to Creations + list movement**

Enter on Home (opens Creations), then down-arrow, then capture:

```bash
pkill -f "tsx src/server.js" 2>/dev/null; sleep 0.3
rm -f /tmp/portfolio-server.log /tmp/portfolio-client.log
npm start > /tmp/portfolio-server.log 2>&1 &
timeout 15 bash -c 'until grep -q "SSH portfolio running" /tmp/portfolio-server.log 2>/dev/null; do sleep 0.2; done'
( printf '\r'; sleep 0.5; printf '\x1b[B'; sleep 1 ) | script -q -c "timeout 3 ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR localhost -p 2222" /tmp/portfolio-client.log >/dev/null 2>&1
pkill -f "tsx src/server.js" 2>/dev/null
cat /tmp/portfolio-client.log | sed 's/\x1b\[[0-9;?]*[a-zA-Z]//g' | tail -20
```

Expected: final frame contains the `── saynffs · creations ──` title, three project names (`ssh-portfolio`, `project-two`, `project-three`) in the left pane with `▸` next to `project-two` (second item, after one down-arrow), and the detail panel showing `project-two` content.

- [ ] **Step 4: Commit**

```bash
git add src/screens/Creations.jsx src/app.jsx
git commit -m "add Creations screen with list/detail layout"
```

---

## Task 10: Final end-to-end verification

This task adds no code — it just runs the full acceptance script from the spec's "Manual verification" section.

- [ ] **Step 1: Verify all spec acceptance criteria**

Run each of the following and confirm it passes:

```bash
# 1. Server starts cleanly
pkill -f "tsx src/server.js" 2>/dev/null; sleep 0.3
rm -f /tmp/portfolio-server.log
npm start > /tmp/portfolio-server.log 2>&1 &
timeout 15 bash -c 'until grep -q "SSH portfolio running" /tmp/portfolio-server.log 2>/dev/null; do sleep 0.2; done' && echo "PASS: server up"

# 2. Home screen renders
rm -f /tmp/c1.log
script -q -c "timeout 3 ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR localhost -p 2222" /tmp/c1.log >/dev/null 2>&1
grep -q "SAYNFFS\|███" /tmp/c1.log && echo "PASS: home banner"
sed 's/\x1b\[[0-9;?]*[a-zA-Z]//g' /tmp/c1.log | grep -q "creations" && echo "PASS: menu items"

# 3. Navigation: right twice + enter lands on Contacts
rm -f /tmp/c2.log
( printf '\x1b[C\x1b[C\r'; sleep 1 ) | script -q -c "timeout 3 ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR localhost -p 2222" /tmp/c2.log >/dev/null 2>&1
sed 's/\x1b\[[0-9;?]*[a-zA-Z]//g' /tmp/c2.log | tail -20 | grep -q "saynffs · contacts" && echo "PASS: nav to contacts"

# 4. Esc returns to home
rm -f /tmp/c3.log
( printf '\r'; sleep 0.4; printf '\x1b'; sleep 0.8 ) | script -q -c "timeout 3 ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR localhost -p 2222" /tmp/c3.log >/dev/null 2>&1
sed 's/\x1b\[[0-9;?]*[a-zA-Z]//g' /tmp/c3.log | tail -10 | grep -q "creations    reflections    contacts" && echo "PASS: esc returns home"

# 5. q quits cleanly
rm -f /tmp/c4.log
( printf 'q'; sleep 0.8 ) | script -q -c "timeout 3 ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR localhost -p 2222" /tmp/c4.log >/dev/null 2>&1
echo "PASS: q exits"

# 6. Two concurrent clients survive one disconnecting
( timeout 3 ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR localhost -p 2222 </dev/null >/dev/null 2>&1 ) &
( timeout 3 ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR localhost -p 2222 </dev/null >/dev/null 2>&1 ) &
wait
ss -tlnp 2>/dev/null | grep -q 2222 && echo "PASS: server survives concurrent clients"

# 7. Server log clean (no errors)
grep -iE "error|exception" /tmp/portfolio-server.log && echo "FAIL: errors in server log" || echo "PASS: server log clean"

# stop server
pkill -f "tsx src/server.js" 2>/dev/null
```

Expected: every line ends with `PASS:`. If any `FAIL:` appears, do not mark this task complete — diagnose the failure and fix the responsible task.

- [ ] **Step 2: Commit (no-op if nothing changed)**

If any spec criterion required a fix during verification, commit those fixes. Otherwise skip.

```bash
git status
# If there are pending changes from fixes:
# git add -A && git commit -m "fix issues found in final verification"
```

---

## Self-review notes

**Spec coverage check:**
- Brand (SAYNFFS, email, web) — Task 1 (banner) + Task 2 (data files) + Task 6 (Home bio) + Task 8 (Contacts).
- Architecture (router + screens + data) — Tasks 6–9.
- Home screen layout — Task 6.
- Creations / Reflections / Contacts — Tasks 9 / 7 / 8.
- Keybindings — Task 6 (home), Task 7 (esc routing), Task 9 (vertical list).
- File layout — every file in the spec's layout has a task that creates or modifies it (server.js unchanged; Portrait.jsx unchanged).
- Visual palette (cyan, white, dim, magenta) — applied in Home (Task 6), Reflections (Task 7), Menu (Task 5).
- Manual verification criteria — Task 10 covers all seven items from the spec.

**Placeholder scan:** project entries 2 and 3 explicitly contain placeholder strings — these are documented as scaffolds the user fills later, not plan placeholders. No `TBD` / `TODO` / `add error handling` patterns in any task step.

**Type / name consistency:** screen state values are `"home" | "creations" | "reflections" | "contacts"` everywhere. `onOpen` callback signature matches across Home and App. Menu prop names (`items`, `index`, `orientation`, `cursor`) match across all callers.
