const router = require("express").Router()

const multer = require("multer")
const path = require("path")
const bodyparserMW = require("body-parser").urlencoded({extended: true})

const authGuardes = require("./guarde/auth.guarde")

const groupsController = require("../controllers/groups.controller")


router.get("/groups",authGuardes.isAuth, groupsController.getGroups)
router.get("/create-group",authGuardes.isAuth, groupsController.getCreateGroup)
router.post("/create-group", multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
                cb(null, 'images');
        },
        filename: (req, file, cb) => {
                cb(null, Date.now() + '-' + file.originalname);
        }
    }),
    fileFilter: (req, file, callback) => {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(null, false)
        }
        callback(null, true)
    },
}).single('groupImage'), authGuardes.isAuth,groupsController.postCreateGroup)

router.get("/group/chat",bodyparserMW ,authGuardes.isAuth, groupsController.backToGroups)
router.post("/group/chat",bodyparserMW ,authGuardes.isAuth, groupsController.getGroupChat)


router.post("/group/leave",bodyparserMW ,authGuardes.isAuth, groupsController.leaveGroup)


module.exports = router