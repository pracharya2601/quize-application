const admin = require('firebase-admin');
const db = admin.firestore();

const HttpError = require('../../models/http-error');

const createQuize =async (req, res, next) => {
    const {
        question,
        answer,
        options
    } = req.body;

    const resRef = db.collection("quizes");
    const data = await resRef.add({
        question,
        answer,
        options,
    })
    if(!data) {
        throw new HttpError("Cannot added your data please try again later", 404);
    }

    res.status(200).json(data);
}

exports.createQuize = createQuize;