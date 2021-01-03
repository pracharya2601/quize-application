const express = require('express');
const bodyParser = require('body-parser');


//error
const HttpError = require('./models/http-error');
//routes quize
const quizeRoutes = require("./routes/quize-route");
//userRoute
const userRoutes = require("./routes/user-route");

const app = express();
app.use(bodyParser.json());





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
  res.status(error.code || 500);
  res.json({message: error.message || "Error message not found"});
})


app.listen(3000, () => {
    console.log("Server Running on Local Host 3000");
});
  
