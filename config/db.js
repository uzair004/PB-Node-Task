const Sequelize = require('sequelize');
const dbConfig = require('./config');

const sequelize = new Sequelize(
	dbConfig.development.database, dbConfig.development.username, dbConfig.development.password,
	{
		dialect: dbConfig.development.dialect
	});

// establish db connection
async function checkConnection() {
	try {
		await sequelize.authenticate();
		console.log('connected to database...');
	} catch (err) {
		console.error("unable to connect to database", err);
	}
}

module.exports = {
	checkConnection: checkConnection,
	sequelize: sequelize
}