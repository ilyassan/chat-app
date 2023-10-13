const socket = io()

let myId = document.querySelector("#qlbcoqmfbrId").value;

socket.on("connect",()=>{
    socket.emit("joinToNotificationRoom",myId);
    socket.emit("beOnline",myId);
})

socket.on("newFriendRequest", data =>{
    let userSended = data.userSended
    let userSendTo = data.userSendTo


    if(window.location.pathname == "/profile/"+userSendTo.id){
        // create request content
        let newRequest = `<a href="/profile/${userSended.id}">
        <div class="profile text-center mt-3 w-100">
            <div class="main-info">
                        <img src="/${userSended.image}" alt="">
                        <h1 class="text-uppercase">${userSended.username}</h1>
                    </div>
                    <form action="" class="actions" method="POST">
                    <input type="hidden" name="isProfileRequests" value="true">
                    <input type="hidden" name="myData" value='${JSON.stringify(userSendTo)}'>
                        <input type="hidden" name="userData" value='${JSON.stringify(userSended)}'>
                        
                        <input type="submit" class="btn" value="Accept" formaction="/friend/accept">
                        <input type="submit" class="btn reject" value="Reject" formaction="/friend/reject">
                    </form>
                    </div>
            </a>`
            
            if(document.getElementById("noFriendRequest")){
                let noFriendAlert = document.getElementById("noFriendRequest")
                let parent = noFriendAlert.parentElement
                noFriendAlert.remove()
                parent.innerHTML += `<div class="con friend-requests mt-3" id="friendRequests">
                <p class="alert alert-success">Friends Request :</p>
                ${newRequest}
                </div>
                `
            }else if(document.getElementById("friendRequests")){
                let friendRequestsDiv = document.getElementById("friendRequests")
                friendRequestsDiv.innerHTML += newRequest
            }
        }else if(window.location.pathname == "/profile/search" && document.getElementById("userId")){
                // change buttons
            if(document.getElementById("userId").textContent == userSended.id){
                let form = document.querySelector(".actions")
                    document.getElementById("addRequest").remove()
                    form.innerHTML += ` <input type="submit" id="acceptRequest" class="btn" value="Accept Friend Request" formaction="/friend/accept">
                                        <input type="submit" id="rejectRequest" class="btn reject" value="Reject" formaction="/friend/reject">`
            }
        }
        
    // change request count profile notification icon
        
   let profileIcon = document.getElementById("profileIcon")
   let friendRequestsCount = document.getElementById("qlmjfncaRequestLength")

   let newCount = Number(profileIcon.getAttribute("data-count")) + 1

   profileIcon.removeAttribute("data-count")
   profileIcon.setAttribute("data-count",newCount)
   friendRequestsCount.value = newCount
   
    profileIcon.classList.add("newIcon")
})


socket.on("removeFriendRequest", data =>{
    let userSended = data.userSended
    let userSendTo = data.userSendTo

    if(window.location.pathname == "/profile/"+userSendTo.id){

            let friendRequests = Array.from(document.querySelectorAll("#friendRequests a"));

            friendRequests.forEach(request => {
                if(request.pathname == "/profile/"+userSended.id){
                    // show new request
                    if(friendRequests.length == 1){
                        let friendRequestsDiv = request.parentElement
                        let parent = request.parentElement.parentElement
                        let noFriendRequestDiv = `        <div class="con friend-requests text-center mt-3" id="noFriendRequest">
                                                    <p class="alert alert-danger">There's No New Friend Request</p>
                                                                </div>` 
                        friendRequestsDiv.remove()
                        parent.innerHTML += noFriendRequestDiv

                        let profileIcon = document.getElementById("profileIcon")
                        profileIcon.classList.remove("newIcon")
                    }
                    request.remove()
                }
            });
    }else{
        if(window.location.pathname == "/profile/search" && document.getElementById("userId")){
            if(document.getElementById("userId").textContent == userSended.id){
                let form = document.querySelector(".actions")
                document.getElementById("acceptRequest").remove()
                document.getElementById("rejectRequest").remove()
                form.innerHTML += `<input type="submit" id="addRequest" class="btn" value="Send Friend Request" formaction="/friend/add">`
            }
        }
        if(document.getElementById("qlmjfncaRequestLength").value == 1){
                 let profileIcon = document.getElementById("profileIcon")
                 profileIcon.classList.remove("newIcon")
                }
            }
            
    // change request count profile notification icon
            let profileIcon = document.getElementById("profileIcon")
            let friendRequestsCount = document.getElementById("qlmjfncaRequestLength")
            
            let newCount = Number(profileIcon.getAttribute("data-count")) - 1

            profileIcon.removeAttribute("data-count")
            profileIcon.setAttribute("data-count",newCount)
            friendRequestsCount.value = newCount
})



socket.on("acceptFriendRequest", data =>{
    let userSended = data.userSended
    // change buttons
    if(window.location.pathname == "/profile/search" && document.getElementById("userId").textContent == userSended.id){
        let form = document.querySelector(".actions")
                document.getElementById("cancelRequest").remove()
                document.getElementById("sended").remove()
                form.innerHTML += ` <input type="hidden" id="chatId" name="chatId" value="${data.chatId}">
                                    <input type="submit" id="chatFriend" class="btn" value="Chat" formaction="/friend/chat">
                                    <input type="submit" id="deleteFriend" class="btn delete" value="Unfriend" formaction="/friend/delete">`
        
    }
})


socket.on("rejectFriendRequest", data =>{
    let userSended = data.userSended
    // change buttons
    if(window.location.pathname == "/profile/search" && document.getElementById("userId").textContent == userSended.id){
        let form = document.querySelector(".actions")
                document.getElementById("cancelRequest").remove()
                document.getElementById("sended").remove()
                form.innerHTML += `<input type="submit" id="addRequest" class="btn" value="Send Friend Request" formaction="/friend/add">`

    }
})



socket.on("deleteFriend", data =>{
    let userSended = data.userSended
    // change buttons
    if(window.location.pathname == "/profile/search" && document.getElementById("userId").textContent == userSended.id){
        let form = document.querySelector(".actions")
                document.getElementById("chatId").remove()
                document.getElementById("chatFriend").remove()
                document.getElementById("deleteFriend").remove()
                form.innerHTML += `<input type="submit" id="addRequest" class="btn" value="Send Friend Request" formaction="/friend/add">`

    }
})


socket.on("toError", ()=>{
    window.location.pathname = "/error"
})