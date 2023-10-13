const router = require("express").Router()

const bodyparser = require("body-parser")
const bodyparserMW = bodyparser.urlencoded({extended:true})

const authGuardes = require("./guarde/auth.guarde")

const friendController = require("../controllers/friend.controller")

router.post("/add",authGuardes.isAuth, bodyparserMW, friendController.add)
router.post("/cancel",authGuardes.isAuth, bodyparserMW, friendController.cancel)
router.post("/accept",authGuardes.isAuth, bodyparserMW, friendController.accept)
router.post("/reject",authGuardes.isAuth, bodyparserMW, friendController.reject)
router.post("/delete",authGuardes.isAuth, bodyparserMW, friendController.delete)



module.exports = router