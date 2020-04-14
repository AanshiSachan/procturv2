import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../../../services/authenticator.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  jsonFlag = {
    isProfessional: false,
    isShowEcourseMapping: false,
  }



  constructor(private auth: AuthenticatorService) {

  }

  ngOnInit() {
    const permittedRoles = sessionStorage.getItem('permitted_roles');
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.jsonFlag.isProfessional = true;
        } else {
          this.jsonFlag.isProfessional = false;
        }
      }
    );

  }

}
