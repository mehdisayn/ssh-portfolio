import React from "react"
import {Text} from "ink"
import fs from "fs"

const portrait = fs.readFileSync("./assets/portrait.txt","utf8")

export default function Portrait(){

 return (
   <Text wrap="truncate">
     {portrait}
   </Text>
 )

}
