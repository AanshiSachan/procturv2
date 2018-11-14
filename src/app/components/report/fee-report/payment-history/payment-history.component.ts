import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { LoginService } from '../../../../services/login-services/login.service';
import { AppComponent } from '../../../../app.component';

import { GetFeeService } from '../../../../services/report-services/fee-services/getFee.service';
import { PostFeeService } from '../../../../services/report-services/fee-services/postFee.service';

@Component({
  selector: 'payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss']
})
export class PaymentHistoryComponent implements OnChanges {

  @Input() feeData: any;
  @Output() closeButton = new EventEmitter<any>()
  @Input() standardList: any[];
  @Input() subjectList: any[] = [];
  @Input() batchList: any[] = [];
  @Input() masterId: any;
  dummyArr: any[] = [0, 1, 2, 0, 1, 2];
  columnMaps: any[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  columnMaps2: any[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  pastDues: any[] = [];
  pastHIstoryData: any[] = [];
  nextDuesData: any[] = [];

  dataStatus: boolean = false;
  sendPayload = {
    from_date: "",
    to_date: "",
  }
  courseFetchForm: any = {
    standard_id: -1,
    subject_id: -1,
    batch_id: -1,
    student_name: '',
    from_date: '',
    to_date: '',
    master_course_name: -1,
    course_id: -1,
    contact_no: '',
    type: '-1',
    installment_id: -1,
    is_fee_report_view: 1,
    academic_year_id: ""
  }

  constructor(private getter: GetFeeService, private putter: PostFeeService) { }

  ngOnChanges() {
    this.feeData;
    this.updateData();
    this.updateDataNext();
    this.updatePastDues();

    console.log(this.standardList);
    console.log(this.batchList);
    console.log(this.subjectList);
  }


  updateData() {
    this.dataStatus = true;
    //console.log(this.feeData);
    this.getter.getPaymentHistory(this.feeData.student_id).subscribe(
      res => {
        this.dataStatus = false;
        this.pastHIstoryData = res;
      },
      err => {
        this.dataStatus = false;
      }
    )

  }

  updateDataNext() {
    this.dataStatus = true;
    //console.log(this.feeData);
    this.getter.getFutureDues(this.feeData.student_id).subscribe(
      res => {
        this.dataStatus = false;
        this.nextDuesData = res;
      },
      err => {
        this.dataStatus = false;
      }
    )
  }

  downloadReceipt(r, i) {

    let obj = {
      student_id: this.feeData.student_id,
      disp_id: r.invoice_no,
      fin_yr: r.financial_year
    }
    let link = document.getElementById("customreceipt" + i);
    this.getter.getReceiptById(obj).subscribe(
      res => {
        let body: any = res;
        let byteArr = this.convertBase64ToArray(body.document);
        let format = body.format;
        let fileName = body.docTitle;
        let file = new Blob([byteArr], { type: 'application/pdf' });
        let url = URL.createObjectURL(file);
        if (link.getAttribute('href') == "" || link.getAttribute('href') == null) {
          link.setAttribute("href", url);
          link.setAttribute("download", fileName);
          link.click();
        }
      },
      err => {
        //console.log(err);
      }
    )
  }


  convertBase64ToArray(val) {
    var binary_string = window.atob(val);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  getSubjectList(i) {
    console.log(i);
    this.courseFetchForm.subject_id = -1;
    this.courseFetchForm.batch_id = -1;
    this.courseFetchForm.from_date = '';
    this.courseFetchForm.to_date = '';
    this.courseFetchForm.type = "0";

    this.getter.getBatchDetails(this.courseFetchForm).subscribe(
      res => {
        this.batchList = res.batchLi;
        this.subjectList = res.subjectLi;
      },
      err => {
      }
    )
  }

  closePopups() {
    this.closeButton.emit(null);
  }

  updatePastDues() {
    this.pastDues = [];
    this.dataStatus = true;
    this.putter.sendPastDues(this.sendPayload, this.feeData.student_id).subscribe(
      (res: any) => {
        this.dataStatus = false;
        this.pastDues = res;
      },
      (error: any) => {
        this.dataStatus = false;
      }
    )
  }

}



