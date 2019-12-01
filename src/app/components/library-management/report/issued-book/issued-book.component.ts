import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ReportService } from '../../../../services/library/report/report.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-issued-book',
  templateUrl: './issued-book.component.html',
  styleUrls: ['./issued-book.component.scss']
})
export class IssuedBookComponent implements OnInit {

  jsonFlag = {
    isProfessional: false,
    isRippleLoad: false
  };
  issueBookReportList: any[] = [];
  fixedIssueBookList: any;
  issueBookRange: any[] = [];
  searchText: string;

  constructor(
    private router: Router,
    private cd: ChangeDetectorRef,
    private reportService: ReportService
  ) { }

  ngOnInit() {
    this.issueBookRange[0] = new Date(moment().date(1).format("YYYY-MM-DD"));
    this.issueBookRange[1] = new Date(moment().format("YYYY-MM-DD"));

    // this.getIssueBookReport(this.issueBookRange[0], this.issueBookRange[1]);
  }

  getIssueBookReport(startDate, endDate){
    let obj = {
      "between":{
      "from": startDate,
      "to": endDate
      },
      "in": [
    		{
    			"column": "status",
    			"values":[10]
    		}
    	],
      "pageNo": 1,
      "noOfRecords": 1000
    }

    this.jsonFlag.isRippleLoad = true;
    this.reportService.getIssueBookReport(obj).subscribe(
      response => {
        this.jsonFlag.isRippleLoad = false;
        let res: any;
        res = response
        this.issueBookReportList = res.results;
        this.fixedIssueBookList = res.results;
      },
      errorResponse => {
        this.jsonFlag.isRippleLoad = false;
      }
    )
  }

  searchDatabase() {
    if (this.searchText != "" && this.searchText != null) {
      let searchData: any;
      const peopleArray = Object.keys(this.fixedIssueBookList).map(i => this.fixedIssueBookList[i])
      searchData = peopleArray.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchText.toLowerCase()))
      );
      this.issueBookReportList = searchData;
    }
    else {
      this.issueBookReportList = this.fixedIssueBookList
    }
  }

  getStartDate() {
      this.cd.markForCheck();
      let date = new Date(moment().date(1).format("YYYY-MM-DD"));
      return this.issueBookRange[0];
  }

  getEndDate() {
      this.cd.markForCheck();
      return this.issueBookRange[1];
  }

  updateDateRange(e) {
    this.cd.markForCheck();

    this.getIssueBookReport(moment(e[0]).format("YYYY-MM-DD"), moment(e[1]).format("YYYY-MM-DD"));

  }

  openCalendar(id) {
    document.getElementById(id).click();
  }

}
