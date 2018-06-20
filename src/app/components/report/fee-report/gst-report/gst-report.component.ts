import { Component, OnInit } from '@angular/core';
import { ColumnData } from '../../../shared/ng-robAdvanceTable/ng-robAdvanceTable.model';
import { PaymentHistoryMainService } from '../../../../services/payment-history/payment-history-main.service';
import * as moment from 'moment';
import { ExcelService } from '../../../../services/excel.service';
@Component({
  selector: 'app-gst-report',
  templateUrl: './gst-report.component.html',
  styleUrls: ['./gst-report.component.scss']
})
export class GstReportComponent implements OnInit {


  selectMonth: any[] = [
    {
      key: '0',
      month: "January"
    },
    {
      key: '1',
      month: "February"
    },
    {
      key: '2',
      month: "March"
    },
    {
      key: '3',
      month: "April"
    },
    {
      key: '4',
      month: "May"
    },
    {
      key: '5',
      month: "June"
    },
    {
      key: '6',
      month: "July"
    },
    {
      key: '7',
      month: "August"
    },
    {
      key: '8',
      month: "September"
    },
    {
      key: '9',
      month: "October"
    },
    {
      key: '10',
      month: "November"
    },
    {
      key: '11',
      month: "December"
    }
  ]

  dataStatus: number;

  feeSettings1: ColumnData[] = [
    { primaryKey: 'student_disp_id', header: 'ID' },
    { primaryKey: 'student_name', header: 'Name' },
    { primaryKey: 'display_invoice_no', header: 'Receipt No' },
    { primaryKey: 'paymentMode', header: 'Payment Mode' },
    { primaryKey: 'fee_type_name', header: 'Fee Type' },
    { primaryKey: 'installment_nos', header: 'Inst No' },
    { primaryKey: 'paid_date', header: 'Paid Date' },
    { primaryKey: 'cgst', header: 'CGST Amount' },
    { primaryKey: 'sgst', header: 'SGST Amount' },
    { primaryKey: 'tax', header: 'Tax Amount' },
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
  getPaymentRecords: any[] = [];

  downloadService = {

    from_date: moment().format('YYYY-MM-DD'),
    to_date: moment().format('YYYY-MM-DD'),
    payment_history_student_category_option: 0,
    student_name: "",
    contact_no: "",
    isExportGSTReport: "Y"
  }

  downloadFormatted: number;

  searchText = "";
  searchData = [];
  searchflag: boolean = false;
  searchName:string;
  tempRecords:any[]=[];

  constructor(private gst: PaymentHistoryMainService, private excelService: ExcelService) { }

  ngOnInit() {
    this.getGstReport(event);
  }


  getGstReport(event) {

    this.getPaymentRecords = [];

    let date = new Date()
    let y = date.getFullYear()
    let m = date.getMonth();
    let firstDay = new Date(y, parseInt(event), 1);
    let t = parseInt(event);
    this.downloadFormatted = t;
    let lastDay = new Date(y, t + 1, 0);
    this.dataStatus = 1;

    this.sendPayload = {

      institute_id: this.gst.institute_id,
      from_date: moment(firstDay).format('YYYY-MM-DD'),
      to_date: moment(lastDay).format('YYYY-MM-DD'),
      payment_history_student_category_option: 0,
      student_name: "",
      contact_no: ""

    }


    this.gst.getPaymentData(this.sendPayload).subscribe(

      (data: any) => {

        if (data.length == 0) {
          this.dataStatus = 2;
        }

        else {
          this.dataStatus = 0;
        }

        this.getPaymentRecords = data;
        this.tempRecords = data;
      },
      (error: any) => {

        return error;
      }
    )
  }



  downloadToExcel() {

    let date = new Date();

    this.downloadService = {
      from_date: moment(new Date(date.getFullYear(), this.downloadFormatted, 1)).format('YYYY-MM-DD'),
      to_date: moment(new Date(date.getFullYear(), this.downloadFormatted + 1, 0)).format('YYYY-MM-DD'),
      payment_history_student_category_option: 0,
      student_name: "",
      contact_no: "",
      isExportGSTReport: "Y"
    }

    this.gst.downloadData(this.downloadService).subscribe(

      (data: any) => {
        this.exportToExcel(data);
      }
    )
  }

  exportToExcel(event) {
    let exportedArray: any[] = [];
    this.getPaymentRecords.map(
      (data: any) => {
        let obj = {
          "Id": data.student_disp_id,
          "Name": data.student_name,
          "Reciept No": data.display_invoice_no,
          "Payment Mode": data.paymentMode,
          "Fee Type": data.fee_type_name,
          "Inst No": data.installment_nos,
          "Paid Date": data.paid_date,
          "Reference No": data.reference_no,
          "Amount Paid": data.amount_paid,
          'CGST Amount' : data.cgst ,
          'SGST Amount' : data.sgst,
          'Tax Amount' : data.tax ,
          "Student_Category": data.student_category,
          "Counsellor": data.enquiry_counsellor_name
        }
        exportedArray.push(obj);
      }
      
    )
    this.excelService.exportAsExcelFile(
      exportedArray,
      'Students'
    )
  }

  searchDatabase() {
    if (this.searchText != "" && this.searchText != null) {
      // let searchData: any;
      this.getPaymentRecords = this.getPaymentRecords.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchText.toLowerCase()))
      );
      // this.searchData = searchData;
      this.searchflag = true;
    }
    else {
      this.getPaymentRecords = this.tempRecords;
      this.searchflag = false;
    }
  }


}
