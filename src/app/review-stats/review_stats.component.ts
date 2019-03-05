import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormControl } from "@angular/forms";
import { Subscription } from 'rxjs';
import {PageEvent} from '@angular/material';
import {MatPaginator, MatTableDataSource} from '@angular/material';

import { AppService } from '../app.service';
import { ReviewService } from '../review.service';

@Component({
  selector: 'review-stats',
  templateUrl: './review_stats.component.html',
  styleUrls: ['./review_stats.component.css']
})
export class ReviewStatsComponent {

  data_recieved = false;
  keywordStats;
  totalReviewsCollected;
  badReviewCount;
  badReviewPercentage;
  performanceCount;
  powerCount;
  performancePercentage;
  powerPercentage;
  thinking;

  constructor(private appService: AppService, private reviewService: ReviewService) {
    reviewService.reviewStats$.subscribe(
      appInfo => {
        this.getReviewStats(appInfo.appId, appInfo.context, appInfo.region);
      }
    );
  }

  ngOnInit() {

  }

  getReviewStats(id, context, region){
    this.badReviewPercentage = null;
    this.performancePercentage = null;
    this.powerPercentage = null;
    this.data_recieved = false;
    this.thinking = true;
    if(context == "appStore"){
      this.appService.getAppStoreReviewStats(id)
      .subscribe(response => {
        this.keywordStats = response["keywordStats"]
        this.totalReviewsCollected = response["totalReviewsCollected"];
        this.badReviewCount = response["badReviewCount"];
        this.badReviewPercentage = response["badReviewPercentage"];
        this.performancePercentage = response["performancePercentage"];
        this.powerPercentage = response["powerPercentage"];
        this.performanceCount = response["performanceCount"];
        this.powerCount = response["powerCount"];

        this.thinking = false;
        this.reviewService.thinkingIs(false);
        this.data_recieved = true
      })
    }else{
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
        this.reviewService.thinkingIs(false);
        this.data_recieved = true
      })
    }
  }
}
