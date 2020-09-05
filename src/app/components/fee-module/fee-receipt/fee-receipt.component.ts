import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import * as moment from 'moment';
import { GetFeeService } from '../../../services/report-services/fee-services/getFee.service';
import { PostFeeService } from '../../../services/report-services/fee-services/postFee.service';
import { AppComponent } from '../../../app.component';
import { CommonServiceFactory } from '../../../services/common-service';
import { AuthenticatorService } from '../../../services/authenticator.service';

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
    private _commService:CommonServiceFactory,
    private auth: AuthenticatorService
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
    link.setAttribute('href', '');
    this.auth.showLoader();
    this.getter.getReceiptById(obj).subscribe(
      res => {
        this.auth.hideLoader();
        let body:any = res;
        if(body!=null) {
        let byteArr = this._commService.convertBase64ToArray(body.document);
        let format = body.format;
        let fileName = body.docTitle;
        let file = new Blob([byteArr], { type: 'application/pdf' });
        let url = URL.createObjectURL(file);
        if (link.getAttribute('href') == "" || link.getAttribute('href') == null) {
          link.setAttribute("href", url);
          link.setAttribute("download", fileName);
          link.click();
        }
        } else {
          let msg={
            type:"error",
            body:"Failed to download receipt"
          }
          this.appc.popToast(msg);
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

}

