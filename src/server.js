import ssh2 from "ssh2"
const { Server } = ssh2

import fs from "fs"
import React from "react"
import { render } from "ink"

import App from "./app.jsx"

new Server({
 hostKeys:[fs.readFileSync("host.key")]
}, client=>{

 client.on("error", err => console.error("client error:", err.message))

 client.on("authentication",ctx=>ctx.accept())

 client.on("ready",()=>{

  client.on("session",(accept)=>{

   const session = accept()

   let ptyInfo = null
   session.on("pty",(accept,reject,info)=>{
    ptyInfo = info
    accept()
   })

   session.on("shell",(accept)=>{

    const stream = accept()

    stream.isTTY = true
    stream.columns = ptyInfo?.cols ?? 120
    stream.rows = ptyInfo?.rows ?? 40
    stream.setRawMode = () => true
    stream.ref = () => {}
    stream.unref = () => {}

    const instance = render(React.createElement(App), {
     stdout: stream,
     stdin: stream,
     patchConsole: false
    })

    const cleanup = () => {
     try { instance.unmount() } catch {}
     try { stream.end() } catch {}
    }

    stream.on("error", cleanup)
    stream.on("close", cleanup)

    session.on("window-change",(a,r,info)=>{
     stream.columns = info.cols
     stream.rows = info.rows
     stream.emit("resize")
    })

   })

  })

 })

}).listen(2222,"0.0.0.0",()=>{

 console.log("SSH portfolio running")

})
