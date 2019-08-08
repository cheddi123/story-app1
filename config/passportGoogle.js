const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const keys = require('./keys');
const User = require('../models/UserModel');

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(null, user);
		});
	});

	// GOOGLE STRATEGY

	passport.use(
		new GoogleStrategy(
			{
				clientID: keys.googleClientID,
				clientSecret: keys.googleClientSecret,
				callbackURL: '/auth/google/callback',
				proxy: true,
			},
			(accessToken, refreshToken, profile, done) => {
				// console.log(accessToken);
				console.log(profile.photos[0].value);
				const newUser = {
					google: {
						googleID: profile.id,
						firstname: profile.name.givenName,
						lastname: profile.name.familyName,
						email: profile.emails[0].value,
						photo:profile.photos[0].value
					},
				};
				// check for existing user

				User.findOne({ 'google.googleID': profile.id }).then(user => {
					if (user) {
						done(null, user);
					} else {
						new User(newUser).save().then(user => done(null, user));
					}
				});
			}
		)
	);

	// Local Strategy
	passport.use(
		new LocalStrategy(function(username, password, done) {
			// Match UserName
			User.findOne({ 'local.username': username.toLowerCase() }, function(err, user) {
				// console.log("my hash passowrd : "+ user.local.password)
				if (err) {
					return done(err);
				}
				if (!user) {
					return done(null, false, { message: 'No user found' });
				}
				// Match Password
				// if (!user.verifyPassword(password)) { return done(null, false); }
				// return done(null, user);

				bcrypt.compare(password, user.local.password, (err, isMatched) => {
					if (err) throw err;
					if (isMatched) {
						console.log(user);
						return done(null, user);
					} else {
						return done(null, false, { message: 'wrong password' });
					}
				});
			});
		})
	);
};
