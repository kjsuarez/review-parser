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

function reviewBreackdown(result) {

  bad_reviews = badReviews(result)

  power_related_reviews = filterReviewsByKeywordSet(bad_reviews, ["I", "power", "battery"])
  performance_related_reviews = filterReviewsByKeywordSet(bad_reviews, ["the", "performance"])
  var breakdown = {
    badReviewCount: bad_reviews.length,
    badReviewPercentage: xPercentOfy(bad_reviews, result),
    powerCount: power_related_reviews.length,
    powerPercentage: xPercentOfy(power_related_reviews, bad_reviews),
    performanceCount: performance_related_reviews.length,
    performancePercentage: xPercentOfy(performance_related_reviews, bad_reviews)
  }

  console.log(breakdown)
  return breakdown

}

function badReviews(result){
  return result.filter(review => parseInt(review["rating"]) < 4)
}

function xPercentOfy(x, y) {
  return parseInt((x.length/y.length)*100)
}

function filterReviewsByKeywordSet(reviews, keywords){
  return reviews.filter(review =>  containsAtLeastOneOf(review["content"], keywords) )
}

function containsAtLeastOneOf(str, arry) {
  pass = false
  arry.forEach(function(element) {
    if (str.toLowerCase().includes(element.toLowerCase())) {
      pass = true
    }
  });
  return pass
}

function preanSearchResults(results) {
  results = results.body.results
  results = results.map(result => {
    return {id: result.trackId, trackName: result.trackName, artistName: result.artistName}
  })
  return results
}

function preanReviewResults(results) {
  results = results.map(result => {
    return {rating: result["im:rating"]["label"], title: result["title"]["label"], content: result["content"]["label"], link: result["author"]["uri"]["label"]}
  })
  return results
}

function narrowResult(keyword, results) {
  results = results.filter(result => result.trackName.toLowerCase().includes(keyword.toLowerCase()))
  return results
}



module.exports = {
  getReviewsFor: getReviewsFor,
  preanSearchResults: preanSearchResults,
  narrowResult: narrowResult,
  preanReviewResults: preanReviewResults,
  reviewBreackdown: reviewBreackdown
};
