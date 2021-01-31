const express = require("express");
const { addCart } = require("../controllers/cart/add-cart");
const { deleteCart } = require("../controllers/cart/delete-cart");
const router = express.Router();

const { getCarts } = require("../controllers/cart/get-carts");

router.get('/', getCarts);
router.get('/addcart', addCart);
router.delete('/:cartSlug', deleteCart);

module.exports = router;