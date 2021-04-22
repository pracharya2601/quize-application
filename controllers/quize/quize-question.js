const {getTodayDate} = require('../../utils/getTodayDate');
const decodedToken = require('../../utils/decodedToken');
const wrap = require("../../middleware/wrap");
const collection = require('../../common/collection');
const subcollection = require('../../common/subcollection');
const subcollectionupdate = require('../../common/subcollectionupdate');
const { time } = require('../../utils/quize-level');
const shuffle = require('../../utils/shuffle');

const quizeQuestion = wrap(async (req, res) => {
    if(!req.session.user) {
        res.status(200).json({
            signIn: false,
            user: {},
        })
        return;
    }
    const quizeSlug = req.params.quizeSlug;
    const token = req.session.user;
    const decoded = decodedToken(token);
    const userId = decoded.uid;

    const quizeData = await collection('quizes', quizeSlug);
    const lot = await subcollection('users', userId, 'quize_lots', quizeData.lotId);
    const totalOpened = lot.totalopened + 1;
    await subcollectionupdate('users', userId, 'quize_progess', quizeSlug, {
        opened: true,
        lotId: quizeData.lotId,
        date: new Date().getTime() + 60000, // 1 minute
        availableOn: getTodayDate(),
    });
    await subcollectionupdate('users', userId, 'quize_lots', quizeData.lotId, {
        totalopened: totalOpened,
        completed: totalOpened === 10 ? true: false,
    })
    res.status(200).json({
        quize: {
            question: quizeData.question,
            options: shuffle(quizeData.options),
            qid: quizeSlug,
            time: Math.floor(Math.random() * (1 + 60 - 40)) + 40,
            level: quizeData.level ? quizeData.level : 'level'
        },
        alert: {
            text: 'You have 60 second to submit answer',
            type: 'success'
        }
    })

})

exports.quizeQuestion = quizeQuestion;