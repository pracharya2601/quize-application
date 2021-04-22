const { db } = require("../model/fb");

module.exports = async (dbcollection, id, subcollection, documentId) => {
    let doc = await db
        .collection(dbcollection)
        .doc(id)
        .collection(subcollection)
        .doc(documentId)
        .get();
    
    if(!doc.exists) {
       return;
    }else {
        return doc.data();
    }
}