const mongoose = require("mongoose");

const DB_URL = require("./mongooseDB");

const bcrypt = require("bcrypt")

const User = require("./user.model").User



exports.createNewUser = (username,email,password,image)=>{

    // check if email exists
    // yes => error is exists
    // no => create new account

    return new Promise((resolve,reject)=>{
        mongoose.connect(DB_URL).then(()=>{
            return User.findOne({username:username})
        }).then(user =>{
            if(user){
                mongoose.disconnect()
                reject("username is already used")
            }
            return User.findOne({email:email})
        }).then(user =>{
            if(user){
            mongoose.disconnect()
             reject("email is already used")
            }else{
                return bcrypt.hash(password,10)
            }
        }).then(hashedPassword =>{
            let user = new User({password:hashedPassword,email:email,username:username,image:image})
            return user.save()
        }).then(()=>{
            mongoose.disconnect()
            resolve()
        }).catch(err => {
            mongoose.disconnect()
            reject("something went wrong please try again")
        })
    })

}


exports.login = (email,password)=>{


    // check if email already using
    // no ==> error
    // yes ==> check password is correct
    // no ==> error
    // yes ==> set ssesion

    return new Promise((resolve,reject)=>{
        mongoose.connect(DB_URL).then(()=> User.findOne({email:email})).then(user=>{
            if(!user){
                mongoose.disconnect()
                reject("email not found")
            }else{
                bcrypt.compare(password,user.password).then(same =>{
                    if(!same){
                        mongoose.disconnect()
                        reject("password is incorrect")
                    }else{
                        mongoose.disconnect()
                        resolve(user)
                    }
                })
            }
        }).catch(err =>{
            mongoose.disconnect()
            reject(err)
        })
    })

}


exports.getUserIdByEmail = email=>{


    return new Promise((resolve,reject)=>{
        mongoose.connect(DB_URL).then(()=> User.findOne({email:email}))
        .then(user=>{
            mongoose.disconnect()
            if(user){
                resolve(user._id)
            }else{
                resolve(false)
            }
        }).catch(err =>{
            mongoose.disconnect()
            reject(err)
        })
    })


}