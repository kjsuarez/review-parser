var request = require('request-promise');
var rex = require('request');
var express = require('express');
const fs = require('fs');
var async = require('async');

var gplay = require('google-play-scraper');

function preanSearchResults(results) {
  results = results.map(result => {
    return {id: result.appId, name: result.title, developer: result.developer}
  })
  return results
}

function preanReviewResults(results) {
  results = results.map(result => {
    return {rating: result["score"], title: result["title"], content: result["text"], link: result["url"], date: result["date"]}
  })
  return results
}

function getReviewsFor(id, language='en') {
  return new Promise(function(resolve, reject) {
    var out_of_reviews = false
    var output = []
    var count = 0;
    if (language != 'en') {
      aggregateMultiLanguageReviews(id, language, resolve)
    } else {
      aggregateReviews(id, language, resolve)
    }
  });
}

function aggregateReviews(id, language='en', resolve) {
  var out_of_reviews = false
  var output = []
  var count = 0;

  async.times(13, function(count, callback) {
    getPageOfReviews(id, count + 1).then((result) => {
      if (result.length > 0) {
        output = output.concat(result)
      }else{
        out_of_reviews = true;
      }
      callback(null, count);
    });
  }, function(err, users) {
    if (err) {
      console.log(err);
      return resolve([])
    }else {
      return resolve(output)
    }
  });
}

function aggregateMultiLanguageReviews(id, language='en', resolve) {
  var out_of_reviews = false
  var output = []
  var count = 0;
  // 1 page = 40 reviews, 13 pages is 520 reviews, we want to
  // collect about 500 reviews from english and the language of this region.

  async.times(26, function(count, callback) {
    if (count > 13) {
      getPageOfReviews(id, count - 12, language).then((result) => {
        if (result.length > 0) {
          output = output.concat(result)
        }else{
          out_of_reviews = true;
        }
        callback(null, count);
      });
    }else{
      getPageOfReviews(id, count + 1).then((result) => {
        if (result.length > 0) {
          output = output.concat(result)
        }else{
          out_of_reviews = true;
        }
        callback(null, count);
      });
    }

  }, function(err, users) {
    if (err) {
      console.log(err);
      return resolve([])
    }else {
      return resolve(output)
    }
  });
}

function blankReviewStats() {
  return {
    totalReviewsCollected: 0,
    badReviewCount: bad_reviews.length,
    badReviewPercentage: 0,
    powerCount: 0,
    powerPercentage: 0,
    performanceCount: 0,
    performancePercentage: 0
  }
}

function getPageOfReviews(id, page, language='en') {
  return gplay.reviews({
    appId: id,
    page: page,
    lang: language,
    sort: gplay.sort.NEWEST
  });
}



module.exports = {
  getReviewsFor: getReviewsFor,
  preanSearchResults: preanSearchResults,
  preanReviewResults: preanReviewResults
};
