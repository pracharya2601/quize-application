const subcollection = require("../../common/subcollection");
const wrap = require("../../middleware/wrap");
const decodedToken = require("../../utils/decodedToken");

const point = wrap(async (req, res, next) => {
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

    const userData = await subcollection('users', userId, 'user_points', 'final_points');
    if(!userData) {
        res.status(200).json({
            data: {
                totalpoints: 0,
                totalpointearn: 0,
                totalpointpurchase: 0,
                totalpointused: 0,
            }
        })
        return;
    }
    res.status(200).json({
        data: userData,
    })
})

exports.point = point;