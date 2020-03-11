import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { ReportService } from '../../../../services/library/report/report.service';

@Component({
  selector: 'app-overdue-book',
  templateUrl: './overdue-book.component.html',
  styleUrls: ['./overdue-book.component.scss']
})
export class OverdueBookComponent implements OnInit {

  jsonFlag = {
    isProfessional: false,
    isRippleLoad: false
  };
  overdueBookReportList: any[] = [];
  tempOverdueBookReportList: any= {};
  overdueCollectionRange: any[] = [];
  searchText: string;
   // FOR PAGINATION
   pageIndex: number = 1;
   displayBatchSize: number = 10;
   totalCount: number = 0;
   sizeArr: any[] = [10, 25, 50, 100, 150, 200, 500];

  constructor(
    private cd: ChangeDetectorRef,
    private auth:AuthenticatorService,
    private reportService: ReportService
  ) { }


  ngOnInit() {
    this.overdueCollectionRange[0] = new Date(moment().date(1).format("YYYY-MM-DD"));
    this.overdueCollectionRange[1] = new Date();
      this.getOverDueBookReport();
  }

  searchDatabase() {
    if (this.searchText != "" && this.searchText != null) {
      let searchData: any;
      let data = this.tempOverdueBookReportList;
      const peopleArray = Object.keys(data).map(i => data[i])
      searchData = peopleArray.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchText.toLowerCase()))
      );
      this.tempOverdueBookReportList = searchData;
    }
    else {
      this.overdueBookReportList = this.tempOverdueBookReportList;
    }
  }

  openCalendar(id) {
    document.getElementById(id).click();
  }

  getStartDate() {
    this.cd.markForCheck();
    let date = moment().date(1).format("YYYY-MM-DD");
    return this.overdueCollectionRange[0];
}

getEndDate() {
    this.cd.markForCheck();
    return this.overdueCollectionRange[1];
}

  getOverDueBookReport(){
    let obj = {
      "pageNo": this.pageIndex,
  	  "noOfRecords": this.displayBatchSize

    }
    this.auth.showLoader();
    this.reportService.getOverDueBookReport(obj).subscribe(
      response => {
        this.auth.hideLoader();
        let res: any;
        res = response
        if(res.results.length > 0){
          this.overdueBookReportList = res.results;
          this.tempOverdueBookReportList = res;
          this.totalCount = res.totalRecords;
        }
      },
      errorResponse => {
        this.auth.hideLoader();
      }
    )
  }

  // printFeeReceipt(issueBookId){
  //   this.auth.showLoader();
  //   this.reportService.downloadReceipt(issueBookId).subscribe(
  //     response => {
  //       let res: any;
  //       res = response;
  //       this.auth.hideLoader();
  //       let byteArr = this.convertBase64ToArray(res.document);
  //       let fileName = res.docTitle;
  //       let file = new Blob([byteArr], { type: 'text/csv;charset=utf-8;' });
  //       let url = URL.createObjectURL(file);
  //       let dwldLink = document.getElementById('timeTable_download');
  //       dwldLink.setAttribute("href", url);
  //       dwldLink.setAttribute("download", fileName);
  //       document.body.appendChild(dwldLink);
  //       dwldLink.click();
  //     })
  // }
  //
  // convertBase64ToArray(val) {
  //
  //   var binary_string = window.atob(val);
  //   var len = binary_string.length;
  //   var bytes = new Uint8Array(len);
  //   for (var i = 0; i < len; i++) {
  //     bytes[i] = binary_string.charCodeAt(i);
  //   }
  //   return bytes.buffer;
  //
  // }

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
  this.getOverDueBookReport();
}

/* Fetches Data as per the user selected batch size */
updateTableBatchSize(num) {
  this.pageIndex = 1;
  this.displayBatchSize = parseInt(num);
  this.getOverDueBookReport();
}

}
