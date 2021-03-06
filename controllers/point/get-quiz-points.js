const {db} = require("../../models/googlefirestore");
var jwt = require('jsonwebtoken');

const getQuizPoints = async (req, res, next) => {
    if(!req.session.user) {
        req.status(200).json({
            signIn: false,
            user: {},
        })
        return;
    }
    const token = req.session.user;
    const decoded = jwt.verify(token, "user_world");
    const userRef = db.collection('users').doc(decoded.uid);
    const limit = 7;
    let after = req.query.after;

    try{
        var pointsRef = userRef
        .collection('quize_progess')
        .where('status', '==', 'correct')
        .orderBy('date', 'desc');
    if(after) {
        pointsRef = pointsRef.startAfter(after).limit(limit);
    }
    else {
        pointsRef = pointsRef.limit(limit);
    }

    const snapshot = await pointsRef.get();

    let points = [];

    snapshot.forEach(doc => {
        points.push({
            id: doc.id,
            date: doc.data().date,
            point: doc.data().point,
            status: doc.data().status,
        });
    })

    res.status(200).json({
        nextpage: points.length == limit ? points[points.length -1].date : null,
        pointHistory: points,
    })
    }catch(e){
        console.log(e);
        res.status(500).json({error: "Error getting quize"});
        
    }
}


exports.getQuizPoints = getQuizPoints;