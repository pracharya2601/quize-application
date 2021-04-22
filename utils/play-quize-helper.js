const {db} = require('../model/fb');
const { getTodayDate } = require('./getTodayDate');

module.exports.usedLots = async (userId) => {
    const data = [];
    const docRef = await db.collection('users').doc(userId).collection('quize_lots').listDocuments();
    docRef.forEach(id => {
        data.push(id.id);
    })
    return data;
}

const randomNumber = (arr) => {
    const x = 10;
    let num = Math.floor(Math.random() * x) + 1;
    console.log('num', num)
    for(var i=0; i<arr.length; i++) {
        if(arr[i] == num.toString()) {
            randomNumber(arr, num);
        } else {
            return num.toString();
        }
    }
}


module.exports.randomLot = (arr) => {
    const x = 10;
    let num = Math.floor(Math.random() * x) + 1;
    if(arr.length === 0) {
        return num.toString();
    }
    for(var i=0; i<arr.length; i++) {
        if(arr[i] == num.toString()) {
            randomLot(arr);
        } else {
            return num.toString();
        }
    }
    return;
}

module.exports.quizeList = async (lotId) => {
    const ref = await db.collection('quizes').where('lotId', '==', lotId).get();
    let data = [];
    ref.forEach(element => {
        data.push(element.id)
    })
    return data;
}

module.exports.getOpenedQuize = async (userId) => {
    const todayDate = getTodayDate();
    const snapshot = db.collection('users')
        .doc(userId)
        .collection('quize_progess');
    const dataRef = await snapshot
        .where('opened', '==', true)    
        .where('availableOn', '==', todayDate)
        .get();
    if(dataRef.empty) {
        return [];
    }
    let data = [];
    dataRef.forEach(element => {
        data.push(element.id);
    })
    return data;
}

module.exports.updateEarnedPoints = async (userId, point) => {
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
                totalpointearn: doc.data().totalpointearn + point,
            })
    }
}

