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
      aggregateMultiLanguageReviews(id, language, resolve, reject)
    } else {
      aggregateReviews(id, language, resolve, reject)
    }
  }).catch(error => {
    console.log(error);
  });
}

function aggregateReviews(id, language='en', resolve, reject) {
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
  }, function(err) {
    if (err) {
      console.log(err);
      return reject(err)
    }else {
      return resolve(output)
    }
  });
}

function collectReviews(id, language='en') {
    var out_of_reviews = false
    var output = []
    var count = 0;
    return new Promise(function(resolve, reject) {
      async.times(13, function(count, callback) {
        getPageOfReviews(id, count + 1)
        .then((result) => {
          if (result.length > 0) {
            output = output.concat(result)
            // console.log("getting page " + count + " of "+id);
          }else{
            out_of_reviews = true;
          }
          callback(null, result);
        })
        .catch((err)=> console.log(err))
      }, function(err, reviews) {
        if (err) {
          console.log(err);
          return reject(err)
        }else {

          return resolve(reviews)
        }
      });
    }).catch(error => {
      console.log(error);
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
      getPageOfReviews(id, count - 12, language)
      .then((result) => {
        if (result.length > 0) {
          output = output.concat(result)
        }else{
          out_of_reviews = true;
        }
        callback(null, count);
      })
      .catch((err)=> console.log(err))
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

function delayPromise(duration) {
  return function(...args){
    return new Promise(function(resolve, reject){
      setTimeout(function(){
        resolve(...args);
      }, duration)
    });
  };
}

function getPageOfReviews(id, page, language='en') {
  return gplay.reviews({
    appId: id,
    page: page,
    lang: language,
    sort: gplay.sort.NEWEST
  });
}

function getPageOfPopApps(index=0) {
  num = 3
  return gplay.list({
    category: gplay.category.GAME,
    collection: gplay.collection.TOP_FREE,
    num: num,
    start: index
  })

}

function getReviewsForTheseApps(apps) {
  reviews = [];
  return new Promise(function(resolve, reject) {
    async.eachOfSeries(apps, function(app, index, callback) {
      collectReviews(app.appId).then((thisAppsReviews) => {
        thisAppsReviews = thisAppsReviews[0]
        reviews = reviews.concat(thisAppsReviews)
        setTimeout(()=> {
          console.log("play store "+(index + 1)+" of "+ apps.length);
          callback();
        },(1000))
      })
    }, function(err) {
        if( err ) {
          console.log(err);
          reject(err)
        } else {
          // console.log("total reviews length: " + reviews.length);
          resolve(reviews)
        }
    });
  }).catch(error => {
    console.log(error);
  });
}

function getPopularApps() {
  var out_of_reviews = false
  var output = []
  var count = 0;

  return new Promise(function(resolve, reject) {
    getPageOfPopApps(count).then((result) => {
      // console.log("pulled these apps from play store: " + result.length);
      if (result.length > 0) {
        output = output.concat(result)
      }else{
        out_of_reviews = true;
      }
      resolve(result)
    })
    .catch(error => {
      console.log(error);
    });

    //TODO pull multiple pages of reviews

    // async.times(2, function(count, callback) {
    //   getPageOfPopApps(count).then((result) => {
    //     if (result.length > 0) {
    //       output = output.concat(result)
    //     }else{
    //       out_of_reviews = true;
    //     }
    //     callback(null, count);
    //   })
    // }, function(err, users) {
    //   if (err) {
    //     console.log(err);
    //     return resolve([])
    //   }else {
    //     console.log(output.length);
    //     return resolve(output)
    //   }
    // });
  })
}


module.exports = {
  getReviewsFor: getReviewsFor,
  preanSearchResults: preanSearchResults,
  preanReviewResults: preanReviewResults,
  getPopularApps: getPopularApps,
  getReviewsForTheseApps: getReviewsForTheseApps
};
