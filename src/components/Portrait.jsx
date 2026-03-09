import React from "react"
import { Text } from "ink"
import fs from "fs"

const ascii = fs.readFileSync("./assets/portrait.txt","utf8")

export default function Portrait(){
 return <Text>{ascii}</Text>
}
