import React from "react"
import { Box, Text } from "ink"
import ScreenShell from "../components/ScreenShell.jsx"
import skills from "../data/skills.js"

export default function Skills() {
  return (
    <ScreenShell title="skills">
      {skills.map(group => (
        <Box key={group.category} flexDirection="column" marginBottom={1}>
          <Text bold color="cyan">{group.category}</Text>
          <Box marginLeft={2}>
            <Text>{group.items.join("  ·  ")}</Text>
          </Box>
        </Box>
      ))}
    </ScreenShell>
  )
}
