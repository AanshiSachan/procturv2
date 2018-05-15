import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../services/login-services/login.service';
import { AppComponent } from '../../../../app.component';

@Component({
  selector: 'app-fee-manage',
  templateUrl: './fee-manage.component.html',
  styleUrls: ['./fee-manage.component.scss']
})
export class FeeManageComponent implements OnInit {

  constructor(private login: LoginService, private appC: AppComponent) { }

  ngOnInit() {
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
  }


}
