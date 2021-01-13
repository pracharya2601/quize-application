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
    const resRef = db.collection("quize_question");
    const data = await resRef
        .add({
            question,
            lotId,
    })
    await db.collection("quize_credential").add({
        qid: data.id,
        answer,
        level
    })
    await db.collection("quize_option").add({
        qid: data.id,
        options:[...newOptions, {name: answer, value: answer}],
    })
    await db.collection('quize_info').add({
        qid: data.id,
        createBy,
        dateCreated: new Date().toISOString(),
    })

    res.status(200).json({message:`Quize created with quizeId ${data.id}`})
}catch(e) {
    res.status(400).json({error: "Error occured"})
}
}

exports.createQuize = createQuize;