let callBtn = document.getElementById("callBtn")

callBtn.onclick = ()=>{
    let state = document.querySelector(".chat .state span")
    
    navigator.mediaDevices.getUserMedia({audio:true}).then(()=>{
        overlay.classList.remove("d-none")
        overlay.classList.add("fshow")
    
    if(state.classList.contains("offline")){
        noCall.classList.remove("d-none")
        
        let cancelCallBtn = document.getElementById("noCallBtn")
        hideOverlay(cancelCallBtn)
        
    }else if(state.classList.contains("online")){
        socket.emit('requestPeerId', chatId)

        calllay.classList.remove("d-none")

        let cancelCall = document.getElementById("cancelCall")
        cancelCall.onclick = ()=>{
            socket.emit("cancelCall", chatId)
            hideOverlay(cancelCall, "click")
        }
    }
    }).catch((err)=>{
        let permissionOverlay = document.getElementById("permission")
        overlay.classList.remove("d-none")
        overlay.classList.add("fshow")
        permissionOverlay.classList.remove("d-none")
        let noPermissionBtn = document.getElementById("noPermissionBtn")
        hideOverlay(noPermissionBtn)
    })

}


socket.on("recievePeerId", userPeerId =>{
    navigator.mediaDevices.getUserMedia({audio: true}).then(stream =>{

        otherUserPeerId = userPeerId
        let call = peer.call(userPeerId, stream)
        call.on("stream", showCall)

    })
})

socket.on("cancelCall", ()=>{
    Array.from(overlay.children).forEach(child => {
        child.classList.add("d-none")
    });
    overlay.classList.remove("fshow")
    overlay.classList.add("not-show")
    setTimeout(() =>overlay.classList.add("d-none"), 1000);
})