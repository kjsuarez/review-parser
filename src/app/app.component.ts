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

  constructor(private appService: AppService) {}

  ngOnInit() {

  }

  updateSearch(form){
    this.appService.getAppStoreApps(form.value.searchKeyWord)
    .subscribe(response => {
      console.log(response)
      this.foundApps = response.obj;
    })
  }
}
