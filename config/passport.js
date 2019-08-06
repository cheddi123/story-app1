const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');

module.exports = function(passport) {
	// Local Strategy
	passport.use(
		new LocalStrategy(function(username, password, done) {
			// Match UserName
			User.findOne({ username: username.toLowerCase() }, function(err, user) {
                if (err) { return done(err); }
				if (!user) {
					
					return done(null, false, { message: 'No user found' });
				}
				// Match Password
				// if (!user.verifyPassword(password)) { return done(null, false); }
				// return done(null, user);

				bcrypt.compare(password, user.password, (err, isMatched) => {
					if (err) throw err;
					if (isMatched) {
						console.log(user)
						return done(null, user);
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
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});
};

