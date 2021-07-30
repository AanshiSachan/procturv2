import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AppComponent } from '../../../app.component';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { HttpService } from '../../../services/http.service';
import { MessageShowService } from '../../../services/message-show.service';
import { WidgetService } from '../../../services/widget.service';
import { ProductService } from '../../../services/products.service';
import {Location} from '@angular/common';

declare var $;


@Component({
  selector: 'app-send-to-messages',
  templateUrl: './send-to-messages.component.html',
  styleUrls: ['./send-to-messages.component.scss']
})
export class SendToMessagesComponent implements OnInit, OnDestroy {
  jsonFlag={
    institute_id:'',
    
  }
  selectMasterCourse = {
    master_course: '-1',
    course_id: '',
    standard_id: '-1',
    standard_name:'',
    batch_id:'',
    subject_id:'',
    master_course_name:''
  }
  getPayloadBatch={
    institute_id:this.jsonFlag.institute_id,
    coursesArray: [''],
    role: 'student'
  }
  showActiveTableFlag: boolean = false;
  showFacultyTableFlag:boolean = false;
  showInactiveStudentFlag:boolean =false;
  showAllaluminiStudentFlag:boolean=false;
  showallUserListFlag:boolean=false; 
  showCourseWiseFlag:boolean=false
  emailSendingFlag:boolean=false
  smsSendingFlag:boolean=false
  allChecked: boolean = true;
  transactionalFlag:boolean=false
  pramotinalFlag:boolean=false
  pushNotificationFlag:boolean=false
 
  activeCeckbox:string='false';
  facultyCheckBox:string='false';
  aluminiCheckBox:string='false';
  allUserCheck:string='false';
  inactiveCheck:string='false';
  schoolModel: boolean = false;
  public isProfessional: boolean = false;
student:boolean=true;
parent:boolean=false

  masterCourseList: any =[];
  selectedCourseList: any[] = [];
  selectedSubjectList: any[] = [];
  courseList: any=[];
  batchList: any = [];
  studentList:any =[];
  courseStudentList:any=[]
  allFacultyList:any =[];
  allInactiveStudentList:any=[];
  allAluminiList:any=[];
  allUserList:any=[];
  batches: any[] = [];
  masters: any[] = [];
  courses: any[] = [];
  courseIds: any = null;
  batchesIds: any = null;
  courseId:string='';
  fullResponse:any=[]
  courseListSetting={}
  combinedDataRes: any = {};
  userType:any
  pramotional:any
  transactional:any
  selected_message:any
  selected_messageId:any
  selected_email:any
  email_subjects:any
  messageCharacterCount:any
  searchData: string = "";
  push_message:string="";
  push_messageId:any
  count:number=0
  messageCount:number=0
bacToEditMessage:string=""
backToEditMessageId:any
backToEditEmail:string=""
backToEmailId:any
backToEditemailSub:string=""
backToPush:string="";
backTopushId:any
selectedMesgCount:number =0
  

  constructor( private router: Router,
    private auth: AuthenticatorService,
    private httpService :HttpService,
    private msgService: MessageShowService,
    private widgetService: WidgetService,
    private appC: AppComponent,
    private productService: ProductService,
    private location:Location
    ) {
      this.jsonFlag.institute_id = sessionStorage.getItem('institution_id');
      this.userType = Number(sessionStorage.getItem('userType'));
      this.selected_message=sessionStorage.getItem('selected-message')
      this.selected_messageId=sessionStorage.getItem('selected-message_id')
      this.selected_email = sessionStorage.getItem('selecte-email-message')
      this.email_subjects= sessionStorage.getItem('email-subject')
      this.pramotional = sessionStorage.getItem('pramotional')
      this.transactional = sessionStorage.getItem('transactinal')
      this.push_message = sessionStorage.getItem('push_message')
      this.push_messageId= sessionStorage.getItem('push_mesg_id')
      this.messageCharacterCount =sessionStorage.getItem('messageLength')
      this.selectedMesgCount = parseInt(sessionStorage.getItem('messageCounts'))


     
    }
  ngOnInit(): void {
    this.courseListSetting={
      singleSelection :false,
      idField: 'course_id',
      textField: 'course_name',
      selectAllText :'Select All',
      unSelectAllText:'UnSelect All',
      itemsShowLimit : 2,
      enableCheckAll:true

    }
 if(this.smsSendingFlag){
   this.messageCharacterCount = this.selected_message.length

 }
//  if(this.messageCharacterCount !=0){
//    this.messageCount =1
//  }
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
    if(this.email_subjects == null){
      this.smsSendingFlag = true;

      this.pushNotificationFlag = false;

  }else{

    this.emailSendingFlag = true

  }

  if(this.push_message && this.push_message != ""){
this.transactional = false
    this.pushNotificationFlag = true;

    this.smsSendingFlag = false
    this.emailSendingFlag = false

  

  
  }
    
  
    this.getMaterCourseList()
    //this.getStandard()
  }

