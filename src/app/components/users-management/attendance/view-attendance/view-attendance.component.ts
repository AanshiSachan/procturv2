import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MessageShowService } from '../../../../services/message-show.service';
import { HttpService } from '../../../../services/http.service';
// import { document } from 'ngx-bootstrap-custome/utils/facade/browser';
import { provideRoutes, Router } from '@angular/router';
import { AuthenticatorService } from '../../../../services/authenticator.service';

@Component({
  selector: 'app-view-attendance',
  templateUrl: './view-attendance.component.html',
  styleUrls: ['./view-attendance.component.scss']
})
export class ViewAttendanceComponent implements OnInit {

  activeDayIsOpen: boolean;

  jsonFlag = {
    institute_id: ''
  }
  userDetailsAttendance = {
    fromDate: moment(new Date()).format('YYYY-MM-DD'),
    toDate: moment(new Date()).format('YYYY-MM-DD'),
    user_id: '17863',

  }
  //viewDate: Date = new Date();


  userDetailsAttendanceList: any[] = []
  constructor(private msgService: MessageShowService,
    private httpService: HttpService,
    private router: Router,
    private auth: AuthenticatorService) {
    this.jsonFlag.institute_id = sessionStorage.getItem('institution_id');

  }

  ngOnInit(): void {
    this.getallAttendanceDetails()

  }

  getallAttendanceDetails() {
    this.auth.showLoader();

    const url = '/api/v1/daily/attendance/' + this.jsonFlag.institute_id + /getByUser/ + this.userDetailsAttendance.user_id + '?' + 'formDate=' + this.userDetailsAttendance.fromDate + '&&' + 'toDate=' + this.userDetailsAttendance.toDate;
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.userDetailsAttendanceList = res;
        console.log("ASHA create Atttendance", this.userDetailsAttendanceList)
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }


  priveous() {
    this.userDetailsAttendance.fromDate = moment(new Date()).format('YYYY-MM-DD');
    let today = this.userDetailsAttendance.fromDate

  }


}
