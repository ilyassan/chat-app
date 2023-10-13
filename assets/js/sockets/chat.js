var chatId = document.getElementById("chatId").value


const isGroup = false

socket.emit("joinChat", chatId)
socket.emit("isFriendOnline", document.getElementById("userId").textContent)

socket.on("friendState", friendState =>{
    document.querySelector(".chat-container").style.display = "flex"
    let state;
    if(friendState){
        state = "online"
    }else state = "offline"

    document.querySelector(".state span").className = state
    document.querySelector(".state").innerHTML += state
    
    scrollDownMessages("instant")
})