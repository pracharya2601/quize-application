const {validationResult} = require("express-validator");
const {db} = require("../../models/googlefirestore");

const createQuize =async (req, res, next) => {
    const {
        question,
        answer,
        options,
        level,
        lotId,
    } = req.body;
    const errors = validationResult(req);

    const createBy = "useridofcreater"
    if(!errors.isEmpty()) {
        res.status(400).json(errors);
        return;
    }
    const newOptions = options.map((str) => ({name: str, value: str}))

    //make sure to verify the user is admin to create a quize
try{
    const resRef = db.collection("quizes");
    const data = await resRef
        .add({
            question,
            answer,
            options: [...newOptions, {name: answer, value: answer}],
            level,
            dateCreated: new Date().toISOString(),
            createBy,
            lotId,
    })
    res.status(200).json({message:`Quize created with quizeId ${data.id}`})
}catch(e) {
    res.status(400).json({error: "Error occured"})
}
}

exports.createQuize = createQuize;