var mongoose = require('mongoose');
var User = mongoose.model('Users');
var sha512 = require('js-sha512');

var aes = require('aes-js');
var key_256 = Array(32).fill(0).map(Number.call, Number); // 32 * 8 = 256
var aesCtr = new aes.ModeOfOperation.ctr(key_256, new aes.Counter(5)); // counter start is arbitrary

exports.list_users = (req, res) => {
	User.find({}, (err, user) => {
		if (err)
			res.send(err);
		res.json(user);
	});
};

exports.login_user = (req, res) => {

  var body = req.body;
  if (body.token) {
    console.log("TOKEN");
	} else {
	  var name = body.username;
	  var password = body.password;
	  User.findOne({ username: name }, (err, user) => {
		  if (err) res.send(err);
		  if (user != null) {
			  user.comparePassword(password, (pswErr, isMatch) => {
				  if (pswErr) res.send(pswErr);
				  if (isMatch) res.send(user);
				  else res.status(401).json({ message: "Password Errata"});
			  });
		  } else {
			  res.status(401).json({ message: "Username non trovato"});
		  }
	  });
  }
}

exports.create_user = (req, res) => {
	var newUser = new User(req.body);
	newUser.accessToken = generateAccessToken(newUser);
	newUser.save(function (err, user) {
		if (err) res.send(err);
		res.status(201).json(user);
	});
};

function generateAccessToken(user) {
	var userHash = sha512(user.username);
	var plainBytes = aes.utils.utf8.toBytes(userHash);
  var encryptedBytes = aesCtr.encrypt(plainBytes);
	var tokenId = aes.utils.hex.fromBytes(encryptedBytes);
	return {
			id: tokenId,
			expirationTime: Date.now()  + 1000 * 60 * 60 * 24 * 30 // 30 days
  }
}
