const wrap = require("../../middleware/wrap");

const deleteCart = wrap(async(req, res, next) => {
    if(!req.session.user) {
        res.status(200).json({
            signIn: false,
            user: {},
        })
        return;
    }
    const cartSlug = req.params.cartSlug;
    if(!req.session.carts) {
        req.session.carts = [];
        res.status(400).json({
            alert: {
                text: "Something went wrong",
                type: 'danger',
            }
        })
    }
    let carts = req.session.carts;
    let filteredCarts = carts.filter(item => item.id !== cartSlug);
    req.session.carts = filteredCarts;
    const pointneeded = filteredCarts.reduce((prevPoint, item) => prevPoint + (item.point), 0)
    res.status(200).json({
        total: pointneeded,
        count: filteredCarts.length,
        data: cartSlug,
        alert: {
            text: "Item removed from cart",
            type: 'success',
        }
    })
})

exports.deleteCart = deleteCart;