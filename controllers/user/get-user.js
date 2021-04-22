const wrap = require('../../middleware/wrap');
const {db} = require('../../models/googlefirestore');
const subcollection = require('../../common/subcollection');
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
    const userRef = db.collection('users').doc(userId);
    const checktime = new Date(Date.now());

    const data = await collection('users', userId);   
    const cartcount = await subcollection('users', userId, 'user_data', 'cartcount');
    const quizeinfo = await subcollection('users', userId, 'user_data', 'quize_info');

    const user = {
      email: data.email,
      name: data.name,
      address: data.address,
      playAccess: quizeinfo && quizeinfo.dailyTotalPlay >= 5 ? false : true,
      cartcount: cartcount && cartcount.cartcount ? cartcount.cartcount : 0,
    }
  
    if(quizeinfo && checktime - quizeinfo.playedAt.toDate() > 86400000) {
      await userRef
        collection('user_data')
        .doc('quize_info')
        .update({
          dailyTotalPlay: 0
      })
    }
    res.status(200).json({
      signIn: true,
      user: user,
      message: `You are logged in`
    })

})

exports.current_user = current_user;