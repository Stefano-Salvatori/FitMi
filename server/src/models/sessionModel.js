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

SessionSchema.methods.totalMins = function () {
  const diffMs = (this.end.getTime() - this.start.getTime());
	return Math.round(((diffMs % 86400000) % 3600000) / 60000);
}

module.exports = mongoose.model('Sessions', SessionSchema);
