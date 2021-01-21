const {db} = require("../../models/googlefirestore");
var jwt = require('jsonwebtoken');
const axios = require('axios');

const purchasePoint = async (req, res, next) => {
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

    const {
        amount,
        date,
        id,
        point,
        khaltiToken,
    } = req.body;

    // khalti verification intregation
    // let verifyData = {
    //     "token": khaltiToken,
    //     "amount": amount,
    // }
    // let config = {
    //     headers: {
    //         'Authorization': 'Key test_secret_key_f59e8b7d18b4499ca40f68195a846e9b'
    //     }
    // }

    // let paymentResponse;
    // try {
    //     paymentResponse = await axios.post("https://khalti.com/api/v2/payment/verify/", data, config);
    // } catch (e) {
    //     console.log(e);
    //     res.status(400).json({error: 'Error verification error'});
    //     return;
    // }

    try {
        await userRef.collection('purchased_point')
            .set({
                amount,
                date,
                id,
                point,
                token,
                status: "Purchased"
                //get verified data from khalti verification
            })
            res.status(200).json({
                id: id,
                date: date,
                point: point,
                status: "Puchased"
            }) 
    }catch{
        res.status(500).json({error: "Error purchasing points"});
    }

    
}


exports.purchasePoint = purchasePoint;