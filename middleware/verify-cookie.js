// const {db} = require("../models/googlefirestore");
// var jwt = require('jsonwebtoken');

module.exports = (req, res) => {
    if(!req.session.user) {
        res.status(200).json({
            signIn: false,
            user: {}
        });
        return;
    } else {
        const token = req.session.user;
        return token;
    }
}

exports.verifyToken = verifyToken;   