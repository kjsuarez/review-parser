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
  server_status = 'unknown';
  thinking = false;

  sent_email = localStorage.getItem('email') || false;
  emailCardVisible = false;

  constructor(private appService: AppService, private reviewService: ReviewService) {
    reviewService.thinking$.subscribe(
      response => { this.thinking = response }
    );
  }

  ngOnInit() {
    this.wakeServer()
  }

  wakeServer() {
    this.appService.wakeServer()
    .subscribe(
      res => {
        this.server_status = res;
      }
    )
  }

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
