const router = require("express").Router()

const authGuardes = require("./guarde/auth.guarde")

const friendsController = require("../controllers/friends.controller")

router.get("/friends",authGuardes.isAuth,friendsController.showFriends)

module.exports = router