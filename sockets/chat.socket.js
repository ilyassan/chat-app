const newMessage = require("../models/messages.model").newMessage

module.exports = io =>{
    io.on("connection", (socket)=>{
        socket.on("joinChat", chatId =>{
            socket.join(chatId)
        })
        socket.on("isFriendOnline", friendId =>{

            let friendState = io.onlineUsers[friendId]
            socket.emit("friendState", friendState)
        })
        socket.on("sendMessage", msg =>{
            newMessage(msg).then(()=>{
                io.to(msg.chat).emit("newMessage", msg)
            }).catch(err => socket.emit("toError"))
        })
        socket.on("requestPeerId", chatId =>{
            socket.broadcast.to(chatId).emit("getPeerId", chatId)
        })
        socket.on("sendPeerId", data =>{
            socket.broadcast.to(data.chatId).emit("recievePeerId", data.peerId)
        })
        socket.on("stopCall", chatId =>{
            socket.broadcast.to(chatId).emit("endCall")
        })
        socket.on("declinecall", chatId =>{
            socket.broadcast.to(chatId).emit("declinecall")
        })
        socket.on("cancelCall", chatId =>{
            socket.broadcast.to(chatId).emit("cancelCall")
        })
    })
}