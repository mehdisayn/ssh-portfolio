import React,{useState} from "react"
import {Box,Text,useInput} from "ink"

const items = ["Creations","Reflections","Contacts"]

export default function Menu(){

 const [index,setIndex] = useState(0)

 useInput((input)=>{

   if(input==="a")
     setIndex(i=>Math.max(0,i-1))

   if(input==="d")
     setIndex(i=>Math.min(items.length-1,i+1))

 })

 return(

  <Box marginTop={1}>

   {items.map((item,i)=>(

    <Text key={i} color={i===index?"cyan":"white"}>
      {i===index?"◆ ":"  "} {item}
    </Text>

   ))}

  </Box>

 )

}
