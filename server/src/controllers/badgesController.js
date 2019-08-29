var mongoose = require('mongoose');
var User = mongoose.model('Users');
var Session = mongoose.model('Sessions');
var Badge = mongoose.model('Badges');



exports.get_user_badges = (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err) res.status(500).send("User not found");
        else {
            Badge.find({
                _id: { $in: user.badges }
            }, (err, badges) => {
                if (err) res.status(500).send("Error " + err);
                else res.status(200).json(badges);
            });
        }
    });
}

exports.get_badges = (req, res) => {
    Badge.find({}, (err, badges) => {
        if(err) res.status(500).error("Error " + err);
        else {
            res.status(200).json(badges);
        }

    })
}

exports.add_badge = (req, res) => {
    var newBadge = new Badge(req.body);
    //Save the badge only if it's not already present
    Badge.findOne({
        name: newBadge.name
    }, (err, badge) => {
        if (badge == null) {
            newBadge.save();
        }
    });

}



exports.add_user_badge = (req, res) => {
    User.findById(req.params.id, async (err, user) => {
        if (err) res.status(500).send("User not found");
        else {
            Badge.findOne({
                name: req.body.name
            }, async (err, badge) => {
                if (badge != null) {
                    user.badges.push(badge._id);
                    await user.save();
                    res.status(201).json(newBadge)
                }
            });
         
        }
    });
}