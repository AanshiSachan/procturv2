import { Component, OnInit } from '@angular/core';
import { ColumnData } from '../../../shared/ng-robAdvanceTable/ng-robAdvanceTable.model';
import { PaymentHistoryMainService } from '../../../../services/payment-history/payment-history-main.service';
import * as moment from 'moment';
@Component({
  selector: 'app-gst-report',
  templateUrl: './gst-report.component.html',
  styleUrls: ['./gst-report.component.scss']
})
export class GstReportComponent implements OnInit {


  selectMonth:any [] = ["January" , "February" , "March" , "April" , "May" , "June" , "July" , "August" , "September" , "October" , "November" , "December"];

  feeSettings1: ColumnData[] = [
    { primaryKey: 'student_disp_id', header: 'ID' },
    { primaryKey: 'student_name', header: 'Name' },
    { primaryKey: 'display_invoice_no', header: 'Receipt No' },
    { primaryKey: 'paymentMode', header: 'Payment Mode' },
    { primaryKey: 'fee_type_name', header: 'Fee Type' },
    { primaryKey: 'installment_nos', header: 'Inst No' },
    { primaryKey: 'paid_date', header: 'Paid Date' },
    { primaryKey: 'reference_no', header: 'Ref No' },
    { primaryKey: 'amount_paid', header: 'Amount Paid' },
    { primaryKey: 'enquiry_counsellor_name', header: 'Counsellor' }
  ];

  sendPayload = {
    institute_id: this.gst.institute_id,
    from_date: moment().format('YYYY-MM-DD'),
    to_date: moment().format('YYYY-MM-DD'),
    payment_history_student_category_option: 0,
    student_name: "",
    contact_no: ""
  }
  getPaymentRecords:any[]=[];

  constructor(private gst:PaymentHistoryMainService) { }

  ngOnInit() {
    this.getGstReport();
  }

  getGstReport(){
   
    this.gst.getPaymentData(this.sendPayload).subscribe(
      (data:any)=>{
        this.getPaymentRecords = data;
      },
      (error:any)=>{
        return error;
      }
    )
  }

}
