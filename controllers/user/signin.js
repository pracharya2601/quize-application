const wrap = require('../../middleware/wrap');
const {validationResult} = require("express-validator");
const {hashCompare} = require("../../utils/hash-password");
var jwt = require('jsonwebtoken');

const {multipleQuery} = require('../../common/collectionSnap');
const collectionupdate = require('../../common/collectionupdate');
const { unauthorizeSigninAttempt } = require('../../utils/mail/unauthorizeSigninAttempt');

const signin = wrap(async (req, res, next) => {
    if(!req.session.signinAttemp) {
        req.session.signinAttemp = [];
    }
    
    const {
        email,
        password,
    } = req.body;

    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        res.status(404).json({
            alert: {
                text: 'Please check your email and password',
                type: 'danger'
            }   
        });
        return;
    }
    const data =  await multipleQuery('users', 'email', email, 'verified', true, true);
    if(!data) {
        res.status(400).json({
            alert: {
                text: 'User not found',
                type: 'danger'
            }   
        });
        return;
    }
    if(req.session.signinAttemp.length > 4) { 
        await collectionupdate('users', data.id, {
            verified: false,
            code: null,
            unauthorizeAttempt: new Date().toISOString(),
            unauthorizedData: req.session.signinAttemp,
        });
        await unauthorizeSigninAttempt(email, data.name, req.session.signinAttemp)
        req.session.signinAttemp = [];
        res.status(404).json({
            alert: {
                text: 'Unauthorized signin attempted. This account will be block for 24 hours.',
                type: 'danger'
            }   
        });
        return;
    }
    
    const shouldAuthenticated = await hashCompare(password, data.password);
    if(!shouldAuthenticated) {
        let attempt = req.session.signinAttemp;
        let date = new Date();
        attempt.push({
            type: 'Login attempted',
            desc: 'Incorrect password',
            date: date.toDateString(),
            time: date.toTimeString(),
        })

        res.status(404).json({
            alert: {
                text: 'Password is incorrect',
                type: 'danger'
            }   
        });
        return;
    }
    //stored the signined time to the new collection signed
    //create jwt tokn
    const token = jwt.sign({
        uid: data.id,
        email: email,
        name: data.name,
    }, process.env.JWT_SECRET)

    req.session.user = token;
    req.session.signinAttemp = [];
    res.status(200).json({
        signIn: true,
        alert: {
            text: 'Sign in successfully',
            type: 'success'
        }        
    })
})

exports.signin = signin;