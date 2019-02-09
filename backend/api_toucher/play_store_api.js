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
    return {rating: result["score"], title: result["title"], content: result["text"], link: result["url"]}
  })
  return results
}

function getReviewsFor(id) {
  return new Promise(function(resolve, reject) {
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
        resolve([])
      }else {
        resolve(output)
      }
    });
  });
}

function blankReviewStats() {
  return {
    badReviewCount: bad_reviews.length,
    badReviewPercentage: 0,
    powerCount: 0,
    powerPercentage: 0,
    performanceCount: 0,
    performancePercentage: 0
  }
}

function getPageOfReviews(id, page) {
  return gplay.reviews({
    appId: id,
    page: page,
    sort: gplay.sort.NEWEST
  });
}



module.exports = {
  getReviewsFor: getReviewsFor,
  preanSearchResults: preanSearchResults,
  preanReviewResults: preanReviewResults
};
