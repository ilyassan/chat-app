const router = require("express").Router()

const bodyparser = require("body-parser")
const bodyparserMW = bodyparser.urlencoded({extended:true})

const authGuardes = require("./guarde/auth.guarde")

const chatController = require("../controllers/chat.controller")

router.get("/chat",authGuardes.isAuth, bodyparserMW, chatController.backToMain)
router.post("/chat",authGuardes.isAuth, bodyparserMW, chatController.getChat)



module.exports = router