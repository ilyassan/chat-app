let friends = JSON.parse(document.querySelector("[name='friends']").value)
socket.emit("getFriendsAndOnlineFriends",friends)



socket.on("FriendsAndOnlineFriends", data =>{
    let offlineFriends = data.offlineFriends;
    let onlineFriends = data.onlineFriends;

    // create friends container
    let friendsContainer = document.getElementById("friendsContainer")
    friendsContainer.innerHTML = `<div id="onlineFriendsContainer" class="onlineFriendsContainer">
                                <p class="alert alert-success">Online Friends</p>
                                <div id="onlineFriends" class="onlineFriends">
                                    
                                </div>
                            </div>

                            <div class="line my-4"></div>

                            <div id="offlineFriendsContainer" class="offlineFriendsContainer">
                                <p class="alert alert-success">Offline Friends</p>
                                <div id="offlineFriends" class="offlineFriends">

                                </div>
                            </div>`

    let onlineDiv = document.getElementById("onlineFriends")
    let offlineDiv = document.getElementById("offlineFriends")
    let onlineDivAlert = onlineDiv.parentElement.querySelector(".alert")
    let offlineDivAlert = offlineDiv.parentElement.querySelector(".alert")

    // create users
    if(offlineFriends.length == 0 && onlineFriends.length == 0){
        let parent = friendsContainer.parentElement
        parent.innerHTML = `<p class="alert alert-danger">You Don't Have Any Friends</p>`
    }else if(offlineFriends.length != 0 && onlineFriends.length == 0){
        onlineDivAlert.remove()
        onlineDiv.innerHTML = `<p class="alert alert-danger mb-0">No Online Friends</p>`
        fillFriends(offlineDiv, offlineFriends)
    }else if(offlineFriends.length == 0 && onlineFriends.length != 0){
        offlineDivAlert.remove()
        offlineDiv.innerHTML = `<p class="alert alert-danger mb-0">No Offline Friends</p>`
        fillFriends(onlineDiv, onlineFriends, "join")
    }else{
    
        fillFriends(offlineDiv, offlineFriends)
        fillFriends(onlineDiv, onlineFriends, "join")
    }








    function fillFriends( div, friends, join = false){
        // append users to the container
        for(let friend of friends){
            div.innerHTML += `<a href="/profile/${friend.id}">
                            <div class="user-chat">
                                <div class="image"><img src="${friend.image}" alt=""></div>
                                <h3>${friend.username}</h3>
                                <form action="/friend/chat" class="actions" method="post">
                                    <input type="hidden" name="chatId" value="${friend.chatId}">
                                    <input type="submit" class="btn" value="Chat">
                                </form>
                            </div>
                        </a>`
                if(join){
                    socket.emit("joinChat", friend.chatId)
                }
        }
    }
})