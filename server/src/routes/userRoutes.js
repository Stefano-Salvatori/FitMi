module.exports = function (app) {
	var usersController = require('../controllers/usersController');

	app.route('/users')
		.post(usersController.create_user)
		.get(usersController.list_users);

	app.route('/users/login')
		.get(usersController.login_user);

	app.get('/', function (req, res) {
		res.send("Hello World!");
	});

};
