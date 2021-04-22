const wrap = require('../../middleware/wrap');
const {validationResult} = require("express-validator");
const {sendVerifiedMessage} = require("../../utils/mailing-service");
const collection = require('../../common/collection');
const subcollectionupdate = require('../../common/subcollectionupdate');
const collectionupdate = require('../../common/collectionupdate');
const {multipleQuery} = require('../../common/collectionSnap');

const verifyUser = wrap(async (req, res, next) => {
    const{
        verificationcode,
    } = req.body;
    const verifyEmail = req.query.verifyEmail;
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        res.status(400).json(errors);
        return;
    }
    const data =  await multipleQuery('users', 'email', verifyEmail, 'verified', false, true);
    if(!data) {
        res.status(400).json({
            alert: {
                text: 'Server error',
                type: 'warning'
            } 
        })
        return;
    }
    if(data.code != parseInt(verificationcode) ) {
        res.status(400).json({
            alert: {
                text: 'Verification error',
                type: 'danger'
            } 
        })
        return;
    }
    const verify = {
        verified: true,
        dailyTotalPlay: 0,
    }
    const userDetailData = {
        address: {
            address: '',
            city: '',
            state: '',
            zip: ''
        },
        age : '',
        citizenship: '',
        language: '',
        number: '',
        passport: ''
    }
    await collectionupdate('users', data.id, verify);
    await subcollectionupdate('users', data.id, 'user_data', 'detail', userDetailData);
    await sendVerifiedMessage(verifyEmail);

    res.status(200).json({
        alert: {
            text: 'Email Verified',
            type: 'success'
        } 
    })
})

exports.verifyUser = verifyUser;