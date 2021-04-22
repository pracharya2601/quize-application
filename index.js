require("dotenv").config();
const express = require('express');
const path = require('path');
const session = require("express-session");
const admin = require('firebase-admin');
const FirestoreStore = require("firestore-store")(session);
const app = express();
const pvtKey = `${process.env.FIREBASE_PRIVATE_KEY_I}${process.env.FIREBASE_PRIVATE_KEY_II}${process.env.FIREBASE_PRIVATE_KEY_III}${process.env.FIREBASE_PRIVATE_KEY_IV}${process.env.FIREBASE_PRIVATE_KEY_V}${process.env.FIREBASE_PRIVATE_KEY_VI}${process.env.FIREBASE_PRIVATE_KEY_VII}${process.env.FIREBASE_PRIVATE_KEY_VIII}${process.env.FIREBASE_PRIVATE_KEY_IX}${process.env.FIREBASE_PRIVATE_KEY_X}`

process.setMaxListeners(15);
admin.initializeApp({
  credential: admin.credential.cert({
    "type": process.env.FIREBASE_TYPE,
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key_id": pvtKey,
    "private_key": process.env.FIREBASE_PRIVATE_KEY,
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": process.env.FIREBASE_AUTH_URI,
    "token_uri": process.env.FIREBASE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    "client_x509_cert_url": process.env.FIREBASE_CLIENT_CERT_URL,
  }),
});

const {db} = require('./model/fb');

const userRoutes = require('./routes/user-routes');
const quizeRoutes = require('./routes/quize-route');
const pointRoutes = require('./routes/point-route');
const cartRoutes = require('./routes/cart-route');
const purchaseRoutes = require('./routes/purchase-route');
const ticketRoutes = require('./routes/ticket-route');

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
    next();
});

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());
app.set('trust proxy', 1) 
app.use(session({
    store: new FirestoreStore({
        database: db,
    }),
    name: 'session', //SESSION_STORAGE_NAME
    secret: 'session-fo-user', //SESSION_SECRET
    resave: true,
    saveUninitialized: true,
    proxy: true,
    cookie: {
        httpOnly: true,
        expires: new Date(Date.now() + 158400000),
        maxAge: 158400000,
        genid: function(req) {return genuuid()},
    },
}))

app.use("/api/user", userRoutes);
app.use("/api/quize", quizeRoutes);
app.use("/api/point", pointRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/ticket", ticketRoutes);
app.use("/api/purchase", purchaseRoutes);


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})
app.use((error, req, res, next) => {
    if(res.headerSent) {
      return next(error);
    }
    res.status(500).json({
        alert: {
            text: error.message || "Error message not found",
            type: 'danger'
        }
    });
})  

const PORT = 4000;
app.listen(PORT, () => {
    console.log("server is running: 4000" )
})

