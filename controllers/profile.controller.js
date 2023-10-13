const userModel = require("../models/user.model")

const validationResult = require("express-validator").validationResult

/*
    user enter his profile 
    friends
            user1 is in user2 friends
    user1 sent friend request to user2
            user1 is in user2 friend requestes
    user1 receive friend request from user2
            user1 is in user2 send requestes
*/


exports.getProfile = (req,res,next)=>{
    let id = req.params.id
    if(!id) return res.redirect("/profile/"+ req.session.userId)
    userModel
            .getProfileData(id)
            .then(data =>{
                //if data found
                if(data != undefined ){

                    // if data of main user
                    if(id == req.session.userId){
                        let connectIo = req.session.connectIo
                        delete req.session.connectIo
                        
                        res.render("profile",{
                            pageTitle: "My Profile",
                            isUser : req.session.userId,
                            id: id,
                            myData:{
                                id: id,
                                username: data.username,
                                image: data.image,
                            },
                            // chatId: chatId,
                            username : data.username,
                            userImage : data.image,
                            friendRequests: req.friendRequests,
                            connectIo : connectIo
                        })

                    // if data of another user 
                    }else{
                            req.session.searchId = id
                           res.redirect("/profile/search")
                    }

                }else{
                    // if not found
                    res.redirect("/profile/search")
                }
            })
            .catch(err =>{
                res.redirect("/error")
            })
}


exports.getSearch = (req,res,next)=>{
    let searchId = req.session.searchId
    let connectIo = req.session.connectIo
    delete req.session.connectIo
    delete req.session.searchId

    res.render("search-user",{
        pageTitle: "Search",
        authError : req.flash("authError")[0],
        validationError: req.flash("validationError")[0],
        isUser: req.session.userId,
        found: false,
        searchId: searchId?searchId:false,
        friendRequests: req.friendRequests,
        connectIo: connectIo,
    })
}


exports.postSearch = (req,res,next)=>{

    if(validationResult(req).isEmpty()){
        let idOrName = req.body.idOrName
        userModel
    .getProfileData(idOrName)
    .then(data =>{
        
        if(data != undefined){
            let id = data._id
            
            let ownerId = req.session.userId
            let chatId = req.body.chatId;
            
            if(chatId == "false" || !chatId){
                data.friends.forEach(friend => {
                    if(friend.id == ownerId){
                        chatId = friend.chatId
                    }
                });
            }

            //if user found
                res.render("search-user",{
                    pageTitle: "Search",
                    isUser : ownerId,
                    found: true,
                    authError : req.flash("authError")[0],
                    validationError: req.flash("validationError")[0],
                    friendRequests: req.friendRequests,

                    myData: {
                        id: ownerId,
                        username: req.session.username,
                        image: req.session.image,
                    },

                    userData: {
                        id: data._id,
                        username: data.username,
                        image: data.image,
                    },
                    chatId: chatId,

                    isOwner: id == ownerId,
                    isFriend: data.friends.find(friend => friend.id == ownerId),
                    isRequestSent: data.friendRequests.find(friend => friend.id == ownerId),
                    isRequestRecieved: data.sendRequests.find(friend => friend.id == ownerId),
                    
                    connectIo: false,
                })
        }else{
             //if user not found
             req.flash("authError",idOrName)
             res.redirect("/profile/search")
        }

    })
    .catch(err =>{
        res.redirect("/error")
    })

    }else{
        req.flash("validationError",validationResult(req).array())
        res.redirect("/profile/search")
    }

}