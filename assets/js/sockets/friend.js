socket.on("connect",()=>{
    if(document.querySelector("#connectIo")){
            let data = JSON.parse(document.querySelector("#connectIo").value)

            if(data.status == "add"){
                socket.emit("sendFriendRequest",data)
            }else if(data.status == "cancel"){
                socket.emit("cancelFriendRequest",data)
            }else if(data.status == "accept"){
                socket.emit("acceptFriendRequest",data)
            }else if(data.status == "reject"){
                socket.emit("rejectFriendRequest",data)
            }else if(data.status == "delete"){
                socket.emit("deleteFriend",data)
            }
        }
})
