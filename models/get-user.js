const {db} = require('./googlefirestore');

const getUser = async (email) => {
    const data = []
    const user = await db.collection('users').where("email", '==', email).get();
    if(user.empty) {
        return;
    }
    user.forEach((doc) => {
        data.push({...doc.data(), id: doc.id})
    });
    return data;
}

const getAllUser = async () => {
    let users = [];
    const data = await db.collection('users').get();
    if(data.empty) {
        return;
    }
    data.forEach((doc) => {
        users.push({...doc.data(), id: doc.id})
    })
    return users;
}

exports.getAllUser = getAllUser;
exports.getUser = getUser;