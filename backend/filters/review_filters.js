var request = require('request-promise');
var rex = require('request');
var express = require('express');
const fs = require('fs');
var async = require('async');

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
  // getReviewsFor: getReviewsFor,
  // preanSearchResults: preanSearchResults,
  // // narrowResult: narrowResult,
  // preanReviewResults: preanReviewResults,
  reviewBreackdown: reviewBreackdown
};
