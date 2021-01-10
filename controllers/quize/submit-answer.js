const {db} = require("../../models/googlefirestore");
var jwt = require('jsonwebtoken');

const pointData = {
    "easy": 3,
    "medium": 4,
    "hard": 5,
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
    const newDate = new Date().getTime();
    const token = req.session.user;
    const decoded = jwt.verify(token, "user_world");

    const userRef = db
        .collection('users')
        .doc(decoded.uid);

    let data;
    try {
       data = await get_user_sub_colletion_quize(userRef, quizeSlug);
    } catch {
        res.status(400).json({error: 'serverside error please try again later'})
        return;
    }

    if(data.date < newDate) {
        //update points here
        let point = 0;
        user_quize_update(userRef, quizeSlug, "timeout", ans, point)
        res.status(200).json({message: 'Timeout on submit question'});
        return;
    }

    if(data.correct_answer !== ans.trim()) {
        //update everything here
        let point = 0;
        user_quize_update(userRef, quizeSlug, "incorrect", ans, point)
        res.status(200).json({message: 'Your answer is incorrect'});
        return;
    }
    const point = pointData[data.level];
    try {
        //add a point here once the answer is correct
        await update_point(userRef, point);
        await user_quize_update(userRef, quizeSlug, "correct", ans, point)
        res.status(200).json({message: 'Your answe is correct'});

    } catch {
        res.status(400).json({error: 'Something went wrong please try again later'})
    }

}

const update_point = async (userRef, point) => {
    let doc = await userRef.get();
    return await userRef
        .update({totalpoints: doc.data().totalpoints + point});
}

const get_user_sub_colletion_quize = async (userRef, quizeSlug) => {
    const doc = await userRef
        .collection('quizes_subcollection')
        .doc(quizeSlug)
        .get();
    
    return doc.data();
}

const user_quize_update = async (userRef, slug,  status, answer, point) => {
    return await userRef
        .collection('quizes_subcollection')
        .doc(slug)
        .set({
            opened: true,
            date: new Date().toISOString(),
            valid: false,
            status: status,
            youranswer: answer,
            point: point
        }, {merge: true})
}

exports.submitAnswer = submitAnswer;