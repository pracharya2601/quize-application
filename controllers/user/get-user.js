const wrap = require('../../middleware/wrap');
const collectionupdate = require('../../common/collectionupdate');
const collection = require('../../common/collection');
const decodedToken = require('../../utils/decodedToken');

const current_user = wrap(async (req, res, next) => {
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
    // const quizeinfo = await subcollection('users', userId, 'user_data', 'quize_info');
    // console.log(checktime - quizeinfo.playedAt)
    const playedTime = new Date(data.playedAt).getTime();
    const todayDate = new Date().getTime();
  
    let playAccess = data.dailyTotalPlay && data.dailyTotalPlay >= 5 ? false : true;
    if(todayDate - playedTime > 86400000) {
      playAccess = true;
      await collectionupdate('users', userId, {dailyTotalPlay: 0})
    }
    res.status(200).json({
      signIn: true,
      user: {
        email: data.email,
        name: data.name,
        address: data.address,
        playAccess: playAccess,
      },
      message: `You are logged in`
    })

})

exports.current_user = current_user;