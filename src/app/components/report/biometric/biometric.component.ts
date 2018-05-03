import { Component, OnInit } from '@angular/core';
import { BiometricServiceService } from '../../../services/biometric-service/biometric-service.service';
import { AppComponent } from '../../../app.component';
import { AuthenticatorService } from "../../../services/authenticator.service";
import * as moment from 'moment';
@Component({
  selector: 'app-biometric',
  templateUrl: './biometric.component.html',
  styleUrls: ['./biometric.component.scss']
})
export class BiometricComponent implements OnInit {

  masterCourse: any[] = [];
  studentsData: any[] = [];
  master: any = "";
  courses: any[] = [];
  masterCourseNames: boolean = true;
  students: any = "";
  isProfessional: boolean = true;
  addReportPopUp: boolean = false;
  popupCtrl: any = "";
  addAcademicPopUp: boolean = false;
  isRippleLoad: boolean = true;
  monthAttendance: any[] = [];
  showStudentTable: boolean = false;
  showTeachersTable: boolean = false;
  othersData: any[] = [];
  showCustomTable: boolean = false;
  PageIndex: number = 1;
  pagedisplaysize: number = 10;
  totalRow: number;
  showTable: boolean = false;
  showMonth: boolean = false;
  studentsDisplayData: any[] = [];
  showRange: boolean = false;
  showWeek: boolean = false;
  weekAttendance: any[] = [];
  range: any[] = [];
  addAbsentiesPopup = false;
  showButton: boolean = true;
  masters: any[] = [];
  subjects: any[] = [];
  absentiesRecords: any[] = [];
  absentTable: boolean = false;
  dummyArr: any[] = [0, 1, 2, 0, 1, 2];
  columnMaps: any[] = [0, 1, 2, 3, 4, 5,6];
  dataStatus : boolean = false;
  showTeacherButton : boolean =true;
  direction = 0;
  searchText = "";
  searchData=[];
  searchflag: boolean = false;
  columnMapRecords: any[] = [0, 1, 2];
  getData = {
    school_id: -1,
    name: "",
    is_active_status: 1,
    standard_id: -1,
    batch_id: -1,
    master_course_name: "",
    course_id: -1,
    subject_id: -1,
    user_Type: 1,
    biometric_attendance_date: moment().format('YYYY-MM-DD')
  }
  getAbsentiesData = {
    batch_id: -1,
    course_id: -1,
    from_date: "",
    institution_id: this.reportService.institute_id,
    master_course_name: -1,
    standard_id: -1,
    subject_id: -1
  }
  getAllData = {
    from_date: "",
    institute_id: this.reportService.institute_id,
    to_date: "",
    user_id: ""
  }
  constructor(private reportService: BiometricServiceService,
    private appc: AppComponent,
    private institute_id: AuthenticatorService) { }

  ngOnInit() {
    this.getMasterCourses();
  }
  getMasterCourses() {
    
    this.getData.biometric_attendance_date = moment().format('YYYY-MM-DD');
    this.getData.name = "";
    this.getData.master_course_name = "";
    this.reportService.getAllData().subscribe(
      (data: any) => {
        
        this.masterCourse = data;
        this.isRippleLoad = false;
      },
      (error) => {
        return error;
      }
    )
  }
  getCourses(i) {
    this.reportService.getCourses(i).subscribe(
      (data: any) => {
        this.courses = data.coursesList;
      },
      (error) => {
        return error;
      }
    )

  }
  getSubjects(i) {
    this.reportService.getSubjects(i).subscribe(
      (data: any) => {
        this.subjects = data.batchesList;
      },
      (error: any) => {
        return error;
      }
    )
  }
  fetchDataByName() {
    
   
    this.showTeacherButton = true;
    if (this.getData.user_Type == 1) {
      this.studentsDisplayData = [];
      this.showTeacherButton = true;
      this.showStudentTable = true;
      this.showTeachersTable = false;
      this.showCustomTable = false;
      this.dataStatus = true;
      this.reportService.getAttendanceReport(this.getData).subscribe(
        (data: any) => {
         
          this.dataStatus =  false;
          this.studentsData = data;
          this.totalRow = data.length;
          this.PageIndex = 1;
          this.fetchTableDataByPage(this.PageIndex);
        
        },
        (error) => {
          this.dataStatus =  false;
          this.isRippleLoad = false;
          return error;
        }
      )
    }
    else if (this.getData.user_Type == 3) {
      this.showTeacherButton = true;
      this.showTeachersTable = true;
      this.showStudentTable = false;
      this.showCustomTable = false;

      this.reportService.getAttendanceReportTeachers(this.getData).subscribe(
        (data: any) => {
          this.studentsData = data;
          this.totalRow = data.length;
          this.PageIndex = 1;
          this.fetchTableDataByPage(this.PageIndex);
        },
        (error: any) => {
          return error;
        }
      )
    }
    else {
      this.showTeacherButton = true;
      this.showStudentTable = false;
      this.showTeachersTable = false;
      this.showCustomTable = true;
      this.reportService.getAttendanceReportOthers(this.getData).subscribe(
        (data: any) => {
          this.studentsData = data;
          this.totalRow = data.length;
          this.PageIndex = 1;
          this.fetchTableDataByPage(this.PageIndex);
        },
        (error: any) => {
          return error;
        }
      )
    }
  }


