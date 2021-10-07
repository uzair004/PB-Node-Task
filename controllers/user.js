const Sequelize = require('sequelize');
const sequelize = require('../config/db').sequelize;

// Bring in Model
const User = require('../models/user')(sequelize, Sequelize.DataTypes, Sequelize.Model);

exports.createUser = async function (req, res) {

	const { name, phone_number } = req.body;
	const otp = Math.floor(1000 + Math.random() * 9000);
	const currentDate = new Date();

	const newUser = { name, phone_number, otp, otp_expiration_date: currentDate }

	try {
		await User.create(newUser);
		res.json({ statusCode: 200, msg: 'Account created' });
	} catch (dbError) {
		console.error('unable to insert in database ', dbError);
		res.json({ statusCode: 500, msg: 'Account creation failed' });
	}

}

exports.generateOTP = function (req, res) {
	res.json({ msg: 'you are on generateOTP route' });
}

exports.verifyOTP = function (req, res) {
	res.json({ msg: 'you are on verifyOTP route' });
}

