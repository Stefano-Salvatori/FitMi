module.exports = function (app) {
	var usersController = require('../controllers/usersController');
	var sessionsController = require('../controllers/sessionsController');
	var badgesController = require('../controllers/badgesController');


	app.route('/users')
		.post(usersController.create_user)
		.get(usersController.list_users);

	app.route('/users/login')
		.post(usersController.login_user);

	app.route('/users/:id')
		.get(usersController.get_user);

	app.route('/users/:id/badges')
		.get(badgesController.get_user_badges)
		.post(badgesController.add_user_badge)

	app.route('/users/:id/sessions')
		.post(sessionsController.add_session)
		.get(sessionsController.list_sessions)

	app.route('/users/:id/sessions/last')
		.get(sessionsController.last_session)

};
