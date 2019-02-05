var request = require('request-promise');
var rex = require('request');
var express = require('express');
const fs = require('fs');
var async = require('async');

function getReviewsFor(id) {
  return new Promise(function(resolve, reject) {
    var out_of_reviews = false
    var output = []
    var count = 0;

    async.whilst(
        function() { return count < 10 && !out_of_reviews; },
        function(callback) {
          count++;
          getPageOfReviews(id, count).then((result) => {
            data = JSON.parse(result)
            if (data["feed"]["entry"]) {
              output = output.concat(data["feed"]["entry"])
            }else{
              out_of_reviews = true;
            }
            callback(null, count);
          });
        },
        function (err, n) {
            resolve(output)
        }
    );
  });
}


function getPageOfReviews(id, page) {
  return request({ // 840784742, yelp: 284910350
    uri: 'https://itunes.apple.com/us/rss/customerreviews/page='+ page +'/id='+ id +'/sortby=mostrecent/json',
    qs: {
    }
  });
}

function preanSearchResults(results) {
  results = results.body.results
  results = results.map(result => {
    return {id: result.trackId, trackName: result.trackName, artistName: result.artistName}
  })
  return results
}

module.exports = {
  getReviewsFor: getReviewsFor,
  preanSearchResults: preanSearchResults
};
