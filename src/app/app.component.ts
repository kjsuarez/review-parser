import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl } from "@angular/forms";
import { Subscription } from 'rxjs';
import { AppService } from './app.service';
import {PageEvent} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'review-parser';

  foundApps = [];
  reviews = [];
  viewableReviews = [];

  pageSizeOptions: number[] = [5, 10, 25];
  pageSize = 5;

  powerReviews = [];
  viewablePowerReviews = this.powerReviews.slice(0, this.pageSize)

  performanceReviews = [];
  viewablePerformanceReviews = this.performanceReviews.slice(0, this.pageSize)

  keywordStats;
  totalReviewsCollected;
  badReviewCount;
  badReviewPercentage;
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
    this.viewablePowerReviews = this.powerReviews.slice(page.pageIndex, page.pageIndex + page.pageSize)
  }

  onPerformancePage(page){
    this.viewablePerformanceReviews = this.performanceReviews.slice((page.pageIndex*page.pageSize), (page.pageIndex*page.pageSize) + page.pageSize)
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

        this.powerReviews = response.power_reviews.reviews;
        this.viewablePowerReviews = this.powerReviews.slice(0, this.pageSize)

        this.performanceReviews = response.performance_reviews.reviews;
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
        console.log(response)
        this.badReviewPercentage = response["badReviewPercentage"]
        this.performancePercentage = response["performancePercentage"];
        this.powerPercentage = response["powerPercentage"];
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

}
