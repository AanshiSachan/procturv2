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

  constructor(
    private reportService: ReportService
  ) { }


  ngOnInit() {
      this.getOverDueBookReport();
  }

  getOverDueBookReport(){
    let obj = {
      "pageNo": 1,
  	  "noOfRecords": 10

    }
    this.jsonFlag.isRippleLoad = true;
    this.reportService.getOverDueBookReport(obj).subscribe(
      response => {
        this.jsonFlag.isRippleLoad = false;
        let res: any;
        res = response
        if(res.results.length > 0){
          this.overdueBookReportList = res.results;
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

}
