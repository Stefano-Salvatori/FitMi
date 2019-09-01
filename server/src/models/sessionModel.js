var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var SessionSchema = new Schema({
  start: Date,
  end: Date,
  type: String,
  steps:  { type: Number, default: 0 },
  calories: { type: Number, default: 0 },
  distance:  { type: Number, default: 0 },
  heart_frequency: [{
    timestamp: Date,
    value: Number
  }],
  gps_path: [{
    accuracy: { type: Number, default: 0 },
    altitude: { type: Number, default: 0 },
    altitudeAccuracy: { type: Number, default: 0 },
    heading: { type: Number, default: 0 },
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
    speed: { type: Number, default: 0 },
  }]
});



SessionSchema.methods.totalMins = function () {
  const diffMs = (this.end.getTime() - this.start.getTime());
	return Math.round(((diffMs % 86400000) % 3600000) / 60000);
}

module.exports = mongoose.model('Sessions', SessionSchema);
