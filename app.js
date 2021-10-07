const express = require('express');
require('dotenv').config();

const port = process.env.PORT || 3000;
const app = express();

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());

// sequelize connection
const checkConnection = require('./config/db').checkConnection;
checkConnection();


// -------------- ROUTES ----------
// home route
app.get('/', (req, res) => {
	res.json({ msg: 'welcome home !' });
});

// users routes
const userRouter = require('./routes/user');
app.use('/users', userRouter);





// start server
app.listen(port, () => {
	console.log(`server started at port ${port}`)
});