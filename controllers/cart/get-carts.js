const {db} = require("../../models/googlefirestore");
var jwt = require('jsonwebtoken');

const getCarts = async (req, res, next) => {
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

    try {
        const listRef = userRef
            .collection('cart')
        const snapshot = await listRef.get();
        let carts = [];
        snapshot.forEach(doc => {
            let dataId = doc.id;
            let data = doc.data();
            carts.push({...data, id: dataId})
        })
        res.status(200).json({
            itemCount: carts.length,
            itemLists: carts,
        })
    } catch{
        console.log(e);
        res.status(500).json({error: "Error getting cart lists"});
        
    }
}


exports.getCarts = getCarts;