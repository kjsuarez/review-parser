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


  title = 'review-parser';

  foundApps = [];
  reviews = [];
  viewableReviews = [];

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
  emailCardVisible = false;


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
  
  // getReviews(id, region){
  //   if(this.searchContext == "appStore"){
  //     this.appService.getAppStoreReviews(id, region.country)
  //     .subscribe(response => {
  //       this.reviews = response;
  //       this.viewableReviews = this.reviews.slice(0, this.pageSize)
  //     })
  //   }else{
  //     // I dont think this exists on the front end yet
  //     this.appService.getPlayStoreReviews(id, region.country)
  //     .subscribe(response => {
  //       this.reviews = response;
  //       this.viewableReviews = this.reviews.slice(0, this.pageSize)
  //     })
  //   }
  //
  // }

  // submitEmail(email) {
  //   this.appService.sendEmail(email)
  //   .subscribe((response: any) => {
  //     if(response.status == 200) {
  //       localStorage.setItem('email', email);
  //
  //       this.getRelevantReviews(this.currentAppId, this.selectedRegion);
  //       this.sent_email = email
  //     }
  //   })
  // }

  validEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }


  toggleEmailCard() {
    this.emailCardVisible = !this.emailCardVisible
  }

}
