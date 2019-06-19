import { Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { AuthenticatorService } from '../../services/authenticator.service';
import { MessageShowService } from '../../services/message-show.service';
import { ZendAuth } from '../../services/Chat-bot/chatbot.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class chatBotComponent {

  @Output() flagData: EventEmitter<any>;
  @ViewChild('helpForm') help: ElementRef;
  isProfessional: boolean = false;
  closechatbot: boolean = true;
  payload = {
    "ticket": {
      "subject": "",
      "description": "",
      "requester_id": '362262131554'
    }
  }

  constructor(
    private router: Router,
    private auth: ZendAuth,
    private msgService: MessageShowService
  ) {
    if (sessionStorage.getItem('userid') == null) {
      this.router.navigate(['/authPage']);
    }
    this.flagData = new EventEmitter();
  }

  ZendeskLogin() {
    if (this.payload.ticket.subject == "" && this.payload.ticket.description == "") {
      this.helpRequested();
      return;

    }
    if (this.payload.ticket.subject == "" || this.payload.ticket.description == "") {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, "Error", "Please fill Both this fields");
      return;
    }
    if (this.payload.ticket.description.length > 499) {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, "Description should not be greater than 500 Characters", "");
      return;
    }

    this.auth.ZendeskAuth(this.payload).subscribe(
      (data: any) => {
        this.flagData.emit(data);
        this.helpRequested();
      },
      (err: any) => {
        this.flagData.emit(err);
        this.helpRequested();
      }
    )
    this.payload.ticket.description = "";
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






