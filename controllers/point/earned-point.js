const { singleSubcollectionQuery } = require("../../common/subcollectionSnap");
const wrap = require("../../middleware/wrap");
const decodedToken = require("../../utils/decodedToken");

const earnedPoint = wrap(async(req, res, next) => {
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

    const limit = 10;
    const after = req.query.after;

    const dataLists = await singleSubcollectionQuery('users', userId, 'quize_progess', 'status', 'correct', after, limit, false);
    if(dataLists.length === 0) {
        res.status(200).json({
            data: {
                nextPage: '',
                pointearnhistory: []
            },
            alert: {
                text: 'No earned data',
                type: 'success'
            }
        })
        return;
    }
    const data = dataLists.map(({id, date, point, status}) => ({id, date, point, status : `${status} answer`}));
    res.status(200).json({
        data: {
            nextPage: data.length === limit ? data[data.length - 1].date : '',
            pointearnhistory: data,
        },
        alert: {
            text: 'Earned with playing quize points',
            type: 'success'
        }
    })
})

exports.earnedPoint = earnedPoint;
