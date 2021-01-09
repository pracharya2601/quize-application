const {db} = require("../../models/googlefirestore");
var jwt = require('jsonwebtoken');

const getSingleQuize = async (req, res, next) => {
    if(!req.session.user) {
        req.status(200).json({
            signIn: false,
            user: {},
        })
        return;
    }
    const quizeSlug = req.params.quizeSlug;
    const token = req.session.user;
    const decoded = jwt.verify(token, "user_world");

    const userRef = db.collection('users').doc(decoded.uid);
    const quizeRef = db.collection('quizes').doc(quizeSlug);

    const get_quize = async () => {
        const doc = await quizeRef.get();
        if(!doc.exists) {
            return;
        } else {
            return doc.data();
        }

    }
    //check the validation before procedding
    //update opended to true
    //start time here for answering questions
    // validate time while submit answer
    try {
        const quize = await get_quize();
        await userRef.collection('quizes_subcollection')
        .doc(quizeSlug)
        .update({
            opened: true, 
            date: new Date(new Date().getTime() + 60000)
        }); 
        //while submit the answer check the data and satisfy the needs
        res.status(200).json({
            quize: {
                question: quize.question,
                options: quize.options,
                level: quize.level,
            }
        })
    }catch {
        res.status(200).json({error: "Something went wrong Please try again later"});
    }   



}


exports.getSingleQuize = getSingleQuize;