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
  showFacultyTableFlag:boolean = false;
  showInactiveStudentFlag:boolean =false;
  showAllaluminiStudentFlag:boolean=false;
  showallUserListFlag:boolean=false; 
  schoolModel: boolean = false;

  allChecked: boolean = true;

  searchData: string = "";

  messageCount: number = 0;
  newMessageText: string = "";
  messageList: any = [];
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
    this.getAllMessageFromServer();
    this.getMaterCourseList();
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
      this.messageList = res;
     
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




getMaterCourseList() {
  //this.flushData();
  if(this.schoolModel) {
    this.getStandard();
  } else {
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
  }}

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

  onMasterCourseSelection(event) {
    // if (this.userType != 3) {
    //   this.allUserList = false
    // }
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
  
    // this.batchList = [];
    // this.courseList = [];
    // this.sendNotification.subject_id = '-1';
    // this.sendNotification.batch_id = '-1';
    // this.getMasterCourseAndBatch(this.sendNotification);
  }

  onCourseSelection(event) {
    if (this.userType != 3) {

    }
    this.batchList = [];
    this.sendNotification.batch_id = "-1";
    this.getMasterCourseAndBatch(this.sendNotification);
  }

onCheckBoxSelection(obj) {
  this.selectedRow = obj.message

 let count = this.selectedRow.length

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

  this.selectedMessageText =""
  this.jsonFlag.editMessage = false;
}



chkBoxAllFaculty() {
  this.showTableFlag =false;
  this.showallUserListFlag = false;
  this.showAllaluminiStudentFlag = false;
 this.showInactiveStudentFlag = false;
    this.showFacultyTableFlag = true;
    this.auth.showLoader();
    this.widgetService.getAllTeacherList().subscribe(
      res => {
        this.auth.hideLoader();

          this.allFacultyList = res;
          console.log("facultyyyyyyyyyyyy",this.allFacultyList)
        
      },
      err => {
        this.auth.hideLoader();
        //console.log(err);
      }
    )
    }

    chkBoxAllInActiveStudent() {
      this.showFacultyTableFlag = false;
      this.showTableFlag =false;
      this.showallUserListFlag = false;
      this.showAllaluminiStudentFlag = false;
     this.showInactiveStudentFlag = true;
        this.auth.showLoader();
        this.studentList = [];
        this.widgetService.getAllInActiveList().subscribe(
          res => {
            this.auth.hideLoader();
             this.allInactiveStudentList = res;
            console.log("Inactiveeeeeeeeeee",this.allInactiveStudentList)
          },
          err => {
            this.auth.hideLoader();
            //console.log(err);
          }
        )
     
    }

    chkBoxAllAluminiStudent() {
      this.showInactiveStudentFlag = false;
      this.showFacultyTableFlag = false;
      this.showTableFlag =false;
      this.showallUserListFlag = false;

     this.showAllaluminiStudentFlag = true;
        this.auth.showLoader();
        this.widgetService.getAllAluminiList().subscribe(
          res => {
            this.auth.hideLoader();
  
              this.allAluminiList = res;
              console.log("ALLLLUMINIIIIII",this.allAluminiList)
            
          },
          err => {
            this.auth.hideLoader();
            //console.log(err);
          }
        )
    
    }
    chkBoxAllUsers() {
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
  
              this.allUserList = response.result;
            
          },
          err => {
            this.auth.hideLoader();
            //console.log(err);
          }
        )
     
    }
  
    fetchDataFromFields() {
      if (this.sendNotificationCourse.course_id != "-1") {
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
            this.allChecked = true;
            this.auth.hideLoader();
            this.showTableFlag = true;
            //this.selectedOption = "filter";
            this.studentList = res;
            console.log("filterList",this.studentList)
          },
          err => {
            this.auth.hideLoader();
            //console.log(err);
          }
        )
      }
    }
  




   
}



