var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var BadgeSchema = new Schema({
    name: { type: String, required: 'badge name is required', index: { unique: true } },
    description: String,
    type: String,
    threshold: Number,
    image: String
  });
  
  module.exports = mongoose.model('Badges', BadgeSchema);
  