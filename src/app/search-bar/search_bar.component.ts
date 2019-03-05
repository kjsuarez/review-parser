import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormControl } from "@angular/forms";
import { Subscription } from 'rxjs';
import {PageEvent} from '@angular/material';
import {MatPaginator, MatTableDataSource} from '@angular/material';

import { AppService } from '../app.service';
import { ReviewService } from '../review.service';



@Component({
  selector: 'search-bar',
  templateUrl: './search_bar.component.html',
  styleUrls: ['./search_bar.component.css']
})
export class SearchBarComponent {

  searchKeyWord;
  searchContext = "appStore";
  foundApps = [];
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

  constructor(private appService: AppService, private reviewService: ReviewService) {}

  ngOnInit() {

  }

  updateSearch(keyword){
    var keyword = keyword.trim()
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

  setKeyWord(name){
    this.searchKeyWord = name
  }



  doApplicationThings(application, region) {
    this.setKeyWord(application.name);
    this.reviewService.doApplicationThings(application, region, this.searchContext);
  }

  onChange(value){
    this.cleanSlate();
    if(value.checked === true){
      this.searchContext = "playStore"
    }else{
      this.searchContext = "appStore"
    }
  }

  cleanSlate(){
    this.foundApps = [];
    // this.performancePercentage = null;
    // this.powerPercentage = null;
    // this.badReviewPercentage = null;
    this.searchKeyWord = null;
    // this.data_recieved = false;
  }
}
