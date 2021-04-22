const express = require("express");
const {body} = require('express-validator');
const router = express.Router();

const { purchase } = require("../controllers/purchase/purchase");

router.get('/', purchase);

module.exports = router;