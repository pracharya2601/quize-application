const {db} = require('./googlefirestore');

const setUser = async (email, password, name) => {
    const res = await db.collection('users').add({
        email,
        password, 
        name,
        address: {
            address: '',
            city: '',
            state: '',
            zip: '',
        }
    })
    if(!res) {
        return;
    }
    return res.id;
}

exports.setUser = setUser;