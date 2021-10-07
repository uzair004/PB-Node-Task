const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.js');

// create user route
router.post('/', userController.createUser);

// generate otp route
router.post('/generateOTP', userController.generateOTP);

// verify otp route
router.post('/:id/verifyOTP', userController.verifyOTP);


module.exports = router;