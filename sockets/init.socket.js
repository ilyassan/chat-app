module.exports = io =>{
    io.on("connection", socket =>{
        socket.on("joinToNotificationRoom",id => {
            socket.join(id)
        });
        socket.on("beOnline", id =>{
            io.onlineUsers[id] = true
            socket.on("disconnect", ()=>{
                io.onlineUsers[id] = false
            })
        });
    })
}