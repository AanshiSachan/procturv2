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
    editPush:false,
    createMesageFlag:false,
    createEmailFlag:false,
    createdPushNotification:false,
    selectedMessageFlag:false,
    selectedEmailChecboxFlag:false,
    selectedPushCheckbox:false
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
  pushTableFlag:boolean=false;
  selectStudentForm :boolean= false;
  selectedSmsCheckBox:boolean=false;
  selectedEmailCheckBox:boolean=false;
  emailCeckbox:string="selectedEmailCheck"
  selectesPushCheckBox:boolean=false;

  pramotionalSelectedFlag:boolean=false;
  transactionalSelectedFlag:boolean=true
  classToggled = false;
 
  
  schoolModel: boolean = false;
 
  public isProfessional: boolean = false;
  previowBox: boolean = false;


  allChecked: boolean = false;
  allRowCheck :boolean=false
  searchData: string = "";
  messageCount: number = 0;
  //selectedMessageCount:number =0
  newMessageText: string = "";
  newEmailText:string ="";
  notificationMessage:string=""



  approveMessageText:string="";
  messageList: any = [];
  emailMessageList:any=[];
  openMessageList: any = [];
  pushNotificationList:any=[];
  
  fullResponse: any = [];
  selectedActiveStudentList:any;
  selectedRow:any;
  subject: any;
 pramotional:any
 transactional:any
 email_subject:string="";

  previewedMessage: any;
  transactionalSms:number=0;
  pramotionalSms:any;
  email_quataBalence:number=0

  messageSubject: any = "";
  selectedMessageText:string ="";
  selectedMessageCount:number =0;
  selectedMessageId:any
  backToEdit:string="";
  bactToeditMsgId:any
  backEeditEmail:string=""
  baclToemai_Id:any;
  backToeditPush:string="";
  backTopush_Id:any
  backToeditEmaiSub:string=""
  editorConf = {
    height: 150,
    menubar: false,
    branding: false,
    plugins: [
      'preview anchor',
      'visualblocks code ',
      'insertdatetime  table paste code  wordcount'
    ],
    toolbar: 'undo redo | formatselect | bold italic backcolor | \
              alignleft aligncenter alignright alignjustify | \
              bullist numlist outdent indent'
  };

  constructor( private router: Router,
    private auth: AuthenticatorService,
    private httpService :HttpService,
    private msgService: MessageShowService,
    private widgetService: WidgetService,
    private appC: AppComponent,
    private productService: ProductService
    ) {
      this.jsonFlag.institute_id = sessionStorage.getItem('institution_id');
      // this.transactionalSms = sessionStorage.getItem('smsTransaction')
      // this.pramotionalSms = sessionStorage.getItem('pramotionValu')
      // this.email_quataBalence = sessionStorage.getItem('email_quoat_balence')
      



    }

  ngOnInit(): void {
//console.log("back edit message",this.backToEdit)
    // this.auth.schoolModel.subscribe(
    //   res => {
    //     this.schoolModel = false;
    //     if (res) {
    //       this.schoolModel = true;
    //     }
    //   }
    // )
    this.schoolModel = this.auth.schoolModel.getValue();

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
     this.backToEdit = sessionStorage.getItem('editmessageDesc')
     this.bactToeditMsgId = sessionStorage.getItem('edit-mesgId')
     this.backEeditEmail = sessionStorage.getItem('editEmail')
     this.backToeditPush = sessionStorage.getItem('editPushmessage')
     this.backTopush_Id = sessionStorage .getItem('edit-PushMesgId')
     this.baclToemai_Id = sessionStorage.getItem('editEmaiId')
    this.smsTableFlag = true
  

if(this.backToEdit != '' && this.backToEdit !=null){
  sessionStorage.removeItem('editmessageDesc')

  this.jsonFlag.editMessage = true
  this.newMessageText = this.backToEdit
  this.selectedMessageId = this.bactToeditMsgId


} 
 if(this.backEeditEmail !="" && this.backEeditEmail !=null){
  sessionStorage.removeItem('editEmail')

  this.jsonFlag.editEmail = true
  this.smsTableFlag = false
  this.emailTableFlag = true
  this.newMessageText = this.backEeditEmail
  this.selectedMessageId = this.baclToemai_Id

 
}if(this.backToeditPush !="" && this.backToeditPush !=null){
  sessionStorage.removeItem('editPushmessage')

  this.jsonFlag.editPush = true
  this.smsTableFlag = false
  this.pushTableFlag = true
  this.newMessageText = this.backToeditPush
  this.selectedMessageId = this.backTopush_Id

 }
 this.fetchWidgetPrefill()
  }
 
  onClickEmai(){
    this.emailTableFlag = true
    this.smsTableFlag = false
    this.pushTableFlag = false
    this.jsonFlag. editMessage=false,
    this.jsonFlag.editEmail=false,
    this.jsonFlag. editPush=false,
    this.jsonFlag.createMesageFlag=false,
    this.jsonFlag.createEmailFlag=false,
    this.jsonFlag.createdPushNotification=false,
    this.jsonFlag.selectedMessageFlag=false,
   this.jsonFlag. selectedEmailChecboxFlag=false,
    this.jsonFlag.selectedPushCheckbox=false
    this.selectedSmsCheckBox=false
    this.selectesPushCheckBox=false
    this.closeDiv()

  }
  onClickSms(){
    this.jsonFlag.createMesageFlag=false,
    this.closeDiv()
    this.emailTableFlag = false
    this.pushTableFlag = false
    this.smsTableFlag = true
    this.jsonFlag. editMessage=false,
    this.jsonFlag.editEmail=false,
    this.jsonFlag. editPush=false,
    this.jsonFlag.createEmailFlag=false,
    this.jsonFlag.createdPushNotification=false,
    this.jsonFlag.selectedMessageFlag=false,
   this.jsonFlag. selectedEmailChecboxFlag=false,
    this.jsonFlag.selectedPushCheckbox=false
    this.selectedEmailCheckBox=false
    this.selectesPushCheckBox=false
  }
  onClickPush(){
    this.closeDiv()

    this.pushTableFlag = true
    this.emailTableFlag = false
    this.smsTableFlag = false
    this.jsonFlag. editMessage=false,
    this.jsonFlag.editEmail=false,
    this.jsonFlag. editPush=false,
    this.jsonFlag.createMesageFlag=false,
    this.jsonFlag.createEmailFlag=false,
    this.jsonFlag.createdPushNotification=false,
    this.jsonFlag.selectedMessageFlag=false,
   this.jsonFlag. selectedEmailChecboxFlag=false,
    this.jsonFlag.selectedPushCheckbox=false
    this.selectedSmsCheckBox=false
    this.selectedEmailCheckBox=false

this.selectesPushCheckBox=false


  }
  onClickCreateMessage(){
    this.newMessageText=""
    this.jsonFlag.createMesageFlag = true
    this.jsonFlag.selectedMessageFlag = false
    this.selectedSmsCheckBox=false
    this.jsonFlag. editMessage=false,
    this.jsonFlag.editEmail=false,
    this.jsonFlag. editPush=false,
    this.jsonFlag.createEmailFlag=false,
    this.jsonFlag.createdPushNotification=false,
    this.jsonFlag.selectedMessageFlag=false,
   this.jsonFlag. selectedEmailChecboxFlag=false,
    this.jsonFlag.selectedPushCheckbox=false
  }
  onClickCreateEmail(){
    this.newMessageText=""
    this.selectedEmailCheckBox=false
    this.jsonFlag.createEmailFlag=true
    this.jsonFlag. editMessage=false,
    this.jsonFlag.editEmail=false,
    this.jsonFlag. editPush=false,
    this.jsonFlag.createMesageFlag=false,
    this.jsonFlag.createdPushNotification=false,
    this.jsonFlag.selectedMessageFlag=false,
   this.jsonFlag. selectedEmailChecboxFlag=false,
    this.jsonFlag.selectedPushCheckbox=false
    this.selectedSmsCheckBox=false
  }
  onclickCreatePushNotify(){
    this.newMessageText=""
    this.selectesPushCheckBox=false
    this.jsonFlag.createdPushNotification = true
    this.jsonFlag.createEmailFlag=false

    this.jsonFlag. editMessage=false,
    this.jsonFlag.editEmail=false,
    this.jsonFlag. editPush=false,
    this.jsonFlag.createMesageFlag=false,
    this.jsonFlag.selectedMessageFlag=false,
   this.jsonFlag. selectedEmailChecboxFlag=false,
    this.jsonFlag.selectedPushCheckbox=false
    this.selectedSmsCheckBox = false
  }
  closeDiv(){
    this.newMessageText=""
    this.selectedRow=""
    this.jsonFlag.createEmailFlag=false
    this.jsonFlag.createMesageFlag = false
    this.jsonFlag.selectedMessageFlag = false
    this.jsonFlag. editMessage=false,
    this.jsonFlag.editEmail=false,
    this.jsonFlag. editPush=false,
    this.jsonFlag.createMesageFlag=false,
    this.jsonFlag.createdPushNotification=false,
    this.jsonFlag.selectedMessageFlag=false,
   this.jsonFlag. selectedEmailChecboxFlag=false,
    this.jsonFlag.selectedPushCheckbox=false
  }
  onClicktransaction(event){
    this.pramotionalSelectedFlag = false
    if(event){
  this.transactionalSelectedFlag = true
  console.log("transactional",this.transactionalSelectedFlag)
}
  }
  onclicPramotional(event){
    this.transactionalSelectedFlag =false
    if(event){
      this.pramotionalSelectedFlag = true
      console.log("pramotional",this.pramotionalSelectedFlag)

    }
  }
  getAllMessageFromServer() {
    this.messageList = [];
    this.emailMessageList = [];
    this.pushNotificationList =[];
    let tempMessageList: any = [];
    let tempPushList:any=[];
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
      // tempMessageList = [];

        for (let i = 0; i < tempMessageList.length; i++) {
          if(tempMessageList[i].source === "Push"){
            this.pushNotificationList.push(tempMessageList[i])   

        }
        
          if (tempMessageList[i].source === "EMAIL") {
            this.emailMessageList.push(tempMessageList[i]);
          }
          else if (tempMessageList[i].source === "SMS") {
            this.messageList.push(tempMessageList[i]);
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
  let uniCodeFlag = this.hasUnicode(this.newMessageText);
  let charLimit = 160;
  this.jsonFlag.createMesageFlag = false
  this.jsonFlag.selectedMessageFlag = true
  this.selectedSmsCheckBox=true
  this.jsonFlag. editMessage=false,
  this.jsonFlag.editEmail=false,
  this.jsonFlag. editPush=false,
  this.jsonFlag.createEmailFlag=false,
  this.jsonFlag.createdPushNotification=false,
 this.jsonFlag. selectedEmailChecboxFlag=false,
  this.jsonFlag.selectedPushCheckbox=false
this.selectedRow = obj.message
this.selectedMessageId= obj.message_id
sessionStorage.setItem('selected-message',(this.selectedRow))
sessionStorage.setItem('selected-message_id',JSON.stringify(this.selectedMessageId))

this.selectedMessageText=this.selectedRow.length
sessionStorage.setItem('messageLength',(this.selectedMessageText))


  if (uniCodeFlag) {
    charLimit = 70
  }
if (this.selectedRow.length == 0) {
  this.selectedMessageCount = 0;
}
else if (this.selectedRow.length > 0 && this.selectedRow.length <= charLimit) {
  this.selectedMessageCount = 1;
}
else {
  let count = Math.ceil(this.selectedRow.length / charLimit);

  console.log(count);
  this.selectedMessageCount = count;
}

sessionStorage.setItem('messageCounts',JSON.stringify(this.selectedMessageCount))


}
onSelectedEmailCheckbox(obj){
  this.jsonFlag.createEmailFlag =false
  this.jsonFlag.selectedEmailChecboxFlag = true
  this.selectedEmailCheckBox=true
  this.jsonFlag.selectedMessageFlag = false
  this.jsonFlag. editMessage=false,
  this.jsonFlag.editEmail=false,
  this.jsonFlag. editPush=false,
  this.jsonFlag.createMesageFlag=false,
  this.jsonFlag.createdPushNotification=false,
  this.jsonFlag.selectedPushCheckbox=false
this.selectedRow = obj.message
this.selectedMessageId= obj.message_id

sessionStorage.setItem('selecte-email-message',(this.selectedRow))
sessionStorage.setItem('selected-message_id',JSON.stringify(this.selectedMessageId))


}
onClickSelectPush(obj){
  this.jsonFlag.selectedPushCheckbox = true
  this.selectesPushCheckBox=true
  this.jsonFlag.createdPushNotification = false
  this.jsonFlag.createEmailFlag=false
  this.jsonFlag.selectedMessageFlag = false
  this.jsonFlag. editMessage=false,
  this.jsonFlag.editEmail=false,
  this.jsonFlag. editPush=false,
  this.jsonFlag.createMesageFlag=false,
 this.jsonFlag. selectedEmailChecboxFlag=false,
  this.selectedRow = obj.message
this.selectedMessageId= obj.message_id

sessionStorage.setItem('push_message',this.selectedRow)
sessionStorage.setItem('push_mesg_id',JSON.stringify(this.selectedMessageId))

console.log("push_mesg_id",this.selectedMessageId)
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
   if(this.infoErroInput()){
  this.auth.showLoader();
  let src: any;
  let status:any
  if (this.jsonFlag.createMesageFlag == true ) {
    src = "SMS";
    status = 1
  }
  else {
    src = "EMAIL";
    status = 1
  }
  if(this.jsonFlag.createdPushNotification == true){
    src="Push"
    status = 1
  }
  let obj = { message: this.newMessageText ,source: src,status: status};
  this.widgetService.saveMessageTOServer(obj).subscribe(
    res => {
      if(this.jsonFlag.createMesageFlag){
      let msg = {
        type: 'success',
        title: 'Message Created Successfully',
        // body: " Your request is in queue and process shortly"
      };
      this.appC.popToast(msg);

    }if(this.jsonFlag.createEmailFlag){
      let msg2 = {
        type: 'success',
        title: 'Email Created Successfully',
        // body: " Your request is in queue and process shortly"
      };
      this.appC.popToast(msg2);

    }if(this.jsonFlag.createdPushNotification){
      let msg3 = {
        type: 'success',
        title: 'Push Notification Created Successfully',
        // body: " Your request is in queue and process shortly"
      };
      this.appC.popToast(msg3);

    }
      this.closeDiv()

      this.auth.hideLoader();
       //this.appC.popToast(msg);
    
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
}
// else{
//   this.msgService.showErrorMessage('info', '', "Type Message");

// }


 deletMessage(data,statusCode){
   this.selectedSmsCheckBox=false
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
    this.jsonFlag.selectedMessageFlag= false
    this.selectedSmsCheckBox=false
    this.newMessageText = obj.message
    this.selectedMessageId = obj.message_id
    console.log("ghghg",this.selectedMessageId)
  }
  onClickEditEmail(obj){
    this.jsonFlag.selectedMessageFlag= false
    this.selectedEmailCheckBox=false
    this.jsonFlag.selectedEmailChecboxFlag = false
    this.jsonFlag.editEmail = true
    this.newMessageText = obj.message
    this.selectedMessageId = obj.message_id
    console.log("ghghg",this.selectedMessageId)
  }
  onClickEditPush(obj){
    this.jsonFlag.selectedPushCheckbox = false
    this.selectesPushCheckBox=false
    this.selectesPushCheckBox=false
    this.jsonFlag.editPush = true
    this.newMessageText = obj.message
    this.selectedMessageId = obj.message_id

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
        this.closeDiv()
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
 
  onClickSentTo(){
    if(this.transactionalSms != 0){
    this.router.navigateByUrl('/view/dashboard/send-to-messages')
    sessionStorage.setItem('transactinal',JSON.stringify( this.transactionalSelectedFlag))
    sessionStorage.setItem('pramotional',JSON.stringify( this.pramotionalSelectedFlag))
    console.log("transactional flag",this.transactionalSelectedFlag)
    console.log("pramotional flag",this.pramotionalSelectedFlag)
    sessionStorage.removeItem('email subject')
    sessionStorage.removeItem('push_message')
    sessionStorage.removeItem('selecte-email-message')
  }else{
    this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Transactional Sms quota not available');

  }
}

  onClickEmailSentTo(){
    if(this.email_quataBalence != 0){

    if( this.email_subject.trim() ==''){
      this.classToggled = true
      console.log("emailflasssss",this.classToggled)
    }else{
      this.classToggled = false
    this.router.navigateByUrl('/view/dashboard/send-to-messages')
    sessionStorage.setItem('email-subject',this.email_subject)
    console.log("email subject",this.email_subject)
   

    }
sessionStorage.removeItem('push_message')
sessionStorage.removeItem('selected-message')
  }else{
    this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Email quota is not available');

  }
  }
  onClickPushSentTo(){
    this.router.navigateByUrl('/view/dashboard/send-to-messages')
    sessionStorage.removeItem('email subject')
    sessionStorage.removeItem('selected-message')
    sessionStorage.removeItem('selecte-email-message')

      
  }
  infoErroInput(){
    if( this.newMessageText ==''){
      this.msgService.showErrorMessage('info', '', "Enter Some Detail");
return;
  
  }
  
  return true;
}
// ============for-transaction and pramotional===============
fetchWidgetPrefill() {

  this.widgetService.getAllplan().subscribe(
      res => {
          this.widgetService.getInstituteSettings().subscribe(
              res => {
                  let transacAndpramo = res;
                  this.transactionalSms = transacAndpramo.institute_sms_quota_available
                  this.pramotionalSms =transacAndpramo. institute_campaign_sms_quota_available
                  this.email_quataBalence=transacAndpramo.institute_email_quota - transacAndpramo.institute_email_quota_used
              },
              err => { }
          );
      },
      err => { }
  );
}

}


