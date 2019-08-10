const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const passport = require('passport');
const nodemailer = require('nodemailer');
const keys = require("../config/keys")

//Bring in LocalUser Model
const UserModel = require('../models/UserModel');

// GET Register form
router.get('/register', (req, res) => {
	res.render('user/register');
});

// POST Register FORM

router.post(
	'/register',
	[
		check('firstname')
			.not()
			.isEmpty()
			.withMessage('First name is required')
			.matches(/^[a-zA-Z]+$/)
			.withMessage('First Name must ONLY BE  Alpha chars'),
		check('lastname')
			.not()
			.isEmpty()
			.withMessage('Last name is required')
			.matches(/^[a-zA-Z]+$/)
			.withMessage('Last Name must ONLY BE  Alpha chars'),
		check('email', 'Email is required')
			.not()
			.isEmpty(),
		check('email', 'Email is not Valid').isEmail(),

		check('username')
			.not()
			.isEmpty()
			.withMessage('UserName is required')
			.matches('^[a-zA-Z0-9_]*$')
			.withMessage('UserName must ONLY be AlphaNumeric'),

		check('password', 'Password is required')
			.not()
			.isEmpty(),
		check('password')
			.isLength({ min: 5 })
			.withMessage('Password must be at least 5 chars long'),
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
			console.log(req.session.data);
			req.flash('errors', errors.array());

			return res.render('user/register', { errors: req.flash('errors') });
		} else {
			const newUser = new UserModel({
				local: {
					firstname,
					lastname,
					email,
					username,
					password,
				},
			});

			bcrypt.genSalt(10, function(err, salt) {
				bcrypt.hash(newUser.local.password, salt, function(err, hash) {
					if (err) {
						console.log(err);
					}
					// Store hash in your password DB.
					newUser.local.password = hash;
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
router.get('/login', (req, res) => {
	res.render('user/login');
});

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

// GET email form
router.get('/email', (req, res) => {
	res.render('index/contact');
});

//POST Email
router.post('/email', (req, res) => {
	const output = `
	<p> You have a new contact </p>
	<h3> Contact details </h3>
	<ul> 
	<li> Name :${req.body.name} </li>
	<li> Company :${req.body.company} </li>
	<li>Phone Email :${req.body.email} </li>
	<li>Phone Number :${req.body.phoneNumber} </li>
	<li> Message:${req.body.message} </li>
	</ul>
	<h4> Message : ${req.body.message}
	`;
	// create reusable transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',

		port: 465,
		secure: true, // true for 465, false for other ports
		auth: {
			user: keys.userEmail,
			// generated ethereal user
			pass:  keys.userPassword,
			// generated ethereal password
		},
		
	});

	// send mail with defined transport object
	let info = {
		from: ' "Ched Tech" <cheddi.tech@gmail.com>', // sender address
		to: 'cheddi.charles@gmail.com', // list of receivers
		subject: 'Hello ✔', // Subject line
		text: 'Hello world?', // plain text body
		html: output, // html body
	};

	transporter.sendMail(info, (err, data) => {
		if (err) {
			console.log(err);
		} else {
			console.log('Message sent: %s', data.messageId);
			// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

			// Preview only available when sending through an Ethereal account
			console.log('Preview URL: %s', nodemailer.getTestMessageUrl(data));
			// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
			res.render('index/contact');
		}
	});
});

module.exports = router;




