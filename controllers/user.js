const Sequelize = require('sequelize');
const sequelize = require('../config/db').sequelize;

// Bring in Model
const User = require('../models/user')(sequelize, Sequelize.DataTypes, Sequelize.Model);

exports.createUser = async function (req, res) {
	const { name, phone_number } = req.body;
	const newUser = { name, phone_number }

	try {
		await User.create(newUser);
		res.status(200).json({ status: 'success', msg: 'Account created' })
	} catch (dbError) {
		handleErrors(dbError, res);
	}

}


exports.generateOTP = async function (req, res) {
	let foundUser;
	try {
		foundUser = await User.findOne({ where: { phone_number: req.body.phone_number } });
	} catch (findErr) {
		console.error('error while finding user: ', findErr);
		res.status(500).json({ status: 'error', msg: 'Server Error' })
		return;
	}

	if (foundUser) {
		const otp = Math.floor(1000 + Math.random() * 9000);
		foundUser.otp = otp;
		foundUser.otp_expiration_date = new Date();

		await foundUser.save();
		res.status(200).json({ status: 'success', id: foundUser.id })

	} else {
		res.status(404).json({ status: 'error', msg: 'Phone Number doesnt exist' });
	}

}


exports.verifyOTP = async function (req, res) {
	let foundUser;
	try {
		foundUser = await User.findByPk(req.params.id);
	} catch (findErr) {
		res.status(500).json({ status: 'error', msg: 'Server Problem' });
	}

	if (foundUser) {
		checkOTP(req.query.otp, foundUser, res);
	} else {
		res.status(404).json({ status: 'error', msg: 'User Not Found' });
	}

}

// ---------- Helper Functions ---------------

function checkOTP(otp, foundUser, res) {
	if (otp != foundUser.otp.toString()) {
		res.status(401).json({ status: 'error', msg: 'Incorrect OTP' });
	} else if (foundUser.is_otp_expired) {
		res.status(401).json({ status: 'error', msg: 'OTP Expired' });
	}
	else {
		res.status(200).json({ status: 'success', user: foundUser });
	}
}


function handleErrors(Error, res) {
	if (Error.name === 'SequelizeValidationError') {
		const errObj = {};
		Error.errors.map(er => {
			errObj[er.path] = er.message;
		})
		res.status(400).json({ status: 'error', msg: errObj });
	} else {
		res.status(500).json({ status: 'error', msg: 'Account creation failed' });
	}
}
