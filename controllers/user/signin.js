const wrap = require('../../middleware/wrap');
const {validationResult} = require("express-validator");
const {hashCompare} = require("../../models/hash-password");
var jwt = require('jsonwebtoken');

const {multipleQuery} = require('../../common/collectionSnap');

const signin = wrap(async (req, res, next) => {
    const {
        email,
        password,
    } = req.body;

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        res.status(400).json(errors);
        return;
    }
    const data =  await multipleQuery('users', 'email', email, 'verified', true, true);
    if(!data) {
        res.status(400).json({error: 'User not found'});
        return;
    }
    
    const shouldAuthenticated = await hashCompare(password, data.password);
    if(!shouldAuthenticated) {
        res.status(404).json({error: 'Password Incorrect'});
        return;
    }
    //stored the signined time to the new collection signed
    //create jwt tokn
    const token = jwt.sign({
        uid: data.id,
        email: email,
    }, process.env.JWT_SECRET)

    req.session.user = token;
    res.status(200).json({
        signedIn: true,
    })
})

exports.signin = signin;