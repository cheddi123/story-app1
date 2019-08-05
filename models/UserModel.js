const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	firstname: { type: String },
	lastname: { type: String },
	email: { type: String, required: true, unique: true, uniqueCaseInsensitive: true },
	username: {
		type: String,
		required: true,
		minlength: [5, 'need at least 5 characters'],
		unique: true,
		uniqueCaseInsensitive: true,
	},
	password: { type: String, required: true },
	date: { type: Date, default: Date.now },
});


module.exports = mongoose.model('user', UserSchema);
