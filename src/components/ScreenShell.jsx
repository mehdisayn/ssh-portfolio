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
