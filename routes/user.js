const express = require('express');
const router = express.Router();

// handles multipart/form-data
const multer = require('multer');
const upload = multer();

const userController = require('../controllers/user.js');

// create user route
router.post('/', userController.createUser);

// generate otp route
router.post('/generateOTP', upload.none(), userController.generateOTP);

// verify otp route
router.post('/:id/verifyOTP', userController.verifyOTP);


module.exports = router;