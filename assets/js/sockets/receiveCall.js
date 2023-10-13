if(!typeof chatId){
    var chatId;
}

socket.on("getPeerId", (thisChatId)=>{
    chatId = thisChatId
    socket.emit("sendPeerId", {
        chatId,
        peerId,
    })
})

peer.on("call", call => {
    navigator.mediaDevices.getUserMedia({audio: true}).then(stream =>{
        let calling = document.getElementById("isCalling")
        let answerBtn = document.getElementById("answerBtn")
        let declineBtn = document.getElementById("declineBtn")
        if(path === "/friends"){
            calling.querySelector("p").innerHTML = `${getCallerName() || "unkown"} is calling you`
        }
        overlay.classList.remove("d-none")
        overlay.classList.add("fshow")
        calling.classList.remove("d-none")

        answerBtn.onclick = ()=>{
            call.answer(stream)
            call.on("stream", showCall)
        }
        declineBtn.onclick = ()=>{
            hideOverlay(declineBtn, "click")
            socket.emit("declinecall", chatId)
        }

    })
})


function getCallerName(){
    let names = document.querySelectorAll("#onlineFriends .user-chat h3")
    let allChatId = document.querySelectorAll("#onlineFriends [name='chatId']")
    let name;

    allChatId.forEach((input,i) => {
        if(input.value == chatId){
            name =  names[i].textContent
        }
    })

    return name
}