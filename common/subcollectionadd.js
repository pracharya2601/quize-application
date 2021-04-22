const { db } = require("../model/fb");
module.exports = async (dbcollection, id, subcollection, data) => {

    let res = await db
        .collection(dbcollection)
        .doc(id)
        .collection(subcollection)
        .add(data);

    return res.id;
}