const mongoose = require("mongoose");

const DB_URL = require("./mongooseDB");

const chatSchema = mongoose.Schema({
    users: [{type: mongoose.Schema.Types.ObjectId, ref: "user"}]
});

const Chat = mongoose.model("chat", chatSchema)
exports.Chat = Chat

exports.getChat = async (chatId)=>{
    try{
        await mongoose.connect(DB_URL)

        let chat = await Chat.findById(chatId).populate('users')
        await mongoose.disconnect()
        return chat

    }catch(error){
        await mongoose.disconnect()
        throw new Error(error)
    }
}