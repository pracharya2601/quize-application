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

    //check daily total value and accessPlay on user fields
    let data;
    try {
        data = await get_user_val(userRef);
    } catch {
        res.status(400).json({error: 'error occured while playing quize'})
        //send notification to admin play quize error occured
        return;
    }
    
    if(!data.accessPlay && data.dailyTotalPlay >= 5) {
        res.status(400).json({error: 'Your already used your daily total'});
        return;
    }

    //check the quize_lot sub_collection
    let alreadyUpdatedQuize = [];
    try {
        alreadyUpdatedQuize = await process_quize_lot(userRef, false);
    } catch {
        res.status(400).json({error: 'Error occured while acessing updated quize'});
        //send notification to admin
        return;
    }

    //already processed quize lot id
    if(alreadyUpdatedQuize.length > 0) {
        //get all the remaining quize
        //return not opened quize only
        let startedquizeLot = [];
        try {
            startedquizeLot = await get_updated_quize(userRef);
        } catch (e) {
            res.status(500).json({error: "Error getting user quize started list"});
            //send notification to admin
            return;
        }

        if(startedquizeLot.length === 0) {
            //update status of this quize lot is competed to false working on it
            res.status(500).json({error: "Quize not found please try again later"});
            //send notification to admin
            return;
        }

        res.status(200).json({
            quizes: startedquizeLot,
            message: "You can start quize now"
        })
        return;
    }

    let avoidQuize = [];
    try{
        avoidQuize = await process_quize_lot(userRef, true);
    }catch {
        res.status(500).json({error: "Error getting user quize lot list"});
        //send notification to admin
        return;
    }
    
    //generate random id not available on avoid Quize 
    //but should match id from quize collection where lotId is, 

    // const randomQuizeLot = generate_random_num(avoidQuize);
    const randomQuizeLot = `01`;
    let quizes = [];
    try {
        quizes = await get_quize(randomQuizeLot);
    }catch {
        res.status(500).json({error: "Error getting bulk quize"});
        return;
    }

    //check the length of the quizes
    if(quizes.length === 0) {
        res.status(500).json({error: "Quize not found please try again later"});
        //send notification to admin
        return;
    }

    //update to quizesubcollection
    try {
        await userRef.collection('quize_lots').doc(randomQuizeLot).set({
            completed: false,
            date: new Date().toISOString(),
            point: 0,
            totalanswered: 0
        })
        quizes.forEach(async(item) => {
            return await userRef
                .collection('quize_progess')
                .doc(item)
                .set({
                    valid: true,
                    opened: false,
                })
        })
        res.status(200).json({
            quizes: quizes,
            message: "You can start quize now"
        })
    }catch {
        res.status(500).json({error: "Server error please try again later"})
    }
}

//get user information
const get_user_val = async (userRef) => {
    let doc = await userRef.get();
    if(!doc.exists) {
        return;
    } else {
        return {
            accessPlay: doc.data().accessPlay,
            dailyTotalPlay: doc.data().dailyTotalPlay,
        }
    }
}

const process_quize_lot = async (userRef, boolvalue) => {
    let lotIds = [];
    let docRef = await userRef
        .collection('quize_lots')
        .where('completed', '==', boolvalue)
        .get();
    if(docRef.empty) {
        return lotIds;
    }
    docRef.forEach((doc) => {
        lotIds.push(doc.id);
    })
    return lotIds; 
}

const generate_random_num = (arr) => {
    let x = 10 //can change to any number
    let num = Math.floor(Math.random()* x) + 1;
    if(arr.includes(`${num}`)) {
        return generate_random_num(arr);
    } else {
        return num;
    }
}


const get_quize = async (lotId) => {
    let newQuize = [];
    let snapShot = await db
        .collection('quizes')
        .where('lotId', '==', lotId)
        .get();
    if(snapShot.empty) {
        return newQuize;
    }

    snapShot.forEach((doc) => {
        newQuize.push(doc.id)
    })
    return newQuize;
}

const get_updated_quize = async (userRef) => {
    let quizes = [];
    let snapShot = await userRef
        .collection('quize_progess')
        .where('opened', '==', false) //only get the quize that is not opened
        .get();
    if(snapShot.empty) {
        return quizes;
    }
    snapShot.forEach((doc) => {
        quizes.push(doc.id)
    })
    return quizes;
}
exports.playQuize = playQuize;