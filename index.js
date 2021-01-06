const express = require('express');
const bodyParser = require('body-parser');
//cookie-session
const session = require('express-session');
//helmet
const helmet = require('helmet');
const hpp = require('hpp');
const csurf = require('csurf');

const cors = require('cors');
const {FirestoreStore} = require('@google-cloud/connect-firestore');

const {db} = require('./models/googlefirestore');
// //error
const HttpError = require('./models/http-error');
//routes quize
const quizeRoutes = require("./routes/quize-route");
//userRoute
const userRoutes = require("./routes/user-route");

const app = express();
var corsOptions = {
  origin: ["http://localhost:3000",],
  credentials: true
};

app.use(cors(corsOptions));

app.use(helmet());
app.use(hpp());
app.use(bodyParser.json());
// app.use(csurf());

app.use(
  session({
    store: new FirestoreStore({
      dataset: db,
      kind: 'express-sessions',

    }),
    secret: 'my-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      originalMaxAge: 3600000,
    },
  })
);


app.use("/api/user", userRoutes);
// app.use("/api/quize", quizeRoutes);


app.use((req, res, next) => {
  const error = new HttpError('Could not find the route', 404);
  throw error;
}) ;

app.use((error, req, res, next) => {
  if(res.headerSent) {
    return next(error);
  }
  res.status(500).json({message: error.message || "Error message not found"});
})


app.listen(4000, () => {
    console.log("Server Running on Local Host 4000");
});
  
