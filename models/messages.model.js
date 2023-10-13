const mongoose = require("mongoose");

const DB_URL = require("./mongooseDB");

const messageSchema = mongoose.Schema({
    chat: {type: mongoose.Schema.Types.ObjectId, ref: "chat"},
    content: String,
    sender: String,
    timestamp: String,
});

const Message = mongoose.model("message", messageSchema)

exports.Message = Message

exports.getMessages = async (chatId) =>{

    try{
        await mongoose.connect(DB_URL)

        let messages = await Message.find({chat: chatId},null,{sort:{timestamp: 1}}).populate({
            path: 'chat',
            model: 'chat',
            populate: {
                path: 'users',
                model: 'user',
                select: 'username image email',
            }
        })

    await mongoose.disconnect()
    return messages

    }catch(error){
        await mongoose.disconnect()
        throw new Error(error)
    }

}
exports.getGroupMessages = async (groupId) =>{

    try{
        await mongoose.connect(DB_URL)

        let messages = await Message.find({chat: groupId},null,{sort:{timestamp: 1}}).populate({
            path: 'chat',
            model: 'group',
            populate: {
                path: 'users leaves',
                model: 'user',
                select: 'username image',
            }
        })

    await mongoose.disconnect()
    return messages

    }catch(error){
        await mongoose.disconnect()
        throw new Error(error)
    }

}


exports.newMessage = async (msg)=>{
    try{
        await mongoose.connect(DB_URL)
        msg.timestamp = Date.now()
        let newMessage = new Message(msg)
        await newMessage.save()

    await mongoose.disconnect()
    return

    }catch(error){
        await mongoose.disconnect()
        throw new Error(error)
    }
}