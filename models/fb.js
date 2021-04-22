const admin = require('firebase-admin');

const db = admin.firestore();
const storage = admin.storage();

module.exports = {db, storage};