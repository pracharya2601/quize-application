const wrap = require('../../middleware/wrap');
const {validationResult} = require("express-validator");
const collectionadd = require('../../common/collectionadd');

const createQuize = wrap(async(req, res, next) => {
    const {
        question,
        answer,
        options,
        level,
        lotId
    } = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(400).json({
            alert: {
                text: 'Something went wrong',
                type: 'danger'
            } 
        });
        return;
    }
    const createdBy = 'praskadkfjsk47jkhsdkhks';
    const newAns = answer.replace(/\s/g, '');
    const newOptions = options.map((str) => ({name: str, value: str.replace(/\s/g, '')}));
    const doc = await collectionadd('quizes', {
        question: `${question} ${lotId} ?`, 
        lotId,
        options: [...newOptions, {name: answer, value: newAns}],
        createdBy,
        dateCreated: new Date().toISOString(),
        level,
    });
    await collectionadd('quize_credential', {
        qid: doc.id,
        answer: newAns,
        level,
    })

    res.status(200).json({
        alert: {
            text: `Quize created with id - ${doc.id}`,
            type: 'success'
        }
    })
})

exports.createQuize = createQuize;