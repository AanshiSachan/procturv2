import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../services/login-services/login.service';
import { AppComponent } from '../../../../app.component';
import * as moment from 'moment';
import { getCheque } from '../../../../services/cheque-manage/get-cheque.service';
import { ColumnData } from '../../../shared/ng-robAdvanceTable/ng-robAdvanceTable.model';


@Component({
  selector: 'app-cheque-manage',
  templateUrl: './cheque-manage.component.html',
  styleUrls: ['./cheque-manage.component.scss']
})
export class ChequeManageComponent implements OnInit {

  dateRange: any[] = [];

  chequeFetchForm: any = {
    from_date: '',
    to_date: '',
    cheque_status_id: -1,
    student_name: '',
    contact_no: '',
  }

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
      },
      err => {
        console.log(err);
      }
    );
  }

  selectedRecords() {

  }

  filterCheques() {

    let obj = {
      from_date: moment(this.dateRange[0]).format("YYYY-MM-DD"),
      to_date: moment(this.dateRange[1]).format("YYYY-MM-DD"),
      cheque_status_id: this.chequeFetchForm.cheque_status_id,
      student_name: '',
      contact_no: '',
    }

    if(isNaN(this.searchValue)){
      obj.student_name = this.searchValue;
    }
    else{
      obj.contact_no = this.searchValue;
    }

    this.fetchChequeType(obj);

  }

}
