const HttpError = require('../../models/http-error');

const quize = [
    {q: "What is your name?", id: '22', accessId: 'dlksjdis'},
]

const getSingleQuize = (req, res, next) => {

    const {quizeId} = req.params;
    const resultData = quize.find((q) => q.id === quizeId);
    
    if(!resultData) {
        throw new HttpError("Not a right path", 404);
    }
    res.json(resultData)
}

exports.getSingleQuize = getSingleQuize;