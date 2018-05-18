import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../services/login-services/login.service';
import { AppComponent } from '../../../../app.component';
import * as moment from 'moment';
import { getCheque } from '../../../../services/cheque-manage/get-cheque.service';
import { ColumnData } from '../../../shared/ng-robAdvanceTable/ng-robAdvanceTable.model';
import { DropData } from '../../../shared/ng-robAdvanceTable/dropmenu/dropmenu.model';
import { copyConfig } from '@angular/router/src/config';


@Component({
  selector: 'app-cheque-manage',
  templateUrl: './cheque-manage.component.html',
  styleUrls: ['./cheque-manage.component.scss']
})
export class ChequeManageComponent implements OnInit {

  pdcDetails: any;
  studentFeeDues: any[];
  isPendingUpdate: boolean;
  isUpdatePopup: boolean;
  actionSelected: any;
  selectedRecord: any;
  dateRange: any[] = [];

  chequeFetchForm: any = {
    from_date: '',
    to_date: '',
    cheque_status_id: -1,
    student_name: '',
    contact_no: '',
  }

  dropType: number = 1;

  searchValue: any = ''

  chequeDataSource: any[] = [];
  dataStatus: number = 1;
  chequeSetting: ColumnData[] = [
    { primaryKey: 'display_invoice_no', header: 'Receipt No' },
    { primaryKey: 'cheque_no', header: 'Cheque No' },
    { primaryKey: 'bank_name', header: 'Bank Name' },
    { primaryKey: 'student_name', header: 'Student Name' },
    { primaryKey: 'contact_no', header: 'Contact No' },
    { primaryKey: 'cheque_date', header: 'Cheque No' },
    { primaryKey: 'cheque_amount', header: 'Amount' },
    { primaryKey: 'cheque_status', header: 'Status' }
  ];

  menuList: DropData[] = [
    { key: 'update', header: 'Update' }
    /* { key: 'pending', header: 'Update Payment' } */
  ];

  chequeUpdateStatus: any;


  constructor(private login: LoginService, private appC: AppComponent, private getter: getCheque) {
    this.dateRange[0] = new Date(moment().date(1).format("YYYY-MM-DD"));
    this.dateRange[1] = new Date();
  }

  ngOnInit() {
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
    this.fetchChequeType(this.chequeFetchForm);
  }

  fetchChequeType(obj) {
    this.getter.getChequeTypes(obj).subscribe(
      res => {
        this.chequeDataSource = res;
        if (res == null || res.length == 0) {
          this.dataStatus = 0;
        }
      },
      err => {
        this.dataStatus = 0;
      }
    );
  }

  filterCheques() {

    let obj = {
      from_date: moment(this.dateRange[0]).format("YYYY-MM-DD"),
      to_date: moment(this.dateRange[1]).format("YYYY-MM-DD"),
      cheque_status_id: this.chequeFetchForm.cheque_status_id,
      student_name: '',
      contact_no: '',
    }

    if (isNaN(this.searchValue)) {
      obj.student_name = this.searchValue;
    }
    else {
      obj.contact_no = this.searchValue;
    }

    this.fetchChequeType(obj);

  }

  optionSelected(e) {
    this.selectedRecord = e.data;
    this.actionSelected = e.action._value;
    this.decidePopup(e.data);
  }

  cancelUpdate() {
    this.isUpdatePopup = false;
    this.isPendingUpdate = false;
  }

  decidePopup(d) {
    if (d.cheque_status_id == 3) {
      this.chequeUpdateStatus = "3"
      this.isUpdatePopup = true;
    }
    else if (d.cheque_status_id == 1) {
      this.fetchChequePaymentData();
      this.isPendingUpdate = true;
    }
  }


  fetchChequePaymentData() {
    this.getStudentFeeDetails();
    this.getAllChequeStudent();
    this.getPdcDetails();
  }

  getStudentFeeDetails(){
    this.getter.fetchStudentFeeDetails(this.selectedRecord.student_id).subscribe(
      res => {
        if(res.studentFeeReportJsonList != null){
          for(let k in res.studentFeeReportJsonList){
            res.studentFeeReportJsonList[k].toPay = '';
            res.studentFeeReportJsonList[k].balanceDueOn = res.studentFeeReportJsonList[k].due_date;
            res.studentFeeReportJsonList[k].selected = false;
          }
          this.studentFeeDues = res;
        }
      },
      err => {}
    )
  }

  getPdcDetails(){
    console.log(this.selectedRecord);
    this.getter.fetchPdcChequeDetails(this.selectedRecord.pdc_cheque_id).subscribe(
      res => {
        this.pdcDetails = res;
      },
      err => {}
    )
  }

  getAllChequeStudent(){
    this.getter.fetchAllChequeStudent(this.selectedRecord.student_id).subscribe(
      res => {
        this.studentFeeDues = res;
      },
      err => {}
    )
  }

  updateRecord() {

    let obj = {
      student_id: this.selectedRecord.student_id,
      payment_reference_id: this.selectedRecord.payment_reference_id,
      cheque_status_id: this.chequeUpdateStatus,
      cheque_id: this.selectedRecord.cheque_id,
      financial_year: this.selectedRecord.financial_year
    }

    this.getter.updateChequeStatus(obj).subscribe(
      res => {
        this.updateRecordOnClient();
        let msg = {
          type: "success",
          title: "Cheque Status Updated",
          body: ""
        }
        this.appC.popToast(msg);
        this.isUpdatePopup = false;
      },
      err => {
        let msg = {
          type: "error",
          title: "An Error Occured",
          body: "Please contact support@proctur.com"
        }
        this.appC.popToast(msg);
      }
    )

  }

  updateRecordOnClient() {
    let temp: any[] = this.chequeDataSource.map(e => {
      if (e.cheque_id == this.selectedRecord.cheque_id) {
        e.cheque_status_id = this.chequeUpdateStatus;
        if (e.cheque_status_id == 2) {
          e.cheque_status = "dishonoured"
        }
        else if (e.cheque_status_id == 3) {
          e.cheque_status = "cleared";
        }

        return e;
      }
      else {
        return e;
      }
    });

    this.selectedRecord = null;
    this.chequeUpdateStatus = "3";
    this.chequeDataSource = temp;
  }


  

}
