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
    openMessageFlag: false,
    editMessage: false,
    messageObject: {}
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


  approveMessage:boolean= false;
  pendingMessage :boolean=true;
  selectStudentForm :boolean= false;
  addSmsForm:boolean=true;
  showTableFlag: boolean = false;

  messageCount: number = 0;
  newMessageText: string = "";
  messageList: any = [];
  openMessageList: any = [];
  masterCourseList: any =[];
  courseList: any=[];
  batchList: any = [];
  studentList:any =[];
  fullResponse: any = [];
selectedActiveStudentList:any;
  selectedRow:any;
  selectedMessageText:string ="";
  selectedMessageCount:number =0;

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
    this.getAllMessageFromServer();
    this.getMaterCourseList();
    //this.chkBoxAllActiveStudent();
  }
openStudentForm(){
  this.selectStudentForm = true
  this.addSmsForm = false
}

approveTab(){
  this.approveMessage = true;
  this.pendingMessage = false;
  this.getOpenStatusSMS();
  
}
penddingTab(){
  this.approveMessage = false;
  this.pendingMessage = true;

}

getAllMessageFromServer() {
  console.log("1");
  this.messageList = [];
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

  countNumberOfSelectedMessage() {
    let uniCodeSelectFlag = this.hasUnicode(this.selectedMessageText);
    let charLimit = 160;
    if (uniCodeSelectFlag) {
      charLimit = 70
    }
    if (this.selectedMessageText.length == 0) {
      this.selectedMessageCount = 0;
    }
    else if (this.selectedMessageText.length > 0 && this.selectedMessageText.length <= charLimit) {
      this.selectedMessageCount = 1;
    }
    else {
      let count = Math.ceil(this.selectedMessageText.length / charLimit);
      console.log("fdfgdg",count);
      this.selectedMessageCount = count;
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

approveRejectSms(data, statusCode) {
  let msg: any = "";
  if (statusCode == 1) {
    msg = "approve";
  } else {
    msg = "deleted";
  }
  if (confirm('Are you sure, You want  to ' + msg + ' the message?')) {
    this.widgetService.changesSMSStatus({ 'status': statusCode }, data.message_id).subscribe(
      res => {
        let msg = {
          type: 'success',
          title: '',
          body: ''
        }
        if (statusCode == 1) {
          msg.title = "SMS Approved"
        } else {
          msg.title = "SMS Deleted";
        }
        this.appC.popToast(msg);
        this.getOpenStatusSMS();
        //this.getAllMessageFromServer();

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

// onTabChange(tabname) {
//   this.jsonFlag.openMessageFlag = false;
//   this.jsonFlag.smsTabType = tabname;
//   document.getElementById('approvedSMSTab').classList.remove('active');
//   document.getElementById('openSMSTab').classList.remove('active');
//   if (tabname == 'approved') {
//     document.getElementById('approvedSMSTab').classList.add('active');
//     this.getAllMessageFromServer();
//   } else {
//     document.getElementById('openSMSTab').classList.add('active');
//     this.getOpenStatusSMS();
//   }
// }
// ==================for approve list========================
getOpenStatusSMS() {
  this.auth.showLoader();
  this.jsonFlag.openMessageFlag = true;
  this.openMessageList = [];
  let tempMessageList: any = [];


  this.widgetService.getMessageList({}).subscribe(
    res => {
      this.auth.hideLoader();
      tempMessageList = res;
      for (let i = 0; i < tempMessageList.length; i++) {
       
        if (tempMessageList[i].status === 1) {
          this.openMessageList.push(tempMessageList[i]);
        }
      }
     //this.openMessageList.push(tempMessageList)
    },
    err => {
      this.auth.hideLoader();
      //console.log(err);
    }
  )
}
// =========================all master course=====================


getMaterCourseList() {
  // this.flushData();
  // if(this.schoolModel) {
  //   this.getStandard();
  // } else {
  this.auth.showLoader();
  this.widgetService.getAllMasterCourse().subscribe(
    res => {
      this.auth.hideLoader();
      this.masterCourseList = res;
      console.log("master course",this.masterCourseList)
    },
    err => {
      this.auth.hideLoader();
      //console.log(err);
    }
  )
  }

  getCourseList(ev) {
    this.courseList = [];
    this.sendNotificationCourse.course_id = '-1';
    let master_course_obj = this.masterCourseList.filter(
      (standard)=> (ev == standard.standard_id)
    );
    let temp = this.fullResponse[master_course_obj[0].masterCourse];
    for (let i = 0; i < temp.length; i++) {
      this.courseList.push(temp[i]);
    }
  }



  getMasterCourseAndBatch(data) {
    this.auth.showLoader();
    this.widgetService.fetchCombinedData(data.standard_id, data.course_id).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.combinedDataRes = res;
        console.log("course",this.combinedDataRes)
        if (res.standardLi != null) {
          this.masterCourseList = res.standardLi;
        }
        if (res.batchLi != null) {
          this.batchList = res.batchLi;
        }
        if (res.subjectLi != null) {
          this.courseList = res.subjectLi;
        }

      },
      err => {
        this.auth.hideLoader();
        //console.log(err);
      }
    )
  }








  chkBoxAllActiveStudent() {
    // if(this.selectedActiveStudentList){
    // this.showTableFlag =true;
    

    // this.auth.showLoader();
    // this.widgetService.getAllActiveStudentList().subscribe(
    //   res => {
    //     this.auth.hideLoader();
    //     this.studentList = res;
    //     console.log("All active studentList",this.studentList)
    //   },
    //   err => {
    //     this.auth.hideLoader();
    //   }
    // )
    // }
        this.showTableFlag =true;
         this.auth.showLoader();
        this.widgetService.getAllActiveStudentList().subscribe(
          res => {
            this.auth.hideLoader();
            this.studentList = res;
            console.log("All active studentList",this.studentList)
          },
          err => {
            this.auth.hideLoader();
          }
        )
        
}
    



  
      




  
  
  onMasterCourseSelection(event) {
    if (this.userType != 3) {
    }
    this.batchList = [];
    this.courseList = [];
    this.sendNotification.subject_id = '-1';
    this.sendNotification.batch_id = '-1';
    this.getMasterCourseAndBatch(this.sendNotification);
  }





  onCourseSelection(event) {
    if (this.userType != 3) {

    }
    this.batchList = [];
    this.sendNotification.batch_id = "-1";
    this.getMasterCourseAndBatch(this.sendNotification);
  }



onCheckBoxSelection(obj) {
  console.log("selected",this.selectedRow)
  this.selectedRow = obj.message_id
}



closeNewMessageDiv() {
  this.newMessageText = "";
  this.messageCount = 0;
  this.jsonFlag.editMessage = false;
}

}



