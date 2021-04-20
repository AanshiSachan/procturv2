import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { HttpService } from '../../../services/http.service';
import { MessageShowService } from '../../../services/message-show.service';



@Component({
  selector: 'app-send-notification',
  templateUrl: './send-notification.component.html',
  styleUrls: ['./send-notification.component.scss']
})
export class SendNotificationComponent implements OnInit {
jsonFlag={
  institute_id:''
}
smsData:any[]=[];
  constructor( private router: Router,
    private auth: AuthenticatorService,
    private httpService :HttpService,
    private msgService: MessageShowService,
    ) {
      this.jsonFlag.institute_id = sessionStorage.getItem('institution_id');
    }

  ngOnInit(): void {
    this.getAllSmsData();
  }

getAllSmsData(){
 this.auth.showLoader();
 let url = `/api/v1/institutes/sms-gateway/fetch-all/${this.jsonFlag.institute_id}`
 this.httpService.getData(url).subscribe(
  (res: any) => {
    this.auth.hideLoader();
    this.smsData = res;
    console.log("asha smmmmmmmmmmmm",this.smsData)
  },
  err => {
    this.auth.hideLoader();
    this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
  }
)
}
}

