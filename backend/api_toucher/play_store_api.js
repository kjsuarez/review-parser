var request = require('request-promise');
var rex = require('request');
var express = require('express');
const fs = require('fs');
var async = require('async');

function preanSearchResults(results) {
  results = results.map(result => {
    return {id: result.appId, name: result.title, developer: result.developer}
  })
  return results
}


module.exports = {
  // getReviewsFor: getReviewsFor,
  preanSearchResults: preanSearchResults//,
  // narrowResult: narrowResult,
  // preanReviewResults: preanReviewResults,
  // reviewBreackdown: reviewBreackdown
};
