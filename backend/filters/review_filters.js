var request = require('request-promise');
var rex = require('request');
var express = require('express');
const fs = require('fs');
var async = require('async');

// var power_dictionary = [
//   "battery", "power", "temperature", "heating"
// ]
// var performance_dictionary = [
//   "Slow", "graphic", "graphics", "crash",
//   "lag", "resolution", "performance", "responsive",
//   "fps", "frame rate", "cpu", "gpu", "freeze",
//    "stutter", "janks", "judder", "shaky"]


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
  "Slow", "crash", "load", "server",
  "lag", "resolution", "performance", "responsive",
  "fps", "frame rate", "cpu", "gpu", "freeze",
   "stutter", "janks", "judder", "shaky",
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
"Lent", "graphique", "crash",
   "lag", "resolution", "performance", "responsive",
   "geler", "bégayer", "cadence",
"느리게", "그래픽", "충돌",
   "지연", "해결", "성과", "반응",
   "동결", "더듬기", "프레임 속도"]

function reviewBreackdown(result) {

  bad_reviews = badReviews(result)

  console.log("bad reviews:");
  console.log(bad_reviews);

  power_related_reviews = filterReviewsByKeywordSet(bad_reviews, power_dictionary)
  performance_related_reviews = filterReviewsByKeywordSet(bad_reviews, performance_dictionary)

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
