var express = require('express');
var router = express.Router();
var request = require('request');
var itunesSearchApi = require('itunes-search-api');
var appScraper = require('app-store-scraper');
var gplay = require('google-play-scraper');
var playStoreApiToucher = require('../api_toucher/play_store_api')
var md5 = require('md5');

const appStoreApiToucher = require('../api_toucher/app_store_api')
var resultFilter = require('../filters/review_filters')

var Review = require('../models/review');
var AppStoreReview = Review.appStoreReview
var PlayStoreReview = Review.playStoreReview

var bigApps = [
  {appId: "284910350", store: "app"},
  {appId: "com.gamebench.metricscollector", store: "play"}
]

router.post('/', (req, res, next) => {
  appStoreApiToucher.getReviewsFor("284910350").then((result) => {
    result = appStoreApiToucher.preanReviewResults(result)
    reviews = [];

    result.forEach(function(review) {
      review_id = md5(review["link"])
      appStoreReview = new AppStoreReview({
        _id: review_id,
        appId: "284910350",
        rating: review["rating"],
        text: review["content"],
        date: Date.now().toString(),
        version: review["version"],
        region: "us"
      });

      reviews = reviews.concat(appStoreReview)
    })

    AppStoreReview.insertMany(reviews, {ordered: false}, function (err, result) {
      if (err) {
        if (err.code == 11000) {
          return res.status(200).json({
            title: 'found review duplicates but otherwise fine'
          });
        } else {
          return res.status(500).json({
            title: 'Something went pear shaped trying to save review',
            error: err
          });
        }

      } else {
        res.status(200).json({
          message: 'success',
          obj: "reviews saved!"
        })
      }
    });

  }).catch(error => {
    console.log(error);
  });
})

module.exports = router;
