const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongooose = require('mongoose');
const keys = require('./keys');
const User = require('../models/UserModel');

module.exports = function(passport) {
	passport.use(
		new GoogleStrategy(
			{
				clientID: keys.googleClientID,
				clientSecret: keys.googleClientSecret,
				callbackURL: '/auth/google/callback',
				proxy: true,
			},
			(accessToken, refreshToken, profile, done) => {
				// console.log(accessToken)
				// console.log(profile)
				const newUser = {
					googleID: profile.id,
					firstname: profile.name.givenName,
					lastname: profile.name.familyName,
					email: profile.emails[0].value,
				};
				// check for existing user
				User.findOne({ googleID: profile.id }).then(user => {
					if (user) {
						done(null, user);
					} else {
						// create user
						new User(newUser).save().then(user => done(null, user));
					}
				});
			}
		)
	);

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(null, user);
		});
	});
};
