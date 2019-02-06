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

function reviewBreackdown(result) {

  bad_reviews = badReviews(result)

  console.log("bad reviews:" + bad_reviews.length);

  power_related_reviews = filterReviewsByKeywordSet(bad_reviews, ["I", "power", "battery"])
  performance_related_reviews = filterReviewsByKeywordSet(bad_reviews, ["the", "performance"])

  if (bad_reviews.length > 0) {
    breakdown = {
      badReviewCount: bad_reviews.length,
      badReviewPercentage: xPercentOfy(bad_reviews, result),
      powerCount: power_related_reviews.length,
      powerPercentage: xPercentOfy(power_related_reviews, bad_reviews),
      performanceCount: performance_related_reviews.length,
      performancePercentage: xPercentOfy(performance_related_reviews, bad_reviews)
    }
  } else {
    breakdown = {
      badReviewCount: bad_reviews.length,
      badReviewPercentage: 0,
      powerCount: 0,
      powerPercentage: 0,
      performanceCount: 0,
      performancePercentage: 0
    }
  }

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

module.exports = {
  getReviewsFor: getReviewsFor,
  preanSearchResults: preanSearchResults,
  // narrowResult: narrowResult,
  preanReviewResults: preanReviewResults,
  reviewBreackdown: reviewBreackdown
};
