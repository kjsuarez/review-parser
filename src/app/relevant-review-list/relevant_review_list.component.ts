import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormControl } from "@angular/forms";
import { Subscription } from 'rxjs';
import { AppService } from '../app.service';
import {PageEvent} from '@angular/material';
import {MatPaginator, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'relevant-review-list',
  templateUrl: './relevant_review_list.component.html',
  styleUrls: ['./relevant_review_list.component.css']
})
export class RelevantReviewListComponent {

  constructor(private appService: AppService) {}

  ngOnInit() {

  }

}
