const { db } = require("../models/googlefirestore")

module.exports = async (dbcollection, id, data) => {
    return await db.collection(dbcollection)
        .doc(id)
        .set(data, {merge: true})
}