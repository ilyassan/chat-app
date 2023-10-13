const router = require("express").Router()

const authGuardes = require("./guarde/auth.guarde")

const homeController = require("../controllers/home.controller")

router.get("/",authGuardes.isAuth,homeController.getHome)

module.exports = router