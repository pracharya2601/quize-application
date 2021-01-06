const express = require("express");

const router = express.Router();

//import usercontroller
const {signin} = require('../controllers/user/signin');
const { signup } = require("../controllers/user/signup");
const { current_user } = require("../controllers/user/get-user");
const { signout } = require("../controllers/user/signout");






router.get('/', current_user);
router.post('/signin', signin);
router.post('/signup', signup);
router.get('/signout', signout);


module.exports = router;