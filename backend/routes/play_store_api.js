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
    // result = playStoreApiToucher.narrowResult(req.params.keyword, result)

    res.status(200).json({
      message: 'success',
      obj: result
    })
    }).catch(error => {
      console.log(error);
  });


});


module.exports = router;
