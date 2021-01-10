const {validationResult} = require("express-validator");
const {db} = require("../../models/googlefirestore");
const {hashCompare} = require("../../models/hash-password");
var jwt = require('jsonwebtoken');

const signin = async (req, res, next) => {
    const {
        email,
        password,
    } = req.body;
    const userRef = db.collection('users');
    let userDetail = [];
    try {
        let user = await userRef
            .where("email", '==', email)
            .where('verified', "==", true)
            .get();
            
        user.forEach((doc) => {
            userDetail.push({...doc.data(), uid: doc.id});
        })

    }catch (e) {
        res.status(400).json({error: 'User not Found'});
    }
    if(userDetail.length === 0) {
        res.status(400).json({error: 'User not Found'});
        return;
    }
    const shouldAuthenticated = await hashCompare(password, userDetail[0].password);
    if(!shouldAuthenticated) {
        res.status(404).json({error: 'Password Incorrect'});
        return;
    }

    //stored the signined time to the new collection signed

    //create jwt tokn
    const token = jwt.sign({
        uid: userDetail[0].uid,
        email: email,
    }, "user_world")

    req.session.user = token;
    res.status(200).json({
        signedIn: true,
    })
}

exports.signin = signin;