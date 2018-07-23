import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { LoginService } from '../../../../services/login-services/login.service';
import { AppComponent } from '../../../../app.component';

import { GetFeeService } from '../../../../services/report-services/fee-services/getFee.service';
import { PostFeeService } from '../../../../services/report-services/fee-services/postFee.service';

import * as moment from 'moment';

@Component({
  selector: 'payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss']
})
export class PaymentHistoryComponent implements OnChanges {

  @Input() feeData: any;
  @Output() closeButton = new EventEmitter<any>()

  pastHIstoryData: any[] = [];
  nextDuesData: any[] = [];
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


  pastDues: any[] = [];

  @Input() standardList: any[];
  @Input() subjectList: any[] = [];
  @Input() batchList: any[] = [];
  @Input() masterId: any;

  dummyArr: any[] = [0, 1, 2, 0, 1, 2];
  columnMaps: any[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  dataStatus: boolean = false;
  columnMaps2: any[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
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



