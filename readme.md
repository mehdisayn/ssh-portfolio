
# SSH Terminal Portfolio

A **terminal-based portfolio website** accessible through **SSH**.
Instead of visiting a website in a browser, users connect through the terminal and interact with a **TUI (Terminal User Interface)** built using **React + Ink**.

The portfolio displays:

* ASCII portrait
* stylized header text
* short bio
* navigable sections (Creations, Reflections, Contacts)

---

# Preview

Example usage: for running localy

go to the app folder

```bash
cd ssh-portfolio
npm start
```

open another terminal and command

```bash
ssh localhost -p 2222
```

You will see something like:

```
KAZMI

Syed Mehedi Hussain is a developer,
research enthusiast and technology explorer.

Exploring AI, systems and digital culture.

◆ Creations   Reflections   Contacts
```

Navigation works with **arrow keys**.

---

# Running the Project Locally

## 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ssh-portfolio.git
cd ssh-portfolio
```

---

## 2. Install Dependencies

```bash
npm install
```

Required dependencies include:

* react
* ink
* ssh2
* tsx (for running JSX directly)

---

## 3. Start the SSH Server

```bash
npm start
```

or

```bash
npx tsx src/server.js
```

The server will start:

```
SSH portfolio running
```

---

## 4. Connect to the Portfolio

Open another terminal and run:

```bash
ssh localhost -p 2222
```

You will now enter the **terminal portfolio interface**.

---

# Project Structure

```
ssh-portfolio
│
├── src
│   ├── server.js        # SSH server
│   ├── app.jsx          # Main UI layout
│   │
│   └── components
│       ├── Header.jsx
│       ├── Portrait.jsx
│       └── Menu.jsx
│
├── host.key             # SSH host key
├── package.json
└── README.md
```

---

# How the Project Works

The system combines three main technologies:

## 1. SSH Server

The `ssh2` library creates an SSH server.

```
ssh localhost -p 2222
```

connects directly to the Node.js application.

---

## 2. Terminal UI (TUI)

Instead of HTML, the interface is built with **Ink**, a React renderer for the terminal.

Example:

```javascript
<Box flexDirection="row">
  <Text>Hello Terminal</Text>
</Box>
```

This behaves like **React components but rendered inside a terminal**.

---

## 3. ASCII Interface

The UI displays:

* ASCII portrait
* styled header text
* interactive menu

This creates a **terminal-native portfolio experience**.

---

# Step-by-Step Guide to Build Your Own

## Step 1 — Initialize Project

```
npm init -y
```

Install required packages:

```
npm install react ink ssh2
npm install tsx --save-dev
```

---

## Step 2 — Create SSH Server

Example server:

```javascript
import ssh2 from "ssh2"
const { Server } = ssh2

new Server({
 hostKeys:[fs.readFileSync("host.key")]
}, client=>{

 client.on("authentication",ctx=>ctx.accept())

}).listen(2222,"0.0.0.0")
```

---

## Step 3 — Create Ink Interface

Use React components inside the terminal:

```javascript
import { Box, Text } from "ink"

export default function App(){
 return(
  <Box>
   <Text>Hello SSH Portfolio</Text>
  </Box>
 )
}
```

---

## Step 4 — Render UI into SSH Stream

The SSH connection stream is passed to Ink:

```javascript
render(React.createElement(App), { stdout: stream })
```

---

## Step 5 — Add Navigation

Ink provides keyboard input support.

Example:

```javascript
useInput((input,key)=>{
 if(key.leftArrow) moveLeft()
 if(key.rightArrow) moveRight()
})
```

---

# Problems We Faced

During development several issues occurred.

### 1. Node.js ESM Import Errors

```
SyntaxError: Cannot use import statement outside a module
```

Cause: Node default module system conflict.

Solution:

```
"type": "module"
```

added to `package.json`.

---

### 2. JSX Execution Errors

```
Unexpected token '<'
```

Node cannot run JSX directly.

Solution:

Used **tsx** to execute JSX files.

```
npx tsx src/server.js
```

---

### 3. Ink Raw Mode Errors

```
Raw mode is not supported on stdin provided to Ink
```

Cause: incorrect terminal stream handling.

Solution:

Correctly attach the SSH stream to Ink:

```javascript
render(React.createElement(App), {
 stdout: stream,
 stdin: stream
})
```

---

### 4. Duplicate React Keys

```
Encountered two children with the same key
```

Cause: incorrect key usage inside `.map()`.

Solution:

Use unique keys:

```javascript
<Text key={item}>
```

instead of

```
key={index}
```

---

### 5. ASCII Portrait Layout Issues

ASCII output sometimes broke the UI.

Solution:

Controlled width using Ink layout:

```
<Box width="50%">
```

---

# Problems We Could Not Fully Solve

Some issues remain partially unresolved:

### Terminal Compatibility

Different terminal emulators render ASCII differently.

Some terminals distort layout.

---

### Deployment Complexity

Hosting SSH applications on cloud platforms is difficult because:

* most platforms expect HTTP servers
* TCP routing requires additional configuration

This made deployment challenging.

---

# What We Learned

This project provided several insights.

### Terminal UI Development

Learned how **React can be used outside the browser**.

Ink allows building full terminal applications.

---

### SSH Protocol Basics

Understanding how:

* authentication
* sessions
* shells
* streams

work inside SSH connections.

---

### Debugging Node Applications

Encountered and solved multiple real-world issues involving:

* module systems
* runtime errors
* stream handling
* UI rendering

---

### System Design Thinking

This project required combining:

```
Networking
+ Terminal UI
+ React
+ Node.js
```

into a working system.

---

# Future Improvements

Possible improvements include:

* animated ASCII loading screen
* command-based navigation
* project viewer (`projects` command)
* custom themes
* global deployment

---

# Author

Syed Mehedi Hussain

Computer Science Student
Technology enthusiast exploring AI, systems, and digital culture.



• a **demo GIF**
• **screenshots section**
• **GitHub badges (stars, license, Node version)**
