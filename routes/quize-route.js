const express = require("express");
const {body} = require('express-validator');
const router = express.Router();
// //import controller
const { createQuize } = require("../controllers/quize/create-quize");
const { playQuize } = require("../controllers/quize/play-quize");
const { quizeQuestion } = require("../controllers/quize/quize-question");
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
    body("lotId")
        .not()
        .isEmpty()
        .withMessage("Not a creator fault")

], createQuize);

router.get('/play', playQuize);
router.get('/play/:quizeSlug', quizeQuestion);
router.post('/play/:quizeSlug', [
    body("ans")
    .not()
    .isEmpty()
    .withMessage("Must have the answer")
], submitAnswer)

module.exports = router;