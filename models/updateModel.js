var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var updateModel = new Schema({
  text: String,
  date: Date,
  user: Schema.Types.Mixed,
  book: Schema.Types.Mixed
});

module.exports = mongoose.model('Update', updateModel);
