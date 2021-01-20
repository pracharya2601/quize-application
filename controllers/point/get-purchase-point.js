const {db} = require("../../models/googlefirestore");
var jwt = require('jsonwebtoken');

const getPurchasedPoints = async (req, res, next) => {
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

    let purchasedPoints;

    try {
        purchasedPoints = await get_purchased_point(userRef);
    } catch(e) {
        console.log(e);
        res.status(500).json({error: "Error getting purchased points lists"});
        return;
    }
    res.status(200).json(purchasedPoints)
}

const get_purchased_point = async(userRef) => {
    let data = [];
    let snapshot = await userRef
        .collection('purchased_point')
        .get();
    if(snapshot.empty) {
        console.log("no data");
        return data;
    }

    snapshot.forEach(doc => {
        data.push({...doc.data(), id: doc.id});
    })
    return data;
}


exports.getPurchasedPoints = getPurchasedPoints;