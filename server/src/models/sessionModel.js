var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var SessionSchema = new Schema({
  start: Date,
  end: Date,
  type: String,
  steps:  { type: Number, default: 0 },
  calories: { type: Number, default: 0 },
  distance:  { type: Number, default: 0 },
  heart_frequency: [{timestamp: Date,value: Number}]
});

module.exports = mongoose.model('Sessions', SessionSchema);
