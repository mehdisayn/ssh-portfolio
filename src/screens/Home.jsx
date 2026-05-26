import React from "react"
import { Box, Text } from "ink"
import Portrait from "../components/Portrait.jsx"
import Header from "../components/Header.jsx"

export default function Home() {
  return (
    <Box flexDirection="row" gap={4}>
      <Box flexDirection="column">
        <Portrait />
      </Box>
      <Box flexDirection="column">
        <Header />
        <Box marginTop={1} flexDirection="column">
          <Text bold>Syed Mehedi Hussain</Text>
          <Text dimColor>full-stack developer · cs student</Text>
          <Text dimColor>syedmehedihussain@gmail.com</Text>
        </Box>
        <Box marginTop={1}>
          <Text dimColor>plays with many things, iykyk</Text>
        </Box>
      </Box>
    </Box>
  )
}
