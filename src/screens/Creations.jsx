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
