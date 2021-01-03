const admin = require('firebase-admin');
const db = admin.firestore();

const HttpError = require('../../models/http-error');

const updateQuize = async (req, res, next) => {

    const {quizeId} = req.params;
    const docRef = db.collection("quizes").doc(quizeId);
    
    try {
        await docRef.update(req.body)
    } catch (e) {
        throw new HttpError(e, 400);
    }

    res.status(200).json({message: "Update successfully"});
}

exports.updateQuize = updateQuize;