import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AppComponent } from '../../../app.component';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { HttpService } from '../../../services/http.service';
import { MessageShowService } from '../../../services/message-show.service';
import { WidgetService } from '../../../services/widget.service';
import { ProductService } from '../../../services/products.service';
import { elementAt } from 'rxjs-compat/operator/elementAt';




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
  approveMessage:boolean= true;
  pendingMessage :boolean=false;
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
      console.log("hhhhhhhhhh",this.transactionalSmsm)
      this.pramotionalSms = sessionStorage.getItem('pramotionValu')
      console.log("pramotional",this.pramotionalSms)

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
    // this.getAllMessageFromServer();
    this.getOpenStatusSMS()
    //this.getMaterCourseList();
  }
openStudentForm(){
//this.selectStudentForm = true
if (this.isProfessional) {
  this.getMasterCourseAndBatch(this.sendNotification);
} else {
  this.getMaterCourseList();
}
  this.addSmsForm = false
  console.log("semected message",this.selectedRow)

  if (this.selectedMessageText.length == 0) {
  let msg = {
      type: 'error',
      title: '',
      body: "Please select message"
    };
    this.appC.popToast(msg);
this.selectStudentForm = false;
  this.addSmsForm = true;


  }else if(this.selectedMessageText.length !=0)
this.selectStudentForm = true;
// }else
//   this.selectStudentForm = true;


}
approveTab(){
  this.approveMessage = true;
  this.pendingMessage = false;
  this.getOpenStatusSMS();
  
}
penddingTab(){
  this.approveMessage = false;
  this.pendingMessage = true;
  this.getAllMessageFromServer()

}

