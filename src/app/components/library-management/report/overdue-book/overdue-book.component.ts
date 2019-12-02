import { Component, OnInit} from '@angular/core';
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
  searchText: string;
   // FOR PAGINATION
   pageIndex: number = 1;
   displayBatchSize: number = 20;
   totalCount: number = 0;
   sizeArr: any[] = [20, 50, 100, 150, 200, 500];

  constructor(
    private reportService: ReportService
  ) { }


  ngOnInit() {
      this.getOverDueBookReport();
  }

  getOverDueBookReport(){
    let obj = {
      "pageNo": this.pageIndex,
  	  "noOfRecords": this.displayBatchSize

    }
    this.jsonFlag.isRippleLoad = true;
    this.reportService.getOverDueBookReport(obj).subscribe(
      response => {
        this.jsonFlag.isRippleLoad = false;
        let res: any;
        res = response
        if(res.results.length > 0){
          this.overdueBookReportList = res.results;
          this.totalCount = res.totalRecords;
        }
      },
      errorResponse => {
        this.jsonFlag.isRippleLoad = false;
      }
    )
  }

  // printFeeReceipt(issueBookId){
  //   this.jsonFlag.isRippleLoad = true;
  //   this.reportService.downloadReceipt(issueBookId).subscribe(
  //     response => {
  //       let res: any;
  //       res = response;
  //       this.jsonFlag.isRippleLoad = false;
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
