const {db} = require("../../models/googlefirestore");
var jwt = require('jsonwebtoken');
const { DocumentSnapshot } = require("@google-cloud/firestore");

const levelData = {
    I : 1,
    II: 2,
    III: 4,
    IV: 8,
    V: 16,
    VI: 32,
    VII: 64,
    VIII: 128,
    IX: 256,
    X: 512,
    XI: 1024,
    XII: 2038,
    XIII: 4096
}

const submitAnswer = async (req, res, next) => {
    if(!req.session.user) {
        req.status(200).json({
            signIn: false,
            user: {},
        })
        return;
    }
    const {ans} = req.body;
    const {quizeSlug} = req.params;
    const newTime = new Date().getTime();
    const token = req.session.user;
    const decoded = jwt.verify(token, "user_world");

    const userRef = db
        .collection('users')
        .doc(decoded.uid);

    let info;
    try{
        info = await get_time_lot(userRef, quizeSlug);
    }catch{
        res.status(400).json({error: 'Server error please try again later'});
        //send notification to admin
        return;
    }

    if(info.date < newTime) {
        //update points here
        let point = 0;
        user_quize_update(userRef, quizeSlug, "timeout", ans, point)
        res.status(200).json({message: 'Timeout on submit'});
        return;
    }

    let data = '';
    try {
       data = await get_quize_info(quizeSlug);
    } catch(e) {
        console.log(e)
        res.status(400).json({error: 'Server error please try again later'});
        //send notification to admin
        return;
    }

    if(data.answer !== ans.trim()) {
        //update everything here
        let point = 0;
        user_quize_update(userRef, quizeSlug, "incorrect", ans, point)
        res.status(200).json({message: 'Your answer is incorrect'});
        return;
    }

    const point = levelData[data.level];
    //check the number of submited answer and send the email abif it is 13
    try {
        //add a point here once the answer is correct
        await update_point(userRef, point);
        await update_on_quize_lot(userRef, info.lotId, point);
        await user_quize_update(userRef, quizeSlug, "correct", ans, point)
        res.status(200).json({
            message: 'Your answer is correct',
            point: point
        });

    } catch {
        res.status(400).json({error: 'Something went wrong please try again later'})
    }

}

const get_time_lot = async (userRef, quizeSlug) => {
    const doc = await userRef
        .collection('quize_progess')
        .doc(quizeSlug)
        .get();
    if(!doc.exists) {
        return;
    } else {
        return {
            date: doc.data().date,
            lotId: doc.data().lotId,
        }
    }
}
const update_point = async (userRef, point) => {
    let doc = await userRef.get();
    return await userRef
        .update({totalpoints: doc.data().totalpoints + point});
}

const get_quize_info = async (quizeSlug) => {
    const data = [];
    const snapshot = await db
        .collection('quize_credential')
        .where('qid', '==', quizeSlug)
        .get();
    if(snapshot.empty) {
        return;
    } 
    snapshot.forEach((doc) => {
        data.push(doc.data());
    })
    return data[0];
}

const user_quize_update = async (userRef, slug,  status, answer, point) => {
    return await userRef
        .collection('quize_progess')
        .doc(slug)
        .set({
            date: new Date().toISOString(),
            status: status,
            youranswer: answer,
            point: point
        }, {merge: true})
}

const update_on_quize_lot = async (userRef, lotId, point) => {
    const ref = userRef
        .collection('quize_lots')
        .doc(lotId);
    
    const doc = await ref.get();

    const new_number = doc.data().totalanswered + 1

    return await ref.update({
        point: doc.data().point + point,
        totalanswered: new_number,
    })

    
}

exports.submitAnswer = submitAnswer;

