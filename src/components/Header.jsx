
import React from "react"
import { Text } from "ink"
import figlet from "figlet"

const title = figlet.textSync("SAYNFFS", {
 font: "ANSI Shadow"
})

export default function Header(){
 return <Text color="cyan">{title}</Text>
}
