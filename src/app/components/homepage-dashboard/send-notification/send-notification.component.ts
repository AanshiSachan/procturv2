import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AppComponent } from '../../../app.component';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { HttpService } from '../../../services/http.service';
import { MessageShowService } from '../../../services/message-show.service';
import { WidgetService } from '../../../services/widget.service';
import { ProductService } from '../../../services/products.service';




@Component({
  selector: 'app-send-notification',
  templateUrl: './send-notification.component.html',
  styleUrls: ['./send-notification.component.scss']
})
export class SendNotificationComponent implements OnInit {
  jsonFlag: any = {
    smsTabType: 'approved',
    openMessageFlag: false,
    editMessage: false,
    editApprovedMsg:false,
    messageObject: {},
    approveMessageObject:{}
  };
  combinedDataRes: any = {};
  userType:any
  sendNotification = {
    standard_id: '-1',
    subject_id: '-1',
    batch_id: '-1',
    course_id:'-1'
  };
  sendNotificationCourse = {
    master_course: '',
    course_id: '',
    standard_id: ''
  }
  loginField = {
    checkBox: '0'
  }
sendLoginmessage:boolean=false
  messageFlag:boolean= true;
  emailFlag :boolean=false;
  selectStudentForm :boolean= false;
  addSmsForm:boolean=true;
  showTableFlag: boolean = false;
  showFacultyTableFlag:boolean = false;
  showInactiveStudentFlag:boolean =false;
  showAllaluminiStudentFlag:boolean=false;
  showallUserListFlag:boolean=false; 
  schoolModel: boolean = false;
  showEmailSubject: boolean = false;
  chkbxSmsSend:boolean=false;
  sendToStudent:boolean=true;
  sendToParent:boolean=false;
  sendTogardiunt:boolean=false;
  dilverSms:boolean=true;
  dilverEmail:boolean=false;
  public isProfessional: boolean = false;
  previowBox: boolean = false;


  allChecked: boolean = false;
  allRowCheck :boolean=false
  searchData: string = "";
  messageCount: number = 0;
  newMessageText: string = "";
  approveMessageText:string="";
  messageList: any = [];
  emailMessageList:any=[];
  openMessageList: any = [];
  masterCourseList: any =[];
  courseList: any=[];
  batchList: any = [];
  studentList:any =[];
  allFacultyList:any =[];
  allInactiveStudentList:any=[];
  allAluminiList:any=[];
  allUserList:any=[];
  fullResponse: any = [];
  selectedActiveStudentList:any;
  selectedRow:any;
  subject: any;
  activeRowCeckbox:boolean=false;
  facultyCheckBox:boolean=false;
  aluminiCheckBox:boolean=false;
  allUserCheck:boolean=false;
  inactiveCheck:boolean=false;

  previewedMessage: any;
  transactionalSmsm:any;
  pramotionalSms:any;

  messageSubject: any = "";
  selectedMessageText:string ="";
  selectedMessageCount:number =0;
  selectedMessageId:any

  constructor( private router: Router,
    private auth: AuthenticatorService,
    private httpService :HttpService,
    private msgService: MessageShowService,
    private widgetService: WidgetService,
    private appC: AppComponent,
    private productService: ProductService
    ) {
      this.jsonFlag.institute_id = sessionStorage.getItem('institution_id');
      this.transactionalSmsm = sessionStorage.getItem('smsTransaction')
      this.pramotionalSms = sessionStorage.getItem('pramotionValu')
    }

  ngOnInit(): void {

    this.auth.schoolModel.subscribe(
      res => {
        this.schoolModel = false;
        if (res) {
          this.schoolModel = true;
        }
      }
    )

    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )
     this.getAllMessageFromServer();
    //this.getOpenStatusSMS()
    //this.getMaterCourseList();
  }
  getAllMessageFromServer() {
    console.log("1");
    this.messageList = [];
    this.emailMessageList = [];
    let tempMessageList: any = [];
    this.auth.showLoader();
    let obj = {
      from_date: moment().subtract(1, 'months').format("YYYY-MM-DD"),
      //from_date: moment( new Date("YYYY-MM-DD")),
      status: 1,
       to_date: moment().format("YYYY-MM-DD")
    }
    this.widgetService.getMessageList(obj).subscribe(
      res => {
        console.log("Response", res);
        
        tempMessageList = res;
        for (let i = 0; i < tempMessageList.length; i++) {
          if (tempMessageList[i].source === "EMAIL") {
            this.emailMessageList.push(tempMessageList[i]);
          }
          else if (tempMessageList[i].source === "SMS") {
            this.messageList.push(tempMessageList[i]);
            console.log("sms list",this.messageList)
          }
        }
        this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
      }
    )

  }
onselectMessageCheckbox(obj){
this.selectedRow = obj.message
this.selectedMessageId= obj.message_id
this.selectedMessageText=this.selectedRow.length
console.log("msg length",this.selectedMessageText)

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
  this.auth.showLoader();
  let src: any;
  let status:any
  if (this.messageFlag == true) {
    src = "SMS";
    status = 1
  }
  else {
    src = "EMAIL";
  }
  let obj = { message: this.newMessageText ,source: src,status: status};
  this.widgetService.saveMessageTOServer(obj).subscribe(
    res => {
      let msg = {
        type: 'success',
        title: 'Message created Successfully',
        body: " Your request is in queue and process shortly"
      };
      this.auth.hideLoader();
      this.appC.popToast(msg);
       this.getAllMessageFromServer();
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

 deletMessage(data,statusCode){
  let msg: any = "";
 this.selectedMessageId = data
  if(statusCode == 0){
 msg = 'deleted'
  }
    if (confirm('Are you sure, You want  to ' + msg + ' the message?')) {
      this.widgetService.changesSMSStatus({'status':statusCode},data.message_id).subscribe(
        res => {
          let msg = {
            type: 'success',
            title: ' messages deleted successfully',
            body: ''
          }
          this.appC.popToast(msg);
          this.getAllMessageFromServer();
        },
        err => {
          let msg = {
            type: 'error',
            title: '',
            body: err.error.message
          }
          this.appC.popToast(msg);
        }
      )
    }
  }

 
}
