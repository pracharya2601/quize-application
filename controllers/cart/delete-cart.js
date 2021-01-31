const {db} = require("../../models/googlefirestore");
var jwt = require('jsonwebtoken');

const deleteCart = async (req, res, next) => {
    if(!req.session.user) {
        res.status(200).json({
            signIn: false,
            user: {},
        })
        return;
    }
    const token = req.session.user;
    const decoded = jwt.verify(token, "user_world");
    const userRef = db.collection('users').doc(decoded.uid);
    const cartSlug = req.params.cartSlug;
    const newCart = req.session.cart - 1 ;
    try {
        await userRef
            .collection('cart')
            .doc(cartSlug)
            .delete();
        req.session.cart = newCart
        res.status(200).json({
            itemCount: req.session.cart,
            message: 'Item remove from cart',
        })
        
    }catch(e) {
        console.log(e);
        res.status(500).json({error: "Erroroccured please try again later"});
    }
}

exports.deleteCart = deleteCart