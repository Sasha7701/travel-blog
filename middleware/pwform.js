function pwform(password) {
	return function(req, res, next) {
		if (req.signedCookies.authenticated || req.query.password === password) {
			res.cookie("authenticated", true, { signed: true });
			return next();
		}
		let message = "";

		if (req.query.password) {
			message = "Incorrect password, please try again";
			console.log("Failed password attempt from " + req.ip);

		}
		res.status(403);
		res.render("pwform", { message: message });
	};
}


module.exports = pwform;

