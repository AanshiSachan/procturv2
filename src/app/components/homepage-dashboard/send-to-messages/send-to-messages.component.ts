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
  selector: 'app-send-to-messages',
  templateUrl: './send-to-messages.component.html',
  styleUrls: ['./send-to-messages.component.scss']
})
export class SendToMessagesComponent implements OnInit {
  jsonFlag={
    institute_id:'',
    
  }
  selectMasterCourse = {
    master_course: '',
    course_id: '',
    standard_id: '',
    batch_id:'',
    subject_id:''
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
  allChecked: boolean = true;

 
  activeRowCeckbox:boolean=false;
  facultyCheckBox:boolean=false;
  aluminiCheckBox:boolean=false;
  allUserCheck:boolean=false;
  inactiveCheck:boolean=false;
  schoolModel: boolean = false;
  public isProfessional: boolean = false;



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
  courseId: any[] = [];
  fullResponse:any=[]
  courseListSetting={}
  combinedDataRes: any = {};
  userType:any
  pramotional:any
  transactional:any
  selected_message:any
  selected_messageId:any
  

  constructor( private router: Router,
    private auth: AuthenticatorService,
    private httpService :HttpService,
    private msgService: MessageShowService,
    private widgetService: WidgetService,
    private appC: AppComponent,
    private productService: ProductService
    ) {
      this.jsonFlag.institute_id = sessionStorage.getItem('institution_id');
      this.userType = Number(sessionStorage.getItem('userType'));
      this.selected_message=sessionStorage.getItem('selecte-messase')
      this.selected_messageId=sessionStorage.getItem('selected-message_id')


      this.courseListSetting={
        singleSelect :false,
        idField: 'course_id',
        textField: 'course_name',
        selectAllText :'select All',
        unSelectAllText:'unselect All',
        itemShowLimit :2,
        enableCheckAll:true
  
      }
    }
  ngOnInit(): void {
    console.log("messase",this.selected_message)
    console.log("message id",this.selected_messageId)
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
    this.getMaterCourseList()
  }
  allActiveStudent() {
   this.auth.showLoader();
      this.studentList = [];
      this.widgetService.getAllActiveStudentList().subscribe(
        res => {
          this.auth.hideLoader();
            this.showActiveTableFlag = true;
            this.studentList = res;
           },
        err => {
          this.auth.hideLoader();
          //console.log(err);
        }
      )
    }

    allFacultyDataList(event) {
        this.auth.showLoader();
        this.studentList = [];
        this.widgetService.getAllTeacherList().subscribe(
          res => {
            this.auth.hideLoader();
  
              this.showFacultyTableFlag = true;
              this.studentList = res;
            
          },
          err => {
            this.auth.hideLoader();
            //console.log(err);
          }
        )
      }
      aluminiStudentData(event) {
        
          this.auth.showLoader();
          this.studentList = [];
          this.widgetService.getAllAluminiList().subscribe(
            res => {
              this.auth.hideLoader();
    
                this.showAllaluminiStudentFlag = true;
                this.studentList = res;
              
            },
            err => {
              this.auth.hideLoader();
              //console.log(err);
            }
          )
        } 


        allInActiveStudent() {
         this.showActiveTableFlag= false
            this.auth.showLoader();
            this.studentList = [];
            this.widgetService.getAllInActiveList().subscribe(
              res => {
                this.auth.hideLoader();
      
                  this.showInactiveStudentFlag = true;

                  this.studentList = res;
                  console.log("sttttttttttttt",this.studentList)
                
              },
              err => {
                this.auth.hideLoader();
                //console.log(err);
              }
            )
          }
        allRegisterUsers(event) {
         
            this.auth.showLoader();
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
                
              },
              err => {
                this.auth.hideLoader();
                //console.log(err);
              }
            )
          
        }
       
        fetchStudentsApi(courseArray) {
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
          let obj={
            inst_id :this.jsonFlag.institute_id,
            role:'student',
            coursesArray:['']
          }
          obj.coursesArray = temp_selectedCourseList;
          const url = '/api/v1/courseMaster/onlineClass/fetch/users'
          this.auth.showLoader();
          this.httpService.postData(url, obj).subscribe(
            (data: any) => {
              this.courseStudentList = data.studentsAssigned;

              console.log("iddddddd",this.studentList)

              this.auth.hideLoader();
            },
            (error: any) => {
              this.auth.hideLoader();
              //this.errorMessage(error);
            }
          )
        }
        
        getMaterCourseList() {
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
        let url = "/api/v1/courseMaster/master-course-list/" + sessionStorage.getItem("institute_id") + "?is_standard_wise=true&sorted_by=course_name";
        let keys;
        this.auth.showLoader();
        this.httpService.getData(url).subscribe(
          (data: any) => {
            this.masterCourseList = [];
            this.auth.hideLoader();
            this.fullResponse = data.result;
            keys = Object.keys(data.result);
    
            // console.log("keys", keys);
            // this.masterCourse = keys;
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
        if (this.userType != 3) {
          this.showInactiveStudentFlag=false
          
        }
       // this.flushData();
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
      let id:any=[]
      for(let i=0; i<this.studentList.length;i++){
        if(this.studentList[i].assigned == true){
          id.push(this.studentList[i][key])
        }
      }
      return id.join(',');

    }
    getListOfUserIds(key){
      let id:any=[];
      for(let i =0; i< this.studentList.length;i++){
        if(this.studentList[i].assigned == true){
          id.push(Number(this.studentList[i][key]));

        }
      }
      return id
    }
    sendNotificationMessages(){
      let messageSelected: any;
      let configuredMessage: boolean = false;
     
       // messageSelected = this.getNotificationMessage();
        configuredMessage = true;
        
      let destination: any;
      if (!this.showallUserListFlag) {
        destination = 0;
        if (destination === false) {
          return;
        }
      }
      let studentID: any;
      let userId: any;
      let isTeacherSMS: number = 0;
      // if (this.showFacultyTableFlag) {
      //   studentID = this.getListOfIds('teacher_id');
      //   isTeacherSMS = 1;
      //   destination = 0;
      // } 
      // else {
      //   if (this.showallUserListFlag) {
      //     userId = this.getListOfUserIds('user_id')
      //   } else {
      //     studentID = this.getListOfIds('student_id');
      //   }
      // }
      
      studentID = this.getListOfIds('student_id')
      let isAlumini = 0;

      if (this.showAllaluminiStudentFlag == true) {
        isAlumini = 1;
      }
      let obj = {
        delivery_mode: 0,
        notifn_message: this.selected_message,
        notifn_subject: "",
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
      if (this.showallUserListFlag) {
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
  
