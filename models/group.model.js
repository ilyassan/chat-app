const mongoose = require("mongoose");

const DB_URL = require("./mongooseDB");

const groupSchema = mongoose.Schema({
    name: String,
    users: [{type: mongoose.Schema.Types.ObjectId, ref: "user"}],
    leaves: [{type: mongoose.Schema.Types.ObjectId, ref: "user"}],
    image: String,
});


const Group = mongoose.model("group", groupSchema)
exports.Group = Group

const { Message } = require("./messages.model");


exports.newGroup = async (usersId, image, name)=>{
    try{
        await mongoose.connect(DB_URL)

        let group = await new Group({name: name, users: usersId, leaves: [], image: image})
        await group.save()
        
        await mongoose.disconnect()
        return

    }catch(error){
        await mongoose.disconnect()
        throw new Error(error)
    }
}

exports.getGroups = async (userId)=>{
    try{
        await mongoose.connect(DB_URL)

        let groups = await Group.find({ users : { $all : [userId] }},{users: false})
        await mongoose.disconnect()
        return groups

    }catch(error){
        await mongoose.disconnect()
        throw new Error(error)
    }
}

exports.getGroup = async (groupId)=>{
    try{
        await mongoose.connect(DB_URL)

        let group = await Group.findById(groupId,{users: true, leaves: true}).populate({
            path: "users leaves",
            model: "user",
            select: "username image _id"
        })
        await mongoose.disconnect()
        return {users: group.users, leaves: group.leaves}

    }catch(error){
        await mongoose.disconnect()
        throw new Error(error)
    }
}



exports.leaveGroup = async (groupId, userId)=>{
    try{
        await mongoose.connect(DB_URL)

        //  delete user from group doc users
        let group = await Group.findOneAndUpdate({_id: groupId}, {$pull:{ users : userId}, $push:{ leaves : userId}} ,{new: true})
        
        if(group.users.length == 0){
            await Promise.all([
                Group.deleteOne({_id: groupId}),
                Message.deleteMany({chat: groupId})
            ])
        }
        
        await mongoose.disconnect()
        return group

    }catch(error){
        await mongoose.disconnect()
        throw new Error(error)
    }
}