const { singleQuery } = require('../../common/collectionSnap');
const wrap = require('../../middleware/wrap');
const { prevDrawDate } = require('../../utils/drawDate');

const weeklyWinner = wrap(async(req, res, next) => {
    const date = prevDrawDate('weekly');
    const winners = await singleQuery('weekly_daily', 'drawDate', date, false);
    if(winners.length === 0) {
        res.status(400).json({
            data: [],
            alert: {
                text: 'Something went worong',
                type: 'danger',
            }
        })
        return;
    }
    res.status(200).json({
        data: winners,
        alert: {
            text: `List of winner on ${date}`,
            type: 'success'
        }
    })
});

exports.weeklyWinner = weeklyWinner;