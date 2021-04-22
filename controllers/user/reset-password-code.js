const wrap = require('../../middleware/wrap');
const {validationResult} = require("express-validator");
const {hashPass} = require("../../models/hash-password");
const {sendTemporaryPass} = require("../../utils/mailing-service");
const randomGenerator = require('../../utils/randomGenerator');
const collectionupdate = require('../../common/collectionupdate');

const resetPasswordCode = wrap(async (req, res, next) => {
    const {email} = req.body;
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        res.status(400).json(errors);
        return;
    }
    const data =  await singleQuery('users', 'email', email, true);
    if(!data) {
        res.status(400).json({error: 'User not found'});
        return;
    }

    //generate temporary password
    const newPass = randomGenerator(7);
    const hash = await hashPass(newPass);
    await collectionupdate('users', data.id, {
        password: hash,
        verified: true,
    })
    await sendTemporaryPass(email, newPass);
    //send message to the user
    res.status(200).json({
        message: `We sent you a temporary passsword on your email`,
    });


})

exports.resetPasswordCode = resetPasswordCode;