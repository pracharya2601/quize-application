const { db } = require("../models/googlefirestore")

module.exports = async (dbcollection, id, subcollection, documentId, data) => {
    return await db.collection(dbcollection)
        .doc(id)
        .collection(subcollection)
        .doc(documentId)
        .set(data, {merge: true})
}