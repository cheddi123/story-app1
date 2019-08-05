module.exports = {
	ensureAuthenticated: function(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			req.flash('danger', 'Please Login');
			res.redirect('/user/login');
		}
    },
    ensureGuest: function(req,res,next){
        if (req.isAuthenticated()) {
			return next();
		} else {
			
			res.send("Page not found");
		}
    }
};

