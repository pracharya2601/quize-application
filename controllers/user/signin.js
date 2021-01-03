
const HttpError = require('../../models/http-error');
const {getUser} = require('../../models/get-user');
const {hashCompare} = require("../../models/hash-password");

const signin = async (req, res, next) => {
    const {
        email,
        password,
    } = req.body;

    const user = await getUser(email);
    if(!user) {
        throw new HttpError("User not found", 400);
    }

    //checking hash Pass
    const truePassword = hashCompare(user[0].password, password);


    //create session cookine
    //create jwt token

    //send it to the user

    if(!truePassword) {
        throw new HttpError("Incorrect password", 400);
    }
    
    res.status(200).json(user);
}

exports.signin = signin;