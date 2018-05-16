import {Component,NgModule} from '@angular/core'; 
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { AppComponent } from '../../app.component';
import * as moment from 'moment';
import { ZendAuth } from '../../services/Chat-bot/chatbot.service';
import { LoginService } from '../../services/login-services/login.service';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';

@Component({
    selector: 'app-chatbot',
    templateUrl: './chatbot.component.html',
    styleUrls: ['./chatbot.component.scss']
  })
  export class chatBotComponent {
    isProfessional: boolean = false;


    payload = {
      "ticket": {
        "subject": "",
        "description": "",
        "requester_id": '362262131554'
      }
    }
  
    constructor(private router: Router, private auth: ZendAuth, private appC: AppComponent, private login: LoginService, ) {
      if (sessionStorage.getItem('Authorization') == null) {
        this.router.navigate(['/authPage']);
      }
    }
  
    ngOnInit() {
      this.isProfessional = sessionStorage.getItem('institute_type') == 'LANG';
      this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
      this.login.changeNameStatus(sessionStorage.getItem('name'));
    }
  
  
    ZendeskLogin() {
      this.auth.ZendeskAuth(this.payload).subscribe(
  
        (data: any) => {
          let msg = {
            type: "success",
            title: "",
            body:   "#" + data.audit.ticket_id + "  " +"Your Ticket has been Generated."
          }
          this.appC.popToast(msg);
        },
        error => {
          let msg = {
            type: "error",
            title: "",
            body: "An Error Occured"
          }
          this.appC.popToast(msg);
        }
      )
    }
  
    ticketData(){
    
    }
/*
ticket_id
 */

    posterData() {
      this.ZendeskLogin();
    }
  }
  
  
  
  
  
  