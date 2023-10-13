const userModel = require("../models/user.model")


exports.add = (req,res,next)=>{

    userModel.sendFriendRequest( formatData(req,0) , formatData(req) ).then(() => {
        refreshProfile(req,res,"add")
    }).catch(err =>{
        req.session.problem = err
        res.redirect("/error")
    })
    
}
exports.cancel = (req,res,next)=>{
    
    userModel.cancelFriendRequest( formatData(req,0) , formatData(req) ).then(() => {
        refreshProfile(req,res,"cancel")
    }).catch(err =>{
        res.redirect("/error")
    })

}
exports.accept = (req,res,next)=>{

    userModel.acceptFriendRequest( formatData(req,0) , formatData(req) ).then((chatId) => {
        refreshProfile(req,res,"accept",String(chatId))
    }).catch(err =>{
        res.redirect("/error")
    })

}
exports.reject = (req,res,next)=>{

    userModel.rejectFriendRequest( formatData(req,0) , formatData(req) ).then(() => {
        refreshProfile(req,res,"reject")
    }).catch(err =>{
        res.redirect("/error")
    })

}
exports.delete = (req,res,next)=>{

    userModel.deleteFriendRequest( formatData(req,0) , formatData(req) ).then(() => {
        refreshProfile(req,res,"delete")
    }).catch(err =>{
        res.redirect("/error")
    })

}





function refreshProfile(req,res,x=false,chatId=false){
    if(req.body.isProfileRequests){
        if(x == "accept" || x == "reject"){
            if(x){req.session.connectIo = JSON.stringify({userSended:formatData(req,0),userSendTo:formatData(req),chatId: chatId,status:x})}
        }
        res.redirect("/profile")
    }else{
        if(x){req.session.connectIo = JSON.stringify({userSended:formatData(req,0),userSendTo:formatData(req),chatId: chatId,status:x})}
        res.redirect("/profile/"+formatData(req).id)
    }
}

function formatData(req,x = 1,){
    if(x == 0){
        let myData = JSON.parse(req.body.myData);
        return myData
    }else if(x == 1){
        let userData = JSON.parse(req.body.userData)
        return userData
    }
}