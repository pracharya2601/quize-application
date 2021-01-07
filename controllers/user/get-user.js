const {db} = require("../../models/googlefirestore");
var jwt = require('jsonwebtoken');

const current_user = async (req, res, next) => {
    if(!req.session.user) {
        res.status(200).json({
            signIn: false,
            user: {},
        })
        return;
    }   
    const token = req.session.user;
    const decoded = jwt.verify(token, "user_world");
    try {
        const userData = await db.collection('users').doc(decoded.uid).get();
        const user = {
            email: userData.data().email,
            name: userData.data().name,
            address: userData.data().address,
        }
        console.log(user)
        res.status(200).json({
            signIn: true,
            user: user,
        })
    
    } catch (e) {

    }

}

exports.current_user = current_user;