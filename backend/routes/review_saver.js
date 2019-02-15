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
var dbToucher = require('../db_toucher/db_toucher')

var Review = require('../models/review');
var AppStoreReview = Review.appStoreReview
var PlayStoreReview = Review.playStoreReview

var bigApps = [
  {appId: "284910350", store: "app"},
  {appId: "com.gamebench.metricscollector", store: "play"}
]

router.post('/update-reviews/:appId/:store', (req, res, next) => {

  if (req.params.store == 'app') {
    dbToucher.saveAppStoreReviews(req.params.appId).then((result) => {
      if (result.title == 'success') {
        return res.status(200).json(result);
      } else {
        return res.status(500).json(result);
      }
    }).catch(error => {
      console.log(error);
    });
  } else if (req.params.store == 'play') {
    // playstore saver
  }else{

  }


})

module.exports = router;
