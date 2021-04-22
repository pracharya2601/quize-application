const { db } = require("../model/fb");
module.exports = async (dbcollection, id, subcollection, documentId, data) => {
    let res =  await db.collection(dbcollection)
        .doc(id)
        .collection(subcollection)
        .doc(documentId)
        .set(data, {merge: true})

    return res.id;
}