const Sequelize = require('sequelize');
const sequelize = require('../config/db').sequelize;

// Bring in Model
const User = require('../models/user')(sequelize, Sequelize.DataTypes, Sequelize.Model);

exports.createUser = async function (req, res) {

	const { name, phone_number } = req.body;
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

exports.verifyOTP = function (req, res) {
	res.json({ msg: 'you are on verifyOTP route' });
}

