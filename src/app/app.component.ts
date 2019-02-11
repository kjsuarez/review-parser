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
  performancePercentage;
  powerPercentage;
  badReviewPercentage;
  thinking = false;
  searchContext = "appStore";
  searchKeyWord;
  breakdown;
  appStoreRegions = [
    {code: "us", country: "US"},
    {code: "cn", country: "China"},
    {code: "gb", country: "UK"},
    {code: "kr", country: "South Korea"},
    {code: "fr", country: "France"},
    {code: "in", country: "India"},
    {code: "ru", country: "Russia"}
  ];
  selectedRegion = 'us';
  selectedLanguage = 'en';

  constructor(private appService: AppService) {}

  ngOnInit() {

  }

  cleanSlate(){
    this.foundApps = [];
    this.performancePercentage = null;
    this.powerPercentage = null;
    this.badReviewPercentage = null;
    this.searchKeyWord = null;
  }

  onChange(value){
    this.cleanSlate();
    if(value.checked === true){
      this.searchContext = "playStore"
    }else{
      this.searchContext = "appStore"
    }
  }

  setKeyWord(name){
    this.searchKeyWord = name
    console.log("the keyword is: " + this.searchKeyWord)
  }

  updateSearch(form){
    var keyword = form.value.searchKeyWord.trim()
    if(keyword){
      if(this.searchContext == "appStore"){
        this.appService.getAppStoreApps(keyword)
        .subscribe(response => {
          this.foundApps = response;
        })
        //*****//
        // this.foundApps = this.appService.mockAppStoreApps(keyword)
      }else{
        this.appService.getPlayStoreApps(keyword, this.selectedRegion)
        .subscribe(response => {
          this.foundApps = response;
        })
      }

    }else{
      this.foundApps = []
    }

  }

  getReviews(id, region){
    this.appService.getAppStoreReviews(id, region)
    .subscribe(response => {
      console.log(response[0])
      this.reviews = response;
    })
  }

  getReviewStats(id, region){
    console.log("region: " + region)
    this.badReviewPercentage = null;
    this.performancePercentage = null;
    this.powerPercentage = null;
    this.thinking = true;
    if(this.searchContext == "appStore"){
      this.appService.getAppStoreReviewStats(id)
      .subscribe(response => {
        console.log(response)
        this.badReviewPercentage = response["badReviewPercentage"]
        this.performancePercentage = response["performancePercentage"];
        this.powerPercentage = response["powerPercentage"];
        this.thinking = false;
      })
      //********//
      // var response = this.appService.mockAppStoreReviewStats(id)
      // this.badReviewPercentage = response["badReviewPercentage"]
      // this.performancePercentage = response["performancePercentage"];
      // this.powerPercentage = response["powerPercentage"];
      // this.thinking = false;
    }else{
      this.appService.getPlayStoreReviewStats(id)
      .subscribe(response => {
        console.log(response)
        this.badReviewPercentage = response["badReviewPercentage"]
        this.performancePercentage = response["performancePercentage"];
        this.powerPercentage = response["powerPercentage"];
        this.thinking = false;
      })
    }

  }
}
