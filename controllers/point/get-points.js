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
    const userRef = db.collection('users').doc(decoded.uid);

    try{
        let userPoints = await points(userRef);
        res.status(200).json(userPoints);
    }catch{
        res.status(400).json({error: 'Error occurs gettig data please try again later'})
        //send notification to admin getting point error occur;
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
const points = async(userRef) => {
    const data = userRef.collection('user_points');
    const doc = await data.doc('final_points').get();

    if(!doc.exists) {
        return{
            totalpoints: 0,
            totalpointearn: 0,
            totalpointpurchase: 0,
            totalpointused: 0, 
        }
    }
    else {
        return {
            totalpoints: doc.data().totalpoints,
            totalpointearn: doc.data().totalpointearn,
            totalpointpurchase: doc.data().totalpointpurchase,
            totalpointused: doc.data().totalpointused, 
        } 
    }
}

exports.getPoints = getPoints;