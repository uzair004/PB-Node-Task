const Sequelize = require('sequelize');
const sequelize = require('../config/db').sequelize;

// Bring in Model
const User = require('../models/user')(sequelize, Sequelize.DataTypes, Sequelize.Model);

exports.createUser = async function (req, res) {

	const { name, phone_number } = req.body;

	const newUser = { name, phone_number }

	try {
		await User.create(newUser);
		res.json({ statusCode: 200, msg: 'Account created' });
	} catch (dbError) {
		console.error('unable to insert in database ', dbError);
		res.json({ statusCode: 500, msg: 'Account creation failed' });
	}

}

exports.generateOTP = async function (req, res) {

	let foundUser;

	try {
		foundUser = await User.findOne({ where: { phone_number: req.body.phone_number } });
	} catch (findErr) {
		console.error('error while finding user: ', findErr);
		res.json({ statusCode: 500, msg: 'Server error' });
		return;
	}

	if (foundUser) {
		const otp = Math.floor(1000 + Math.random() * 9000);
		foundUser.otp = otp;
		foundUser.otp_expiration_date = new Date();

		await foundUser.save();
		res.json({ statusCode: 200, id: foundUser.id });

	} else {
		res.json({ statusCode: 404, msg: 'Phone Number doesnt exist' });
	}

}

exports.verifyOTP = async function (req, res) {
	let foundUser;
	try {
		foundUser = await User.findByPk(req.params.id);
	} catch (findErr) {
		res.json({ statusCode: 500, msg: 'Server Problem' });
	}

	console.log('is expired: ', foundUser.is_otp_expired)

	if (foundUser) {
		checkOTP(req.query.otp, foundUser, res);
	} else {
		res.json({ statusCode: 404, msg: 'User Not Found' });
	}

}

// ---------- Helper Functions ---------------

function checkOTP(otp, foundUser, res) {
	if (otp != foundUser.otp.toString()) {
		res.json({ statusCode: 401, msg: 'Incorrect OTP' });
	} else if (foundUser.is_otp_expired) {
		res.json({ statusCode: 401, msg: 'OTP Expired' });
	}
	else {
		res.json({ statusCode: 200, user: foundUser });
	}
}

