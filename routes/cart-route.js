const express = require("express");
const { addCart } = require("../controllers/cart/add-cart");
const { deleteCart } = require("../controllers/cart/delete-cart");
const router = express.Router();

const { getCarts } = require("../controllers/cart/get-carts");

router.get('/', getCarts);
router.get('/addcart', addCart);
router.delete('/:cartSlug', deleteCart);

module.exports = router;

// {"cookie":{
//         "originalMaxAge":6600000,
//         "expires":"2021-02-01T01:57:16.274Z",
//         "httpOnly":true,
//         "path":"/"
//     },
//     "user":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ4YzViU285bjh0bzJTY01ZTGEwQSIsImVtYWlsIjoicHJhY2hhcnlhMjYwMUBnbWFpbC5jb20iLCJpYXQiOjE2MTIxMzgwMzV9.q_hk4dQtDZmY8bv7j2kVP8JbK4TFb_tsXGavHw-CjOw"
// }