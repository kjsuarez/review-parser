var express = require('express');
var request = require('request');
var itunesSearchApi = require('itunes-search-api');
var appScraper = require('app-store-scraper');
var gplay = require('google-play-scraper');
var playStoreApiToucher = require('../api_toucher/play_store_api')
var md5 = require('md5');
var async = require('async');

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
      console.log("app store app in question: " + appId);
      console.log("reviews pulled for this app: " + result.length);
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
            console.log("app store reviews in insert-many: " + reviews.length)
            resolve({
              title: 'success',
              message: 'found app store review duplicates but otherwise fine',
              appStoreReviews: reviews
            })
          } else {
            resolve({
              title: 'Something went pear shaped trying to save review',
              error: err
            })
          }
        } else {
          console.log("app store reviews in insert-many: " + reviews.length)
          resolve({
            title: 'success',
            message: "reviews saved!",
            appStoreReviews: reviews
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
        review_id = md5(review["link"])
        playStoreReview = new PlayStoreReview({
          _id: review_id,
          appId: appId,
          rating: review["rating"],
          text: review["content"],
          date: review["date"],
          version: "unknown",
          region: region
        });

        reviews = reviews.concat(playStoreReview)
      })

      PlayStoreReview.insertMany(reviews, {ordered: false}, function (err, result) {
        if (err) {
          if (err.code == 11000) {
            console.log("play store reviews in insert-many: " + reviews.length)
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
          console.log("play store reviews in insert-many: " + reviews.length)
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

function pullAppStoreAppReviews(appId) {
  return new Promise(function(resolve, reject) {
    AppStoreReview.find({appId: appId}, function(err, reviews) {
      if (err) {
        resolve({
          title: 'error collecting app ids',
          error: err
        })
      } else {
        resolve({
          title: 'success',
          apps: reviews
        })
      }
    });
  });
}

function pullPlayStoreAppReviews(appId) {
  return new Promise(function(resolve, reject) {
    PlayStoreReview.find({appId: appId}, function(err, reviews) {
      if (err) {
        resolve({
          title: 'error collecting app ids',
          error: err
        })
      } else {
        resolve({
          title: 'success',
          apps: reviews
        })
      }
    });
  });
}


function updateAll(){
  return new Promise(function(resolve, reject) {

    PlayStoreReview.find().distinct('appId', function(play_err, play_store_apps) {
      if (play_err) {
        resolve({
          title: 'error collecting app ids',
          error: play_err
        })
      } else {
        console.log("play store apps to be updated: ")
        console.log(play_store_apps);
        async.each(play_store_apps, function(app, callback) {
          savePlayStoreReviews(app).then((result) => {
            callback(result);
          })
        }, function(err) {
            if( play_err ) {
              resolve({
                title: 'error',
                apps: err
              })
            }
            AppStoreReview.find().distinct('appId', function(app_err, app_store_apps) {
              if (app_err) {
                resolve({
                  title: 'error collecting app ids',
                  error: play_err
                })
              } else {
                console.log("app store apps to be updated: ")

                async.each(app_store_apps, function(app, callback) {
                  console.log(app);
                  saveAppStoreReviews(app).then((result) => {
                    callback(result);
                  })
                },function(err) {

                    if( err ) {
                      resolve(err.title == 'success' ? { title: 'success', apps: err } :
                                                       { title: 'error', apps: err });
                    }else{
                      resolve({
                        title: 'made it',
                        apps: play_store_apps.concat(app_store_apps)
                      })
                    }
                  })
              }

            })
        });
      }
    });
  });
}

module.exports = {
  saveAppStoreReviews: saveAppStoreReviews,
  savePlayStoreReviews: savePlayStoreReviews,
  pullAppStoreApps: pullAppStoreApps,
  pullPlayStoreApps: pullPlayStoreApps,
  pullAppStoreAppReviews: pullAppStoreAppReviews,
  pullPlayStoreAppReviews: pullPlayStoreAppReviews,
  updateAll: updateAll
};
