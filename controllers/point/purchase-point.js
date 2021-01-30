const {db} = require("../../models/googlefirestore");
var jwt = require('jsonwebtoken');

const purchasePoint = async (req, res, next) => {
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

    // const {
    //     point,
    //     amount,
    //     id,
    //     token,
    // } = req.body;

    //send token and amount to user for fututr verification 
    //if verification failed


    /*
    verify khalti verification
        token, amount
        send header
    
        let config = {
        headers: {'Authorization': 'Key test_secret_key_f59e8b7d18b4499ca40f68195a846e9b'}
    };
    put url on env 
    const url = `https://khalti.com/api/v2/payment/verify/`
    let verificationResponse;
        try {
            verificationResponse = await axios.post(url, data, config)
        }catch {
            send error to adming and user also 
            return;
        }
    if(!verificationResponse) {
        res.status(500).json({error: "Payment verification failed"})
        return;
    }

    //response format
    {
        "idx": "sdlkjflskjdflks",
        "user": {
            "name": "Test User",
            "mobile": "708709890"
        }
        "state": {
            "idx": "DhvMj9hdRufLqkP8ZY4d8g",
            "name": "Completed",
            "template": "is complete"
        },
        "amount": 10000
        "created_on": date today

    }
    */

    const verifiedData = {
        token: req.body.token,
        amount: req.body.amount,
        point: req.body.point,
        date: new Date().toISOString(),
        status: 'Purchased',
        khaltiIdx: 'sdjlksjdlksjds',
        user: {
            idx: 'skdjlksjdklsjd',
            name: 'Test Name',
            mobile: '980767676373',
        },
        state: 'completed' //get this data form khalti verification
    }
    try {
        await userRef
        .collection('purchased_point')
        .doc(req.body.id)
        .set(verifiedData);
        await update_final_point(userRef, verifiedData.point);
        //send email to user
        //confirmation code
        res.status(200).json({
            message: "Thankyou for purchasing the points",
            data: {
                date: verifiedData.date,
                point: verifiedData.point,
                status: verifiedData.status,
                id: req.body.id,
            }
        })

    }catch (e) {
        res.status(500).json({
            error:"Error occured while verifying purchased" 
        })
    }
}
//update on final_point sub collection
//change the collection to update points
const update_final_point = async (userRef, point) => {
    let docRef = userRef
        .collection('user_points');
    let doc = await docRef
        .doc('final_points')
        .get();

    if(!doc.exists) {
        return await docRef
            .doc('final_points')
            .set({
               totalpoints: point,
               totalpointearn: 0,
               totalpointpurchase: point,
               totalpointused: 0, 
            })
    } else {
        return await docRef
            .doc('final_points')
            .update({
                totalpoints: doc.data().totalpoints + point,
                totalpointpurchase: doc.data().totalpointpurchase + point,
            })
    }
}

//purchased_point sub-collection for purchasing points
//add purchased data to the sub-collection

//send email to the purchased point
//

exports.purchasePoint = purchasePoint;