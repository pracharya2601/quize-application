const {db} = require("../../models/googlefirestore");
var jwt = require('jsonwebtoken');

const current_user = async (req, res, next) => {
    if(!req.session.user) {
        res.status(200).json({
            signIn: false,
            user: {},
        })
        return;
    }   
    const token = req.session.user;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userRef = db.collection('users').doc(decoded.uid);
    const checktime = new Date(Date.now());
    let data;
    try {
        data = await userRef.get();   
    } catch {
        res.status(500).json({error: "Error getting quize"});
        return;
        //send message to admin
    }
    const user = {
        email: data.data().email,
        name: data.data().name,
        address: data.data().address,
        playAccess: data.data().dailyTotalPlay >= 5 ? false : true,
    }
    console.log(data.data().playedAt.toDate());
    console.log(checktime);
    console.log(checktime - data.data().playedAt.toDate() > 86400000);

    if(checktime - data.data().playedAt.toDate() > 86400000) {
        await userRef.update({
            dailyTotalPlay: 0
        })
    }
    res.status(200).json({
        signIn: true,
        user: user,
    })

}

exports.current_user = current_user;