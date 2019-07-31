var mongoose = require('mongoose');
var User = mongoose.model('Users');
var sha512 = require('js-sha512');

exports.list_users = (req, res) => {
	User.find({}, (err, user) => {
		if (err)
			res.send(err);
		res.json(user);
	});
};

exports.login_user = (req, res) => {
	var name = req.body.username;
	var password = req.body.password;

	User.findOne({ username: name }, (err, user) => {
		if (err) res.send(err);
		if (user != null) {
			console.log(name, password);
			user.comparePassword(password, (pswErr, isMatch) => {
				if (pswErr) res.send(pswErr);
				if (isMatch) res.send(user);
				else res.status(401).json({ message: "Password Errata"});
			});
		} else {
			res.status(401).json({ message: "Username non trovato"});
		}
	});
}

exports.create_user = (req, res) => {
	var newUser = new User(req.body);
	newUser.accessToken = generateAccessToken(newUser);
	newUser.save(function (err, user) {
		if (err) res.send(err);
		res.status(201).json(user);
	});
};

function generateAccessToken(user) {
	return {
			id: sha512(user.username),
			expirationTime: Date.now() + 1000 * 60 * 60 * 24 * 30 // 30 days
  }
}
