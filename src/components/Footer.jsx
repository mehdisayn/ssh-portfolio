import React from "react"
import { Box, Text } from "ink"

export default function Footer({ hints }) {
  return (
    <Box marginTop={1}>
      <Text dimColor>{hints}</Text>
    </Box>
  )
}
