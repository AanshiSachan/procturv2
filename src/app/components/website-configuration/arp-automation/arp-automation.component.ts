import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { MessageShowService } from '../../../services/message-show.service';
import { HttpService } from '../../../services/http.service';

@Component({
  selector: 'app-arp-automation',
  templateUrl: './arp-automation.component.html',
  styleUrls: ['./arp-automation.component.scss']
})
export class ArpAutomationComponent implements OnInit {
appLogos:boolean=true
generateApk:boolean=false
headerSetting: any;
  tableSetting: any;
  rowColumns: any;
  private token : string 
  constructor(private auth:AuthenticatorService,
    private _http: HttpService,private msgService: MessageShowService,
    ) {
     
     }

  ngOnInit(): void {
    this.setTableData()
   // this.currentStatusofClient()
    this.token = sessionStorage.getItem('token')
    console.log("tokennnnnnnnnnn",this.token)
  }
  toggler(){
    this.appLogos = true
    this.generateApk=false
  }
  toggler2(){
    this.generateApk = true
    this.appLogos = false
  }
  setTableData() {
    this.headerSetting = [
      {
        primary_key: 'Sr.No',
        value: "Sr.No",
        charactLimit: 10,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'Version',
        value: "Version",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'Package Name',
        value: "Package Name",
        charactLimit: 25,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'Request Time',
        value: "Request Time",
        charactLimit: 25,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'action',
        value: "Download",
        charactLimit: 10,
        sorting: false,
        visibility: true,
        edit: true,
        delete: true,
        // editCondition: 'converted == 0',
        // deleteCondition: 'converted == 0'
      },
    ]

    this.tableSetting = {
      width: "100%",
      height: "58vh"
    }

    this.rowColumns = [
      {
        width: "15%",
        textAlign: "left"
      },
      {
        width: "25%",
        textAlign: "left"
      },
      {
        width: "25%",
        textAlign: "left"
      },
      {
        width: "25%",
        textAlign: "left"
      },
      {
        width: "25%",
        textAlign: "left"
      },

    ]
  }
  fileData: any;

  onclickTab(id){
    document.getElementById(id).click();

  }
  currentStatusofClient(){
    let obj={
      Params:{
      token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnN0aXR1dGVfaWQiOjEwMDEyNiwiaWF0IjoxNjI2OTUzMjY0fQ.k2Ngi8Fvy9BXc5107Gifzv0Bf-lZkiKybRQ5tOUcpMg"


      }
    }
    this.auth.showLoader();
let url ='/api/v1/client/requestStatus'
this._http.postData(obj,url).subscribe(
  (res:any)=>{
    console.log("resssssss",res)
    this.auth.hideLoader();
  },
  err => {
    this.auth.hideLoader();

    this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);

  }
)
  }
}
