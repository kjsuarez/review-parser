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

  constructor(private appService: AppService) {}

  ngOnInit() {

  }

}
