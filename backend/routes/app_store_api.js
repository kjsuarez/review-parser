var express = require('express');
var router = express.Router();
var request = require('request');
var itunesSearchApi = require('itunes-search-api');
var appScraper = require('app-store-scraper');

const appStoreApiToucher = require('../api_toucher/app_store_api')
var resultFilter = require('../filters/review_filters')

router.get('/reviews/:gameId', function (req, res, next) {
  appStoreApiToucher.getReviewsFor(req.params.gameId).then((result) => {
    result = appStoreApiToucher.preanReviewResults(result)
    res.status(200).json({
      message: 'success',
      obj: result
    })
  }).catch(error => {
    console.log(error);
  });
});

router.get('/itunes-affiliate-search/:keyword', function (req, res, next) {

  const opts = {
  	query: {
  		entity: 'software',
  		limit: 10
  	}
  };
  // console.log(req.query);
  itunesSearchApi(req.params.keyword, opts).then(result => {
    result = appStoreApiToucher.preanSearchResults(result)
    result = appStoreApiToucher.narrowResult(req.params.keyword, result)
    res.status(200).json({
      message: 'success',
      obj: result
    });
  }).catch(error => {
    console.log(error);
  });
});

router.get('/review-breackdown/:id', function (req, res, next) {
  console.log("region: " + req.query.region);
  appStoreApiToucher.getReviewsFor(req.params.id, req.query.region).then((result) => {
    result = appStoreApiToucher.preanReviewResults(result)

    breackdown = resultFilter.reviewBreackdown(result)
    res.status(200).json({
      message: 'success',
      obj: breackdown
    })
  }).catch(error => {
    console.log(error);
  });
});

module.exports = router;
