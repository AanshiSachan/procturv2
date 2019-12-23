import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import * as moment from 'moment';
import { GetFeeService } from '../../../services/report-services/fee-services/getFee.service';
import { PostFeeService } from '../../../services/report-services/fee-services/postFee.service';
import { AppComponent } from '../../../app.component';
import { CommonServiceFactory } from '../../../services/common-service';

@Component({
  selector: 'fee-receipt',
  templateUrl: './fee-receipt.component.html',
  styleUrls: ['./fee-receipt.component.scss']
})
export class FeeReceiptComponent implements OnChanges {

  @Input() feeData: any;
  @Output() closeButton = new EventEmitter<any>()

  receiptData: any[] = [];
  constructor(
    private getter: GetFeeService, 
    private putter: PostFeeService , 
    private appc:AppComponent,
    private _commService:CommonServiceFactory
    ) { }

  ngOnChanges() {
    this.feeData;
    this.updateFeePopupInfo();
  }

  updateFeePopupInfo() {
    this.getter.getFeeReceipts(this.feeData.student_id).subscribe(
      res => {
        this.receiptData = res;
      },
      err => {
        //console.log(err);
      }
    )
  }

  downloadReceipt(r, i) {

    let obj = {
      student_id: this.feeData.student_id,
      disp_id: r.invoice_no,
      fin_yr: r.financial_year
    }
    let link = document.getElementById("customreceipt" +i);
    this.getter.getReceiptById(obj).subscribe(
      res => {
        let body:any = res;
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

  emailReceipt(r) {
    let obj = {
      student_id: this.feeData.student_id,
      disp_id: r.invoice_no,
    }
    this.getter.getEmail(obj).subscribe(
      (data:any)=>{
        let msg={
          type:"success",
          body:"Email Sent successfully"
        }
        this.appc.popToast(msg);
      },
      (error:any)=>{

      }
    )
  }

  closePopups(){
    this.closeButton.emit(null);
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

}

