module.exports = function (app) {
	var controller = require('../controllers/usersController');

	app.route('/users')
		.get(controller.list_users);

	app.get('/', function (req, res) {
		res.send("Hello World!");
	});

};
