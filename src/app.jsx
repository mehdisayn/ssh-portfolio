
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
Meet Syed Mehdi Hussain AKA Mehdi Kazmi. He is a developer,
researcher and tech explorer.
</Text>

<Text>
What does he do?
</Text>

<Text>
- He plays. (With many things iykyk)
</Text>

<Text>

</Text>

<Text>
Is he cool?
</Text>

<Text>
- Eh "is he cool?" bitch he is the word cool
</Text>

<Text>

</Text>

<Text>
Special skill?
</Text>

<Text>
- He can create anything with anything.
</Text>

<Text>
- He can follow tutorial and make tutorial
</Text>

<Text>
- Complex linux BS? It's a random Sunday for him.
</Text>


<Text>
- Some people say "he is better then PewDiePie"
</Text>

<Text>

</Text>

<Text>
So what can't he do?
</Text>

<Text>
- wellllll, there is something......MATHH
</Text>

</Box>

</Box>

<Menu/>

</Box>

)

}

