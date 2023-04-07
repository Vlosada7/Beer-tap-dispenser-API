const mongoose = require("mongoose");
const URL = "mongodb://127.0.0.1:27017/beer";

try {
	mongoose.connect(URL);
	console.log("Connected on DataBase");
} catch (error) {
	console.log(error);
}

module.exports = mongoose;
