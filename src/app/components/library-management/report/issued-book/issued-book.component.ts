import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { ReportService } from '../../../../services/library/report/report.service';

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

   // FOR PAGINATION
   pageIndex: number = 1;
   displayBatchSize: number = 10;
   totalCount: number = 0;
   sizeArr: any[] = [10, 25, 50, 100, 150, 200, 500];


  constructor(
    private router: Router,
    private cd: ChangeDetectorRef,
    private auth:AuthenticatorService,
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
      "pageNo": this.pageIndex,
  	  "noOfRecords": this.displayBatchSize
    }

   this.auth.showLoader();
    this.reportService.getIssueBookReport(obj).subscribe(
      response => {
        this.auth.hideLoader();
        let res: any;
        res = response
        this.issueBookReportList = res.results;
        this.fixedIssueBookList = res.results;
        this.totalCount = res.totalRecords;
      },
      errorResponse => {
        this.auth.hideLoader();
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
   /*** pagination functions */
  /* Fetch next set of data from server and update table */
  fetchNext() {
    this.pageIndex++;
    this.fectchTableDataByPage(this.pageIndex);
}

/* Fetch previous set of data from server and update table */
fetchPrevious() {
    this.pageIndex--;
    this.fectchTableDataByPage(this.pageIndex);
}

/* Fetch table data by page index */
fectchTableDataByPage(index) {
  this.pageIndex = index;
  let startindex = this.displayBatchSize * (index - 1);
  this.getIssueBookReport(moment(this.issueBookRange[0]).format("YYYY-MM-DD"), moment(this.issueBookRange[1]).format("YYYY-MM-DD"));
}

/* Fetches Data as per the user selected batch size */
updateTableBatchSize(num) {
  this.pageIndex = 1;
  this.displayBatchSize = parseInt(num);
  this.getIssueBookReport(moment(this.issueBookRange[0]).format("YYYY-MM-DD"), moment(this.issueBookRange[1]).format("YYYY-MM-DD"));
}

}
