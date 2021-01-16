const {db} = require("../models/googlefirestore");
var jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {

    if(!req.session.user) {
        res.status(403).json({error: "Not authorized"});
        return;
    }
    const token = req.session.user;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    try{
        const userData = await db.collection('users').doc(decoded.uid).get();
        console.log(userData.data());
        const doc = userData.data();
        req.user.uid = decoded.uid;
        req.user.email = doc.email;
        req.user.name = doc.name;
        req.user.avatar = doc.avatar;
        return next();
    } catch(e) {
        res.status(403).json({error: "Not authorized"})
    }
}

exports.verifyToken = verifyToken;   