import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormControl } from "@angular/forms";
import { Subscription } from 'rxjs';
import { AppService } from './app.service';
import {PageEvent} from '@angular/material';
import {MatPaginator, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(MatPaginator) performancePaginator: MatPaginator;
  @ViewChild(MatPaginator) powerPaginator: MatPaginator;

  title = 'review-parser';

  foundApps = [];
  reviews = [];
  viewableReviews = [];

  performancePageIndex = 0;
  powerPageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 25];
  pageSize = 5;

  visibleKeywords = [
    "battery", "crash", " load", "server",
    "drain", " hang", "lag", "fps",
    "temperature", "frame rate", "cpu", "gpu",
    " heating", "freeze", "stutter", "resolution",
    "performance", "responsive"
  ]

  powerReviews = [];
  relevantPowerReviews = this.powerReviews
  viewablePowerReviews = this.relevantPowerReviews.slice(0, this.pageSize)

  performanceReviews = [];
  relevantPreformanceReviews = this.performanceReviews
  viewablePerformanceReviews = this.relevantPreformanceReviews.slice(0, this.pageSize)

  keywordStats;
  totalReviewsCollected;
  badReviewCount;
  badReviewPercentage;
  performanceCount;
  powerCount;
  performancePercentage;
  powerPercentage;
  userEmail;
  thinking = false;
  data_recieved = false;
  sent_email = localStorage.getItem('email') || false
  searchContext = "appStore";
  currentAppId;
  searchKeyWord;
  breakdown;
  appStoreRegions = [
    {code: "us", country: "US", language: "en"},
    {code: "cn", country: "China", language: "zh-CN"},
    {code: "gb", country: "UK", language: "en"},
    {code: "kr", country: "South Korea", language: "ko-KR"},
    {code: "fr", country: "France", language: "fr-FR"},
    {code: "in", country: "India", language: "hi-IN"},
    {code: "ru", country: "Russia", language: "ru-RU"}
  ];
  selectedRegion = {code: "us", country: "US", language: "en"};

  constructor(private appService: AppService) {}

  ngOnInit() {

  }

  cleanSlate(){
    this.foundApps = [];
    this.performancePercentage = null;
    this.powerPercentage = null;
    this.badReviewPercentage = null;
    this.searchKeyWord = null;
    this.data_recieved = false;
  }

  onChange(value){
    this.cleanSlate();
    if(value.checked === true){
      this.searchContext = "playStore"
    }else{
      this.searchContext = "appStore"
    }
  }

  onPowerPage(page){
    this.viewablePowerReviews = this.relevantPowerReviews.slice(page.pageIndex, page.pageIndex + page.pageSize)
  }

  onPerformancePage(page){
    console.log(page.pageIndex*page.pageSize + " vs " + page.length)
    if(page.pageIndex*page.pageSize > page.length){
      console.log("performance index: " + this.performancePageIndex)
      console.log("page index: " + page.pageIndex)
      this.performancePageIndex = 0;
      page.pageIndex = 0
      console.log("at least this works")
    }
    this.viewablePerformanceReviews = this.relevantPreformanceReviews.slice((page.pageIndex*page.pageSize), (page.pageIndex*page.pageSize) + page.pageSize)

  }

  doApplicationThings(application, region) {
    this.setKeyWord(application.name);
    this.currentAppId = application.id
    this.getReviewStats(application.id, region);
    if(this.sent_email){
      this.getRelevantReviews(application.id, region);
    }
  }

  setKeyWord(name){
    this.searchKeyWord = name
  }

  updateSearch(form){
    var keyword = form.value.searchKeyWord.trim()
    if(keyword){
      if(this.searchContext == "appStore"){
        this.appService.getAppStoreApps(keyword, this.selectedRegion.code)
        .subscribe(response => {
          this.foundApps = response;
        })
        //*****//
        // this.foundApps = this.appService.mockAppStoreApps(keyword)
      }else{
        this.appService.getPlayStoreApps(keyword, this.selectedRegion.code)
        .subscribe(response => {
          this.foundApps = response;
        })
      }

    }else{
      this.foundApps = []
    }

  }

  getRelevantReviews(id, region){
    if(this.searchContext == "appStore"){
      this.appService.getRelevantAppStoreReviews(id, region.country)
      .subscribe(response => {

        this.powerReviews = this.relevantPowerReviews = response.power_reviews.reviews;
        this.viewablePowerReviews = this.powerReviews.slice(0, this.pageSize)

        this.performanceReviews = this.relevantPreformanceReviews = response.performance_reviews.reviews;
        this.viewablePerformanceReviews = this.performanceReviews.slice(0, this.pageSize)
      })
    }else{
      // I dont think this exists on the front end yet
      this.appService.getRelevantPlayStoreReviews(id, region.country)
      .subscribe(response => {
        this.powerReviews = response.power_reviews.reviews;
        this.viewablePowerReviews = this.powerReviews.slice(0, this.pageSize)

        this.performanceReviews = response.performance_reviews.reviews;
        this.viewablePerformanceReviews = this.performanceReviews.slice(0, this.pageSize)
      })
    }

  }

  getReviews(id, region){
    if(this.searchContext == "appStore"){
      this.appService.getAppStoreReviews(id, region.country)
      .subscribe(response => {
        this.reviews = response;
        this.viewableReviews = this.reviews.slice(0, this.pageSize)
      })
    }else{
      // I dont think this exists on the front end yet
      this.appService.getPlayStoreReviews(id, region.country)
      .subscribe(response => {
        this.reviews = response;
        this.viewableReviews = this.reviews.slice(0, this.pageSize)
      })
    }

  }

  getReviewStats(id, region){
    this.badReviewPercentage = null;
    this.performancePercentage = null;
    this.powerPercentage = null;
    this.data_recieved = false;
    this.thinking = true;
    if(this.searchContext == "appStore"){
      this.appService.getAppStoreReviewStats(id)
      .subscribe(response => {
        console.log("review stats ")
        console.log(response)
        this.keywordStats = response["keywordStats"]
        this.totalReviewsCollected = response["totalReviewsCollected"];
        this.badReviewCount = response["badReviewCount"];
        this.badReviewPercentage = response["badReviewPercentage"];
        this.performancePercentage = response["performancePercentage"];
        this.powerPercentage = response["powerPercentage"];
        this.performanceCount = response["performanceCount"];
        this.powerCount = response["powerCount"];
        this.thinking = false;
        this.data_recieved = true
      })
      //********//
      // var response = this.appService.mockAppStoreReviewStats(id)
      // this.badReviewPercentage = response["badReviewPercentage"]
      // this.performancePercentage = response["performancePercentage"];
      // this.powerPercentage = response["powerPercentage"];
      // this.thinking = false;
    }else{
      console.log("region in component:")
      console.log(region)
      this.appService.getPlayStoreReviewStats(id, region.language)
      .subscribe(response => {
        this.keywordStats = response["keywordStats"]
        this.totalReviewsCollected = response["totalReviewsCollected"];
        this.badReviewCount = response["badReviewCount"];
        this.badReviewPercentage = response["badReviewPercentage"]
        this.performancePercentage = response["performancePercentage"];
        this.powerPercentage = response["powerPercentage"];
        this.performanceCount = response["performanceCount"];
        this.powerCount = response["powerCount"];
        this.thinking = false;
        this.data_recieved = true
      })
    }
  }

  submitEmail(email) {
    this.appService.sendEmail(email)
    .subscribe((response: any) => {
      console.log("email response: ")
      console.log(response)
      if(response.status == 200) {
        localStorage.setItem('email', email);

        this.getRelevantReviews(this.currentAppId, this.selectedRegion);
        this.sent_email = email
      }
    })
  }

  validEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  starArray(number) {
    var arry = Array(parseInt(number)).fill("star")
    return arry
  }

  percentOf(x, y) {
    return ((x/y)*100).toFixed(2)
  }

  filterReviewsByKeyword(reviews, keyword) {
    return reviews.filter(review => review.keywords.includes(keyword))
  }

  trim(text) {
    return text.trim();
  }

  resetPaginator() {
    this.performancePaginator.length = this.viewablePerformanceReviews.length;
    setTimeout(()=>{
      this.performancePaginator.pageIndex = 0;
    },25)
    this.performancePaginator.firstPage();

    this.powerPaginator.length = this.viewablePowerReviews.length;
    setTimeout(()=>{
      this.powerPaginator.pageIndex = 0;
    },25)
    this.powerPaginator.firstPage();
  }

  resetRelevantReviews() {
    this.resetPaginator();

    this.relevantPowerReviews = this.powerReviews
    this.viewablePowerReviews = this.relevantPowerReviews.slice(0, this.pageSize)

    this.relevantPreformanceReviews = this.performanceReviews
    this.viewablePerformanceReviews = this.relevantPreformanceReviews.slice(0, this.pageSize)
  }

  selectRelevantReviews(keyword) {
    //powerReviews = [];
    this.resetPaginator();
    console.log("index: " + this.performancePageIndex)
    this.powerPageIndex = 0;
    this.performancePageIndex = 0;

    this.relevantPowerReviews = this.filterReviewsByKeyword(this.powerReviews, keyword)
    this.viewablePowerReviews = this.relevantPowerReviews.slice(0, this.pageSize)

    this.relevantPreformanceReviews = this.filterReviewsByKeyword(this.performanceReviews, keyword);
    this.viewablePerformanceReviews = this.relevantPreformanceReviews.slice(0, this.pageSize)
  }

}
