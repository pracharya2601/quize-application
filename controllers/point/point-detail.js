
const wrap = require("../../middleware/wrap");
const decodedToken = require("../../utils/decodedToken");
const { usedPointDetail } = require("../../utils/point-helper");

const pointDetail = wrap(async(req, res, next) => {
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
    const usedSlug = req.params.usedSlug;

    const dataLists = await usedPointDetail(userId, usedSlug);
    if(dataLists.length === 0) {
        res.status(400).json({
            id: usedSlug,
            data: [],
            danger: {
                text: 'Something went wrong',
                type: 'danger'
            }
        })
        return;
    }
    let total = dataLists.reduce((prevAmt, item) => prevAmt + (item.point), 0);
    res.status(200).json({
        id: usedSlug,
        data: {
            total: total,
            detail: dataLists
        },
        alert: {
            text: 'Success',
            type: 'success'
        }
    })
})

exports.pointDetail = pointDetail;