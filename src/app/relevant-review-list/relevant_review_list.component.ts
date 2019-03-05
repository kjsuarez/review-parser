import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormControl } from "@angular/forms";
import { Subscription } from 'rxjs';
import {PageEvent} from '@angular/material';
import {MatPaginator, MatTableDataSource} from '@angular/material';

import { AppService } from '../app.service';
import { ReviewService } from '../review.service';

@Component({
  selector: 'relevant-review-list',
  templateUrl: './relevant_review_list.component.html',
  styleUrls: ['./relevant_review_list.component.css']
})
export class RelevantReviewListComponent {
  @ViewChild(MatPaginator) performancePaginator: MatPaginator;
  @ViewChild(MatPaginator) powerPaginator: MatPaginator;

  performancePageIndex = 0;
  powerPageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 25];
  pageSize = 5;
  relevantReviewsDirty = false;

  powerReviews = [];
  relevantPowerReviews = this.powerReviews
  viewablePowerReviews = this.relevantPowerReviews.slice(0, this.pageSize)

  performanceReviews = [];
  relevantPreformanceReviews = this.performanceReviews
  viewablePerformanceReviews = this.relevantPreformanceReviews.slice(0, this.pageSize)
  data_recieved = false;



  constructor(private appService: AppService, private reviewService: ReviewService) {
    reviewService.relevantReviews$.subscribe(
      appInfo => {
        this.getRelevantReviews(appInfo.appId, appInfo.context, appInfo.region);
      }
    );
  }

  ngOnInit() {

  }

  getRelevantReviews(id, context, region){
    this.data_recieved = false;
    if(context == "appStore"){
      console.log("look at me")
      this.appService.getRelevantAppStoreReviews(id, region.country)
      .subscribe(response => {

        this.powerReviews = this.relevantPowerReviews = response.power_reviews.reviews;
        this.viewablePowerReviews = this.powerReviews.slice(0, this.pageSize)

        this.performanceReviews = this.relevantPreformanceReviews = response.performance_reviews.reviews;
        this.viewablePerformanceReviews = this.performanceReviews.slice(0, this.pageSize)
        this.data_recieved = true
      })
    }else{
      // I dont think this exists on the front end yet
      this.appService.getRelevantPlayStoreReviews(id, region.country)
      .subscribe(response => {
        this.powerReviews = response.power_reviews.reviews;
        this.viewablePowerReviews = this.powerReviews.slice(0, this.pageSize)

        this.performanceReviews = response.performance_reviews.reviews;
        this.viewablePerformanceReviews = this.performanceReviews.slice(0, this.pageSize)
        this.data_recieved = true
      })
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

  starArray(number) {
    var arry = Array(parseInt(number)).fill("star")
    return arry
  }

  filterReviewsByKeyword(reviews, keyword) {
    return reviews.filter(review => review.keywords.includes(keyword))
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

}
