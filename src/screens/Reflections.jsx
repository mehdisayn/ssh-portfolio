import React from "react"
import { Box, Text } from "ink"
import ScreenShell from "../components/ScreenShell.jsx"
import reflections from "../data/reflections.js"

export default function Reflections() {
  return (
    <ScreenShell title="reflections">
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
