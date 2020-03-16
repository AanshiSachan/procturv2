import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var $;
import * as moment from 'moment';

@Component({
  selector: 'app-list-assignment',
  templateUrl: './list-assignment.component.html',
  styleUrls: ['./list-assignment.component.scss']
})
export class ListAssignmentComponent implements OnInit {

  // global variables
  jsonFlag = {
    isProfessional: false,
    institute_id: '',
  };

  searchText: any;
  
  constructor() { }

  ngOnInit() {
  }

}
