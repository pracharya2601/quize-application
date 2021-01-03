const express = require("express");
const router = express.Router();

//import usercontroller
const {signin} = require('../controllers/user/signin');
const { signup } = require("../controllers/user/signup");






router.post('/', signin);
router.post('/signup', signup);


module.exports = router;