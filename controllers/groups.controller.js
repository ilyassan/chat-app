const userModel = require("../models/user.model")
const groupModel = require("../models/group.model")
const messagesModel = require("../models/messages.model")
const fs = require("fs") 
const path = require("path")

exports.backToGroups = (req,res,next)=>{
    res.redirect("/groups")
}

exports.getGroups = (req,res,next)=>{
    groupModel.getGroups(req.session.userId)
    .then((groups)=>{
        res.render("groups",{
            pageTitle: "Groups",
            isUser: req.session.userId,
            friendRequests: req.friendRequests,
            groups: groups,
        })
    }).catch(err => res.redirect("/error"))
}



exports.getCreateGroup = (req,res,next)=>{
    userModel.getFriends(req.session.userId)
    .then((friends)=>{
        res.render("createGroup",{
            pageTitle: ["Groups","Create Group"],
            isUser: req.session.userId,
            friendRequests: req.friendRequests,
            validationErrors: [],
            friends: friends
        })
    }).catch(err => res.redirect("/error"))
}




exports.postCreateGroup = (req,res,next)=>{
    let usersId = [req.session.userId, ...req.body.friendsToGroup]
    let imageName = "default-group.png"
    if(req.file && req.file.mimetype.includes("image")){
        imageName = req.file.filename
    }
    groupModel.newGroup(usersId, imageName, req.body.groupName).then(()=>{
        res.redirect("/groups")
    }).catch(err => res.redirect("/error"))
}




exports.getGroupChat = async(req,res,next)=>{
    try{
        let group = JSON.parse(req.body.groupData)
        let messages = await messagesModel.getGroupMessages(group.id).then(messages => messages)
    
        let stillAndLeaveMembers;
        let stillMembers;
    
        if(messages.length == 0){
            let object = await groupModel.getGroup(group.id)
            stillAndLeaveMembers = [...object.users, ...object.leaves]
            stillMembers = object.users
        }else{
            stillAndLeaveMembers = [...messages[0].chat.users, ...messages[0].chat.leaves]
            stillMembers = messages[0].chat.users
        }
    
        res.render("group-chat",{
            pageTitle: ["Groups", group.name],
            isUser: req.session.userId,
            friendRequests: req.friendRequests,
            messages: messages,
            group: group,
            stillAndLeaveMembers: stillAndLeaveMembers,
            stillMembers: stillMembers,
        }) 
    
    }catch(error){
        res.redirect("/error")
    }
}


exports.leaveGroup = async(req,res,next)=>{
    let groupId = req.body.groupId
    let group = await groupModel.leaveGroup(groupId, req.session.userId)
    if(group.users.length == 0){
        let imagePath = path.join(__dirname, '../images', group.image)
        fs.unlink(imagePath, (err)=>{
            if(err) res.redirect("/error")
        })
    }
    res.redirect("/groups")
}