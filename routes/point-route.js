const express = require('express');
const { earnedPoint } = require('../controllers/point/earned-point');
const { point } = require('../controllers/point/point');
const { pointDetail } = require('../controllers/point/point-detail');
const { purchasePoint } = require('../controllers/point/purchase-point');
const { purchasedPoint } = require('../controllers/point/purchased-point');
const { usedPoint } = require('../controllers/point/used-point');
const router = express.Router();

router.get('/', point);
router.post('/', purchasePoint);
router.get('/used', usedPoint);
router.get('/used/:usedSlug', pointDetail);
router.get('/earned', earnedPoint);
router.get('/purchased', purchasedPoint);
