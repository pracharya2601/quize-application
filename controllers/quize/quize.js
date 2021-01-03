const admin = require('firebase-admin');
const db = admin.firestore();

const HttpError = require('../../models/http-error');

const getQuize = async (req, res, next) => {

    const dataRef = db.collection('quizes');
    
    const snapshot = await dataRef.get();
    
    if(snapshot.empty) {
        throw new HttpError("Not found any questions", 404);
    }
    let data =[];
    snapshot.forEach(doc => {
        data.push({...doc.data(), id: doc.id});
    })
    res.status(200).json(data);

}

exports.getQuize = getQuize;