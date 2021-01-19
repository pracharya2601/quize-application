const {db} = require("../../models/googlefirestore");
const {getTodayDate} = require('../../utils/getTodayDate');
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

    let options;
    try {
        options = await get_option(quizeSlug);
    } catch {
        console.log("Error getting options")
        res.status(500).json({error: "Something went wrong Please try again later"});
        return;
    }
    if(!options) {
        console.log("Error on console")
        res.status(500).json({error: "Something went wrong Please try again later"});
        return;
    }

    let data;
    try {
        data = await get_quize(quizeRef)
    } catch {
        console.log('Error gettinh quize')
        res.status(500).json({error: "Something went wrong Please try again later"});
    }

    if(!data) {
        console.log("Error no quize data")
        res.status(500).json({error: "Something went wrong Please try again later"});
        return;
    }

    let totalOpened;
    try {
        totalOpened = await get_lots(userRef, data.lotId);
    } catch {
        console.log("Error gettinh lot data data")
        res.status(500).json({error: "Something went wrong Please try again later"});
        return;
    }

    if(!totalOpened) {
        console.log("Error on  lot data")
        res.status(500).json({error: "Something went wrong Please try again later"});
        return;
    }

    try {
        await userRef.collection('quize_progess')
        .doc(quizeSlug)
        .set({
            opened: true, 
            lotId: data.lotId,
            date: new Date().getTime() + 60000, //1 minute
            availableOn: getTodayDate()
        }); 
        await userRef.collection('quize_lots')
        .doc(data.lotId)
        .update({
            totalopened: totalOpened,
            completed: totalOpened === 13 ? true: false
        })
        
        //while submit the answer check the data and satisfy the needs
        res.status(200).json({
            quize: data.question,
            options: options.option,
            qid: quizeSlug,
        })
    }catch {
        console.log("last round")
        res.status(500).json({error: "Something went wrong Please try again later"});
    }   
}

const get_lots = async (userRef, lotId) => {
    const lotRef = userRef
        .collection('quize_lots')
        .doc(lotId);
    const doc = await lotRef.get();

    if(!doc.exists) {
        return;
    } else {
        return doc.data().totalopened + 1;
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
const get_option = async (slug) => {
    let options = []
    const optionRef = db.collection('quize_option')
    const option = await optionRef.where('qid', '==', slug).get();
    option.forEach((doc) => {
        options.push(doc.data());
    })

    if(option.length == 0) {
        return;
    }
    else {
        return {
            option: options[0].options
        }
    }

}


exports.getSingleQuize = getSingleQuize;