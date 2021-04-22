const { sendQuizeStartMesssage } = require("../../utils/mailing-service");
const {singleSubcollectionQuery} = require("../../common/subcollectionSnap");
const { randomLot, quizeList, getOpenedQuize, usedLots} = require("../../utils/play-quize-helper");
const decodedToken = require('../../utils/decodedToken');
const wrap = require("../../middleware/wrap");
const collection = require("../../common/collection");
const subcollectionupdate = require("../../common/subcollectionupdate");
const collectionupdate = require("../../common/collectionupdate");

const playQuize = wrap(async(req, res, next) => {
    if(!req.session.user) {
        res.status(200).json({
            signIn: false,
            user: {},
        })
        return;
    }
    const token = req.session.user;
    const decoded = decodedToken(token);
    const userId = decoded.uid;

    const data = await collection('users', userId);
    if(data.dailyTotalPlay >= 5) {
        res.status(400).json({
            alert: {
                text: 'You played the daily maximum',
                type: 'warning'
            }
        })
        return;
    }
    const startedQuize = await singleSubcollectionQuery('users', userId, 'quize_lots', 'completed', false, '', 1, true);
    if(startedQuize) {
        const openedQuize = await getOpenedQuize(userId);
        const leftoverFilter = startedQuize.quizes.filter((quize) => !openedQuize.includes(quize));
        res.status(200).json({
            quizes: leftoverFilter,
            alert: {
                text: 'You can start now',
                type: 'success'
            }
        })
        return;
    }
    const usedLotsArr = await usedLots(userId);
    const randomnumber = randomLot(usedLotsArr);
    const quizeIdList = await quizeList(randomnumber);
    await subcollectionupdate('users', userId, 'quize_lots', randomnumber, {
        completed: false,
        date: new Date().toISOString(),
        point: 0,
        totalopened: 0,
        quizes: quizeIdList,
    })
    await collectionupdate('users', userId, {
        dailyTotalPlay: data.dailyTotalPlay + 1,
    })
    res.status(200).json({
        quizes: quizeIdList,
        alert: {
            text: 'You can start playing quize now',
            type: 'success'
        }
    })
    return await sendQuizeStartMesssage(data.email);
})

exports.playQuize = playQuize;
