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
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25];
  viewableReviews = this.reviews.slice(0, this.pageSize)
  performancePercentage;
  powerPercentage;
  badReviewPercentage;
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

  onPage(page){
    this.viewableReviews = this.reviews.slice(page.pageIndex, page.pageIndex + page.pageSize)
  }

  doApplicationThings(application, region) {
    this.setKeyWord(application.name);
    this.currentAppId = application.id
    this.getReviewStats(application.id, region);
    if(this.sent_email){
      this.getReviews(application.id, region);
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

  getReviews(id, region){
    if(this.searchContext == "appStore"){
      this.appService.getAppStoreReviews(id, region.country)
      .subscribe(response => {
        console.log(response[0])
        this.reviews = response;
      })
    }else{
      // I dont think this exists on the front end yet
      this.appService.getPlayStoreReviews(id, region.country)
      .subscribe(response => {
        console.log(response[0])
        this.reviews = response;
      })
    }

  }

  getReviewStats(id, region){
    console.log("region: ")
    console.log(region)
    this.badReviewPercentage = null;
    this.performancePercentage = null;
    this.powerPercentage = null;
    this.data_recieved = false;
    this.thinking = true;
    if(this.searchContext == "appStore"){
      this.appService.getAppStoreReviewStats(id)
      .subscribe(response => {
        console.log(response)
        this.badReviewPercentage = response["badReviewPercentage"]
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

        this.getReviews(this.currentAppId, this.selectedRegion);
        this.sent_email = email
      }
    })
  }

  validEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

}
