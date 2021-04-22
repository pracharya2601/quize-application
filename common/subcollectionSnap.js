const { db } = require("../model/fb");

module.exports.singleSubcollectionQuery = async (
        dbcollection, 
        id, 
        subcollection, 
        field, 
        fieldVal, 
        after, 
        limit, 
        singleData
) => {
    var docRef = db
        .collection(dbcollection)
        .doc(id)
        .collection(subcollection)
        .orderBy('date', 'desc');

    if(field && after) {
        docRef = docRef.where(field, '==', fieldVal).startAfter(after).limit(limit);
    }
    if(field && !after) {
        docRef = docRef.where(field, '==', fieldVal).limit(limit);
    }
    if(after) {
        docRef = docRef.startAfter(after).limit(limit);
    }
    else {
        docRef = docRef.limit(limit);
    }

    const snapshot = await docRef.get();

    if(snapshot.empty) {
        if(singleData) {
            return;
        } else {
            return [];
        }
    }

    if(singleData) {
        const data = snapshot.docs[0];
        return {
            ...data.data(),
            id: data.id,
        };
    }else {
        let data = [];
        snapshot.forEach(element => {
            data.push({...element.data(), id: element.id,})
        });
        return data;
    }
}
module.exports.multipleSubcollectionQuery = async (
        dbcollection, 
        id, 
        subcollection, 
        field, 
        fieldVal, 
        field1,
        fieldVal1,
        after, 
        limit, 
        singleData
) => {
    var docRef = db
        .collection(dbcollection)
        .doc(id)
        .collection(subcollection)
        .orderBy('date', 'desc');

    if(field && after) {
        docRef = docRef
            .where(field, '==', fieldVal)
            .where(field1, '==', fieldVal1)
            .startAfter(after)
            .limit(limit);
    }
    if(field && !after) {
        docRef = docRef
            .where(field, '==', fieldVal)
            .where(field1, '==', fieldVal1)
            .limit(limit);
    }
    if(after) {
        docRef = docRef.startAfter(after).limit(limit);
    }
    else {
        docRef = docRef.limit(limit);
    }

    const snapshot = await docRef.get();

    if(snapshot.empty) {
        if(singleData) {
            return;
        } else {
            return [];
        }
    }

    if(singleData) {
        const data = snapshot.docs[0];
        return {
            ...data.data(),
            id: data.id,
        };
    }else {
        let data = [];
        snapshot.forEach(element => {
            data.push({...element.data(), id: element.id,})
        });
        return data;
    }
}