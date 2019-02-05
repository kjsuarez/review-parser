import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Subscription } from 'rxjs';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'review-parser';

  foundApps = [];
  reviews = [];
  performancePercentage = null;
  powerPercentage = null;
  badReviewPercentage = null;

  constructor(private appService: AppService) {}

  ngOnInit() {

  }

  updateSearch(form){
    var keyword = form.value.searchKeyWord.trim()
    if(keyword){
      this.appService.getAppStoreApps(keyword)
      .subscribe(response => {
        this.foundApps = response;
      })
    }else{
      this.foundApps = []
    }

  }

  getReviews(id){
    this.appService.getAppStoreReviews(id)
    .subscribe(response => {
      console.log(response[0])
      this.reviews = response;
    })
  }

  getReviewStats(id){
    this.appService.getAppStoreReviewStats(id)
    .subscribe(response => {
      this.badReviewPercentage = response["badReviewPercentage"]
      this.performancePercentage = response["performancePercentage"];
      this.powerPercentage = response["powerPercentage"];
    })
  }
}
