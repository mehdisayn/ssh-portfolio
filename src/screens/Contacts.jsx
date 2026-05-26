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
