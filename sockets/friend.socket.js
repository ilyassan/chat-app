module.exports = io =>{
    io.on("connection", socket =>{
        socket.on("sendFriendRequest", data =>{
            io.to(data.userSendTo.id).emit("newFriendRequest",data)
        })
        socket.on("cancelFriendRequest", data =>{
            io.to(data.userSendTo.id).emit("removeFriendRequest",data)
        })
        socket.on("acceptFriendRequest", data =>{
            io.to(data.userSendTo.id).emit("acceptFriendRequest",data)
        })
        socket.on("rejectFriendRequest", data =>{
            io.to(data.userSendTo.id).emit("rejectFriendRequest",data)
        })
        socket.on("deleteFriend", data =>{
            io.to(data.userSendTo.id).emit("deleteFriend",data)
        })

        socket.on("getFriendsAndOnlineFriends", friends =>{
                let onlineFriends = friends.filter(friend  => io.onlineUsers[friend.id])
                let offlineFriends = friends.filter(friend  => !io.onlineUsers[friend.id])
                socket.emit("FriendsAndOnlineFriends",{offlineFriends,onlineFriends})
        })
    })
}