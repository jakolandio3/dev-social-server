const mongoose = require('mongoose');
const config = require('config');
const DB: string = config.get('mongoURI');

const connectDB = async () => {
	try {
		await mongoose.connect(DB);
		console.log('Mongo connected');
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};

module.exports = connectDB;
