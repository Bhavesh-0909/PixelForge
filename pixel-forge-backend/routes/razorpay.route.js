const express = require('express');
const razorpayController = require('../controller/razorpay.controller');

const router = express.Router();

// Define your routes here
router.post('/create-order', razorpayController.capturePayment);

module.exports = router;