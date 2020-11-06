import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { ReportService } from '../../../../services/library/report/report.service';

@Component({
  selector: 'app-scrap-book',
  templateUrl: './scrap-book.component.html',
  styleUrls: ['./scrap-book.component.scss']
})
export class ScrapBookComponent implements OnInit {

  jsonFlag = {
    isProfessional: false
  };
  scrapbookrange: any[] = [];
  scrapBookReportList: any[] = [];
  fixedScrapBookList: any;
  searchText: string;

  constructor(
    private router: Router,
    private cd: ChangeDetectorRef,
    private auth:AuthenticatorService,
    private reportService: ReportService
  ) { }

  ngOnInit() {
    this.scrapbookrange[0] = new Date(moment().date(1).format("YYYY-MM-DD"));
    this.scrapbookrange[1] = new Date(moment().format("YYYY-MM-DD"));

    // this.getScrapBookReport(this.scrapbookrange[0],this.scrapbookrange[1]);

  }

  getScrapBookReport(startDate, endDate){
    let obj = {
      "between": {
        "from": startDate,
        "to":   endDate
      },
      "in": [
        {
          "column": "status",
          "values":[50,70]     //  Book scraped by librarian or student
        }
      ]
    }

    this.auth.showLoader();
    this.reportService.getScrapBookReport(obj).subscribe(
      response => {
        this.auth.hideLoader();
        let result : any;
        result = response;
        if(result.length > 0){
          this.scrapBookReportList = result;
          this.fixedScrapBookList = result;
        }
      },
      errorResponse => {
        this.auth.hideLoader();
      }
    )
  }


  searchDatabase() {
    if (this.searchText != "" && this.searchText != null) {
      let searchData: any;
      const peopleArray = Object.keys(this.fixedScrapBookList).map(i => this.fixedScrapBookList[i])
      searchData = peopleArray.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchText.toLowerCase()))
      );
      this.scrapBookReportList = searchData;
    }
    else {
      this.scrapBookReportList = this.fixedScrapBookList;
    }
  }


    getStartDate() {
        this.cd.markForCheck();
        let date = moment().date(1).format("YYYY-MM-DD");
        return this.scrapbookrange[0];
    }

    getEndDate() {
        this.cd.markForCheck();
        return this.scrapbookrange[1];
    }

    updateEnqChartByDate(e) {
      this.cd.markForCheck();

      this.getScrapBookReport(moment(e[0]).format("YYYY-MM-DD"),moment(e[1]).format("YYYY-MM-DD"));

    }

    openCalendar(id) {
      document.getElementById(id).click();
    }

}
