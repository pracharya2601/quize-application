const express = require("express");
const {body} = require('express-validator');
const router = express.Router();

const {db} = require("../models/googlefirestore");

//import usercontroller
const {signin} = require('../controllers/user/signin');
const { signup } = require("../controllers/user/signup");
const { current_user } = require("../controllers/user/get-user");
const { signout } = require("../controllers/user/signout");

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


router.get('/signout', signout);


module.exports = router;