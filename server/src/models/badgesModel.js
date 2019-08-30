var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var BadgeSchema = new Schema({
    name: { type: String, required: 'badge name is required', index: { unique: true } },
    description: String,
    type: String,
    scope: String,
    threshold: Number,
    points: {type: Number, default: 50},
    image: String
  });
  
  module.exports = mongoose.model('Badges', BadgeSchema);
  