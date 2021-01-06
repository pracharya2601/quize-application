const {db} = require("../../models/googlefirestore");
const {hashCompare} = require("../../models/hash-password");
var jwt = require('jsonwebtoken');

const signin = async (req, res, next) => {
    const {
        email,
        password,
    } = req.body;

    // let userCollection = db.collection('users');
    // let userRef = await userCollection.where('email', '==', email).get();
    // if(userRef.empty) {
    //     res.status(404).json({error: "User not found"});
    //     return;
    // }
    // let uid = userRef.docs[0].id;
    // let hash = userRef.docs[0].data().password;
    // let shouldAuthenticated = hashCompare(password, hash);
    // if(!shouldAuthenticated) {
    //     res.status(404).json({error: "Credential is invalid"});
    //     return;
    // }
    //create jwt tokn
    // const token = jwt.sign({
    //     uid: password,
    //     email: email,
    // }, "user_world")
    
    req.session.user = password;
    
    res.status(200).json({
        signedIn: true,
    })
}


exports.signin = signin;