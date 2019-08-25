module.exports = function (app) {
	var usersController = require('../controllers/usersController');
	var sessionsController = require('../controllers/sessionsController');

	app.route('/users')
		.post(usersController.create_user)
		.get(usersController.list_users);

	app.route('/users/login')
		.post(usersController.login_user);


	app.route('/users/:id/sessions')
		.post(sessionsController.add_session)
		.get(sessionsController.list_sessions)

	app.get('/', function (req, res) {
		res.send("Hello World!");
	});

};
