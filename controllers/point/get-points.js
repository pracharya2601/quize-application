const {db} = require("../../models/googlefirestore");
var jwt = require('jsonwebtoken');

const getPoints = async (req, res, next) => {
    if(!req.session.user) {
        res.status(200).json({
            signIn: false,
            user: {},
        })
        return;
    }
    const token = req.session.user;
    const decoded = jwt.verify(token, "user_world");

    try{
        const points = await total_points(decoded.uid);
        res.status(200).json({
            totalpoints: points.totalpoints,
            totalpointsearn: points.totalpointsearn,
            totalpointspurchase: points.totalpointspurchase,
            totalpointsused: points.totalpointsused,
        });
    }catch{
        res.status(400).json({error: 'Error occurs gettig data please try again later'})
        //send notification to admin play quize error occured
    }
}

const total_points = async (uid) => {
    let data = [];
    const userRef = db.collection("user_dash_data")
        .where('uid', '==', uid);
    const snapshot = await userRef.get();
    if(snapshot.empty) {
        console.log("No data found");
        return;
    }
    snapshot.forEach(doc => {
        data.push(doc.data());
    })
    return data[0];
}

exports.getPoints = getPoints;