  ngOnDestroy() {
    sessionStorage.removeItem('selected-message_id')
    sessionStorage.removeItem('email-subject')     
     sessionStorage.removeItem('selecte-messase')
     sessionStorage.removeItem('push_message')
sessionStorage.removeItem('transactinal')
sessionStorage.removeItem('pramotional')
     sessionStorage.removeItem('selecte-email-message')


  }
  clrarfild(){
    this.selectedCourseList=[]
    this.masterCourseList=[]
    this.selected_message=""
    this.email_subjects=""
    this.messageCharacterCount=""
    this.activeCeckbox='false';
    this.facultyCheckBox='false';
    this.aluminiCheckBox='false';
    this.allUserCheck='false';
    this.inactiveCheck='false';
    this.showActiveTableFlag = false;
    this.showFacultyTableFlag = false;
   this. showInactiveStudentFlag =false;
    this.showAllaluminiStudentFlag=false;
    this.showallUserListFlag=false; 
    this.showCourseWiseFlag=false
    this.selectMasterCourse.master_course='-1',
   this.selectMasterCourse.standard_id='-1'
    $('#myModal').modal('hide');



  }
  allActiveStudent() {
    this.count=0
  this.auth.showLoader()
    this.facultyCheckBox='false';
   this.aluminiCheckBox='false';
    this.allUserCheck='false';
   this.inactiveCheck='false';
   this.activeCeckbox='true'
   this.selectedCourseList=[]
   //   this.masterCourseList=[]
   this.showFacultyTableFlag= false;
   this.showInactiveStudentFlag=false;
   this.showAllaluminiStudentFlag=false;
   this.showallUserListFlag=false; 
   this.showCourseWiseFlag=false
      this.studentList = [];
      this.widgetService.getAllActiveStudentList().subscribe(
        res => {
          this.auth.hideLoader();
            this.showActiveTableFlag = true;
            this.studentList = res;
            console.log("active data",this.studentList)

           },
        err => {
          this.auth.hideLoader();
          //console.log(err);
        }
      )
    }
  
    allFacultyDataList() {
      let sub:any
       this.count =0
        this.auth.showLoader(); 
        this. activeCeckbox='false';
        this.facultyCheckBox='true';
        this.aluminiCheckBox='false';
        this.allUserCheck='false';
        this.inactiveCheck='false';
        this.selectedCourseList=[]
        this.selectMasterCourse.standard_id=''
        this.showActiveTableFlag = false;
        this.showInactiveStudentFlag=false;
        this.showAllaluminiStudentFlag=false;
        this.showallUserListFlag=false; 
        this.showCourseWiseFlag=false
        this.studentList = [];
               this.widgetService.getAllTeacherList().subscribe(
          res => {
            this.auth.hideLoader();
  
              this.showFacultyTableFlag = true;
              this.studentList = res;
              for(let i=0;i < this.studentList.length;i++){
                this.studentList[i].sub_list='';
                for(let j=0; j < this.studentList[i].assigned_standard_subject_list.length;j++){
                  this.studentList[i].sub_list = Array.prototype.map.call(this.studentList[i].assigned_standard_subject_list[j].subject_list, sub => sub.subject_name);
                }
              }
              console.log("faculty data",this.studentList)
            
          },
          err => {
            this.auth.hideLoader();
            //console.log(err);
          }
        )
      
    }
      aluminiStudentData() {
        this.count=0
        this.selectedCourseList=[]

        this.auth.showLoader();
        // this.courseList=[]
        // this.masterCourseList=[]
        this. activeCeckbox='false';
        this.facultyCheckBox='false';
        this.aluminiCheckBox='true';
        this.allUserCheck='false';
        this.inactiveCheck='false';
        this.showActiveTableFlag = false;
        this.showInactiveStudentFlag=false;
        this.showallUserListFlag=false; 
        this.showCourseWiseFlag=false;
        this.showFacultyTableFlag=false;
          this.studentList = [];
          this.widgetService.getAllAluminiList().subscribe(
            res => {
              this.auth.hideLoader();
    
                this.showAllaluminiStudentFlag = true;
                this.studentList = res;
              console.log("Alumini data",this.studentList)
            },
            err => {
              this.auth.hideLoader();
              //console.log(err);
            }
          )
        } 


