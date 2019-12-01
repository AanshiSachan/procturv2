import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ReportService } from '../../../../services/library/report/report.service';

@Component({
  selector: 'app-return-book',
  templateUrl: './return-book.component.html',
  styleUrls: ['./return-book.component.scss']
})
export class ReturnBookComponent implements OnInit {

  jsonFlag = {
    isProfessional: false,
    isRippleLoad: false
  };
  returnbookrange: any[] = [];
  returnBookReportList: any[] = [];
  fixedReturnBookList: any;
  searchText: string;

  constructor(
    private router: Router,
    private cd: ChangeDetectorRef,
    private reportService: ReportService
  ) { }

  ngOnInit() {
    this.returnbookrange[0] = new Date(moment().date(1).format("YYYY-MM-DD"));
    this.returnbookrange[1] = new Date(moment().format("YYYY-MM-DD"));
    // this.getReturnBookReport(this.returnbookrange[0],this.returnbookrange[1]);
  }

  getReturnBookReport(startDate, endDate){
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

    this.jsonFlag.isRippleLoad = true;
    this.reportService.getReturnBookReport(obj).subscribe(
      response => {
        this.jsonFlag.isRippleLoad = false;
        let result : any;
        result = response;
        if(result.length > 0){
          this.returnBookReportList = result;
          this.fixedReturnBookList = result;
        }
      },
      errorResponse => {
        this.jsonFlag.isRippleLoad = false;
      }
    )
  }


  searchDatabase() {
    if (this.searchText != "" && this.searchText != null) {
      let searchData: any;
      const peopleArray = Object.keys(this.fixedReturnBookList).map(i => this.fixedReturnBookList[i])
      searchData = peopleArray.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchText.toLowerCase()))
      );
      this.returnBookReportList = searchData;
    }
    else {
      this.returnBookReportList = this.fixedReturnBookList;
    }
  }


    getStartDate() {
        this.cd.markForCheck();
        let date = moment().date(1).format("YYYY-MM-DD");
        return this.returnbookrange[0];
    }

    getEndDate() {
        this.cd.markForCheck();
        return this.returnbookrange[1];
    }

    updateEnqChartByDate(e) {
      this.cd.markForCheck();

      this.getReturnBookReport(moment(e[0]).format("YYYY-MM-DD"),moment(e[1]).format("YYYY-MM-DD"));

    }

    openCalendar(id) {
      document.getElementById(id).click();
    }


}
