import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { ReportService } from '../../../../services/library/report/report.service';

@Component({
  selector: 'app-lost-book',
  templateUrl: './lost-book.component.html',
  styleUrls: ['./lost-book.component.scss']
})
export class LostBookComponent implements OnInit {

  jsonFlag = {
    isProfessional: false,
  };
  lostbookrange: any[] = [];
  lostBookReportList: any[] = [];
  fixedLostBookList: any;
  searchText: string;

  constructor(
    private router: Router,
    private cd: ChangeDetectorRef,
    private auth:AuthenticatorService,
    private reportService: ReportService
  ) { }

  ngOnInit() {
    this.lostbookrange[0] = new Date(moment().date(1).format("YYYY-MM-DD"));
    this.lostbookrange[1] = new Date(moment().format("YYYY-MM-DD"));
    // this.getLostBookReport(this.lostbookrange[0],this.lostbookrange[1]);
  }

  getLostBookReport(startDate, endDate){
    let obj = {
      "between": {
        "from": startDate,
        "to":   endDate
      },
      "in": [
        {
          "column": "status",
          "values":[40,60]
        }
      ]
    }

    this.auth.showLoader();
    this.reportService.getLostBookReport(obj).subscribe(
      response => {
        this.auth.hideLoader();
        let result : any;
        result = response;
        if(result.length > 0){
          this.lostBookReportList = result;
          this.fixedLostBookList = result;
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
      const peopleArray = Object.keys(this.fixedLostBookList).map(i => this.fixedLostBookList[i])
      searchData = peopleArray.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchText.toLowerCase()))
      );
      this.lostBookReportList = searchData;
    }
    else {
      this.lostBookReportList = this.fixedLostBookList;
    }
  }

    getStartDate() {
        this.cd.markForCheck();
        let date = moment().date(1).format("YYYY-MM-DD");
        return this.lostbookrange[0];
    }

    getEndDate() {
        this.cd.markForCheck();
        return this.lostbookrange[1];
    }

    updateEnqChartByDate(e) {
      this.cd.markForCheck();

      this.getLostBookReport(moment(e[0]).format("YYYY-MM-DD"),moment(e[1]).format("YYYY-MM-DD"));

    }

    openCalendar(id) {
      document.getElementById(id).click();
    }

}
