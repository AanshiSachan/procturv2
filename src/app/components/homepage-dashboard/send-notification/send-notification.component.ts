import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AppComponent } from '../../../app.component';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { HttpService } from '../../../services/http.service';
import { MessageShowService } from '../../../services/message-show.service';
import { WidgetService } from '../../../services/widget.service';



@Component({
  selector: 'app-send-notification',
  templateUrl: './send-notification.component.html',
  styleUrls: ['./send-notification.component.scss']
})
export class SendNotificationComponent implements OnInit {
  jsonFlag: any = {
    smsTabType: 'approved',
    showAllMessage: false,
    openMessageFlag: false,
    editMessage: false,
    messageObject: {}
  };
selectStudentForm :boolean= false;
addSmsForm:boolean=true;
addNotification: boolean = false;
openAppUserSelected = false;


messageCount: number = 0;
newMessageText: string = "";
messageList: any = [];
emailMessageList: any = [];
openMessageList: any = [];
  openEmailMessageList: any = [];

  constructor( private router: Router,
    private auth: AuthenticatorService,
    private httpService :HttpService,
    private msgService: MessageShowService,
    private widgetService: WidgetService,
    private appC: AppComponent,


    
    ) {
      this.jsonFlag.institute_id = sessionStorage.getItem('institution_id');
    }

  ngOnInit(): void {
    this.getAllMessageFromServer()
  }
openStudentForm(){
  this.selectStudentForm = true
  this.addSmsForm = false
}



getAllMessageFromServer() {
  console.log("1");
  this.messageList = [];
  this.emailMessageList = [];
  let tempMessageList: any = [];
  this.auth.showLoader();
  let obj = {
    date : moment(new Date("YYYY-MM-DD"))
    // from_date: moment().subtract(1, 'months').format("YYYY-MM-DD"),
    // status: 1,
    // to_date: moment().format("YYYY-MM-DD")
  }
  this.widgetService.getMessageList(obj).subscribe(
    res => {
      console.log("Response", res);
      this.messageList = res;
      console.log("sgggggggg",this.messageList)
     
      this.auth.hideLoader();
    },
    err => {
      this.auth.hideLoader();
    }
  )
  }

  hasUnicode(str) {
    for (var i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 127) return true;
    }
    return false;
  }
  countNumberOfMessage() {
    let uniCodeFlag = this.hasUnicode(this.newMessageText);
    let charLimit = 160;
    if (uniCodeFlag) {
      charLimit = 70
    }
    if (this.newMessageText.length == 0) {
      this.messageCount = 0;
    }
    else if (this.newMessageText.length > 0 && this.newMessageText.length <= charLimit) {
      this.messageCount = 1;
    }
    else {
      let count = Math.ceil(this.newMessageText.length / charLimit);
      console.log(count);
      this.messageCount = count;
    }
  }


saveNewMessage() {
  let obj = { message: this.newMessageText };
  this.auth.showLoader();
  this.widgetService.saveMessageTOServer(obj).subscribe(
    res => {
      let msg = {
        type: 'success',
        title: 'Message created Successfully',
        body: " Your request is in queue and process shortly"
      };

      this.appC.popToast(msg);
      this.getAllMessageFromServer();
      this.closeNewMessageDiv()
      this.auth.hideLoader();

     
    },
    err => {
      //console.log(err);
      let msg = {
        type: 'error',
        title: 'Failed To Save Message',
        // body: err.message
      };
      this.appC.popToast(msg);
    }
  )
}
editSMS(row) {
  this.jsonFlag.editMessage = true;
  this.jsonFlag.messageObject = row;
  this.newMessageText = row.message;
  this.messageCount = 1;
}


updateMessage() {
  let obj = { message: this.newMessageText };
  this.auth.showLoader();
  this.widgetService.changesSMSStatus(obj, this.jsonFlag.messageObject.message_id).subscribe(
    res => {
      this.auth.hideLoader();
      let msg = {
        type: 'success',
        title: 'Message updated Successfully',
      };
      this.appC.popToast(msg);
      this.getAllMessageFromServer();
      this.closeNewMessageDiv()
      // this.closeNewMessageDiv();
      // this.onTabChange(this.jsonFlag.smsTabType);
      // as per view it get the sms data --laxmi
    },
    err => {
      this.auth.hideLoader();
      //console.log(err);
      let msg = {
        type: 'error',
        title: 'Failed To Update Message',
        body: err.message
      };
      this.appC.popToast(msg);
    }
  )

}



onCheckBoxSelection(index, data) {
  this.messageList.map(ele => {
    if (ele.message_id == data.message_id) {
      ele.assigned = true;
    } else {
      ele.assigned = false;
    }
  })
}



closeNewMessageDiv() {
  this.newMessageText = "";
  this.messageCount = 0;
  this.jsonFlag.editMessage = false;
}

}



