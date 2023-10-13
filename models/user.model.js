const mongoose = require("mongoose");

const DB_URL = require("./mongooseDB");

const Chat = require("./chat.model").Chat
const Message = require("./messages.model").Message


const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    image:{ type: String , default: "default-user.png"},
    friends: {
        type: [{username: String, image: String, id: String, chatId: String}],
        default: []
    },
    friendRequests: {
        type: [{ username: String, image: String, id: String}],
        default: []
    },
    sendRequests: {
        type: [{ username: String, id: String}],
        default: []
    }
});

const User = mongoose.model("user", userSchema)
exports.User = User


exports.getProfileData = (idOrUserName) =>{
    return new Promise((resolve,reject)=>{
        mongoose
                .connect(DB_URL)
                .then(()=>{
                   if(idOrUserName.length > 8){
                        return User.findById(idOrUserName).then(user =>user).catch((err)=> undefined)
                    }
                    return User.findOne({username: idOrUserName.toLowerCase()}).then(user =>user).catch((err)=> undefined)
                })
                .then(data =>{
                    mongoose.disconnect()
                    resolve(data)
                })
                .catch(err =>{
                    mongoose.disconnect()
                    reject(err)
                })
    })
}



exports.sendFriendRequest = async(myData , userData)=> {
    // add MY data to USER friend requests
    // add USER data to MY send requests
    try{
        await mongoose.connect(DB_URL)

        let user = await User.findOne({_id : myData.id});
        let answer = user.friendRequests.some(friendRequest => friendRequest.id == userData.id)

        if(!answer){
            await Promise.all([
                User.updateOne(
                    {_id : userData.id},
                    {$push:{ friendRequests : {username:myData.username , id:myData.id , image:myData.image}}}
                ),
                User.updateOne(
                    {_id : myData.id},
                    {$push:{ sendRequests : {username:userData.username , id:userData.id}}}
                )
            ])
        }else{
            await mongoose.disconnect()
            throw 'This user already sent to you a friend request'
        }
    await mongoose.disconnect()
    return

    }catch(error){
        await mongoose.disconnect()
        throw error
    }

};
exports.cancelFriendRequest = async(myData, userData)=> {
        // remove MY data from USER friend requests
    // remove USER data from MY send requests
    try{
        await mongoose.connect(DB_URL)
        
        await Promise.all([
            User.updateOne(
                {_id : userData.id},
                {$pull:{ friendRequests : {id:myData.id}}}
            ),
            User.updateOne(
                {_id : myData.id},
                {$pull:{ sendRequests : {id:userData.id}}}
            )
        ])

    await mongoose.disconnect()
    return

    }catch(error){
        await mongoose.disconnect()
        throw new Error(error)
    }
};
exports.acceptFriendRequest = async(myData, userData)=> {
        // remove USER data from MY friend requests
        // add USER data to MY friends

        // remove MY data from USER send requests
        // add MY data to USER friends

        try{
            await mongoose.connect(DB_URL)

            await User.updateOne(
                {_id : myData.id},
                {$pull:{ friendRequests : {id:userData.id}}}
                );

            let newChat = new Chat({
                users: [myData.id, userData.id]
            });
            let chatDoc = await newChat.save();

            await Promise.all([
                
                User.updateOne(
                    {_id : myData.id},
                    {$push:{ friends : {username:userData.username, image:userData.image, id:userData.id, chatId:chatDoc._id}}}
                ),
    
                // 3
                User.updateOne(
                    {_id : userData.id},
                    {$pull:{ sendRequests : {id:myData.id}}}
                ),
                
                // 4
                User.updateOne(
                    {_id : userData.id},
                    {$push:{ friends : {username:myData.username, id:myData.id, image:myData.image, chatId:chatDoc._id}}}
                )
            ])
            

    
        await mongoose.disconnect()
        return chatDoc._id
    
        }catch(error){
            await mongoose.disconnect()
            throw new Error(error)
        }
};


exports.rejectFriendRequest = async(myData, userData)=> {
            // remove MY data from USER friend requests
    // remove USER data from MY send requests
    try{
        await mongoose.connect(DB_URL)
        
        await Promise.all([
            User.updateOne(
                {_id : myData.id},
                {$pull:{ friendRequests : {id:userData.id}}}
            ),
            User.updateOne(
                {_id : userData.id},
                {$pull:{ sendRequests : {id:myData.id}}}
            )
        ])

    await mongoose.disconnect()
    return

    }catch(error){
        await mongoose.disconnect()
        throw new Error(error)
    }
};


exports.deleteFriendRequest = async(myData, userData)=> {
                // remove MY data from USER friends
               // remove USER data from friends

            try{
                await mongoose.connect(DB_URL)
                let chat = await Chat.findOneAndDelete({users: {$all: [myData.id, userData.id]}})
                await Message.deleteMany({chat: chat._id})

                await Promise.all([
                    User.updateOne(
                    {_id : userData.id},
                    {$pull:{ friends : {id:myData.id}}}
                ),
                User.updateOne(
                    {_id : myData.id},
                    {$pull:{ friends : {id:userData.id}}}
                )])
        
           await mongoose.disconnect()
            return
        
            }catch(error){
                await mongoose.disconnect()
                throw new Error(error)
            }
        
};



exports.friendRequests = async(id)=> {

            return new Promise((resolve,reject)=>{
                mongoose
                        .connect(DB_URL)
                        .then(()=>{
                            return User.findById(id ,{friendRequests: true}).then(data =>data.friendRequests).catch((err)=> undefined)
                        })
                        .then(requests =>{
                            mongoose.disconnect()
                            resolve(requests)
                        })
                        .catch(err =>{
                            mongoose.disconnect()
                            reject(err)
                        })
            })
        
};



exports.getFriends = async id =>{

    try{
        await mongoose.connect(DB_URL)
        let data = await User.findOne({_id:id}, { friends : true})
        await mongoose.disconnect()
        return data.friends
    }catch(error){
        await mongoose.disconnect()
        throw new Error(error)
    }
}