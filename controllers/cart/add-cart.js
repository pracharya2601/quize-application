const {db} = require("../../models/googlefirestore");
var jwt = require('jsonwebtoken');

const addCart = async (req, res, next) => {
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
    const itemType = req.query.itemType;
    const item = req.query.item;
    const type = req.query.type; //type ticket type adn inventory type

    const newCart = req.session.cart ? req.session.cart + 1 : 1;
    let data;
    try {
        data = await get_item(itemType, type);
    }catch(e) {
        console.log(e);
        res.status(500).json({error: "Error getting invontary or ticket item"});
        return;
    }
    if(!data) {
        console.log(e);
        res.status(500).json({error: "Error getting invontary or ticket item"});
        return;
    }
    const cartdata = {...data, item: item}

    try {
        await userRef
            .collection('cart')
            .add(cartdata);
        req.session.cart = newCart
        res.status(200).json({
            message: "Ticket is Added to the cart",
            itemLists: req.session.cart,
        })
    } catch(e){
        console.log(e);
        res.status(500).json({error: "Error getting cart lists"});
    }
}
const get_item = async (coll , document) => {
    let data = {};
    const dataRef = db.collection(coll).doc(document);
    const doc = await dataRef.get();
    if(!doc.exists) {
        data = undefined;
        return data;
    } else {
        data.name = doc.data().name;
        data.description = doc.data().description;
        data.point = doc.data().point;
        data.price = doc.data().price;
        return data;
    }
}
const get_inventory_items = async (itemId) => {
    let data;
    const dataRef = db.collection('inventory').doc(itemId);
    const doc = await dataRef.get();
    if(!doc.exists) {
        data = undefined;
        return data;
    } else {
        data.id = itemId;
        data.name = doc.data().name;
        data.description = doc.data().description;
        data.point = doc.data().point;
        data.price = doc.data().price;

        return data;
    }
    
}

exports.addCart = addCart;