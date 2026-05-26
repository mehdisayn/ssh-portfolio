import React from "react"
import { Box, Text } from "ink"

const DIVIDER = "──────────────────────────────────────────────────────────"

export default function ScreenShell({ title, children }) {
  return (
    <Box flexDirection="column">
      <Text dimColor>── {title} {DIVIDER}</Text>
      <Box marginTop={1} flexDirection="column">
        {children}
      </Box>
    </Box>
  )
}
