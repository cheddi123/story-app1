const LocalStrategy = require('passport-local').Strategy;
const LocalUserModel = require('../models/LocalUserModel');
const bcrypt = require('bcryptjs');

module.exports = function(passport) {
	// Local Strategy
	passport.use(
		new LocalStrategy(function(username, password, done) {
			// Match UserName
			LocalUserModel.findOne({ username: username.toLowerCase() }, function(err, localuser) {
                if (err) { return done(err); }
				if (!localuser) {
					
					return done(null, false, { message: 'No user found' });
				}
				// Match Password
				// if (!user.verifyPassword(password)) { return done(null, false); }
				// return done(null, user);

				bcrypt.compare(password, localuser.password, (err, isMatched) => {
					if (err) throw err;
					if (isMatched) {
						console.log(localuser)
						return done(null, localuser);
					} else {
						return done(null, false, { message: 'wrong password' });
					}
				});
			});
		})
	);
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		LocalUserModel.findById(id, function(err, user) {
			done(null, user);
		});
	});
};

