require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const userRoutes = require("./routes/userRoutes")
const storyRoutes = require("./routes/storyRoutes")
const indexRoutes = require("./routes/indexRoutes")
const methodOverride = require('method-override')

// HELPERS
const {stripTags} = require("./helpers/ejshelper")

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

// Use a static folder and include middleware
app.use(express.static('public'));
// initializing ejs
app.set('view engine',
   
 'ejs');

//EXPRESS SESSION MIDDLEWARE  be sure to use session() before passport.session() to ensure that the login session is restored in the correct order.
app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: false,
	})
);

// EXPRESS MESSAGES MIDDLEWARE
app.use(flash());

// Passport Config Put this before routes
require('./config/passport')(passport);
//Passport Middleware. Put this before routes
app.use(passport.initialize());
app.use(passport.session());

// Always put local middlware after Passport middleware
app.use(function(req, res, next) {
	res.locals.user = req.user || null;
	res.locals.messages = require('express-messages')(req, res);
	res.locals.errors = req.flash('errors');
    res.locals.moment = require('moment');
    res.locals.text_truncate = require("./helpers/ejshelper")

	next();
});

// ROUTES MIDDLEWARE
app.use("/user",userRoutes)
app.use("/stories",storyRoutes)
app.use("/",indexRoutes)

mongoose.set('useCreateIndex', true);
const url = process.env.DATABASE   || 'mongodb://localhost/Storytell_Db';

// const url ='mongodb://localhost/Article_Db';
mongoose.connect(url, { useNewUrlParser: true }, err => {
	if (err) throw err;
	console.log('database connected');
});

app.listen(PORT, (req, res) => {
	console.log(`Server is listening on ${PORT}`);
});
