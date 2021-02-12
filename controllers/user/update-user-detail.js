const wrap = require('../../middleware/wrap');
const decodedToken = require('../../utils/decodedToken');
const subcollectionupdate = require('../../common/subcollectionupdate');

const updateUserDetail = wrap(async (req, res, next) => {
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
    const data = req.body;

    await subcollectionupdate('users', userId, 'user_data', 'detail', data);
    res.status(200).json({data: data})
})

exports.updateUserDetail = updateUserDetail;