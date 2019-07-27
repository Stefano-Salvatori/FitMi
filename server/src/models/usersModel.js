var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
  username: {
    type: String,
    required: 'username is required'
	},
  name: {
    type: String,
    required: 'name is required'
  },
  surname: {
    type: String,
    required: 'surname is required'

  },
});

module.exports = mongoose.model('Users', UserSchema);