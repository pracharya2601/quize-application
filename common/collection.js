const { db } = require("../models/googlefirestore")

module.exports = async (dbcollection, id) => {
    let doc = await db
        .collection(dbcollection)
        .doc(id)
        .get();
    
    if(!doc.exists) {
       return;
    }else {
        return doc.data();
    }
}