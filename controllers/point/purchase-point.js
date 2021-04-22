const subcollectionadd = require("../../common/subcollectionadd");
const wrap = require("../../middleware/wrap");
const decodedToken = require("../../utils/decodedToken");
const { updatePurchasePoints } = require("../../utils/point-helper");

const purchasePoint = wrap(async (req, res, next) => {
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

    /*
    const {
            point,
            amount,
            id,
            token,
        } = req.body;

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
        status: 'purchased',
        khaltiIdx: 'sdjlksjdlksjds',
        user: {
            idx: 'skdjlksjdklsjd',
            name: 'Test Name',
            mobile: '980767676373',
        },
        state: 'completed' //get this data form khalti verification

    }
    await subcollectionadd('users', userId, 'purchased_point', verifiedData);
    await updatePurchasePoints(userId, verifiedData.point);

    res.status(200).json({
        point: {
            date: verifiedData.date,
            point: verifiedData.point,
            status: verifiedData.status,
            id: req.body.id,
        },
        alert: {
            text: `Thankyou for purchasing points. ${verifiedData.point} points has been added to your account.`,
            type: 'success'
        }
    })
})

exports.purchasePoint = purchasePoint;