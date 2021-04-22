const express = require("express");
const {body} = require('express-validator');
const router = express.Router();

const { carts } = require("../controllers/cart/carts");
const { deleteCart } = require("../controllers/cart/delete-cart");
const { addCart } = require("../controllers/cart/add-cart");

router.get('/', carts);
router.post('/', addCart);
router.delete('/:cartSlug', deleteCart);

module.exports = router;