  viewOlderRecords(i) {
    this.getAllData.user_id = i.user_id;
    this.addReportPopUp = true;
    this.reportService.getAllFinalReport(this.getAllData).subscribe(
      (data: any) => {

      },
      (error: any) => {
        return error;
      }
    )
  }
  closeReportPopup() {
    this.addReportPopUp = false;
  }

  showMaster(i) {
    if (i == 1) {
      this.showTeacherButton=true;
      this.showTeachersTable = false;
      this.masterCourseNames = true;
      this.showCustomTable = false;
      this.showButton = true;
    }
    else {
      this.showTeacherButton=true;
      this.showStudentTable = false;
      this.masterCourseNames = false;
      this.showButton = false;
    }
  }
  popupChange() {
    this.monthAttendance = [];
    this.weekAttendance = [];
    if (this.popupCtrl == 2) {

      this.addReportPopUp = false;
      this.addAcademicPopUp = true;
      this.showRange = true;
      this.showMonth = false;
      this.showWeek = false;

    }
    else if (this.popupCtrl == 0) {
     this.monthAttendance = [];
     this.dataStatus = true;
      this.getAllData = {
        from_date: moment().subtract('months', 1).format('YYYY-MM-DD'),
        institute_id: this.reportService.institute_id,
        to_date: moment().format('YYYY-MM-DD'),
        user_id: this.getAllData.user_id
      }
   
      this.addReportPopUp = false;
      this.addAcademicPopUp = true;
      this.showMonth = true;
      this.showRange = false;
      this.showWeek = false;
      this.reportService.getAllFinalReport(this.getAllData).subscribe(
        (data: any) => {
          this.dataStatus = false;
          this.monthAttendance = data;

        },
        (error: any) => {
          return error;
        }
      )

    }
    else if (this.popupCtrl == 1) {
      this.weekAttendance =[];
      this.dataStatus =true;
      this.getAllData = {
        from_date: moment().subtract('days', 7).format('YYYY-MM-DD'),
        institute_id: this.reportService.institute_id,
        to_date: moment().format('YYYY-MM-DD'),
        user_id: this.getAllData.user_id
      }
      this.addReportPopUp = false;
      this.addAcademicPopUp = true;
      this.showMonth = false;
      this.showRange = false;
      this.showWeek = true;
      this.reportService.getAllFinalReport(this.getAllData).subscribe(
        (data: any) => {
          this.dataStatus =false;
          this.weekAttendance = data;

        },
        (error: any) => {

        }
      )

    }

  }
  closeReportAcademicPopup() {
    this.addAcademicPopUp = false;
  }
  getInstitute() {
    let type: any = sessionStorage.getItem('institute_type');
    if (type == 'LANG') {
      this.isProfessional = true;
    }
    else {
      this.isProfessional = false;
    }
  }

