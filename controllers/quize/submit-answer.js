const decodedToken = require('../../utils/decodedToken');
const subcollection = require("../../common/subcollection");
const subcollectionupdate = require("../../common/subcollectionupdate");
const wrap = require("../../middleware/wrap");
const {singleQuery} = require('../../common/collectionSnap');
const { updateEarnedPoints } = require("../../utils/play-quize-helper");
const { level } = require('../../utils/quize-level')


const submitAnswer = wrap(async(req, res, next) => {
    if(!req.session.user) {
        res.status(200).json({
            signIn: false,
            user: {},
        })
        return;
    }
    const quizeSlug = req.params.quizeSlug;
    const ans = req.body.ans;
    const newTime = new Date().getTime();
    const token = req.session.user;
    const decoded = decodedToken(token);
    const userId = decoded.uid;

    const progessQuize = await subcollection('users', userId, 'quize_progess', quizeSlug);
    if(progessQuize.date < newTime) {
        let point = 0;
        await subcollectionupdate('users', userId, 'quize_progess', quizeSlug, {
            date: new Date().toISOString(),
            status: 'timeout',
            youranswer: ans,
            point: point,
        })
        res.status(400).json({
            alert: {
                text: 'Time out! You got 0 point',
                type: 'danger'
            }
        })
        return;
    }
    let quizeCredential = await singleQuery('quize_credential', 'qid', quizeSlug, true);
    if(quizeCredential.answer !== ans.trim()) {
        let point = 0;
        await subcollectionupdate('users', userId, 'quize_progess', quizeSlug, {
            date: new Date().toISOString(),
            status: 'incorrect',
            youranswer: ans,
            point: point,
        })
        res.status(400).json({
            alert: {
                text: 'Incorrect answer',
                type: 'danger'
            }
        })
        return;
    }
    const newDate = new Date().toISOString();
    const point = level[quizeCredential.level];
    const data = await subcollection('users', userId, 'quize_lots', progessQuize.lotId);
    await updateEarnedPoints(userId, point);
    await subcollectionupdate('users', userId, 'quize_lots', progessQuize.lotId, {
        point: data.point + point,
    });
    let dataId = await subcollectionupdate('users', userId, 'quize_progess', quizeSlug, {
        date: newDate,
        status: 'correct',
        youranswer: ans,
        point: point,
    })
    res.status(200).json({
        point: {
            id: dataId,
            point: point,
            date: newDate,
            status: 'correct'

        },
        alert: {
            text: `Correct answer! You got +${point} points.`,
            type: 'success'
        }
    })

})

exports.submitAnswer = submitAnswer;