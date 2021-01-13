const {validationResult} = require("express-validator");
const {db} = require("../../models/googlefirestore");
const {hashPass} = require("../../models/hash-password");
// const {sendSignUpMessage} = require("../../utils/mailing-service");
const signup = async(req, res, next) => {
    const {
        email,
        password,
        name,
    } = req.body;
    const errors = validationResult(req);
    const hash = await hashPass(password);
    //generate random number to pass on databas and email
    const code = Math.floor(100000 + Math.random() * 900000);
    // const mg = new Mailgun({apiKey: api_key, domain: DOMAIN});
    if(!errors.isEmpty()) {
        res.status(400).json(errors);
        return;
    }
    try{
        let resUser = await db.collection('users').add({
            email,
            password: hash,
            name,
            number: '',
            verified: false,
            code: code, // random number genrate to send it to user
            address: {
                address:'',
                city: '',
                state: '',
                zip: '',
            },
            createdAt: new Date().toISOString(),
            totalpoints: 0,
            accessPlay: true,
            dailyTotalPlay: 0,
            //totalPoints here frorm adding the points from points subcollections

            //add they play quize today or not check 
        })
        //send the email to user with code
        // await sendSignUpMessage( "pracharya2601@gmail.com", "123123");
        //verify with phonw number
    
        //send mail
    
        res.status(200).json({
            message: `user has been created ${resUser.id}`,
        
        });
    } catch (e) {
        res.status(403).json({
            error: `Something went wrong`,
        
        });
    }
}

exports.signup = signup;