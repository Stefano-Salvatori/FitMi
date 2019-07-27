var mongoose = require('mongoose');

var User = mongoose.model('Users');

exports.list_users = function(req, res) {
	User.find({}, function(err, user) {
		if (err)
			res.send(err);
		res.json(user);
	});
};