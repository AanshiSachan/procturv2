import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import { ColumnData } from '../../shared/ng-robAdvanceTable/ng-robAdvanceTable.model';
import { PaymentHistoryMainService } from '../../../services/payment-history/payment-history-main.service';
import { ExcelService } from '../../../services/excel.service';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';
import { CommonServiceFactory } from '../../../services/common-service';

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
    }]

  selectYear: any[] = [2017, 2018, 2019,2020]
  getYear: number;

  dataStatus: number;
  downloadFeeReportAccess:boolean = false;

  feeSettings1: ColumnData[] = [
    { primaryKey: 'student_disp_id', header: 'ID' },
    { primaryKey: 'student_name', header: 'Name' },
    { primaryKey: 'display_invoice_no', header: 'Receipt No' },
    { primaryKey: 'paymentMode', header: 'Payment Mode' },
    { primaryKey: 'fee_type_name', header: 'Fee Type' },
    { primaryKey: 'installment_nos', header: 'Inst No' },
    { primaryKey: 'paid_date', header: 'Paid Date' },
    // { primaryKey: 'cgst', header: 'CGST' },
    // { primaryKey: 'sgst', header: 'SGST' },
    { primaryKey: 'tax', header: sessionStorage.getItem("tax_type_without_percentage") },
    { primaryKey: 'reference_no', header: 'Ref No' },
    { primaryKey: 'amount_paid', header: 'Amount Paid' },
    { primaryKey: 'enquiry_counsellor_name', header: 'Counsellor' }
  ];

  date = new Date();

  sendPayload = {
    institute_id: this.gst.institute_id,
    from_date: moment().format('YYYY-MM-DD'),
    to_date: moment().format('YYYY-MM-DD'),
    payment_history_student_category_option: 2,
    student_name: "",
    contact_no: "",
  }
  getPaymentRecords: any[] = [];

  downloadService = {
    from_date: moment().format('YYYY-MM-DD'),
    to_date: moment().format('YYYY-MM-DD'),
    payment_history_student_category_option: 2,
    student_name: "",
    contact_no: "",
    isExportGSTReport: "Y"
  }

  downloadFormatted: number;

  searchText = "";
  searchData = [];
  searchflag: boolean = false;
  searchName: string;
  tempRecords: any[] = [];
  records: string;
  year: number;
  tax_type_without_percentage : String ;
  constructor(
    private gst: PaymentHistoryMainService, 
    private excelService: ExcelService, 
    private cd: ChangeDetectorRef ,
    private pdf:ExportToPdfService,
  private _commService:CommonServiceFactory) { }
  ngOnInit() {
    this.tax_type_without_percentage=sessionStorage.getItem('tax_type_without_percentage');

    window.scroll(0,0);
    this.getGstReport(event, this.year);    
    this.checkDownloadRoleAccess();
  }

  checkDownloadRoleAccess() {
    if(sessionStorage.getItem('downloadFeeReportAccess')=='true'){
        this.downloadFeeReportAccess = true;
    }
}

  getGstReport(event, f) {

    this.records = ""
    this.searchText = ""
    this.getPaymentRecords = [];

    let date = new Date()
    let y = date.getFullYear();
    let m = date.getMonth();
    let firstDay = new Date(parseInt(f), parseInt(event), 1);
    let t = parseInt(event);
    this.year = f
    this.downloadFormatted = t;
    let lastDay = new Date(parseInt(f), t + 1, 0);
    this.dataStatus = 1;

    let data = {
      institute_id: this.sendPayload.institute_id,
      from_date: moment(firstDay).format('YYYY-MM-DD'),
      to_date: moment(lastDay).format('YYYY-MM-DD'),
      payment_history_student_category_option: this.sendPayload.payment_history_student_category_option,
      student_name: this.sendPayload.student_name,
      contact_no: this.sendPayload.contact_no,
    }

    this.gst.getPaymentData(data).subscribe((data: any) => {
        if (data.length == 0) {
          this.dataStatus = 2;
        }
        else {
          this.dataStatus = 0;
        }
        this.getPaymentRecords = data;
        this.tempRecords = data;
        this.records = this.tempRecords[0] ?this.tempRecords[0].totalGst :0;
      },
      (error: any) => {
        return error;
      }
    )
  }



  downloadToExcel() {

    let date = new Date();

    this.downloadService = {
      from_date: moment(new Date(this.year, this.downloadFormatted, 1)).format('YYYY-MM-DD'),
      to_date: moment(new Date(this.year, this.downloadFormatted + 1, 0)).format('YYYY-MM-DD'),
      payment_history_student_category_option: 2,
      student_name: "",
      contact_no: "",
      isExportGSTReport: "Y"
    }

    this.gst.downloadData(this.downloadService).subscribe(

      (data: any) => {
        let byteArr = this._commService.convertBase64ToArray(data.document);
        let format = data.format;
        let fileName = data.docTitle;
        let file = new Blob([byteArr], { type: 'text/csv;charset=utf-8;' });
        let url = URL.createObjectURL(file);
        let dwldLink = document.getElementById('enq_download');
        this.cd.markForCheck();
        dwldLink.setAttribute("href", url);
        dwldLink.setAttribute("download", fileName);
        document.body.appendChild(dwldLink);
        this.cd.markForCheck();
        dwldLink.click();
        this.cd.markForCheck();
      }
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

  exportToPdf() {
    let arr = [];
    this.getPaymentRecords.map(
      (ele: any) => {
        let json = [
          ele.student_disp_id,
          ele.student_name,
          ele.display_invoice_no,
          ele.paymentMode,
          ele.fee_type_name,
          ele.installment_nos,
          ele.paid_date,
          ele.cgst,
          ele.sgst,
          ele.tax,
          ele.reference_no,
          ele.amount_paid,
          ele.enquiry_counsellor_name
        ]
        arr.push(json);
      })

    let rows = [['ID', 'Name', 'Reciept No', 'Payment Mode', 'Fee Type', 'Installment No', 'Paid Date', 'Cgst', 'Sgst', 'Tax', 'Reference No', 'Amount paid' , 'Counsellor']]
    let columns = arr;
    this.pdf.exportToPdf(rows, columns,'GST_Report');
  }


}
