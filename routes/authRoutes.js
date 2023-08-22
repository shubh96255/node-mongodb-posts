const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json()); 

const validator = require("../validators/authValidator");
router.use(validator);

// Routes used for AUTH module
router.post('/send-otp', authController.sendOtp);
router.post('/verify-create-otp', authController.verifyOtp);
router.post('/create-account', authController.createAccount);
router.post('/login', authController.login);


router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-forgot-otp', authController.verifyForgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;