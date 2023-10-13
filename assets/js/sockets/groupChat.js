var chatId = document.getElementById("groupId").value

const isGroup = true

socket.emit("joinChat", chatId)

document.querySelector(".chat-container").style.display = "flex"
scrollDownMessages("instant")