const { db } = require("../models/googlefirestore")

module.exports = async (dbcollection, data) => {
    return await db
        .collection(dbcollection)
        .add(data);
}