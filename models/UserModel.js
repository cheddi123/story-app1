const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// const LocalUserSchema = new mongoose.Schema({
// 	firstname: { type: String },
// 	lastname: { type: String },
// 	email: { type: String, required: true, unique: true ,uniqueCaseInsensitive: true,},
// 	username: {
// 		type: String,
// 		required: true,
// 		minlength: [5, 'need at least 5 characters'],
// 		unique: true,
// 		uniqueCaseInsensitive: true,
		
// 	},
// 	password: { type: String, required: true },
// 	date: { type: Date, default: Date.now },
// });
// LocalUserSchema.plugin(uniqueValidator, { message: '{PATH} already exist' });

// UserSchema.post('save', function(error, doc, next) {
//     if (error.name=== 'MongoError' && error.code === 11000) {

// 		console.log(error)
//       next(new Error(error));
//     } else {
//       next();
//     }
//   });


// USERSCHEMA FOR GOOGLE 
const UserSchema = new mongoose.Schema({
	googleID:{type:String,required:true},
	firstname: { type: String },
	lastname: { type: String },
	email: { type: String, required: true,},
	
	date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('user', UserSchema);