        allInActiveStudent() {
          this.count=0
          this.selectedCourseList=[]

            this.auth.showLoader();
         this. activeCeckbox='false';
         this.facultyCheckBox='false';
         this.aluminiCheckBox='false';
         this.allUserCheck='false';
         this.inactiveCheck='true';
    //     this.courseList=[]
    // this.masterCourseList=[]
         this.showAllaluminiStudentFlag = false;
         this.showActiveTableFlag = false;
         this.showallUserListFlag=false; 
         this.showCourseWiseFlag=false
         this.showFacultyTableFlag=false
            this.studentList = [];
            this.widgetService.getAllInActiveList().subscribe(
              res => {
                this.auth.hideLoader();
      
                  this.showInactiveStudentFlag = true;

                  this.studentList = res;
                  console.log("inactive",this.studentList)
                
              },
              err => {
                this.auth.hideLoader();
                //console.log(err);
              }
            )
          }
        allRegisterUsers() {
          this.count=0

            this.auth.showLoader();
        this. activeCeckbox='false';
         this.facultyCheckBox='false';
         this.aluminiCheckBox='false';
         this.allUserCheck='true';
         this.inactiveCheck='false';
         this.selectedCourseList=[]
    //     this.courseList=[]
    // this.masterCourseList=[]
         this.showAllaluminiStudentFlag = false;
         this.showInactiveStudentFlag = false;
         this.showActiveTableFlag = false;
         this.showFacultyTableFlag = false
         this.showCourseWiseFlag=false
            this.studentList = [];
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
               // this.openAppUserSelected = true;
                this.auth.hideLoader();
                let response = res['body'];
      
                  this.showallUserListFlag = true;

                  this.studentList = response.result;
                  console.log("usel",this.studentList)
                
              },
              err => {
                this.auth.hideLoader();
                //console.log(err);
              }
            )
          
        }
      

        fetchStudentsApi() {
          this.count=0

          this. activeCeckbox='false';
         this.facultyCheckBox='false';
         this.aluminiCheckBox='false';
         this.allUserCheck='false';
         this.inactiveCheck='false';
         this. showActiveTableFlag = false;
        this.showFacultyTableFlag = false;
        this.showInactiveStudentFlag=false;
        this.showAllaluminiStudentFlag=false;
        this.showallUserListFlag=false;
        this.showCourseWiseFlag=true
 
          let temp_selectedCourseList:any=[]
          for(let i=0; i<this.selectedCourseList.length;i++){
            this.courseId = this.selectedCourseList[i].course_id
            temp_selectedCourseList.push(this.courseId)
          } 
          let mc_name:any='';
          console.log(this.masterCourseList);
          if(this.schoolModel){
            for(let i=0; i<this.masterCourseList.length;i++){
              if(this.selectMasterCourse.standard_id == this.masterCourseList[i].standard_id) {
                mc_name = this.masterCourseList[i].masterCourse;
              }

              console.log('courseeeeeeeeee',this.selectMasterCourse.standard_id)

          }
       }
          let obj={
            course_ids_list:temp_selectedCourseList,
           master_course_name:this.schoolModel ? mc_name : this.selectMasterCourse.master_course,
          
          }
         
        
          const url='/api/v1/studentBatchMap/manageBatchStudent/'+this.jsonFlag.institute_id
          this.auth.showLoader();
          this.httpService.postData(url, obj).subscribe(
            (data: any) => {
              this.studentList = data;
              this.auth.hideLoader();
            },
            (error: any) => {
              this.auth.hideLoader();
              //this.errorMessage(error);
            }
          )
        }
        
        getMaterCourseList() {
          this.count=0

          this.selectedCourseList=[]
          this.courseList=[]
          this.studentList=[]
          if(this.schoolModel) {
            this.getStandard();
          } else {
          this.auth.showLoader();
          this.widgetService.getAllMasterCourse().subscribe(
            res => {
              this.auth.hideLoader();
              //console.log(res);
              this.masterCourseList = res;
              console.log("master",this.masterCourseList)

            },
            err => {
              this.auth.hideLoader();
              //console.log(err);
            }
          )
          }
        }
       // }
       getStandard() {
        // let url = "/api/v1/courseMaster/master-course-list/" + sessionStorage.getItem("institute_id") + "?is_standard_wise=true&sorted_by=course_name";
        let keys;
        let url=""
        this.auth.showLoader();
        if(this.schoolModel) {
          url = "/api/v1/courseMaster/master-course-list/" + sessionStorage.getItem("institute_id") + "?is_standard_wise=true&sorted_by=course_name&is_active_not_expire=Y";
        } else if (this.userType === '3') {
          url = '/api/v1/courseMaster/fetch/' + this.jsonFlag.institute_id + '/all' + '?isAllCourses=N&isActiveNotExpire=Y'; //Changed isAllCourses flay Y to N as per ticket 1103
        } else {
          url = '/api/v1/courseMaster/fetch/' + this.jsonFlag.institute_id + '/all?isActiveNotExpire=Y';
        }
        this.httpService.getData(url).subscribe(
          (data: any) => {
            this.masterCourseList = [];
            this.auth.hideLoader();
            this.fullResponse = data.result;
            console.log("sections",this.fullResponse)
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
    
  
      getMasterCourseAndBatch(data) {
        this.auth.showLoader();
        this.widgetService.fetchCombinedData(data.standard_id, data.subject_id).subscribe(
          (res: any) => {
            console.log(res);
            this.auth.hideLoader();
            this.combinedDataRes = res;
            if (res.standardLi != null) {
              this.masterCourseList = res.standardLi;
            }
            if (res.batchLi != null) {
              this.batchList = res.batchLi;
            }
            if (res.subjectLi != null) {
              this.courseList = res.subjectLi;
            }
            console.log("corse",this.courseList)
    
          },
          err => {
            this.auth.hideLoader();
            //console.log(err);
          }
        )
      }

      onMasterCourseChange(event) {
        this.count=0

        this.allUserCheck ='false'
this.selectedCourseList=[]
        this.activeCeckbox='false';
       this.facultyCheckBox = 'false'
           this.aluminiCheckBox='false';
        this.inactiveCheck='false';
        if (this.userType != 3) {
          this.showInactiveStudentFlag=false
          
        }
      
        if(this.schoolModel) {
          this.getCourseList(this.selectMasterCourse.standard_id)
        } else {
        if (this.selectMasterCourse.master_course != "-1") {
          this.auth.showLoader();
          this.widgetService.getAllCourse(this.selectMasterCourse.master_course).subscribe(
            (res: any) => {
              this.showActiveTableFlag = false;
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
    
       getCourseList(ev) {
        this.count=0

        this.courseList = [];
        this.selectMasterCourse.course_id = '-1';
        let master_course_obj = this.masterCourseList.filter(
          (standard)=> (ev == standard.standard_id)
        );
        let temp = this.fullResponse[master_course_obj[0].masterCourse];
        for (let i = 0; i < temp.length; i++) {
          this.courseList.push(temp[i]);
        }
       
      }
      onMasterCourseSelection(event){
        if (this.userType != 3) {
          this.selectMasterCourse.subject_id = '-1';
          this.selectMasterCourse.batch_id = '-1';
          this.showActiveTableFlag = false;
          this.getMasterCourseAndBatch(this.selectMasterCourse);
        }
    }
    onCourseSelection(event) {
      if (this.userType != 3) {
  
       this.showAllaluminiStudentFlag=false
      }
      this.showActiveTableFlag = false;
      this.batchList = [];
      this.selectMasterCourse.batch_id = "-1";
      this.getMasterCourseAndBatch(this.selectMasterCourse);
    }

    getListOfIds(key){
        let id: any = [];
        for (let t = 0; t < this.studentList.length; t++) {
          if (this.studentList[t].assigned == true) {
            id.push(this.studentList[t][key]);
          }
          

        }
        return id.join(',');
      
    }
  //   getListOfCourseIds(key){
  //     let id: any = [];
  //     for (let t = 0; t < this.courseStudentList.length; t++) {
  //       if (this.courseStudentList[t].assigned == true) {
  //         id.push(this.courseStudentList[t][key]);
  //       }
  //     }
  //     return id.join(',');
    
  
  // }
    getListOfUserIds(key){
      let id:any=[];
      for(let i =0; i< this.studentList.length;i++){
        if(this.studentList[i].assigned == true){
          id.push(Number(this.studentList[i][key]));

        }
      }
      return id
    }
// ========for-destination-value====================

getDestinationValue() {
  console.log("getDestinationValue",this.student);
  console.log("getDestinationValue",this.parent);

  
  if (this.student == true && this. parent == false) {
    return 0;
  } else if (this.student ==false && this.parent == false) {
    return 1;
  } else if (this.student == false &&this. parent == false) {
    return 3;
  } else if (this.student == true && this.parent == false) {
    return 2;
  } else if (this.student == true && this.parent == false) {
    return 5;
  } else if (this.parent == true &&this. student == false) {
    return 6;
  }
  else if (this.student == true && this.parent == true) {
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
onClickStudent(event){
  // this.student = event
  console.log("checbox",this.student)

}
// =================end=====================

    sendNotificationMessages(){
      let configuredMessage: boolean = false;
     
        configuredMessage = true;
        
      let destination: any;
     
      let studentID: any;

      let userId: any;
      let isTeacherSMS: number = 0;
      if(this.showFacultyTableFlag){
        isTeacherSMS = 1
        destination = 0;
        studentID = this.getListOfIds('teacher_id')
        console.log("teacher id",studentID)

      }else{
        if(this.showallUserListFlag){
          userId = this.getListOfUserIds('user_id')
        }
        else{
        studentID = this.getListOfIds('student_id')
        }
      }
     
      let delivery_mode:number=0
      if(this.emailSendingFlag){
        delivery_mode = 1
      }else{
        delivery_mode =0
      }      
      let isAlumini = 0;

      if (this.showAllaluminiStudentFlag == true) {
        isAlumini = 1;
        destination = this.getDestinationValue()

       
      }if(this.showActiveTableFlag == true){
        destination = this.getDestinationValue()
      }if(this.showCourseWiseFlag){
        destination = this.getDestinationValue()
      }
     

      let obj = {
        delivery_mode: delivery_mode,
        notifn_message: this.selected_message,
        notifn_subject: this.email_subjects,
        destination: Number(destination),
        student_ids: studentID,
        user_ids: userId,
        cancel_date: '',
        isEnquiry_notifn: 0,
        isAlumniSMS: isAlumini,
        isTeacherSMS: isTeacherSMS,
        configuredMessage: configuredMessage,
        message_id: this.selected_messageId,
        is_user_notify: 0
      }
      if(this.emailSendingFlag){
        obj.notifn_message = this.selected_email
      }
      if (this.showallUserListFlag) {
        obj.is_user_notify = 1
      }
      console.log("teacher id",obj)

      this.widgetService.sendNotification(obj).subscribe(
        res => {
          if(this.smsSendingFlag){
          let msg = {
            type: 'success',
            title: '',
            body: " Message Sent successfully"
          };
          this.appC.popToast(msg);
        }if(this.emailSendingFlag){
          let msg2 = {
            type: 'success',
            title: '',
            body: " Email Sent successfully"
          };
          this.appC.popToast(msg2);

        }
          this.clrarfild()
          this.router.navigateByUrl('/view/dashboard/send-notification')

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
// =========push-Notification-function===================

sendPushNotification() {
  
  let student_id: any = '';
  let user_ids : any =''
  if (this.showallUserListFlag) {
    student_id = this.getListOfIds('user_id')
  } else {
    student_id = this.getListOfIds('student_id')
  }
  let obj = {
    notifn_message: this.push_message,
    message_id: this.push_messageId,
    student_ids: student_id,
  }
  this.widgetService.sendPushNotificationToServer(obj).subscribe(
    res => {
      //console.log(res);
      let msg = {
        type: 'success',
        title: '',
        body: " Push Notification Sent successfully"
      };
      this.appC.popToast(msg);
      this.clrarfild()
      this.router.navigateByUrl('/view/dashboard/send-notification')

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

// ==============end======================





    onCheckBoxEvent(event, item) {
      item.assigned = event;
       this.allChecked = this.checkCheckAllChkboxStatus();
          if(item.assigned == true){
          this.count++;
  }else{
    this.count--;
  }
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
      this.count = 0;
      if(event.target.checked) {
      data.forEach(
        element => {
          if(this.emailSendingFlag){
          if(element.email_id !=null || element.student_email || element.teacher_email) {
            element.assigned = event.target.checked;
            this.count++;
        //  ====faculty-count======
          }
        //   if(element.teacher_id !=null){
        //     element.assigned = event.target.checked;
        //     this.count++;
         
          
        // }
          // ===end====
        }else{
          element.assigned = event.target.checked;
          this.count++;

        }
          
      }
      )
    } else {
      this.count = 0;
      data.forEach(element=>{
        element.assigned = false;
      });
    }
    }
    
   onsearchList(){
     if(this.activeCeckbox =='true' ){
       this.allActiveStudent()
      
     }
     if(this.inactiveCheck == 'true'){
       this.allInActiveStudent()

       }if(this.facultyCheckBox == 'true'){
         this.allFacultyDataList()
       }if(this.aluminiCheckBox == 'true'){
         this.aluminiStudentData()
       }if(this.allUserCheck =='true'){
         this.allRegisterUsers()
       }
     }
    
     onClickEiditMessageDescription(){
      $('#myModal').modal('hide');

       this.bacToEditMessage = this.selected_message
       this.backToEditMessageId = this.selected_messageId
       this.backToEditEmail= this.selected_email
       this.backToEmailId = this.selected_messageId
       this.backToEditemailSub = this.email_subjects
       this.backToPush = this.push_message
       this.backTopushId = this.push_messageId
if(this.smsSendingFlag){
       sessionStorage.setItem('editmessageDesc',this.bacToEditMessage)
       sessionStorage.setItem('edit-mesgId',this.backToEditMessageId)

}if(this.emailSendingFlag){
  sessionStorage.setItem('editEmaiId',this.backToEmailId)

  sessionStorage.setItem('editEmail',this.backToEditEmail)
}
if(this.pushNotificationFlag){
  sessionStorage.setItem('edit-PushMesgId',this.backTopushId)

       sessionStorage.setItem('editPushmessage',this.backToPush)
}

       console.log("email",this.backToEditEmail)
        this.router.navigateByUrl('/view/dashboard/send-notification')

     }
onClearActiveCheckbox(event){
  //this.activeCeckbox='false';
  this.facultyCheckBox='false';
  this.aluminiCheckBox='false';
  this.allUserCheck='false';
  this.inactiveCheck='false';
  this.selectMasterCourse.master_course='-1',
  this.selectMasterCourse.standard_id='-1'
  this.courseId=''
}
onClearInctiveCheckbox(event){
  this.allUserCheck ='false'
   this.activeCeckbox='false';
   this.facultyCheckBox='false';
   this.aluminiCheckBox='false';
   this.selectMasterCourse.master_course='-1',
   this.selectMasterCourse.standard_id='-1'
   this.courseId=''}
onClearAlluserCheckbox(event){
  
   this.activeCeckbox='false';
   this.facultyCheckBox='false';
   this.aluminiCheckBox='false';
   this.selectMasterCourse.master_course='-1',
   this.selectMasterCourse.standard_id='-1'

   this.courseId=''
      this.inactiveCheck='false';
}
onClearFacultyCheckbox(event){
  this.allUserCheck ='false'

   this.activeCeckbox='false';
   this.selectMasterCourse.master_course='-1',
   this.selectMasterCourse.standard_id='-1'

   this.courseId=''
      this.aluminiCheckBox='false';
   this.inactiveCheck='false';
}
onClearAlluminCheckbox(event){
  this.allUserCheck ='false'
 
   this.activeCeckbox='false';
   this.facultyCheckBox='false';
   this.selectMasterCourse.master_course='-1',
   this.selectMasterCourse.standard_id='-1'

   this.courseId=''
      this.inactiveCheck='false';
}
backButton(){
this.location.back()
}
   }
  

  
