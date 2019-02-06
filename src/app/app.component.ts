import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl } from "@angular/forms";
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
  thinking = false;
  searchContext = "appStore";

  constructor(private appService: AppService) {}

  ngOnInit() {

  }

  onChange(value){
    this.foundApps = []
    if(value.checked === true){
      this.searchContext = "playStore"
    }else{
      this.searchContext = "appStore"
    }
  }

  updateSearch(form){
    var keyword = form.value.searchKeyWord.trim()
    if(keyword){
      if(this.searchContext == "appStore"){
        this.appService.getAppStoreApps(keyword)
        .subscribe(response => {
          this.foundApps = response;
        })
      }else{
        this.appService.getPlayStoreApps(keyword)
        .subscribe(response => {
          this.foundApps = response;
        })
      }

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
    this.badReviewPercentage = null;
    this.performancePercentage = null;
    this.powerPercentage = null;
    this.thinking = true;
    this.appService.getAppStoreReviewStats(id)
    .subscribe(response => {
      this.badReviewPercentage = response["badReviewPercentage"]
      this.performancePercentage = response["performancePercentage"];
      this.powerPercentage = response["powerPercentage"];
      this.thinking = false;
    })
  }
}
