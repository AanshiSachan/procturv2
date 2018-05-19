import { Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { AppComponent } from '../../app.component';
import * as moment from 'moment';
import { ZendAuth } from '../../services/Chat-bot/chatbot.service';
import { LoginService } from '../../services/login-services/login.service';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';
import { Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class chatBotComponent {
  isProfessional: boolean = false;
  closechatbot: boolean = true;
  @Output() flagData: EventEmitter<any>;
  @ViewChild('helpForm') help: ElementRef;

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
    this.flagData = new EventEmitter();

  }

  ngOnInit() {
    this.isProfessional = sessionStorage.getItem('institute_type') == 'LANG';
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
  }

  ZendeskLogin() {
    if (this.payload.ticket.subject == "" && this.payload.ticket.description == "") {

      this.helpRequested();
      return;

    }
     if (this.payload.ticket.subject == "" || this.payload.ticket.description == "" ) {
      let data = {
        type: 'error',
        title: "Error",
        body: "Please fill Both this fields."
      }
      this.appC.popToast(data);
      return;
    }
    this.auth.ZendeskAuth(this.payload).subscribe(
      (data: any) => {
        this.flagData.emit(data);
        this.helpRequested();       
      },
      (err: any)  => {
        this.flagData.emit(err);
        this.helpRequested();
      }     
    )
  }

  posterData() {
    this.ZendeskLogin();
  }

  helpRequested() {
    if (this.help.nativeElement.classList.contains('active')) {
      this.payload.ticket.subject = "";
      this.payload.ticket.description = "";
      this.help.nativeElement.classList.remove('active');

    }
    else {
      this.help.nativeElement.classList.add('active');
    }
  }

  closeHelp() {
    this.help.nativeElement.classList.remove('active');
  }

}






