const {db} = require('./googlefirestore');
var jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    const authToken = req.cookie.token;
    jwt.verifyToken(authToken,"user_world", (err, data) => {
        if(err) {
            res.status(403).json(err);
        }
        else if(data.uid) {
            let user = await db.collection('users').doc(data.uid).get();
            if(!user.exists) {
                res.status(500).json({error: "Server error. PLease try again later"})
                //send message to admin about user databse error;
            }
            else {
                let userData = user.data();
                req.uid = data.uid;
                req.name = userData.name;
                req.email = userData.email;
                next();
            }
        }
    })
}