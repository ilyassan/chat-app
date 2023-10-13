const authModel = require("../models/auth.model")
const validationResult = require("express-validator").validationResult

exports.getSignup = (req,res,next)=>{
    
     // render signup page
        res.render("signup",{
            authError : req.flash("authError")[0],
            validationErrors: req.flash("validationErrors"),
            isUser: false,
            pageTitle:"Signup"
        })
    
}

exports.postSignup = (req,res,next)=>{

    if(validationResult(req).isEmpty()){
        let image = req.file.filename
        let username = req.body.username.toLowerCase()
        let email = req.body.email.toLowerCase()
        authModel.createNewUser(username,email, req.body.password, image).then(()=> res.redirect("/login"))
        .catch(err => {
            req.flash("authError",err)
            res.redirect("/signup")
        })
    }else{
        req.flash("validationErrors",validationResult(req).array())
        res.redirect("/signup")
    }
 
}

exports.getLogin = (req,res,next)=>{
    
    // render login page
    res.render("login",{
        authError : req.flash("authError")[0],
        validationErrors: req.flash("validationErrors"),
        isUser: false,
        pageTitle:"Login"
    })
}


exports.postLogin = (req,res,next)=>{
    
    if(validationResult(req).isEmpty()){
    authModel
    .login(req.body.email,req.body.password)
    .then(result=> {
        req.session.userId = result.id;
        req.session.username = result.username;
        req.session.image = result.image;
        res.redirect("/")
    })
    .catch(err =>{
        req.flash("authError",err)
        res.redirect("/login")
    })

    }else{
        req.flash("validationErrors",validationResult(req).array())
        res.redirect("/login")
    }
}


exports.logout = (req,res,next)=>{
    req.session.destroy(()=>{
        res.redirect("/")
    })
}