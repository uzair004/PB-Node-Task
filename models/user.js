const moment = require('moment');

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
			allowNull: false
		},
		phone_number: {
			type: DataTypes.STRING(20)
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
				return this.getDataValue(otp_expiration_date).isAfter(moment()) ? true : false
			}
		}
	}, {
		sequelize,
		modelName: 'User',
	});
	return User;
};