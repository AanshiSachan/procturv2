import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../services/login-services/login.service';
import { AppComponent } from '../../../../app.component';
import * as moment from 'moment';
/* import { getCheque } from '../../../../services/cheque-manage/get-cheque.service'; */


@Component({
  selector: 'app-cheque-manage',
  templateUrl: './cheque-manage.component.html',
  styleUrls: ['./cheque-manage.component.scss']
})
export class ChequeManageComponent implements OnInit {

  datefield: any[] = [];

  constructor(private login: LoginService, private appC: AppComponent, /* private getter: getCheque */) {
    this.datefield[0] = new Date(moment().date(1).format("YYYY-MM-DD"));
    this.datefield[1] = new Date();
  }

  ngOnInit() {
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));

    this.fetchChequeType();
  }

  fetchChequeType() {

/*     this.getter.getChequeTypes() */

  }

}
