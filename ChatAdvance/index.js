const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 12345 });
const app = require("express")();
const db = require("fpdb")
db.init()
// Helper Functions
function s(d){
    return JSON.stringify(d)
};

function p(d){
    return JSON.parse(d)
}

app.get("/", (req,res)=>{
    res.sendFile(__dirname + "/web/index.html")
})

app.get("/index.js", (req,res)=>{
    res.sendFile(__dirname + "/web/index.js")
})

app.listen(6060)


// WSS Config
wss.on("connection", ws => {
    
    db.get("chat","", (err,data)=>{
        let msgObj = new Object;
        msgObj.type = "first"
        msgObj.data = data
        ws.send(s(msgObj))
    })
    ws.on("message", message => {
        let msg = p(message.toString())
        if(msg.type = "new"){
            db.get("chat","",(err,arrayData)=>{
                let data = new Array;
                let chat = data.concat(p(arrayData));
                let msgObj = new Object
                msgObj.name = msg.name
                msgObj.data = msg.data
                chat[chat.length] = msgObj
                db.set("chat","",s(chat))
            })




            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    let msgObj = new Object;
                    msgObj.name = msg.name
                    msgObj.data = msg.data
                    msgObj.type = "newMsg"
                  client.send(s(msgObj));
                }
              });
        }
    })
})