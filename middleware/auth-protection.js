const HttpError = require("../models/http-error");
module.exports = (req, res, next) => {
    if(!req.session.isLoggedIn) {
        throw new HttpError("Unauthorized", 4);
    }
    next();
}