const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  _id: String,
  appId: String,
  rating: String,
  text: String,
  date: String,
  version: String,
  region: String
});

module.exports = {
  appStoreReview: mongoose.model('Review', schema, 'appStoreReviews'),
  playStoreReview: mongoose.model('Review', schema, 'playStoreReviews')
};
