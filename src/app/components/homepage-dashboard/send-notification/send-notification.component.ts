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
    editMessage: false,
    editEmail:false,
    createMesageFlag:false,
    createEmailFlag:false,
    selectedMessageFlag:false,
    selectedEmailChecboxFlag:false
};
  combinedDataRes: any = {};
  userType:any
  sendNotification = {
    standard_id: '-1',
    subject_id: '-1',
    batch_id: '-1',
    course_id:'-1'
  };
  
  loginField = {
    checkBox: '0'
  }
sendLoginmessage:boolean=false
  messageFlag:boolean= true;
  emailTableFlag :boolean=false;
  smsTableFlag:boolean=false;
  selectStudentForm :boolean= false;
  addSmsForm:boolean=true;
 
  
  schoolModel: boolean = false;
 
  public isProfessional: boolean = false;
  previowBox: boolean = false;


  allChecked: boolean = false;
  allRowCheck :boolean=false
  searchData: string = "";
  messageCount: number = 0;
  newMessageText: string = "";
  newEmailText:string ="";
  approveMessageText:string="";
  messageList: any = [];
  emailMessageList:any=[];
  openMessageList: any = [];
  
  fullResponse: any = [];
  selectedActiveStudentList:any;
  selectedRow:any;
  subject: any;
 pramotional:any
 transactional:any
 email_subject:any

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
    this.smsTableFlag = true

  }
  onClickEmai(){
    this.emailTableFlag = true
    this.smsTableFlag = false
  }
  onClickSms(){
    this.emailTableFlag = false
    this.smsTableFlag = true
  }
  onClickCreateMessage(){
    this.jsonFlag.createMesageFlag = true
    this.jsonFlag.selectedMessageFlag = false

  }
  onClickCreateEmail(){
    this.jsonFlag.createEmailFlag=true
    this.jsonFlag.createMesageFlag = false
    this.jsonFlag.selectedMessageFlag = false
  }
  closeDiv(){
    this.jsonFlag.createMesageFlag = false
    this.jsonFlag.selectedMessageFlag = false
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
  this.jsonFlag.selectedMessageFlag = true
this.selectedRow = obj.message
this.selectedMessageId= obj.message_id
sessionStorage.setItem('selecte-messase',(this.selectedRow))
sessionStorage.setItem('selected-message_id',JSON.stringify(this.selectedMessageId))

this.selectedMessageText=this.selectedRow.length
console.log("msg length",this.selectedMessageId)

}
onSelectedEmailCheckbox(obj){
  this.jsonFlag.selectedEmailChecboxFlag = true
this.selectedRow = obj.message
this.selectedMessageId= obj.message_id
sessionStorage.setItem('selecte-messase',(this.selectedRow))
sessionStorage.setItem('selected-message_id',JSON.stringify(this.selectedMessageId))

this.selectedMessageText=this.selectedRow.length
console.log("msg length",this.selectedMessageId)
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
  if (this.jsonFlag.createMesageFlag == true) {
    src = "SMS";
    status = 1
  }
  else {
    src = "EMAIL";
    status = 1
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
  if(statusCode == 1 ){
 msg = 'Approves'
  }else{
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
  onClickEdit(obj){
    this.jsonFlag.editMessage = true
    this.newMessageText = obj.message
    this.selectedMessageId = obj.message_id
    console.log("ghghg",this.selectedMessageId)
  }
  onClickEditEmail(obj){
    this.jsonFlag.editEmail = true
    this.newMessageText = obj.message
    this.selectedMessageId = obj.message_id
    console.log("ghghg",this.selectedMessageId)
  }
updateMessage(){
    let obj = { message: this.newMessageText,status:1};
    this.auth.showLoader();
    this.widgetService.changesSMSStatus(obj, this.selectedMessageId ).subscribe(
      res => {
        this.auth.hideLoader();
        this.getAllMessageFromServer()
        let msg = {
          type: 'success',
          title: 'Message updated Successfully',
        };
        this.appC.popToast(msg);
      
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
  clickEvent(event){
   this.pramotional = event
    console.log("pramotional",this.pramotional)

  }
  onClickSentTo(){
    this.router.navigateByUrl('/view/dashboard/send-to-messages')
  }
  onClickEmailSentTo(){
    this.router.navigateByUrl('/view/dashboard/send-to-messages')
    sessionStorage.setItem('email-subject',this.email_subject)
    console.log("email subject",this.email_subject)

  }
}
 

