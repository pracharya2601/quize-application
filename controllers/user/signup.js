const bcrypt = require('bcryptjs');
const {db} = require("../../models/googlefirestore");
const {hashPass} = require("../../models/hash-password");
const {sendSignUpMessage} = require("../../utils/mailing-service");

const signup = async(req, res, next) => {
    const {
        email,
        password,
        name,
    } = req.body;

    const hash = hashPass(password);
   
    try{
        let userCollection = db.collection('users');
        let userRef = await userCollection.where('email', '==', email).get();
        if(!userRef.empty) {
            res.status(500).json({error: 'Email already exist'});
            return;
        }
        setUser(res, email, hash, name);
    } catch(e) {
        res.status(500).json({error: 'Email already exist'});
    }
}

async function setUser(res, email, password, name) {
    //generate random number to pass on databas and email
    const code = Math.floor(100000 + Math.random() * 900000);
    try{
        let resUser = await db.collection('users').add({
            email,
            password,
            name,
            verified: false,
            code: code, // random number genrate to send it to user
            adddress: {
                address:'',
                city: '',
                state: '',
                zip: '',
            }
        })
        //send the email to user with code
        await sendSignUpMessage( email, code);
        res.status(200).json({
            message: `user has been created ${resUser.id}`,
        
        });
    }catch {
        res.status(500).json({error: 'Database erro send email to admin'});
    }

}

exports.signup = signup;