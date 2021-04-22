const express = require("express");
const {body} = require('express-validator');
const router = express.Router();

const {db} = require("../models/googlefirestore");

//import usercontroller
const {signin} = require('../controllers/user/signin');
const { signup } = require("../controllers/user/signup");
const { current_user } = require("../controllers/user/get-user");
const { signout } = require("../controllers/user/signout");
const { verifyUser } = require("../controllers/user/verify-user");
const { resetPasswordCode } = require("../controllers/user/reset-password-code");
const { changePassword } = require("../controllers/user/change-password");
const { updateUserDetail } = require("../controllers/user/update-user-detail");
const { getUserDetail } = require("../controllers/user/get-user-detail");

router.get('/', current_user);

router.post('/signin', [
    body("email")
        .isEmail()
        .withMessage("Please emter a valid email"),
    body("password")
        .trim()
        .isLength({min: 3})
        .withMessage("Please Enter the valid password")
], signin);


router.post('/signup', [
    body("email")
        .isEmail()
        .withMessage("Please enter valid Email address")
        .custom( async(value, {req}) => {
            let doc = await db.collection('users')
                .where("email", '==', value)
                .get()
                if(!doc.empty) {
                    return Promise.reject("Email already exists")
                }
        }),
    body('password')
        .trim()
        .isLength({min: 6})
        .withMessage("Please length is Insufficient")
], signup);

router.post('/requestresetpassword',[
    body("email")
        .isEmail()
        .withMessage("Please Enter the valid Email")
], resetPasswordCode);

router.post('/verify',[
    body('verificationcode')
        .trim()
        .isLength({min:5, max: 7})
        .withMessage("Please use the correct verification code")
], verifyUser);

router.get('/signout', signout);

router.post('/changepassword',[
    body('lastpass')
        .trim()
        .isLength({min: 6})
        .withMessage('Your Password is'),
    body('newpass')
        .trim()
        .isLength({min: 6})
        .withMessage("Password length is short")
],changePassword)

router.post('/updateuserdetail', updateUserDetail);
router.get('/getuserdetail', getUserDetail);

module.exports = router;