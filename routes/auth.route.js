const router = require("express").Router()
const bodyParser = require("body-parser")
const bodyParserMW = bodyParser.urlencoded({extended:true})
const check = require("express-validator").check
const multer = require("multer")
const path = require("path")

const authGuardes = require("./guarde/auth.guarde")

const authController = require("../controllers/auth.controller")

let requiredFields = "please fill all the fields"

router.get("/signup",authGuardes.notAuth,authController.getSignup)

router.post(
    "/signup",
    authGuardes.notAuth,
    multer({
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
    }).single('profileImage'),
    check("username",requiredFields).not().isEmpty().isLength({max:8}).withMessage("username must be 8 charachter or less")
    .custom((value, { req }) => {
        // Check if the password contains spaces
        if (/\s/.test(value)) {
            throw new Error('username should not contain spaces');
        }
        return true;
    }),
    check("email","invalid email format").not().isEmpty().withMessage(requiredFields).isEmail(),
    check("password","password must be contains at least 8 charachters").not().isEmpty().withMessage(requiredFields).isLength({min:8})
    .custom((value, { req }) => {
        // Check if the password contains spaces
        if (/\s/.test(value)) {
            throw new Error('password should not contain spaces');
        }
        return true;
    }),
    check("confirmPassword").not().isEmpty().withMessage(requiredFields).custom((value,{req})=>{
        if(value ==  req.body.password)return true
        else throw "passwords didn't matches"
    }),
    check("profileImage").custom((value, {req}) =>{
        if(req.file) return true
        else throw "profile image is required"
    }),
    authController.postSignup)

router.get("/login",authGuardes.notAuth,authController.getLogin)

router.post(
    "/login",
    authGuardes.notAuth,
    bodyParserMW,
    check("email","invalid email format").not().isEmpty().withMessage("email is required").isEmail(),
    check("password","password is required").not().isEmpty(),
    authController.postLogin)

router.all("/logout",authGuardes.isAuth,authController.logout)

module.exports = router