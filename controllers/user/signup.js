const wrap = require('../../middleware/wrap');
const {validationResult} = require("express-validator");
const {hashPass} = require("../../models/hash-password");
const {sendSignUpMessage} = require("../../utils/mailing-service");
const collectionadd = require('../../common/collectionadd');
const subcollectionadd = require('../../common/subcollectionadd');

const signup = wrap(async(req, res, next) => {
    const {
        email,
        password,
        name,
    } = req.body;
    const errors = validationResult(req);
    const hash = await hashPass(password);
    //generate random number to pass on databas and email
    const code = Math.floor(100000 + Math.random() * 900000);
    if(!errors.isEmpty()) {
        res.status(400).json(errors);
        return;
    }
    const signupData = {
        email,
        password: hash,
        name,
        createdAt: new Date().toISOString(),
        verified: false,
        code,
    }
    const doc = await collectionadd('users', signupData);
    await subcollectionadd('users', doc.id, 'pass_history', {
        password: hash,
        createdAt: new Date().toISOString(),
        lastpass: true,
    })
    await sendSignUpMessage(email, name, code, doc.id);

    res.status(200).json({
        message: `user has been created ${doc.id}`,
    
    });
})

exports.signup = signup;