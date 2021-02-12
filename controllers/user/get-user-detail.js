const wrap = require('../../middleware/wrap');
const decodedToken = require('../../utils/decodedToken');
const subcollection = require('../../common/subcollection');

const getUserDetail = wrap(async (req, res, next) => {
    if(!req.session.user) {
        res.status(401).json({
            signIn: false,
            user: {},
        })
        return;
    }
    const token = req.session.user;
    const decoded = decodedToken(token);
    const userId = decoded.uid;

    const data = subcollection('users', userId, 'user_detail', 'detail');
    res.status(200).json({data: data})
})

exports.getUserDetail = getUserDetail;