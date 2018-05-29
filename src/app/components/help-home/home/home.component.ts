import { Component, OnInit, } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { AppComponent } from '../../../app.component';
import * as moment from 'moment';
//import { ZendAuth } from '../../../services/Help-Service/help.service';
import { LoginService } from '../../../services/login-services/login.service';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isProfessional: boolean = false;


  payload = {
    "ticket": {
      "subject": "",
      "description": "",
      "requester_id": '362262131554'
    }
  }

  constructor(private router: Router,  private appC: AppComponent, private login: LoginService, ) {
    if (sessionStorage.getItem('userid') == null) {
      this.router.navigate(['/authPage']);
    }
  }

  ngOnInit() {
    this.isProfessional = sessionStorage.getItem('institute_type') == 'LANG';
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
  }


//   ZendeskLogin() {
//     this.auth.ZendeskAuth(this.payload).subscribe(

//       (data: any) => {
//       },
//       error => {
//         let msg = {
//           type: "error",
//           title: "",
//           body: "An Error Occured"
//         }
//         this.appC.popToast(msg);
//       }
//     )
//   }

//   posterData() {
//     this.ZendeskLogin();
//   }
 }




