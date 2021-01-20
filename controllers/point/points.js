const {db} = require("../../models/googlefirestore");

const points = async (req, res, next) => {
    if(!req.session.user) {
        req.status(200).json({
            signIn: false,
            user: {},
        })
        return;
    }
    let data;
    try {
        data = await get_point();
    }catch(e) {
        console.log(e);
        res.status(500).json({error: 'Error occurs getting data please try again later'})
        //send notification to admin play quize error occured
    }
    res.status(200).json(data);
}

const get_point = async () => {
    let data = [];
    const docRef = db.collection('points')
        .where('available', '==', true)
    
    const snapshot = await docRef
        .orderBy('price', 'asc')
        .get();
    if(snapshot.empty) {
        console.log("No data found");
        return data;
    }
    snapshot.forEach(doc => {
        data.push({...doc.data(), id: doc.id});
    })
    return data;
}

exports.points = points;