var express = require('express');
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

function saveAppStoreReviews(appId, region='us') {
  return new Promise(function(resolve, reject) {

    appStoreApiToucher.getReviewsFor(appId).then((result) => {
      result = appStoreApiToucher.preanReviewResults(result)
      reviews = [];

      result.forEach(function(review) {
        review_id = md5(review["link"])
        appStoreReview = new AppStoreReview({
          _id: review_id,
          appId: appId,
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
            resolve({
              title: 'success',
              message: 'found review duplicates but otherwise fine'
            })
          } else {
            resolve({
              title: 'Something went pear shaped trying to save review',
              error: err
            })
          }
        } else {
          resolve({
            title: 'success',
            message: "reviews saved!"
          })
        }
      });
    }).catch(error => {
      console.log(error);
    });
  });
}


module.exports = {
  saveAppStoreReviews: saveAppStoreReviews
};
