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
    coursesArray: [''],
    role: 'student'
  }
  selectMasterCourse = {
    master_course: '',
    course_id: '',
    standard_id: ''
  }
  getPayloadBatch={

  }
  showActiveTableFlag: boolean = false;
  showFacultyTableFlag:boolean = false;
  showInactiveStudentFlag:boolean =false;
  showAllaluminiStudentFlag:boolean=false;
  showallUserListFlag:boolean=false; 
 
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
  courseListSetting={}

  constructor( private router: Router,
    private auth: AuthenticatorService,
    private httpService :HttpService,
    private msgService: MessageShowService,
    private widgetService: WidgetService,
    private appC: AppComponent,
    private productService: ProductService
    ) {
      this.jsonFlag.institute_id = sessionStorage.getItem('institution_id');
      this.courseListSetting={
        singleSelect :false,
        idField :'course-name',
        selectAllText :'select All',
        unSelectAllText:'unselect All',
        itemShowLimit :2,
        enableCheckAll:true
  
      }
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
          this.jsonFlag.coursesArray = courseArray;
          const url = '/api/v1/courseMaster/onlineClass/fetch/users'
          this.auth.showLoader();
          this.httpService.postData(url, this.jsonFlag).subscribe(
            (data: any) => {
              this.studentList = data.studentsAssigned;
              // this.getCheckedBox(this.studentsAssigned);
              this.auth.hideLoader();
            },
            (error: any) => {
              this.auth.hideLoader();
              //this.errorMessage(error);
            }
          )
        }
        
        getMaterCourseList() {
          // if(this.schoolModel) {
          //   this.getStandard();
          // } else {
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
       // }
    
    }
  
  
