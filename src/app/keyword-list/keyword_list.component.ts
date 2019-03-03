import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormControl } from "@angular/forms";
import { Subscription } from 'rxjs';
import { AppService } from '../app.service';
import {PageEvent} from '@angular/material';
import {MatPaginator, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'keyword-list',
  templateUrl: './keyword_list.component.html',
  styleUrls: ['./keyword_list.component.css']
})
export class KeywordListComponent {

  constructor(private appService: AppService) {}

  ngOnInit() {

  }

}
