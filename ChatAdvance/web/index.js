window.onload = e => {
    
    var socket = new WebSocket("ws://localhost:12345")
    function lss(k,d){
        localStorage.setItem(k,d)
    }
    function lsg(k){
       return localStorage.getItem(k)
    }

    function id(id){
        return document.getElementById(id)
    }

    if(lsg("username") == undefined){
        let msg = prompt("Type A Name To Use")
        lss("username",msg)
    }

    socket.onmessage = message =>{

        let msg = JSON.parse(message.data);

        if(msg.type == "first"){
            let chat = new Array;
            chat = chat.concat(JSON.parse(msg.data))
            chat.forEach(e =>{
                id("data").innerHTML += `${e.name}:${e.data}\n`
            })
        } else if(msg.type == "newMsg"){
            id("data").innerHTML += `${msg.name}:${msg.data}\n`
        }
        
    }
    id("send").addEventListener("click", e =>{
        let msg = id("text").value;
        if(msg != ""){
            let msgObj = new Object;
            msgObj.type = "new"
            msgObj.name = lsg("username")
            msgObj.data = msg
            socket.send(JSON.stringify(msgObj))
            id("send").disabled = true;
            setTimeout(()=>{
                id("send").disabled = false
            },1000)
        }
     })
    // let x = new Array;
    // let y = new Object;
    // y.name = "ok"
    // y.id = "id"
    // x[1] = y
    // x[2] = "yo"
    // x.forEach(e => {
    //     console.log(e)
    // })
    // let z = new Array;
    // z = z.concat(x)
    // z[3] = "3 lol"
    // console.log(JSON.stringify(z))
    // console.log(z.length)
}