const moment = require('moment');
const { isMoment } = require('moment');

'use strict';
module.exports = (sequelize, DataTypes, Model) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	};
	User.init({
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: { msg: 'name cannot be empty' },
				notNull: { msg: 'please enter name' },
			}
		},
		phone_number: {
			type: DataTypes.STRING(20),
			validate: {
				isMobilePhone: { msg: 'invalid phone number' }
			}
		},
		otp: {
			type: DataTypes.INTEGER(4).UNSIGNED
		},
		otp_expiration_date: {
			type: DataTypes.DATE,
			set(value) {
				// convert regular Date to moment Date
				value = moment(value).add(5, 'minutes');
				this.setDataValue('otp_expiration_date', value);
			}
		},
		is_otp_expired: {
			type: DataTypes.VIRTUAL,
			get() {
				// otp_expiration_date < current date
				const expirationMoment = moment(this.otp_expiration_date);
				const isExpired = expirationMoment.isAfter(moment()) ? false : true;
				return isExpired;
			}
		}
	}, {
		sequelize,
		modelName: 'User',
	});
	return User;
};