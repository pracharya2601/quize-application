const {db} = require("../../models/googlefirestore");
var jwt = require('jsonwebtoken');

const getQuizPoints = async (req, res, next) => {
    if(!req.session.user) {
        req.status(200).json({
            signIn: false,
            user: {},
        })
        return;
    }
    const token = req.session.user;
    const decoded = jwt.verify(token, "user_world");
    const userRef = db.collection('users').doc(decoded.uid);
    
    let quizePointLists;
    try{
        quizePointLists = await get_point_list(userRef);
    }catch(e){
        console.log(e);
        res.status(500).json({error: "Error getting quize"});
        return;
        
    }
    res.status(200).json(quizePointLists)
}

const get_point_list = async (userRef) => {
    let data = [];
    let snapshot = await userRef
        .collection('quize_progess')
        .where('status', '==', 'correct') //only get the quize that is not opened
        .orderBy('date', 'desc')
        .get();
    if(snapshot.empty) {
        console.log('No data found');
        return data;
    }
    snapshot.forEach(doc => {
        const itemData = {
            date: doc.data().date,
            point: doc.data().point,
            status: doc.data().status,
            id: doc.id,
        } 
        data.push(itemData);
    })
    return data;
}



exports.getQuizPoints = getQuizPoints;