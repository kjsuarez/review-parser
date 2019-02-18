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
      return res.status(result.title == 'success' ? 200 : 500).json(result);
    }).catch(error => {
      console.log(error);
    });

  } else if (req.params.store == 'play') {

    dbToucher.savePlayStoreReviews(req.params.appId).then((result) => {
      return res.status(result.title == 'success' ? 200 : 500).json(result);
    }).catch(error => {
      console.log(error);
    });

  }else{
    return res.status(500).json({
      title: "illegal store specified",
      message: ("store: " + req.params.store)
    });
  }
});

router.get('/apps/:store/list', (req, res, next) => {
  if (req.params.store == 'app') {

    dbToucher.pullAppStoreApps().then((result) => {
      return res.status(result.title == 'success' ? 200 : 500).json(result);
    }).catch(error => {
      console.log(error);
    });

  }else if (req.params.store == 'play'){
    dbToucher.pullPlayStoreApps().then((result) => {
      return res.status(result.title == 'success' ? 200 : 500).json(result);
    }).catch(error => {
      console.log(error);
    });
  } else {
    return res.status(500).json({
      title: "illegal store specified",
      message: ("store: " + req.params.store)
    });
  }
});

router.get('/apps/:appId/:store/list', (req, res, next) => {
  if (req.params.store == 'app') {

    dbToucher.pullAppStoreAppReviews(req.params.appId).then((result) => {
      return res.status(result.title == 'success' ? 200 : 500).json(result);
    }).catch(error => {
      console.log(error);
    });

  }else if (req.params.store == 'play'){
    dbToucher.pullPlayStoreAppReviews(req.params.appId).then((result) => {
      return res.status(result.title == 'success' ? 200 : 500).json(result);
    }).catch(error => {
      console.log(error);
    });
  } else {
    return res.status(500).json({
      title: "illegal store specified",
      message: ("store: " + req.params.store)
    });
  }
});

router.post('/update-all', (req, res, next) => {

  dbToucher.updateAll().then((result) => {
    return res.status(result.title == 'success' ? 200 : 500).json(result);
  }).catch(error => {
    console.log(error);
  });


});

module.exports = router;
