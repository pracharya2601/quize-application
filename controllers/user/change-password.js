const wrap = require('../../middleware/wrap');
const decodedToken = require('../../utils/decodedToken');
const {validationResult} = require("express-validator");
const {hashPass, hashCompare} = require("../../utils/hash-password");
const {passChangedEmail} = require("../../utils/mailing-service");
const collectionupdate = require('../../common/collectionupdate');
const collection = require('../../common/collection');
const subcollectionadd = require('../../common/subcollectionadd');

const changePassword = wrap(async (req, res, next) => {
    if(!req.session.user) {
        res.status(200).json({
            signIn: false,
            user: {},
        })
        return;
    }
    const {
        lastpass,
        newpass
    } = req.body;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(400).json(errors);
        return;
    }
    
    if(lastpass === newpass) {
        res.status(400).json({error: 'Something went wrong please try again later'});
        return;
    }

    const token = req.session.user;
    const decoded = decodedToken(token);
    const userId = decoded.uid;
    const hash = await hashPass(newpass);

    const data = await collection('users', userId);
    const passMatch = await hashCompare(lastpass, data.password);
    if(!passMatch) {
        res.status(404).json({
        alert: {
            text: 'Old password is not correct',
            type: 'danger'
        } 
    });
        return;
    }

    //update to usercollection
    await collectionupdate('users', userId, {password: hash})
    //update to passhistory collection
    await subcollectionadd('users', userId, 'pass_history', {
        password: hash,
        createdAt: new Date().toISOString(),
        lastpass: true,
    })
    //send email to user about password change
    await passChangedEmail(data.email);

    res.status(200).json({
        alert: {
            text: 'Your password has been channged',
            type: 'primary'
        } 
    });
})

exports.changePassword = changePassword;