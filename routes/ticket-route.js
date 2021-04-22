const express = require("express");
const {body} = require('express-validator');
const { tickets } = require("../controllers/ticket/tickets");
const router = express.Router();

router.get('/', tickets);


module.exports = router;