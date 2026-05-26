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
