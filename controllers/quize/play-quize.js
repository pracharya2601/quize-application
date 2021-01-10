const {db} = require("../../models/googlefirestore");
var jwt = require('jsonwebtoken');
const playQuize = async (req, res, next) => {
    if(!req.session.user) {
        req.status(200).json({
            signIn: false,
            user: {},
        })
        return;
    }
    const token = req.session.user;
    const decoded = jwt.verify(token, "user_world");

    const userRef = db.collection('users').doc(decoded.uid);
    const alreadyUpdatedQuize = await process_quize(userRef, false);
    if(alreadyUpdatedQuize.length > 0) {
        res.status(200).json({
            quizes: alreadyUpdatedQuize,
            message: "You can start quize now"
        })
        return;
    }

    let notNeededQuize = [];
    try {
        notNeededQuize = await process_quize(userRef, true);
    }catch {
        res.status(500).json({error: "Error getting user"});
        return;
    }

    let bulkQuizes = [];
    try {
        bulkQuizes = await get_quize();
    }catch {
        res.status(500).json({error: "Error getting bulk quize"});
        return;
    }
    console.log("bulk", bulkQuizes);
    const filteredQuize = bulkQuizes.filter((item) => !notNeededQuize.includes(item));
    console.log('filtered',filteredQuize);

    try {
        filteredQuize.forEach(async(quize) => {
            return await userRef
                .collection('quizes_subcollection')
                .doc(quize)
                .set({
                    qid: quize,
                    opened: false,
                    valid: true,                         
            })
        })
        //send email or message to the user
        //need to work on this
        res.status(200).json({
            quizes: filteredQuize,
            message: "You can start quize now"})
    } catch {
        res.status(500).json({error: "Server error please try again later"})
    }
}

const process_quize = async (userRef, boolvalue) => {
    let quizes = [];
    let docRef = await userRef
        .collection('quizes_subcollection')
        .where('opened', '==', boolvalue)
        .get();
    if(docRef.empty) {
        return quizes;
    }
    docRef.forEach((doc) => {
        quizes.push(doc.id);
    })
    return quizes; 
}

const get_quize = async () => {
    let newQuize = [];
    //need to work on this algorithm
    let docRef = await db
        .collection('quizes')
        .get();
    docRef.forEach((doc) => {
        newQuize.push(doc.id)
    })
    return newQuize;
}

exports.playQuize = playQuize;