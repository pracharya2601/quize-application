const {db} = require("../../models/googlefirestore");
var jwt = require('jsonwebtoken');
const { sendQuizeStartMesssage } = require("../../utils/mailing-service");
const {getTodayDate} = require('../../utils/getTodayDate');

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
    if(data.dailyTotalPlay >= 5) {
        res.status(400).json({error: 'Your already used your daily limit'});
        return;
    }

    //check the quize_lot sub_collection
    let alreadyStartedQuize = [];
    try {
        alreadyStartedQuize = await check_started_quize(userRef);
    } catch {
        res.status(400).json({error: 'Error occured while acessing updated quize'});
        //send notification to admin
        return;
    }

    //already processed quize lot id
    if(alreadyStartedQuize.length > 0) {
        //get all the remaining quize
        let allStartedQuizes = alreadyStartedQuize[0].quizes;

        //get finished updated quize
        let startedquizeLot = [];

        try {
            startedquizeLot = await get_finished_quize(userRef);
        } catch (e) {
            res.status(500).json({error: "Error getting user quize started list"});
            //send notification to admin
            return;
        }
        console.log(startedquizeLot)

        //filter with the finished quize 
        const remainingQuizeOnLot = allStartedQuizes.filter((quize) => !startedquizeLot.includes(quize));
        console.log(remainingQuizeOnLot)
        res.status(200).json({
            quizes: remainingQuizeOnLot,
            message: "You can start quize now"
        })
        return;
    }


    //generate random index
    //write function for to check the lotid xist or not o lots and return it

    let newQuizeLot;
    try{
        newQuizeLot = await get_new_lot(userRef);
    }catch {
        res.status(500).json({error: "Error getting user quize lot list"});
        //send notification to admin
        return;
    }

    if(!newQuizeLot) {
        res.status(500).json({error: "Error getting user quize lot list"});
        //send notification to admin
        return;
    }

    let quizes = [];
    try {
        quizes = await get_quize(newQuizeLot);
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
    console.log(quizes);
    try {
        await userRef.collection('quize_lots').doc(newQuizeLot).set({
            completed: false,
            date: new Date().toISOString(),
            point: 0,
            totalanswered: 0,
            totalopened: 0,
            quizes: quizes
        })
        await userRef.update({
            dailyTotalPlay: data.dailyTotalPlay + 1,
            playedAt: new Date(Date.now()) //24 hours added

        })
        res.status(200).json({
            quizes: quizes,
            message: "You can start quize now"
        })
        return sendQuizeStartMesssage(data.email);
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
            dailyTotalPlay: doc.data().dailyTotalPlay,
            email: doc.data().email,
        }
    }
}

const check_started_quize = async(userRef) => {
    let startedQuize = [];
    let docRef = await userRef
        .collection('quize_lots')
        .where('completed', '==', false)
        .get();
    if(docRef.empty) {
        return startedQuize;
    }
    docRef.forEach((doc) => {
        startedQuize.push({quizes: doc.data().quizes})
    })
    return startedQuize;
}

const get_new_lot = async (userRef) => {
    let x = 10 //can change to any number
    // let num = Math.floor(Math.random()* x) + 1;
    const num = "02"

    let docRef = await userRef
        .collection('quize_lots')
        .doc(num)
        .get();
    if(docRef.exists) {
        return get_new_lot(userRef);
    } else {
        return num;
    }
}

const get_quize = async (lotId) => {
    let newQuize = [];
    let snapShot = await db
        .collection('quize_question')
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

const get_finished_quize = async (userRef) => {
    let quizes = [];
    let snapShot = await userRef
        .collection('quize_progess')
        .where('opened', '==', true) //only get the quize that is not opened
        .where('availableOn', '==', getTodayDate())
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