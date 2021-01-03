const admin = require('firebase-admin');
const db = admin.firestore();

const HttpError = require('../../models/http-error');
let quize = [
    {q: "What is your name?", id: '22', accessId: 'dlksjdis'},
]


const deleteQuize = async (req, res, next) => {
    const {quizeId} = req.params;
    const docRef = db.collection("quizes").doc(quizeId);
    
    try {
        await docRef.delete()
    } catch (e) {
        throw new HttpError(e, 400);
    }

    res.status(200).json({message: "Deleter successfully"});
}

exports.deleteQuize = deleteQuize;