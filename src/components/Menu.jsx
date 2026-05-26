import React from "react"
import { Box, Text } from "ink"

export default function Menu({ items, index, orientation = "horizontal", cursor }) {
  const defaultCursor = orientation === "horizontal" ? "◆" : "▸"
  const c = cursor ?? defaultCursor
  const isHorizontal = orientation === "horizontal"

  return (
    <Box flexDirection={isHorizontal ? "row" : "column"}>
      {items.map((item, i) => {
        const active = i === index
        const label = typeof item === "string" ? item : item.label ?? item.name
        return (
          <Box
            key={label}
            marginRight={isHorizontal ? 3 : 0}
          >
            <Text color={active ? "cyan" : "white"} dimColor={!active}>
              {active ? `${c} ` : "  "}{label}
            </Text>
          </Box>
        )
      })}
    </Box>
  )
}
