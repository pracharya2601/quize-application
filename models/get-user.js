const {db} = require('./googlefirestore');
const {hashCompare} = require("./hash-password");

const getUser = async (email, password) => {
    const data = []
    const user = await db.collection('users').where("email", '==', email).get();
    if(user.empty) {
        return;
    }

    user.forEach((doc) => {
        const pass = doc.data().password;
        if(hashCompare(pass, password)) {
            data.push({...doc.data(), id: doc.id})
        }
        return;
    });

    if(data.length > 0) {
        return data;
    }
    return;
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