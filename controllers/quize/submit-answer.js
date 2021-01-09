const {db} = require("../../models/googlefirestore");
var jwt = require('jsonwebtoken');

const submitAnswer = async (req, res, next) => {
    if(!req.session.user) {
        req.status(200).json({
            signIn: false,
            user: {},
        })
        return;
    }
    const {ans} = req.body;
    const newDate = new Date.getTime();
    const token = req.session.user;
    const decoded = jwt.verify(token, "user_world");
    const userRef = db.collection('users').doc(decoded.uid);
    const quizeRef = db.collection('quizes').doc(quizeSlug);

    
    const user_quize_update = async (status, answer) => {
        let doc =  await userRef.collection('quizes_subcollection').doc(quize).update({
            submitted: true,
            answered: true,
            checking: false,
            valid: false,
            expired: true,
            status: status,
            youranswer: answer
        })
        return doc;
    }
    const get_quize_ans = async () => {
        const doc = await quizeRef.get();
        if(!doc.exists) {
            return;
        } else {
            return doc.data().answer;
        }
    }

    try {
        const doc = await userRef
            .collection('quizes_subcollection')
            .doc(quizeSlug);
        if(!doc.exists) {
            return;
        }
        if(doc.data().date !== newDate) {
            user_quize_update("timeout", ans)
            res.status(200).json({message: 'Timeout'});
            return;
        }
    } catch {
        res.status(200).json({message: 'Timeout before submission'});
    }

    try {
        let quizeAnswer = await get_quize_ans();

        if(quizeAnswer === ans) {
            user_quize_update("correct", ans)
            res.status(200).json({message: 'Your answer is correct'});
        }
    }catch {
        res.status(200).json({message: 'Your answer is correct'});
    }

}

exports.submitAnswer = submitAnswer;