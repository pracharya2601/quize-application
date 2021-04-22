const { db } = require("../model/fb");

module.exports = async (dbcollection, data) => {
    return await db
        .collection(dbcollection)
        .add(data);
}