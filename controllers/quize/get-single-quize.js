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

    const userRef = db
        .collection('users')
        .doc(decoded.uid);

    const quizeRef = db
        .collection('quize_question')
        .doc(quizeSlug);
    
    try {
        const data = await get_quize(quizeRef);
        await userRef.collection('quize_progess')
        .doc(quizeSlug)
        .set({
            opened: true, 
            lotId: data.lotId,
            date: new Date().getTime() + 60000, //1 minute
        }); 
        //while submit the answer check the data and satisfy the needs
        res.status(200).json({
            quize: {
                question: data.question,
            }
        })
    }catch {
        res.status(500).json({error: "Something went wrong Please try again later"});
    }   
}

const get_quize = async (quizeRef) => {
    const doc = await quizeRef.get();
    if(!doc.exists) {
        return;
    } else {
        return {
            question: doc.data().question,
            lotId: doc.data().lotId,
        }
    }
}


exports.getSingleQuize = getSingleQuize;