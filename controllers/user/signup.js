const wrap = require('../../middleware/wrap');
const {validationResult} = require("express-validator");
const {hashPass} = require("../../utils/hash-password");
const collectionadd = require('../../common/collectionadd');
const subcollectionadd = require('../../common/subcollectionadd');
const { signupMessage } = require('../../utils/mail/signupMessage');

const signup = wrap(async(req, res, next) => {
    const {
        email,
        password,
        name,
    } = req.body;
    const errors = validationResult(req);
    const hash = await hashPass(password);
    const date = new Date();
    //generate random number to pass on databas and email
    const code = Math.floor(100000 + Math.random() * 900000);
    if(!errors.isEmpty()) {
        res.status(400).json({
            alert: {
                text: 'Please check your email or password',
                type: 'danger'
            } 
        });
        return;
    }
    const signupData = {
        email,
        password: hash,
        name,
        createdAt: date.toISOString(),
        verified: false,
        code,
    }
    const doc = await collectionadd('users', signupData);
    await subcollectionadd('users', doc.id, 'pass_history', {
        password: hash,
        createdAt: date.toISOString(),
        lastpass: true,
    })
    await signupMessage(email, name, code, date.toDateString())

    res.status(200).json({
        alert: {
            text: 'Account created Please check your email to verify',
            type: 'success'
        }
    });
})

exports.signup = signup;