var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;


var UserSchema = new Schema({
  username: { type: String, required: 'username is required', index: { unique: true } },
  password: { type: String, required: 'password is required' },
  firstName: String,
  lastName: String,
  gender: String,
  birthDate: Date,
  height: Number,
  weight: Number,
  score: { type: Number, default: 0 },
  badges: [[Schema.Types.ObjectId]],
  statistics: {
    totalCalories: { type: Number, default: 0 },
    totalSteps: { type: Number, default: 0 },
    totalKm: { type: Number, default: 0 },
    totalSessions: { type: Number, default: 0 },
    sessionStreak: { type: Number, default: 0 }
  },
  sessions: [[Schema.Types.ObjectId]]
});

//Anytime we add a user we hash his password
UserSchema.pre('save', function (next) {
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

//Method to compare a password with the hashed one in the database.
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
}


module.exports = mongoose.model('Users', UserSchema);