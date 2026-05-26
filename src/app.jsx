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
