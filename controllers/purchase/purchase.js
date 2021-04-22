const collectionupdate = require("../../common/collectionupdate");
const subcollection = require("../../common/subcollection");
const subcollectionadd = require("../../common/subcollectionadd");
const subcollectionupdate = require("../../common/subcollectionupdate");
const wrap = require("../../middleware/wrap");
const decodedToken = require("../../utils/decodedToken");
const { purchaseMessage } = require("../../utils/mail/purchase-mailing");

const purchase = wrap(async(req, res, next) => {
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
    const email = decoded.email;
    const name = decoded.name;
    const date = new Date().toISOString();

    if(!req.session.carts) {
        req.session.carts = [];
    }
    let carts = req.session.carts;
    if(carts.length == 0) {
        res.status(400).json({
            alert: {
                text: 'Cart is Empty',
                type: 'danger'
            }
        })
        return;
    }
    let orderId = carts.map(({id}) => id);
    let count = carts.length;
    let pointsneeded = carts.reduce((prevPoint, item) => prevPoint + (item.point), 0);
    let availabelPoints = await subcollection('users', userId, 'user_points', 'final_points');
    if(!availabelPoints) {
        res.status(400).json({
            alert: {
                text: 'You dont have points to purchase',
                type: 'danger'
            }
        })
        return;
    }
    const overPoint = availabelPoints.totalpoints - pointsneeded;
    if(overPoint <= 0) {
        res.status(400).json({
            alert: {
                text: 'You dont have enough points to purchase',
                type: 'danger'
            }
        })
        return;
    }
    const data = {
        point: pointsneeded,
        status: 'used',
        date: date,
        orderId : orderId,
    }
    const usedHistoryId = await subcollectionadd('users', userId, 'used_point', data);
    await subcollectionupdate('users', userId, 'user_points', 'final_points', {
        totalpoints: availabelPoints.totalpoints - pointsneeded,
        totalpointused: availabelPoints.totalpointused + pointsneeded,
    })
    carts.forEach(async (item) => {
        const data = {
            date: date,
            catagory: item.catagory,
            paymentId: usedHistoryId,
            point: item.point,
            ticket: item.ticket,
            type: item.type,
            uid: userId,
            drawDate: item.drawDate,
        }
        await collectionupdate('purchase', item.id,  data);
    });
    await purchaseMessage(email, name, usedHistoryId, count,pointsneeded)
    const orderLists = carts.map(obj => ({...obj, paymentId: usedHistoryId, uid: userId, date: date}));
    req.session.carts = [];
    res.status(200).json({
        orders: {
            total: pointsneeded,
            detail: orderLists,
        },
        data: {
            id: usedHistoryId,
            date: date,
            point: pointsneeded,
            status: 'used'
        },
        alert: {
            text: 'Your order has been submitted',
            type: 'success',
        }
    })

    
});

exports.purchase = purchase;