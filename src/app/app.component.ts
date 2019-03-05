import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormControl } from "@angular/forms";
import { Subscription } from 'rxjs';
import { AppService } from './app.service';
import { ReviewService } from './review.service';
import {PageEvent} from '@angular/material';
import {MatPaginator, MatTableDataSource} from '@angular/material';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ReviewService]
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

  emailCardVisible = false;
  relevantReviewsDirty = false;

  testyBoi = "shmoop";

  constructor(private appService: AppService, private reviewService: ReviewService) {
    reviewService.missionConfirmed$.subscribe(
      response => {
        this.testyBoi = response
      }
    );

    reviewService.thinking$.subscribe(
      response => { this.thinking = response }
    )
  }

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
    if(page.pageIndex*page.pageSize > page.length){
      this.performancePageIndex = 0;
      page.pageIndex = 0
    }
    this.viewablePerformanceReviews = this.relevantPreformanceReviews.slice((page.pageIndex*page.pageSize), (page.pageIndex*page.pageSize) + page.pageSize)

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



  submitEmail(email) {
    // this.appService.sendEmail(email)
    // .subscribe((response: any) => {
    //   if(response.status == 200) {
    //     localStorage.setItem('email', email);

        this.getRelevantReviews(this.currentAppId, this.selectedRegion);
        this.sent_email = email
    //   }
    // })
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
    if(this.performancePaginator){
      this.performancePaginator.length = this.viewablePerformanceReviews.length;
      setTimeout(()=>{
        if(this.performancePaginator){
          this.performancePaginator.pageIndex = 0;
        }
      },25)
      this.performancePaginator.firstPage();
    }

    if(this.powerPaginator){
      this.powerPaginator.length = this.viewablePowerReviews.length;
      setTimeout(()=>{
        if(this.powerPaginator){
          this.powerPaginator.pageIndex = 0;
        }
      },25)
      this.powerPaginator.firstPage();
    }
  }

  resetRelevantReviews() {
    if(this.relevantReviewsDirty) {
      this.relevantReviewsDirty = false

      this.relevantPowerReviews = this.powerReviews
      this.viewablePowerReviews = this.relevantPowerReviews.slice(0, this.pageSize)

      this.relevantPreformanceReviews = this.performanceReviews
      this.viewablePerformanceReviews = this.relevantPreformanceReviews.slice(0, this.pageSize)

      this.resetPaginator();
    }
  }

  selectRelevantReviews(keyword) {

    this.relevantReviewsDirty = true
    this.resetPaginator();
    this.powerPageIndex = 0;
    this.performancePageIndex = 0;

    this.relevantPowerReviews = this.filterReviewsByKeyword(this.powerReviews, keyword)
    this.viewablePowerReviews = this.relevantPowerReviews.slice(0, this.pageSize)

    this.relevantPreformanceReviews = this.filterReviewsByKeyword(this.performanceReviews, keyword);
    this.viewablePerformanceReviews = this.relevantPreformanceReviews.slice(0, this.pageSize)
  }

  toggleEmailCard() {
    this.emailCardVisible = !this.emailCardVisible
  }

}
