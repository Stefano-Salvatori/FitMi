var mongoose = require('mongoose');
var User = mongoose.model('Users');

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
				else res.send('password errata');
			});
		}
	});
}

exports.create_user = (req, res) => {
	var newUser = new User(req.body);
	newUser.save(function (err, user) {
		if (err) res.send(err);
		res.status(201).json(user);
	});
};