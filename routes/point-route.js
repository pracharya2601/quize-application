const express = require("express");
const router = express.Router();

const {getPoints} = require('../controllers/point/get-points');
const { getPurchasedPoints } = require("../controllers/point/get-purchase-point");
const {getQuizPoints} = require('../controllers/point/get-quiz-points');
const { points } = require("../controllers/point/points");
const { purchasePoint } = require("../controllers/point/purchase-point");

router.get('/', points);
router.get('/available', getPoints);
router.get('/earned', getQuizPoints);
router.post('/purchased', purchasePoint);
router.get('/purchased', getPurchasedPoints);
router.post('/purchase', purchasePoint);


module.exports = router;