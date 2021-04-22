const wrap = require("../../middleware/wrap");
const decodedToken = require("../../utils/decodedToken");


const carts = wrap(async(req, res, next) => {
    if(!req.session.user) {
        res.status(200).json({
            signIn: false,
            user: {},
        })
        return;
    }
    if(!req.session.carts) {
        req.session.carts = []
    }
    let carts = req.session.carts;
    let count = carts.length;
    let pointsneeded = carts.reduce((prevPoint, item) => prevPoint + (item.point), 0);
    res.status(200).json({
        total: pointsneeded,
        count: count,
        data: carts
    })
})

exports.carts = carts;