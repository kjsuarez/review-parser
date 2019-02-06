var express = require('express');
var router = express.Router();
var request = require('request');
var gplay = require('google-play-scraper');

var playStoreApiToucher = require('../api_toucher/play_store_api')

router.get('/play-store-search/:keyword', function (req, res, next) {

  gplay.search({
    term: req.params.keyword,
    num: 10
  }).then(result => {
    result = playStoreApiToucher.preanSearchResults(result)

    res.status(200).json({
      message: 'success',
      obj: result
    })
    }).catch(error => {
      console.log(error);
  });
});

router.get('/reviews/:gameId', function (req, res, next) {
  playStoreApiToucher.getReviewsFor(req.params.gameId).then((result) => {
    //result = playStoreApiToucher.preanReviewResults(result)
    res.status(200).json({
      message: 'success',
      obj: result
    })
  });
});

router.get('/review-breackdown/:id', function (req, res, next) {

  playStoreApiToucher.getReviewsFor(req.params.id).then((result) => {
    result = appStoreApiToucher.preanReviewResults(result)

    breackdown = playStoreApiToucher.reviewBreackdown(result)
    res.status(200).json({
      message: 'success',
      obj: breackdown
    })
  });
});


module.exports = router;