getAllMessageFromServer() {
  this.auth.showLoader();
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
      this.auth.hideLoader();

      tempMessageList = res;

      for(let i =0; i< tempMessageList.length; i++){
         if(tempMessageList[i].status === 0){
           this.messageList.push(tempMessageList[i]);
         }
      }
     
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
         this. getOpenStatusSMS();
  
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

getStandard() {
  let url = "/api/v1/courseMaster/master-course-list/" + sessionStorage.getItem("institute_id") + "?is_standard_wise=true&sorted_by=course_name";
  let keys;
  this.auth.showLoader();
  this.httpService.getData(url).subscribe(
    (data: any) => {
      this.masterCourseList = [];
      this.auth.hideLoader();
      this.fullResponse = data.result;
      keys = Object.keys(data.result);

      for (let i = 0; i < keys.length; i++) {
        let obj = {
          masterCourse: '',
          standard_id: 0
        }
        obj.masterCourse = keys[i];
        let temp = this.fullResponse[keys[i]];
        obj.standard_id = (temp.length) ? temp[0].standard_id : '';
        this.masterCourseList.push(obj);
      }


    },
    (error: any) => {
      this.auth.hideLoader();
      console.log(error);
    }
  )
}

flushData() {
  this.batchList = [];
  this.courseList = [];
  this.studentList = [];
}


getMaterCourseList() {
  this.flushData();
  if(this.schoolModel) {
    this.getStandard();
  } else {
  this.auth.showLoader();
  this.widgetService.getAllMasterCourse().subscribe(
    res => {
      this.masterCourseList = res;
      this.auth.hideLoader();

      console.log("master course",this.masterCourseList)
    },
    err => {
      this.auth.hideLoader();
      //console.log(err);
    }
  )
  }

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
    console.log("corsseeeeeeeeeeee",this.courseList)
  }



  getMasterCourseAndBatch(data) {
    this.auth.showLoader();
    this.widgetService.fetchCombinedData(data.standard_id, data.subject_id).subscribe(
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


  fetchDataOnBatchBasis(event) {
    if (this.userType != 3) {
this.allUserList= false;
      
    }
    if (this.sendNotification.batch_id == "-1") {
      this.showTableFlag = false;
    } else {
      this.widgetService.fetchStudentListData(this.sendNotification.batch_id).subscribe(
        res => {
          this.showTableFlag = true;
          this.studentList = res;
          console.log("hgjhg",this.studentList)
        },
        err => {
          //console.log(err);
        }
      )
    }
  }

  chkBoxAllActiveStudent() {
    this. aluminiCheckBox=false;
    this. allUserCheck=false;
     this.inactiveCheck=false;
     this.facultyCheckBox = false
    this.allChecked =true;
    this.showallUserListFlag = false;
    this.showAllaluminiStudentFlag = false;
   this.showInactiveStudentFlag = false;
      this.showFacultyTableFlag = false;
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



       onMasterCourseChange(event) {
        if (this.userType != 3) {
          
          this.allUserList = false;
        }
        this.flushData();
        if(this.schoolModel) {
          this.getCourseList(this.sendNotificationCourse.standard_id)
        } else {
        if (this.sendNotificationCourse.master_course != "-1") {
          this.auth.showLoader();
          this.widgetService.getAllCourse(this.sendNotificationCourse.master_course).subscribe(
            (res: any) => {
              this.showTableFlag = false;
              this.auth.hideLoader();
              this.courseList = res.coursesList;
            },
            err => {
              this.auth.hideLoader();
              //console.log(err);
            }
          )
        }
        }
      }
    





  onMasterCourseSelection(event) {
    if (this.userType != 3) {
      this.allUserList = false
    }
    this.showTableFlag = false;
    this.sendNotification.subject_id = '-1';
    this.sendNotification.batch_id = '-1';
    this.showTableFlag = false;
    this.getMasterCourseAndBatch(this.sendNotification);
      
        err => {
          this.auth.hideLoader();
        
  }
  }
  onCourseSelection(event) {
    if (this.userType != 3) {

     this.allUserList = false
    }
    this.batchList = [];
    this.sendNotification.batch_id = "-1";
    this.getMasterCourseAndBatch(this.sendNotification);
  }
  slectedMessagesId:''
onCheckBoxSelection(obj) {
  this.selectedRow = obj.message
this.slectedMessagesId =obj.message_id
 let count = this.selectedRow.length
 console.log("massageid",this.slectedMessagesId)

 this.selectedMessageText = count
 if (this.selectedMessageText.length != 0) {
  this.selectedMessageCount = 1;
}else{
this.selectedMessageCount = 0;
}
}

closeNewMessageDiv() {
  this.newMessageText = "";
  this.messageCount = 0;
  this.selectedMessageCount = 0;
this.selectedRow ="";
  this.selectedMessageText =""
  this.jsonFlag.editMessage = false;
  //  this.dilverSms = false;
  this.showTableFlag = false
  this.showallUserListFlag=false
  this.showFacultyTableFlag=false;
  this.showAllaluminiStudentFlag=false;
  this.showallUserListFlag=false;
  this.showInactiveStudentFlag=false;
  this.activeRowCeckbox = false;
  this.facultyCheckBox=false;
  this.aluminiCheckBox=false;
  this.allUserCheck=false;
  this.inactiveCheck=false;
  // this.sendToStudent=false;
  this.batchList=[];
  this.masterCourseList=[];
  this.courseList=[];

}



chkBoxAllFaculty() {
 this. aluminiCheckBox=false;
 this. allUserCheck=false;
  this.inactiveCheck=false;
  this.activeRowCeckbox = false
  this.showTableFlag =false;
  this.showallUserListFlag = false;
  this.showAllaluminiStudentFlag = false;
 this.showInactiveStudentFlag = false;
    this.showFacultyTableFlag = true;
    this.auth.showLoader();
    this.widgetService.getAllTeacherList().subscribe(
      res => {
        this.auth.hideLoader();

          this.studentList = res;
          console.log("facultyyyyyyyyyyyy",this.studentList)
        
      },
      err => {
        this.auth.hideLoader();
        //console.log(err);
      }
    )
    }

    chkBoxAllInActiveStudent() {
      this. allUserCheck=false;
       this.activeRowCeckbox = false
       this.facultyCheckBox = false
      this.aluminiCheckBox = false
      this.showFacultyTableFlag = false;
      this.showTableFlag =false;
      this.showallUserListFlag = false;
      this.showAllaluminiStudentFlag = false;
     this.showInactiveStudentFlag = true;
        this.auth.showLoader();
        this.widgetService.getAllInActiveList().subscribe(
          res => {
            this.auth.hideLoader();
             this.studentList = res;
            console.log("Inactiveeeeeeeeeee",this.studentList)
          },
          err => {
            this.auth.hideLoader();
            //console.log(err);
          }
        )
     
    }

    chkBoxAllAluminiStudent() {
      this. allUserCheck=false;
      this.inactiveCheck=false;
      this.activeRowCeckbox = false
      this.facultyCheckBox = false
      
      this.showInactiveStudentFlag = false;
      this.showFacultyTableFlag = false;
      this.showTableFlag =false;
      this.showallUserListFlag = false;

     this.showAllaluminiStudentFlag = true;
        this.auth.showLoader();
        this.widgetService.getAllAluminiList().subscribe(
          res => {
            this.auth.hideLoader();
  
              this.studentList = res;
              console.log("ALLLLUMINIIIIII",this.studentList)
            
          },
          err => {
            this.auth.hideLoader();
            //console.log(err);
          }
        )
    
    }
    chkBoxAllUsers() {
      this. allUserCheck=false;
       this.inactiveCheck=false;
       this.activeRowCeckbox = false
       this.facultyCheckBox = false
       this.aluminiCheckBox= false
      this.showInactiveStudentFlag = false;
      this.showFacultyTableFlag = false;
      this.showTableFlag =false;
     this.showAllaluminiStudentFlag = false;
        this.auth.showLoader();
        let obj = {
          "by": [
            {
              "column": "productId",
              "value": ""
            },
            {
              "column": "eCourseId",
              "value": 0
            }
          ],
          "start_index": 0,
          "no_of_records": 0
        }
        this.productService.postMethod('user-product/get-user-details', obj).then(
          res => {
            this.showallUserListFlag = true;
            this.auth.hideLoader();
            let response = res['body'];
  
              this.studentList = response.result;
            
          },
          err => {
            this.auth.hideLoader();
            //console.log(err);
          }
        )
     
    }
  
    fetchDataFromFields() {
      // if (this.sendNotificationCourse.course_id != "-1") {
        let obj:any = {
          course_id: this.sendNotificationCourse.course_id,
          master_course_name: this.sendNotificationCourse.master_course
        }
        if(this.schoolModel) {
          obj.standard_id = this.sendNotificationCourse.standard_id;
        }
          this.auth.showLoader();
        this.widgetService.getStudentListOfCourse(obj).subscribe(
          res => {
            //this.allChecked = true;
            this.auth.hideLoader();
            this.showTableFlag = true;
            this.studentList = res;
            console.log("filterList",this.studentList)
          },
          err => {
            this.auth.hideLoader();
            //console.log(err);
          }
        )
      }
    //}


    getListOfUserIds(key) {
      let id: any = [];
      for (let t = 0; t < this.studentList.length; t++) {
        if (this.studentList[t].assigned == true) {
          id.push(Number(this.studentList[t][key]));
        }
      }
      return id;
    }
  
    getListOfIds(key) {
      let id: any = [];
      for (let i = 0; i < this.studentList.length; i++) {
        if (this.studentList[i].assigned == true) {
          id.push(this.studentList[i][key]);
        }
      }
      return id.join(',');
    }
  

    sendSmsForApp(value, delivery_mode) {
      
      let type = delivery_mode == 0 ? 'SMS' : 'Email';
      let msg = "Are you sure you want to send " + type + ' to selected users';
      if (confirm(msg)) {
        let obj = {
          app_sms_type: Number(value),
          studentArray: this.getListOfIds('student_id'),
          userArray: this.getListOfIds('user_id'),
          user_role: this.loginField.checkBox,
          delivery_mode: delivery_mode
        };
        obj.studentArray = obj.studentArray.split(",");
        obj.userArray = obj.userArray.split(",");
        this.auth.showLoader();
        this.widgetService.smsForAddDownload(obj).subscribe(
          res => {
            this.auth.hideLoader();
            let tempMsg = type + ' Sent successfully';
            let msg = {
              type: 'success',
              title: '',
              body: tempMsg
            };
            this.appC.popToast(msg);
          },
          err => {
            this.auth.hideLoader();
            //console.log(err);
            let msg = {
              type: 'error',
              title: '',
              body: err.error.message
            };
            this.appC.popToast(msg);
          }
        )
  
      }
    }

    sendNotificationMessage() {
      let messageSelected: any;
      //messageSelected = this.selectedRow;

      let configuredMessage: boolean = false;
      let check = this.validateAllFields();
      if (check === false) {
        return;
      }
      if (this.dilverEmail = false) {
        messageSelected = { message: this.getMessageText(), messageId: -1 };
        console.log("1", messageSelected);
        configuredMessage = false;
        check = this.getSubject();
      } else {
        //messageSelected = this.getNotificationMessage();
        messageSelected = this.selectedRow;

        configuredMessage = true;
        console.log("2", messageSelected);
      }
      if (messageSelected === false) {
        return;
      }
      let delivery_mode = this.getDeliveryModeValue();
      if (delivery_mode === false) {
        return;
      }
      let destination: any;
      if (!this.allUserList) {
        destination = this.getDestinationValue();
        if (destination === false) {
          return;
        }
      }
  
      let batch_id;
      if (this.isProfessional) {
        batch_id = this.sendNotification.batch_id;
      } else {
        batch_id = this.sendNotificationCourse.course_id;
      }
      let studentID: any;
      let userId: any;
      let isTeacherSMS: number = 0;
      if (this.showFacultyTableFlag) {
        studentID = this.getListOfIds('teacher_id');
        isTeacherSMS = 1;
        destination = 0;
      } else {
        if (this.allUserList) {
          userId = this.getListOfUserIds('user_id')
        } else {
          studentID = this.getListOfIds('student_id');
        }
      }
      let isAlumini = 0;
  
      if (this.showAllaluminiStudentFlag) {
        isAlumini = 1;
      }
  
      let obj = {
        delivery_mode: Number(delivery_mode),
        notifn_message: this.selectedRow,
        notifn_subject: check,
        destination: Number(destination),
        student_ids: studentID,
        user_ids: userId,
        cancel_date: '',
        isEnquiry_notifn: 0,
        isAlumniSMS: isAlumini,
        isTeacherSMS: isTeacherSMS,
        configuredMessage: configuredMessage,
        message_id: this.slectedMessagesId,
        is_user_notify: 0
      }
      if (this.allUserList) {
        obj.is_user_notify = 1
      }
  
      this.widgetService.sendNotification(obj).subscribe(
        res => {
          let msg = {
            type: 'success',
            title: '',
            body: "Sent successfully"
          };
          this.appC.popToast(msg);
          //this.closeNotificationPopUp();
          this.closeNewMessageDiv()

        },
        err => {
          //console.log(err);
          let msg = {
            type: 'error',
            title: '',
            body: err.error.message
          };
          this.appC.popToast(msg);
        }
      )
    }
  
    sendPushNotification() {
      let messageSelected= this.selectedRow;
      if (this.dilverEmail) {
        messageSelected = { message: '', messageId: '' };
      } else {
        // messageSelected = this.getNotificationMessage();
        messageSelected = this.selectedRow;

      }
      if (messageSelected === false) {
        return
      }
      let student_id: any = '';
      if (this.allUserList) {
        student_id = this.getListOfIds('user_id')
      } else {
        student_id = this.getListOfIds('student_id')
      }
      let obj = {
       notifn_message:this.selectedRow,
        // message_id: messageSelected.messageId,
        student_ids: student_id,
        message_id:this.slectedMessagesId 

      }
      this.widgetService.sendPushNotificationToServer(obj).subscribe(
        res => {
          //console.log(res);
          let msg = {
            type: 'success',
            title: '',
            body: "Sent successfully"
          };
          this.appC.popToast(msg);
          this.closeNewMessageDiv()
        },
        err => {
          //console.log(err);
          let msg = {
            type: 'error',
            title: '',
            body: err.error.message
          };
          this.appC.popToast(msg);
        }
      )
    }
  

    getDestinationValue() {
      console.log("getDestinationValue");
  
  
      let student = this.loginField.checkBox;
      let parent = this.loginField.checkBox;
       let gaurdian = this.loginField.checkBox;
      // if (student == true && parent == false && gaurdian == false) {
      if (student == '0' && parent != '1' && gaurdian !='2' ) {
        return 0;
        // } else if (student == false && parent == true && gaurdian == false) {
      } else if (student != '0' && parent == '1' && gaurdian !='2') {
        return 1;
        // } else if (student == false && parent == false && gaurdian == true) {
      } else if (student != '0' && parent !='1' && gaurdian == '2') {
        return 3;
        // } else if (student && parent && gaurdian == false) {
      } else if (student !='0' && parent!='1' && gaurdian != '2') {
        return 2;
        // } else if (student && gaurdian && parent == false) {
      } else if (student !='0' && parent !='1' && gaurdian != '2') {
        return 5;
        // } else if (parent && gaurdian && student == false) {
      } else if (parent !='1' && student !='0' && gaurdian != '2') {
        return 6;
      }
      // else if (student && parent && gaurdian) {
      else if (student && parent && gaurdian) {
        return 4;
      } else {
        let msg = {
          type: 'error',
          title: '',
          body: "Please correct option in Send SMS To.."
        };
        this.appC.popToast(msg);
        return false;
      }
    }




    getNotificationMessage() {
      console.log("getNotificationMessage");
      let count = 0;
 
  
      // let sms = this.dilverSms;
      // let email = this.dilverEmail;
      // if (sms === true) {
      //   for (let t = 0; t < this.messageList.length; t++) {
      //     if (this.messageList[t].assigned == true) {
      //       return {
      //         message: this.messageList[t].message, messageId: this.messageList[t].message_id
      //       };
      //     } else {
      //       count++;
      //     }
      //   }
        if (this.selectedRow ='') {
          let msg = {
            type: 'error',
            title: '',
            body: "Please select message"
          };
          this.appC.popToast(msg);
          return false;
        }
      }
      // else if (email == true) {
      //   for (let t = 0; t < this.emailMessageList.length; t++) {
      //     if (this.emailMessageList[t].assigned == true) {
      //       return {
      //         message: this.emailMessageList[t].message, messageId: this.emailMessageList[t].message_id
      //       };
      //     } else {
      //       count++;
      //     }
      //   }
      //   if (this.emailMessageList.length == count) {
      //     let msg = {
      //       type: 'error',
      //       title: '',
      //       body: "Please select message"
      //     };
      //     this.appC.popToast(msg);
      //     return false;
      //   }
      // }
  
    
  
    getDeliveryModeValue() {
      console.log("getDeliveryModeValue");
  
  
      let sms = this.dilverSms;
      let email = this.dilverEmail;
      if (sms == true && email == true) {
        return 2;
      } else if (sms == true && email == false) {
        return 0;
      } else if (sms == false && email == true) {
        return 1;
      } else {
        let msg = {
          type: 'error',
          title: '',
          body: "Please select Delivery Mode(SMS , Email)"
        };
        this.appC.popToast(msg);
        return false;
      }
    }
    getSubject() {
      console.log("getSubject");
      let text = this.messageSubject;
      if (text.trim() == "" && text.trim() == null) {
        let msg = {
          type: 'error',
          title: '',
          body: "Please enter subject for email"
        };
        this.appC.popToast(msg);
        return false;
      } else {
        return text;
      }
    }
    messageArea: any = "";

    getMessageText() {
      console.log("getMessageText");
      let text = this.messageArea;
      if (text.trim() == "" && text.trim() == null) {
        let msg = {
          type: 'error',
          title: '',
          body: "Please enter subject for email"
        };
        this.appC.popToast(msg);
        return false;
      } else {
        return text;
      }
    }

    validateAllFields() {
      console.log("validateAllFields");
      if (this.dilverEmail) {
        return this.getSubject();
      }
  
      if (this.dilverEmail =true) {
        return this.getMessageText();
      }
      return "";
    }




    previewMessage() {
      let messageSelected: any;
      let configuredMessage: boolean = false;
      let check = this.validateAllFields();
      if (check === false) {
        return;
      }
      if (this.dilverEmail = true) {
        messageSelected = { message: this.getMessageText(), messageId: -1 };
        configuredMessage = false;
        check = this.getSubject();
      } else {
        messageSelected = this.getNotificationMessage();
        configuredMessage = true;
        this.previewedMessage = messageSelected.message;
      }
      if (messageSelected === false) {
        return;
      }
      else {
        this.previowBox = true;
        this.subject = check;
      }
    }
    close() {
      this.previowBox = false;
    }

  selectedId = new Array<string>();
studentCheckboxSelection(e:any,student_disp_id:string){
console.log(student_disp_id)
  if(e.target.checked){
    console.log(student_disp_id +'checked');
    this.selectedId.push(student_disp_id)
  }
else{
  console.log(student_disp_id +'unchecked');
  this.selectedId = this.selectedId.filter(m=>m!=student_disp_id)
}
console.log(this.selectedId)
}
onClickAddselectDiv(){
  this.addSmsForm =true;
  this.selectStudentForm =false;
}
onClickSelectStudentDiv(){
  this.addSmsForm = false;
  this.selectStudentForm = true;
}

// onclickSms(){
//   this.dilverEmail = false;
//   this.dilverSms = true;
//   event=this.dilverSms
// console.log("SSSSSSSSSSS",this.dilverSms)

// }
oclickEmail(){
  this.dilverSms = true;
  this.dilverEmail = false;
}
onSms(){
  this.dilverEmail = true
  this.dilverSms = false
}

onCheckBoxEvent(event, row) {
  row.assigned = event;
  this.allChecked = this.checkCheckAllChkboxStatus();
}

checkCheckAllChkboxStatus() {
  for (let i = 0; i < this.studentList.length; i++) {
    if (this.studentList[i].assigned == false) {
      return false;
    }
  }
  return true;
}

checkAllChechboxes(event, data) {
  data.forEach(
    element => {
      element.assigned = event.target.checked;
    }
  )
}
}