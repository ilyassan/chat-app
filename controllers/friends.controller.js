const getFriends = require("../models/user.model").getFriends;

exports.showFriends = (req,res,next) =>{
    getFriends(req.session.userId)
    .then(friends=>{
        res.render("friends",{
            isUser: req.session.userId,
            pageTitle: "Friends",
            friendRequests: req.friendRequests,
            noFriends: friends.length == 0?true:false,
            friends: friends,
        })
    }).catch(err => console.log(err))
}