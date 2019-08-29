module.exports = function (app) {
    var badgesController = require('../controllers/badgesController');

    app.route('/badges')
        .post(badgesController.add_badge)
        .get(badgesController.get_badges)
    
}