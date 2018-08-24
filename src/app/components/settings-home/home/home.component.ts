import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../../../app.component';

import { LoginService } from '../../../services/login-services/login.service';
import { AuthenticatorService } from '../../../services/authenticator.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isProfessional: boolean = false;

  constructor(private router: Router, private login: LoginService, private auth: AuthenticatorService) {
    if (sessionStorage.getItem('userid') == null) {
      this.router.navigate(['/authPage']);
    }
  }

  ngOnInit() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
  }

}
