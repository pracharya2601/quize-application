require('dotenv').config();
const Firestore = require("@google-cloud/firestore");

const db = new Firestore({
    projectId: process.env.GOOGLE_APPLICATION_PROJECT_ID,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
})

exports.db = db;