  showDataTable() {
    this.range = [];
    this.dataStatus = true;
    this.getAllData = {
      from_date: moment(this.getAllData.from_date).format('YYYY-MM-DD'),
      institute_id: this.reportService.institute_id,
      to_date: moment(this.getAllData.to_date).format('YYYY-MM-DD'),
      user_id: this.getAllData.user_id
    }
    console.log(this.getAllData.from_date);
    let diff = moment(this.getAllData.from_date).diff(moment(this.getAllData.to_date), 'months');
    let futureDate = moment(this.getAllData.to_date).add('days',1).format('YYYY-MM-DD');
    console.log(futureDate);
    console.log(this.getAllData.to_date);
    if (diff < -2) {
      let msg = {
        type: "error",
        title: "Incorrect Details",
        body: "Range should not be more than 2 months"
      }

      this.appc.popToast(msg);
    }
    else if (this.getAllData.from_date >= this.getAllData.to_date) {
      let msg = {
        type: "error",
        title: "Incorrect Details",
        body: "From date cannot be Greater than to date"
      }

      this.appc.popToast(msg);
    }
    
    else {
      this.reportService.getAllFinalReport(this.getAllData).subscribe(
        (data: any) => {
          this.dataStatus = false;
          this.range = data;

        },
        (error) => {
          return error;
        }

      )
      this.showTable = true;

    }
  }
  fetchAbsentiesReport() {
    this.addAbsentiesPopup = true;
  }

  closeAbsentiesPopup() {

    this.addAbsentiesPopup = false;
  }

  sortedData(ev) {
    
    (this.direction == 0 || this.direction == -1) ? (this.direction = 1) : (this.direction = -1);
    
      this.studentsData = this.studentsData.sort((a:any, b:any)=>{
        if(a[ev] < b[ev]){
            return -1*this.direction;
        }
        else if(a[ev] > b[ev]){
            return this.direction;
        }
        else{
            return 0;
        }
    });

    
    this.PageIndex = 1;
    this.fetchTableDataByPage(this.PageIndex);
  }

  searchDatabase(){
    if (this.searchText != "" && this.searchText != null) {
      this.PageIndex = 1;
      let searchData: any;
      searchData = this.studentsData.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchText.toLowerCase()))
      );
      this.searchData =searchData;
      this.totalRow = searchData.length;
      this.searchflag = true;
      this.fetchTableDataByPage(this.PageIndex);
    }
    else {
      this.searchflag = false;
      this.fetchTableDataByPage(this.PageIndex);
      
    }
  }
  
  viewAbsentiesRecord() {
    this.absentTable = true;
    if (this.getAbsentiesData.from_date == "") {
      let msg = {
        type: "error",
        title: "Incorrect Details",
        body: "Please specify absent date"
      }

      this.appc.popToast(msg);
    }
    else {
      this.reportService.fetchAbsentiesData(this.getAbsentiesData).subscribe(
        (data: any) => {
          this.absentiesRecords = data;
        },
        (error: any) => {
          return error;
        }
      )
    }
  }  //pagination functions
  fetchTableDataByPage(index) {
    this.PageIndex = index;
    let startindex = this.pagedisplaysize * (index - 1);

    this.studentsDisplayData = this.getDataFromDataSource(startindex);

  }

  fetchNext() {
    this.PageIndex++;
    this.fetchTableDataByPage(this.PageIndex);
  }

  fetchPrevious() {
    if (this.PageIndex != 1) {
      this.PageIndex--;
      this.fetchTableDataByPage(this.PageIndex);
    }
  }

  getDataFromDataSource(startindex) {
    if (this.searchflag) {
      let t = this.searchData.slice(startindex, startindex + this.pagedisplaysize);
      return t;
    }
    else{
    let d = this.studentsData.slice(startindex, startindex + this.pagedisplaysize);
    return d;
    }
  }



  dateValidationForFuture(e){
    console.log(e);
    let today = moment(new Date);
    let selected = moment(e);

    let diff = moment(selected.diff(today))['_i'];
    
    if(diff <= 0){

    }
    else{
      this.getAllData.to_date = moment(new Date).format("YYYY-MM-DD");
    }

  }

}
