var mongoose = require('mongoose');
var User = mongoose.model('Users');
var Session = mongoose.model('Sessions');



exports.list_sessions = (req, res) => {
	User.findById(req.params.id, (err, user) => {
		if (err) res.status(500).send("User not found");
		else {
			Session.find({
				_id: { $in: user.sessions }
			}, (err, sessions) => {
				if (err) res.status(500).send("Error " + err);
				else res.status(200).json(sessions);
			});
		}
	});
};


exports.add_session = (req, res) => {
	User.findById(req.params.id, async (err, user) => {
		if (err) res.status(404).send("User not found")
		else {
			var newSession = new Session(req.body);
			user.sessions.push(newSession.id);
			user.score += 10;
			user.statistics.totalCalories += newSession.calories;
			user.score += Math.floor(newSession.calories / 10)

			user.statistics.totalSteps += newSession.steps;
			user.score += Math.floor(newSession.steps / 1000)

			user.statistics.totalKm += newSession.distance;
			user.score += Math.floor(newSession.distance / 1000)

			user.score += Math.floor(newSession.totalMins()/15);

			user.statistics.totalSessions += 1;
			var userLastSession = await lastSession(user).catch(() => { });
			if (userLastSession!==null) {
				if (userLastSession.start.getYear() === newSession.start.getYear()
					&& userLastSession.start.getMonth() === newSession.start.getMonth()
					&& (userLastSession.start.getDay() === newSession.start.getDay() || userLastSession.start.getDay() === newSession.start.getDay() + 1)) {
					user.statistics.sessionStreak += 1;
				} else {
					user.statistics.sessionStreak = 0;
				}
			} else {
				user.statistics.sessionStreak += 1;
			}
			newSession.save((err, session) => {
				if (err) res.status(500).send("Error saving session " + err);
				else {
					user.save();
					res.status(201).json(session);
				}
			});
		}
	});

};

exports.last_session = (req, res) => {
	User.findById(req.params.id, async (err, user) => {
		if (err) res.status(500).send("User not found");
		else res.status(200).json(await lastSession(user))
	});
};

/**
 * Find the last session of a user
 * 
 * @param user the user to find the last session for
 */
function lastSession(user) {
	return Session
		.find({ _id: { $in: user.sessions } })
		.sort({ start: 'desc' })
		.limit(1)
		.findOne()
		.exec();
}

