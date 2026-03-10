import ssh2 from "ssh2"
const { Server } = ssh2

import fs from "fs"
import React from "react"
import { render } from "ink"

import App from "./app.jsx"

new Server({

 hostKeys:[fs.readFileSync("host.key")]

}, client=>{

client.on("authentication",ctx=>ctx.accept())

client.on("ready",()=>{

client.on("session",(accept)=>{

const session = accept()

session.on("shell",(accept)=>{

const stream = accept()



render(React.createElement(App), { stdout: stream})

})

})

})

}).listen(2222,"0.0.0.0",()=>{

console.log("SSH portfolio running")

})
