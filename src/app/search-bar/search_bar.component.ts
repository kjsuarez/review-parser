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
  selectedRegion = {code: "us", country: "US", language: "en"};
  foundApps = [];

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

}
