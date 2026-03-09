import React from "react"
import {Box,Text} from "ink"

import Header from "./components/Header.jsx"
import Portrait from "./components/Portrait.jsx"
import Menu from "./components/Menu.jsx"

export default function App(){

return(

<Box flexDirection="column">

<Box flexDirection="row">

<Box width="50%">
<Portrait/>
</Box>

<Box width="50%" flexDirection="column">

<Header/>

<Text>
Syed Mehedi Hussain is a developer,
research enthusiast and technology explorer.
</Text>

<Text>
Exploring AI, systems and digital culture.
</Text>

</Box>

</Box>

<Menu/>

</Box>

)

}
