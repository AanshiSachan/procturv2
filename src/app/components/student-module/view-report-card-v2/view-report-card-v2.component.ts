import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-report-card-v2',
  templateUrl: './view-report-card-v2.component.html',
  styleUrls: ['./view-report-card-v2.component.scss']
})
export class ViewReportCardV2Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  isActiveTab ='profile';
openTab(param){
  alert(param)
  this.isActiveTab =param;
}
}
