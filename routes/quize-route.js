const express = require("express");
const {body, param} = require('express-validator');
const router = express.Router();

const {db} = require("../models/googlefirestore");
// //import controller
const { createQuize } = require("../controllers/quize/create-quize");
const { getSingleQuize } = require("../controllers/quize/get-single-quize");
const { playQuize } = require("../controllers/quize/play-quize");
const { submitAnswer } = require("../controllers/quize/submit-answer");





// router.get('/', getQuize);
router.post('/', [
    body("question")
        .not()
        .isEmpty()
        .withMessage("Must not be empty"),
    body("level")
        .not()
        .isEmpty()
        .withMessage("Must not be empty"),
    body("answer")
        .not()
        .isEmpty()
        .withMessage("Must not be empty"),
    body("options")
        .not()
        .isEmpty()
        .withMessage("Must not be empty"),
], createQuize);

router.get('/play_quize', playQuize);

router.get('/play_quize/:quizeSlug', getSingleQuize);

//need to validate with express validator
router.post('/play_quize/:quizeSlug', [
    body("ans")
    .not()
    .isEmpty()
    .withMessage("Must have the answer")
], submitAnswer);

module.exports = router;