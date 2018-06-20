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

  pastDues:any[]=[];
  constructor(private getter: GetFeeService, private putter: PostFeeService) { }

  ngOnChanges() {
    this.feeData;
    this.updateData();
    this.updateDataNext();
    this.updatePastDues();
  }


  updateData() {
    //console.log(this.feeData);
    this.getter.getPaymentHistory(this.feeData.student_id).subscribe(
      res => {
        this.pastHIstoryData = res;
      },
      err => { }
    )

  }

  updateDataNext() {
    //console.log(this.feeData);
    this.getter.getFutureDues(this.feeData.student_id).subscribe(
      res => {
        this.nextDuesData = res;
      },
      err => { }
    )
  }

  closePopups() {
    this.closeButton.emit(null);
  }

  updatePastDues() {
    this.pastDues = [];
    this.putter.sendPastDues(this.sendPayload , this.feeData.student_id).subscribe(
      (res:any)=>{
        this.pastDues = res;
      },
      (error:any)=>{

      }
    )
  }

}



