
const {getUser} = require('../../models/get-user');
const {setUser} = require("../../models/set-user");
const {hashPass} = require("../../models/hash-password");
const HttpError = require('../../models/http-error');

const signup = async(req, res, next) => {
    const {
        email,
        password,
        name,
    } = req.body;

   
    try{
        const user = await getUser(email);
        if(user) {
            throw new HttpError("Email exist email", 404);
        }
        //password hash
        const hashedPassword = hashPass(password)
        const addUser = await setUser(email, hashedPassword, name);
        if(!addUser) {
            throw new HttpError("Something went wrong", 404);
        }

        res.status(200).json({
            message: `User created ${addUser}`
        });
    } catch(e) {
        // throw new HttpError(e, 404);
       console.log(e)
    }
}

exports.signup = signup;