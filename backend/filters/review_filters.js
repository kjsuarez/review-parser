var request = require('request-promise');
var rex = require('request');
var express = require('express');
const fs = require('fs');
var async = require('async');

var power_dictionary =  [
  "battery", "drain", "temperature", "heating",
  "batería", "poder", "potencia", "temperatura", "calefacción", "sobrecalentar",
  "bateria", "potência", "temperatura", "aquecimento", "sobreaquecimento",
  "батарейка", "мощность", "температура", "нагрев", "перегрев",
  "батарея", "питание", "температура", "нагрев", "перегрев",
  "电池", "电源", "温度", "加热", "过热",
  "Batterie", "Leistung", "Temperatur", "Heizung", "Überhitzung",
  "batterie", "alimentation", "température", "chauffage", "surchauffe",
  "배터리", "전원", "온도", "난방", "과열"
]
var performance_dictionary =  [
  "slow", "crash", " load", "server", " hang",
  "lag", "resolution", "performance", "responsive",
  "fps", "frame rate", "cpu", "gpu", "freeze",
   "stutter", "jank", "judder", "shaky",
"Lento", "gráfico", "gráficos", "bloqueo",
   "retraso", "resolución", "rendimiento", "sensible",
   "congelar", "tartamudear", "velocidad de fotogramas",
"resolução", "responsivo",
   "congelar", "gaguejar", "taxa de fotogramas",
   "медленный", "медленное", "медленная", "графический",
    "поломка", "лаг", "отставание", "запаздывание",
    "отзывчивость", "отклик", "кадры в секунду",
    "процессор", "ЦПУ",
     "заедание", "остановка", "запинание",
    "джанк", "дерганный", "трясущийся", "дрожащий",
 "графика", "сбой",
  "разрешение", "производительность", "отзывчивый",
   "стоп-кадр", "заикание", "частота", "кадров",
"慢", "图形", "崩溃",
   "滞后", "决议", "表现", "反应灵敏",
   "冻结", "口吃", "帧率",
"Langsam", "Grafik", "Absturz",
   "Verzögerung", "Auflösung", "Leistung", "ansprechend",
   "einfrieren", "stottern", "bildrate",
"Lent", "graphique",
   "lag", "resolution", "performance", "responsive",
   "geler", "bégayer", "cadence",
"느리게", "그래픽", "충돌",
   "지연", "해결", "성과", "반응",
   "동결", "더듬기", "프레임 속도"]

function reviewBreackdown(result) {

  bad_reviews = badReviews(result)

  power_related_review_data = filterReviewsByKeywordSet(bad_reviews, power_dictionary)
  power_related_reviews = power_related_review_data.reviews

  performance_related_review_data = filterReviewsByKeywordSet(bad_reviews, performance_dictionary)
  performance_related_reviews = performance_related_review_data.reviews

  power_keyword_stats = power_related_review_data.keywordStats
  performance_keyword_stats = performance_related_review_data.keywordStats

  var all_keyword_stats = Object.assign({}, power_keyword_stats, performance_keyword_stats);

  if (bad_reviews.length > 0) {
    console.log("power stats: ");
    console.log(power_related_review_data.keywordStats);

    breakdown = {
      totalReviewsCollected: result.length,
      badReviewCount: bad_reviews.length,
      badReviewPercentage: xPercentOfy(bad_reviews, result),
      powerCount: power_related_reviews.length,
      powerPercentage: xPercentOfy(power_related_reviews, bad_reviews),
      performanceCount: performance_related_reviews.length,
      performancePercentage: xPercentOfy(performance_related_reviews, bad_reviews),
      keywordStats: all_keyword_stats
    }
  } else {
    breakdown = {
      totalReviewsCollected: result.length,
      badReviewCount: bad_reviews.length,
      badReviewPercentage: 0,
      powerCount: 0,
      powerPercentage: 0,
      performanceCount: 0,
      performancePercentage: 0,
      keywordStats: []
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
  console.log("inside keyword filter, review array length:" + reviews.length);
  var keyword_stats = buildKeywordStats(keywords)
  var keywords_in_review;
  var output = {reviews: [], keywordStats: keyword_stats};

  reviews.forEach(function(review) {
    keywords_in_review = [];
    keywords.forEach(function(keyword) {
      if (review["content"].toLowerCase().includes(keyword.toLowerCase())) {
        console.log("found a match");
        keywords_in_review = keywords_in_review.concat(keyword)
        keyword_stats[keyword] += 1

      }
    })
    console.log("keywords_in_review after keyword loop: " + keywords_in_review.length);
    if (keywords_in_review.length > 0) {
      output.reviews = output.reviews.concat({review: review, keywords: keywords_in_review})
    }
    keywords_in_review = [];
  })

  output.keyWordStats = keyword_stats
  return output//reviews.filter(review =>  containsAtLeastOneOf(review["content"], keywords) )
}

function buildKeywordStats(keywords) {
  var keyWordStats = {}
  keywords.forEach(function(keyword) {
    keyWordStats[keyword] = 0
  });
  return keyWordStats
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

function relevantReviews(result) {
  bad_reviews = badReviews(result)

  power_related_reviews = filterReviewsByKeywordSet(bad_reviews, power_dictionary)
  performance_related_reviews = filterReviewsByKeywordSet(bad_reviews, performance_dictionary)

  return {power_reviews: power_related_reviews, performance_reviews: performance_related_reviews}
}

module.exports = {
  reviewBreackdown: reviewBreackdown,
  relevantReviews: relevantReviews
};
