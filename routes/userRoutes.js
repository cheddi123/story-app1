const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const passport = require('passport');

//Bring in User Model
const User = require('../models/UserModel');

// GET Register form
router.get("/register",(req,res)=>{
   res.render("user/register")
})

// POST Register FORM

router.post(
	'/register',
	[
		check('firstname' )
			.not()
			.isEmpty().withMessage('First name is required')
            .matches(/^[a-zA-Z]+$/).withMessage("First Name must ONLY BE  Alpha chars"),
            check('lastname' )
			.not()
			.isEmpty().withMessage('Last name is required')
			.matches(/^[a-zA-Z]+$/).withMessage("Last Name must ONLY BE  Alpha chars"),
		check('email', 'Email is required')
			.not()
			.isEmpty(),
		check('email', 'Email is not Valid').isEmail(),

		check('username' )
			.not()
			.isEmpty().withMessage('UserName is required')
			.matches("^[a-zA-Z0-9_]*$").withMessage("UserName must ONLY be AlphaNumeric"),
		
		check('password', 'Password is required')
			.not()
			.isEmpty(),
			check("password").isLength({min:5}).withMessage("Password must be at least 5 chars long"),
		check('password2', 'Passwords do not match').custom((value, { req }) => value === req.body.password),
	],

	(req, res) => {
	   
		
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
		const email = req.body.email;
		const username = req.body.username.toLowerCase();
		const password = req.body.password;
		// const password2 = req.body.password2;

		// Finds the validation errors in this request and wraps them in an object with handy functions
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// const firsterror = errors.array()
			// console.log(req.body);
			req.flash('errors', errors.array());
			return res.render('user/register', { errors: req.flash('errors'), newuser: req.body });
		} else {
			const newUser = new User({
                firstname,
                lastname,
				email,
				username,
				password,
			});

			bcrypt.genSalt(10, function(err, salt) {
				bcrypt.hash(newUser.password, salt, function(err, hash) {
					if (err) {
						console.log(err);
					}
					// Store hash in your password DB.
					newUser.password = hash;
					newUser.save(err => {
						if (err) {
							
							req.flash('danger', err.message);
							res.render('user/register');
							return;
						} else {
							req.flash('success', 'You are now registered');
							res.redirect('/user/login');
						}
					});
				});
			});
		}
	}
);

//GET Login form 
router.get("/login",(req,res)=>{
    res.render("user/login")
})

//Login Check
router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/dashboard',
		failureRedirect: '/user/login',
		failureFlash: true,
		successFlash: 'Welcome to Stories of All Kind',
	})
);

// logout
router.get('/logout', function(req, res) {
	req.logout();
	req.flash('success', 'You are logged out');
	res.redirect('/');
});

module.exports =router