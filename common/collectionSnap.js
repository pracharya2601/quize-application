const { db } = require("../model/fb");

module.exports.singleQuery = async (dbcollection, field, fieldVal, singleData) => {
    const reference = db
        .collection(dbcollection)
        .where(field, '==', fieldVal);
    const query = await reference.get();
    if(query.empty) {
        return;
    }
    if(singleData) {
        const data = query.docs[0];
        return {
            ...data.data(),
            id: data.id,
        };
    } else {
        let data = [];
        query.forEach(element => {
            data.push({...element.data(), id: element.id,})
        });
        return data;
    }

}
module.exports.multipleQuery = async (dbcollection, field, fieldVal, fieldtwo, fieldValTwo, singleData) => {
    const reference = db
        .collection(dbcollection)
        .where(field, '==', fieldVal)
        .where(fieldtwo, '==', fieldValTwo);
    const query = await reference.get();
    if(query.empty) {
        return;
    }
    if(singleData) {
        const data = query.docs[0];
        return {
            ...data.data(),
            id: data.id,
        };
    } else {
        let data = [];
        docs.array.forEach(element => {
            data.push({...element.data(), id: element.id,})
        });
        return data;
    }

}