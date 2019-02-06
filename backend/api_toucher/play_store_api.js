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

    async.whilst(
        function() { return output.length < 500 && !out_of_reviews; },
        function(callback) {
          getPageOfReviews(id, count).then((result) => {
            if (result.length > 0) {
              output = output.concat(result)
            }else{
              out_of_reviews = true;
            }
            callback(null, count);
          });
          count++;
        },
        function (err, n) {
          resolve(output)
        }
    );
  });
}

function getPageOfReviews(id, page) {
  return gplay.reviews({
    appId: id,
    page: page,
    sort: gplay.sort.HELPFULNESS
  });
}



module.exports = {
  getReviewsFor: getReviewsFor,
  preanSearchResults: preanSearchResults,
  preanReviewResults: preanReviewResults
};
