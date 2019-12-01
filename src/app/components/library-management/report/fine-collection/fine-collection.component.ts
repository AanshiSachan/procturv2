import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ReportService } from '../../../../services/library/report/report.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-fine-collection',
  templateUrl: './fine-collection.component.html',
  styleUrls: ['./fine-collection.component.scss']
})
export class FineCollectionComponent implements OnInit {

  jsonFlag = {
    isProfessional: false,
    isRippleLoad: false
  };
  fineCollectionReportList: any[] = [];
  fineCollectionRange: any[] = [];

  constructor(
    private router: Router,
    private cd: ChangeDetectorRef,
    private reportService: ReportService
  ) { }

  ngOnInit() {
    this.fineCollectionRange[0] = new Date(moment().date(1).format("YYYY-MM-DD"));
    this.fineCollectionRange[1] = new Date();

    this.getFineCollectionReport(this.fineCollectionRange[0], this.fineCollectionRange[1]);
  }

  getFineCollectionReport(startDate, endDate){
    let obj = {
    	"between":{
    	"from": startDate,
    	"to": endDate
    	},
    	"sortBy":{
    		"assending": false
    	},
    	"pageNo": 1,
    	"noOfRecords": 1000
    }

    this.jsonFlag.isRippleLoad = true;
    this.reportService.getFineCollectionReport(obj).subscribe(
      response => {
        this.jsonFlag.isRippleLoad = false;
        let res: any;
        res = response
        this.fineCollectionReportList = res;
        console.log(this.fineCollectionReportList)
      },
      errorResponse => {
        this.jsonFlag.isRippleLoad = false;
      }
    )
  }

  getStartDate() {
      this.cd.markForCheck();
      let date = moment().date(1).format("YYYY-MM-DD");
      return this.fineCollectionRange[0];
  }

  getEndDate() {
      this.cd.markForCheck();
      return this.fineCollectionRange[1];
  }

  updateDateRange(e) {
    this.cd.markForCheck();

    this.getFineCollectionReport(moment(e[0]).format("YYYY-MM-DD"),moment(e[1]).format("YYYY-MM-DD"));

  }

  openCalendar(id) {
    document.getElementById(id).click();
  }

}
