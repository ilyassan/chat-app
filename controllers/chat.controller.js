const messagesModel = require("../models/messages.model")
const chatModel = require("../models/chat.model")

exports.backToMain = (req,res,next)=>{
    res.redirect("/friends")
}

exports.getChat = async(req,res,next)=>{

    try{
        let chatId = req.body.chatId
        let messages = await messagesModel.getMessages(chatId)
    
        let friendData;
            if(messages.length == 0){
                let chat = await chatModel.getChat(chatId)
                friendData = chat.users.find(user => user._id != req.session.userId)
            }else{
                    friendData = messages[0].chat.users.find(user => user._id != req.session.userId)
            }
            
                res.render("chat",{
                    pageTitle: ["Friends",friendData.username],
                    isUser: req.session.userId,
                    friendRequests: req.friendRequests,
                    friendData: friendData,
                    messages: messages,
                    chatId: chatId,
                })
        }catch(err){
            res.redirect("/error")
        }


}