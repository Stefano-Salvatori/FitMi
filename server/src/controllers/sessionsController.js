var mongoose = require('mongoose');
var User = mongoose.model('Users');
var Session = mongoose.model('Sessions');

mongoose.set('debug', true);

exports.list_sessions = (req, res) => {
	User.findById(req.params.id, (err, user) => {
		Session.find({
			_id: { $in: user.sessions }
		}, (err,sessions) => {
			res.json(sessions);
		});
	});
};


exports.add_session = (req, res) => {
	var newSession = new Session(req.body);
	newSession.save(function (err, session) {
		if (err) res.send(err);
		res.status(201).json(session);
	});
	User.findById(req.params.id, (err, user) => {
		user.sessions.push(newSession.id);
		user.save();
	});

};

