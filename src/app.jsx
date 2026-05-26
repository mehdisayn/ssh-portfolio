import React, { useState } from "react"
import { Box, Text, useApp, useInput } from "ink"
import Home from "./screens/Home.jsx"
import Creations from "./screens/Creations.jsx"
import Skills from "./screens/Skills.jsx"
import Reflections from "./screens/Reflections.jsx"
import Contacts from "./screens/Contacts.jsx"
import Menu from "./components/Menu.jsx"
import Footer from "./components/Footer.jsx"

const tabs = ["home", "creations", "skills", "reflections", "contacts"]

const hints = {
  home: "← →  switch    q  quit",
  creations: "← →  switch    ↑ ↓  pick    q  quit",
  skills: "← →  switch    q  quit",
  reflections: "← →  switch    q  quit",
  contacts: "← →  switch    q  quit"
}

const DIVIDER = "──────────────────────────────────────────────────────────"

export default function App() {
  const [index, setIndex] = useState(0)
  const { exit } = useApp()

  useInput((input, key) => {
    if (input === "q") exit()
    if (key.leftArrow) setIndex(i => Math.max(0, i - 1))
    if (key.rightArrow) setIndex(i => Math.min(tabs.length - 1, i + 1))
  })

  const current = tabs[index]

  let content
  if (current === "home") content = <Home />
  else if (current === "creations") content = <Creations />
  else if (current === "skills") content = <Skills />
  else if (current === "reflections") content = <Reflections />
  else if (current === "contacts") content = <Contacts />

  return (
    <Box flexDirection="column" paddingX={1}>
      {content}
      <Box marginTop={1} flexDirection="column">
        <Text dimColor>{DIVIDER}</Text>
        <Menu items={tabs} index={index} orientation="horizontal" />
        <Text dimColor>{DIVIDER}</Text>
      </Box>
      <Footer hints={hints[current]} />
    </Box>
  )
}
