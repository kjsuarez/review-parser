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
          region: region
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

function savePlayStoreReviews(appId, region='us') {
  return new Promise(function(resolve, reject) {

    playStoreApiToucher.getReviewsFor(appId).then((result) => {
      result = playStoreApiToucher.preanReviewResults(result)
      reviews = [];

      result.forEach(function(review) {
        //review_id = md5(review["url"])
        playStoreReview = new PlayStoreReview({
          _id: review["id"],
          appId: appId,
          rating: review["score"],
          text: review["text"],
          date: review["date"],
          version: "unknown",
          region: region
        });

        reviews = reviews.concat(playStoreReview)
      })

      PlayStoreReview.insertMany(reviews, {ordered: false}, function (err, result) {
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

function pullAppStoreApps(){
  console.log("here I am");
  return new Promise(function(resolve, reject) {
    AppStoreReview.find().distinct('appId', function(err, apps) {
      if (err) {
        resolve({
          title: 'error collecting app ids',
          error: err
        })
      } else {
        resolve({
          title: 'success',
          apps: apps
        })
      }
    });
  });
}

function pullPlayStoreApps(){
  return new Promise(function(resolve, reject) {
    PlayStoreReview.find().distinct('appId', function(err, apps) {
      if (err) {
        resolve({
          title: 'error collecting app ids',
          error: err
        })
      } else {
        resolve({
          title: 'success',
          apps: apps
        })
      }
    });
  });
}

module.exports = {
  saveAppStoreReviews: saveAppStoreReviews,
  savePlayStoreReviews: savePlayStoreReviews,
  pullAppStoreApps: pullAppStoreApps,
  pullPlayStoreApps: pullPlayStoreApps
};
