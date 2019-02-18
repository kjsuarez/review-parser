var request = require('request-promise');
var rex = require('request');
var express = require('express');
const fs = require('fs');
var async = require('async');

var storeScraper = require('app-store-scraper');

function getReviewsFor(id, region='us') {
  return new Promise(function(resolve, reject) {
    var out_of_reviews = false
    var output = []

    async.times(10, function(count, callback) {
      getPageOfReviews(id, region, count + 1).then((result) => {
        data = JSON.parse(result)
        if (data["feed"]["entry"]) {
          output = output.concat(data["feed"]["entry"])
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


function getPageOfReviews(id, region = 'us', page) {
  return request({ // 840784742, yelp: 284910350
    uri: 'https://itunes.apple.com/'+ region +'/rss/customerreviews/page='+ page +'/id='+ id +'/sortby=mostrecent/json',
    qs: {
    }
  });
}

function preanSearchResults(results) {
  results = results.body.results
  results = results.map(result => {
    return {id: result.trackId, name: result.trackName, developer: result.artistName}
  })
  return results
}

function preanReviewResults(results) {
  results = results.map(result => {
    return {rating: result["im:rating"]["label"], version: result["im:version"]["label"], title: result["title"]["label"], content: result["content"]["label"], link: result["author"]["uri"]["label"]}
  })
  return results
}

function narrowResult(keyword, results) {
  results = results.filter(result => result.name.toLowerCase().includes(keyword.toLowerCase()))
  return results
}

function getPopularApps() {
  return new Promise(function(resolve, reject) {
    storeScraper.list({
      collection: storeScraper.collection.TOP_FREE_IOS,
      category: storeScraper.category.GAMES,
      num: 200
    })
    .then((result) => {
      resolve(result) 
    })
    .catch(console.log);
  })

}



module.exports = {
  getReviewsFor: getReviewsFor,
  preanSearchResults: preanSearchResults,
  narrowResult: narrowResult,
  getPopularApps: getPopularApps,
  preanReviewResults: preanReviewResults
};
