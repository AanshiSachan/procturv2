import { Component } from '@angular/core';
import * as moment from 'moment';
import { AppComponent } from '../../../app.component';
import { getEmailService } from '../../../services/report-services/get-email.service';
import { ColumnSetting } from '../../shared/custom-table/layout.model';
import { AuthenticatorService } from './../../../services/authenticator.service';

@Component({
  selector: 'app-email-report',
  templateUrl: './email-report.component.html',
  styleUrls: ['./email-report.component.scss']
})

export class EmailReportComponent {
  pageIndex: number = 1;
  totalRecords: number = 0;
  displayBatchSize: number = 10;
  emailSource: any[] = [];
  emailDataSource: any = [];
  searchText = "";
  searchData = [];
  searchflag: boolean = false;
  dataStatus: boolean = true;

  projectSettings: ColumnSetting[] = [
    { primaryKey: 'sentDateTime', header: 'Sent Date' },
    { primaryKey: 'emailId', header: 'Email' },
    { primaryKey: 'message', header: 'Subject' },
    { primaryKey: 'name', header: 'Name' },
    { primaryKey: 'role', header: 'Role' },
    { primaryKey: 'func_type', header: 'Type' }
  ];


  emailFetchForm: any = {
    institution_id: parseInt(sessionStorage.getItem('institute_id')),
    from_date: moment(new Date()).format('YYYY-MM-DD'),
    to_date: moment(new Date()).format('YYYY-MM-DD'),
  }

  constructor(
    private apiService: getEmailService,
    private appC: AppComponent,
    private auth:AuthenticatorService
  ) {
    this.switchActiveView('email');
  }

  ngOnInit() {
    this.pageIndex = 1;
    this.getAllEmailMessages();
  }

  getAllEmailMessages() {
    this.dataStatus = true;
    this.emailSource = [];
    this.auth.showLoader();
    
    this.apiService.getEmailMessages(this.emailFetchForm).subscribe(
      res => {
        this.auth.hideLoader();
        this.emailDataSource = res;
        this.totalRecords = res.length;
        if (res.length == 0) {
          this.dataStatus = false;
        }
        this.emailSource = res;
        //this.fetchTableDataByPage(this.pageIndex);
      },
      err => {
        this.dataStatus = false;
        this.auth.hideLoader();
      }
    );

  }


  isTimeValid(): boolean {
    let v = moment(this.emailFetchForm.from_date).diff(moment(this.emailFetchForm.to_date))
    if (v <= 0) {
      return true;
    }
    else {
      return false;
    }
  }

  fetchemailByDate() {
    if (this.isTimeValid()) {
      this.getAllEmailMessages();
    }
    else {
      let obj = {
        type: "error",
        title: "",
        Body: "From date cannot be greater than To date"
      }
      this.appC.popToast(obj);

    }
  }


  dateValidationForFuture(e) {
    //console.log(e);
    let today = moment(new Date);
    let selected = moment(e);

    let diff = moment(selected.diff(today))['_i'];

    if (diff <= 0) {

    }
    else {
      this.emailFetchForm.to_date = moment(new Date).format('YYYY-MM-DD');
      this.emailFetchForm.from_date = moment(new Date).format('YYYY-MM-DD');

      let msg = {
        type: "info",
        body: "Future date is not allowed"
      }

      this.appC.popToast(msg);
    }

  }
  // pagination functions 

  fetchTableDataByPage(index) {
    this.pageIndex = index;
    let startindex = this.displayBatchSize * (index - 1);
    this.emailSource = this.getDataFromDataSource(startindex);
  }

  fetchNext() {
    this.pageIndex++;
    this.fetchTableDataByPage(this.pageIndex);
  }

  fetchPrevious() {
    if (this.pageIndex != 1) {
      this.pageIndex--;
      this.fetchTableDataByPage(this.pageIndex);
    }
  }

  getDataFromDataSource(startindex) {
    let t = this.emailDataSource.slice(startindex, startindex + this.displayBatchSize);
    return t;
  }


  switchActiveView(id) {
    document.getElementById('email') && document.getElementById('email').classList.remove('active');
  }
 

  searchDatabase() {
    if (this.searchText != "" && this.searchText != null) {
      let searchData: any;
      searchData = this.emailSource.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchText.toLowerCase()))
      );
      this.emailSource = searchData;
      this.searchflag = true;

    }
    else {
      this.auth.showLoader();
      this.apiService.getEmailMessages(this.emailFetchForm).subscribe(
        res => {
          this.auth.hideLoader();
          this.emailSource = res;
          this.searchflag = false;
        },
        err => {
          this.auth.hideLoader();
        }
      )
    }
  }
}
  

