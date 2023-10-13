const router = require("express").Router()

const check = require("express-validator").check

const bodyparser = require("body-parser")
const bodyparserMW = bodyparser.urlencoded({extended:true})

const authGuardes = require("./guarde/auth.guarde")

const profileController = require("../controllers/profile.controller")

router.get("/search",authGuardes.isAuth,profileController.getSearch)
router.post("/search",bodyparserMW,check("idOrName","Enter User ID First").not().isEmpty(),authGuardes.isAuth,profileController.postSearch)

router.get("/",authGuardes.isAuth,profileController.getProfile)
router.get("/:id",authGuardes.isAuth,profileController.getProfile)


module.exports = router