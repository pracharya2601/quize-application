const { db } = require("../models/googlefirestore")

module.exports = async (dbcollection, id, subcollection, data) => {
    return await db
        .collection(dbcollection)
        .doc(id)
        .collection(subcollection)
        .add(data);
}