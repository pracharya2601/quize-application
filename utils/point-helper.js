const {db} = require('../model/fb');
module.exports.updatePurchasePoints = async (userId, point) => {
    let docRef = db.collection('users')
        .doc(userId)
        .collection('user_points');
    let doc = await docRef
        .doc('final_points')
        .get();

    if(!doc.exists) {
        return await docRef
            .doc('final_points')
            .set({
            totalpoints: point,
            totalpointearn: point,
            totalpointpurchase: 0,
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

module.exports.usedPointDetail = async (val, val1) => {
    let data = [];
    let reference = db.collection('purchase')
        .where('uid', '==', val)
        .where('paymentId', '==', val1)
    const snapshot = await reference.get();
    if(snapshot.empty) {
        return data;
    }
    snapshot.forEach(doc => {
        data.push({...doc.data(), id: doc.id});
    })
    return data;

}
