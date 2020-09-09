import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { AppComponent, AuthenticatorService, HttpService } from '../../../..';
import { ExcelService } from '../../../../services/excel.service';


@Component({
  selector: 'app-biometric',
  templateUrl: './biometric.component.html',
  styleUrls: ['./biometric.component.scss']
})
export class BiometricComponent implements OnInit {

  @ViewChild('biometricTable',{static: false}) biometricTable: ElementRef;
  @ViewChild('xlsDownloader',{static: false}) xlsDownloader: ElementRef;
  masterCourse: any[] = [];
  studentsData: any[] = [];
  monthAttendance: any[] = [];
  courses: any[] = [];
  othersData: any[] = [];
  weekAttendance: any[] = [];
  studentsDisplayData: any[] = [];
  range: any[] = [];
  masters: any[] = [];
  subjects: any[] = [];
  absentiesRecords: any[] = [];
  findName: any[] = [];
  masterCoursePro: any[] = [];
  batchPro: any[] = [];
  coursePro: any[] = [];
  nameOfPeople: any[] = [];
  absendStudentData: any[] = [];
  dummyArr: any[] = [0, 1, 2, 0, 1, 2];
  columnMaps: any[] = [0, 1, 2, 3, 4, 5, 6];
  columnMapRecords: any[] = [0, 1, 2];
  searchData: any[] = [];
  studentArray: any[] = [];
  //need for selected keys
  displayKeys: any[] = ['student_id', 'student_name', 'doj'];
  master: any = "";
  students: any = "";
  popupCtrl: any = "-1";
  PageIndex: number = 1;
  pagedisplaysize: number = 10;
  totalRow: number;
  direction = 0;
  searchText = "";
  sortedBy: string = "";
  studentName: string = "";
  teacherName: string = "";
  customName: string = "";
  studentId: string = "";
  teacherId: string = "";
  customId: string = "";
  masterCourseNames: boolean = false;
  isProfessional: boolean = true;
  addReportPopUp: boolean = false;
  addAcademicPopUp: boolean = false;
  showStudentTable: boolean = false;
  showTeachersTable: boolean = false;
  showCustomTable: boolean = false;
  showTable: boolean = false;
  showMonth: boolean = false;
  addAbsentiesPopup = false;
  showButton: boolean = true;
  showRange: boolean = false;
  showWeek: boolean = false;
  absentTable: boolean = false;
  dataStatus: boolean = false;
  showTeacherButton: boolean = true;
  searchflag: boolean = false;
  sortedenabled: boolean = true;
  showTableEvent: boolean = false;
  showRangeValue: boolean = false;
  showNameFilter: boolean = true;
  showCourseFilter: boolean = true;
  absentStudentPopUp: boolean = false;
  institute_id: any;
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
    from_date: moment().format('YYYY-MM-DD'),
    institution_id: this.institute_id,
    master_course_name: -1,
    standard_id: -1,
    subject_id: -1
  }

  getAllData = {
    from_date: "",
    institute_id: this.institute_id,
    to_date: "",
    user_id: ""
  }

  constructor(
    private appc: AppComponent,
    private _http: HttpService,
    private auth: AuthenticatorService,
    private excelService: ExcelService) {
    this.auth.currentInstituteId.subscribe(id => {
      this.institute_id = id;
    });
  }

  ngOnInit() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )
    this.getMasterCourses();
  }

  fetchAbsentiesReport() {
    this.absentStudentPopUp = true;
  }
  toggleCheckbox(value) {
    console.log(value);
    let index = this.studentArray.indexOf(value);
    if (index == -1) {
      this.studentArray.push(value)
    }
    else {
      this.studentArray.splice(index, value);
    }

  }

  sendSMSToAbsenties() {
    if (confirm("Are u sure, you want to send sms to Absent students?")) {
      this.auth.showLoader();
      let obj = {
        "from_date": moment(this.getAbsentiesData.from_date).format('YYYY-MM-DD'),
        "institution_id": sessionStorage.getItem('institute_id'),
        "studentArray": this.studentArray
      }

      this._http.postData("/api/v1/attendance/sendSMSToAbsenties", obj).subscribe(
        (data: any) => {
          this.auth.hideLoader();
          if (data.statusCode == 200) {
            let obj = {
              type: 'success',
              title: '',
              body: "SMS sent successfully !"
            }
            this.appc.popToast(obj);
          }

        },
        (error: any) => {
          this.auth.hideLoader();
          let msg = {
            type: "error",
            body: error.error.message
          }
          this.appc.popToast(msg);
        }
      )
    }

  }
  closeAbsentiesPopup() {
    this.absentStudentPopUp = false;
  }

  getMasterCourses() {
    this.getData.biometric_attendance_date = moment().format('YYYY-MM-DD');
    this.dataStatus = true;
    this.batchPro = [];
    this.masterCoursePro = [];
    if (this.isProfessional) {
      const url = "/api/v1/batches/fetchCombinedBatchData/" + this.institute_id + "?standard_id=" + this.getData.standard_id + "&subject_id=" + this.getData.subject_id + "&assigned=N";
      this._http.getData(url).subscribe(
        (data: any) => {
          this.auth.hideLoader();
          this.masterCoursePro = data.standardLi;
          this.batchPro = data.batchLi;
        },
        (error: any) => {
          this.auth.hideLoader();
          this.dataStatus = false;
          return error;
        }
      )
    }
    this.getMasterCourse();
  }

  getMasterCourse() {
    const url = "/api/v1/courseMaster/fetch/" + this.institute_id + "/all"
    this._http.getData(url).subscribe(
      (data: any) => {
        this.getData.master_course_name = "";
        this.getData.course_id = -1;
        this.masterCourse = data;
        this.auth.hideLoader();
      },
      (error) => {
        this.auth.hideLoader();
        return error;
      }
    )
  }
  switchFilter() {
    this.studentsData = [];
    this.getData.name = "";
    this.masterCourseNames = true;
    this.showNameFilter = false;
    this.totalRow = this.studentsData.length;
    this.PageIndex = 1;
    this.fetchTableDataByPage(this.PageIndex);
  }

  showNameWiseFilter() {
    this.studentsData = [];
    this.getData.standard_id = -1;
    this.getData.master_course_name = "";
    this.getData.course_id = -1;
    this.masterCourseNames = false;
    this.showNameFilter = true;
    this.totalRow = this.studentsData.length;
    this.PageIndex = 1;
    this.fetchTableDataByPage(this.PageIndex);
  }

  getCourses(i) {
    this.dataStatus = true;
    this.getData.name = "";
    this.getData.subject_id = -1;
    this.getAbsentiesData.course_id = -1;
    this.getAbsentiesData.subject_id = -1;
    // this.batchPro = [];
    this.coursePro = [];
    this.courses = [];
    this.subjects=[];
    if (this.isProfessional) {
      const url = "/api/v1/subjects/standards/" + i;
      this._http.getData(url).subscribe(
        (data: any) => {
          this.dataStatus = false;
          this.auth.hideLoader();
          this.coursePro = data;
        },
        (error: any) => {
          this.dataStatus = false;
          this.auth.hideLoader();
          return error;
        }
      )
    }
    else {
      const url = "/api/v1/courseMaster/fetch/" + this.institute_id + "/" + i
      this._http.getData(url).subscribe(
        (data: any) => {
          this.dataStatus = false;
          this.auth.hideLoader();
          this.courses = data.coursesList;
        },
        (error) => {
          this.dataStatus = false;
          this.auth.hideLoader();
          return error;
        }
      )
    }
  }

  getSubjects(i) {
    this.dataStatus = true;
    const url = "/api/v1/courseMaster/fetch/courses/" + this.institute_id + "/" + i;
    this._http.getData(url).subscribe(
      (data: any) => {
        this.dataStatus = false;
        this.auth.hideLoader();
        this.subjects = data.batchesList;
      },
      (error: any) => {
        this.dataStatus = false;
        this.auth.hideLoader();
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
      if (this.isProfessional) {
        this.getData.biometric_attendance_date = moment(this.getData.biometric_attendance_date).format('YYYY-MM-DD');
        const url = "/api/v1/students/manage/" + this.institute_id;
        this._http.postData(url, this.getData).subscribe(
          (data: any) => {
            this.auth.hideLoader();
            this.dataStatus = false;
            this.studentsData = data;
            this.totalRow = data.length;
            this.PageIndex = 1;
            this.fetchTableDataByPage(this.PageIndex);
          },
          (error) => {
            this.dataStatus = false;
            this.auth.hideLoader();
            return error;
          }
        )
      }
      else {
        this.getData.biometric_attendance_date = moment(this.getData.biometric_attendance_date).format('YYYY-MM-DD');
        const url = "/api/v1/students/manage/" + this.institute_id;
        this._http.postData(url, this.getData).subscribe(
          (data: any) => {
            this.auth.hideLoader();
            this.dataStatus = false;
            this.studentsData = data;
            this.totalRow = data.length;
            this.PageIndex = 1;
            this.fetchTableDataByPage(this.PageIndex);

          },
          (error) => {
            this.dataStatus = false;
            this.auth.hideLoader();
            return error;
          }
        )
      }
    }
    else if (this.getData.user_Type == 3) {
      this.dataStatus = true;
      this.showTeacherButton = true;
      this.showTeachersTable = true;
      this.showStudentTable = false;
      this.showCustomTable = false;
      this.getData.biometric_attendance_date = moment(this.getData.biometric_attendance_date).format('YYYY-MM-DD');
      const url = "/api/v1/teachers/manage/" + this.institute_id;
      this._http.postData(url, this.getData).subscribe(
        (data: any) => {
          this.dataStatus = false;
          this.auth.hideLoader();
          this.studentsData = data;
          this.totalRow = data.length;
          this.PageIndex = 1;
          this.fetchTableDataByPage(this.PageIndex);
        },
        (error: any) => {
          this.dataStatus = false;
          this.auth.hideLoader();
          return error;
        }
      )
    }
    else {
      this.showTeacherButton = true;
      this.showStudentTable = false;
      this.showTeachersTable = false;
      this.showCustomTable = true;
      this.getData.biometric_attendance_date = moment(this.getData.biometric_attendance_date).format('YYYY-MM-DD');
      let isActive = this.getData.is_active_status == 1 ? "Y" : "N";
      const url = "/api/v1/profiles/all/" + this.institute_id + "?active=" + isActive;
      this._http.postData(url, this.getData).subscribe(
        (data: any) => {
          this.dataStatus = false;
          this.auth.hideLoader();
          this.studentsData = data;
          this.totalRow = data.length;
          this.PageIndex = 1;
          this.fetchTableDataByPage(this.PageIndex);
        },
        (error: any) => {
          this.dataStatus = false;
          this.auth.hideLoader();
          return error;
        }
      )
    }
  }


  viewOlderRecords(i) {

    this.studentName = i.student_name;
    this.teacherName = i.teacher_name;
    this.customName = i.name;
    this.studentId = i.student_disp_id;
    this.teacherId = i.teacher_id;
    this.customId = i.userid;
    console.log(this.teacherName);
    this.getAllData.user_id = i.user_id;
    this.getAllData.institute_id = this.institute_id;
    this.addReportPopUp = true;
    this.dataStatus = true;
    const url = "/api/v1/biometricAttendance/report";
    this._http.postData(url, this.getAllData).subscribe(
      (data: any) => {
        this.dataStatus = false;
        this.auth.hideLoader();
      },
      (error: any) => {
        this.dataStatus = false;
        this.auth.hideLoader();
        return error;
      }
    )
  }

  showAttendanceReport() {
    this.showMonth = false;
    this.showWeek = false;
    this.showRange = false;
    this.addReportPopUp = true;
  }

  closeReportPopup() {
    this.addReportPopUp = false;
    this.popupCtrl = "-1";
    this.showRangeValue = false;
    this.showTableEvent = false;
    this.getAllData.from_date = "";
    this.getAllData.to_date = "";
    this.range = [];
  }

  showMaster(i) {
    if (i == 1) {
      this.showCourseFilter = true;
      this.studentsData = [];
    }
    else {
      this.getData.standard_id = -1;
      this.getData.subject_id = -1;
      this.getData.batch_id = -1;
      this.showCourseFilter = false;
      this.studentsData = [];
    }
  }

  fetchAbsentsStudentsData() {
    this.auth.showLoader();
    this.getAbsentiesData.from_date = moment(this.getAbsentiesData.from_date).format('YYYY-MM-DD');
    this.getAbsentiesData.institution_id = this.institute_id;
    let url = "/api/v1/attendance/fetchAbsentsStudentsData";
    this._http.postData(url, this.getAbsentiesData).subscribe(
      (data: any) => {
        console.log(data);
        if (data != null) {
          this.absendStudentData = data;
        }
        else {
          this.absendStudentData = [];
        }
        this.auth.hideLoader();
      },
      (error: any) => {
        this.auth.hideLoader();
        return error;
      }
    )
  }

  futureDateValid(selectDate) {
    if (moment(selectDate).diff(moment()) > 0) {
      let msg = {
        type: "info",
        body: "You cannot select future date"
      }
      this.appc.popToast(msg);
      this.auth.hideLoader();
      this.getData.biometric_attendance_date = moment().format('YYYY-MM-DD');
      this.getAllData.from_date = moment().format('YYYY-MM-DD');
    }
  }

  courseChange() {
    if ((this.getData.master_course_name == "" && !this.isProfessional) || (this.getData.standard_id == -1 && this.isProfessional)) {
      let msg = {
        type: "info",
        body: "Select Master Course First !"
      }
      this.appc.popToast(msg);
      this.auth.hideLoader();
    }
  }


  courseEmpty() {
    if (this.getData.name != "") {
      this.getData.standard_id = -1;
      this.getData.batch_id = -1;
      this.getData.subject_id = -1;
    }
  }


  sortedData(ev) {
    this.sortedenabled = true;
    if (this.sortedenabled) {
      (this.direction == 0 || this.direction == -1) ? (this.direction = 1) : (this.direction = -1);
      this.sortedBy = ev;
      this.studentsData = this.studentsData.sort((a: any, b: any) => {
        if (a[ev] < b[ev]) {
          return -1 * this.direction;
        }
        else if (a[ev] > b[ev]) {
          return this.direction;
        }
        else {
          return 0;
        }
      });


      this.PageIndex = 1;
      this.fetchTableDataByPage(this.PageIndex);
    }
  }

  getCaretVisiblity(e): boolean {

    if (this.sortedenabled && this.sortedBy == e) {
      return true;
    }

    else {
      return false;
    }
  }

  searchDatabase() {
    if (this.searchText != "" && this.searchText != null) {
      this.PageIndex = 1;
      let searchData: any;
      searchData = this.studentsData.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchText.toLowerCase()))
      );
      this.searchData = searchData;
      this.totalRow = searchData.length;
      this.searchflag = true;
      this.fetchTableDataByPage(this.PageIndex);
    }
    else {
      this.searchflag = false;
      this.fetchTableDataByPage(this.PageIndex);

    }
  }

  //pagination functions
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
    else {
      let d = this.studentsData.slice(startindex, startindex + this.pagedisplaysize);
      return d;
    }
  }

  dateValidationForFuture(e) {
    //console.log(e);
    let today = moment(new Date);
    let selected = moment(e);
    let diff = moment(selected.diff(today))['_i'];
    if (diff <= 0) {

    }
    else {
      this.getData.biometric_attendance_date = moment(new Date).format('YYYY-MM-DD');
      this.getAllData.to_date = moment(new Date).format('YYYY-MM-DD');
      this.getAllData.from_date = moment(new Date).format('YYYY-MM-DD');
      let msg = {
        type: "info",
        body: "Future date is not allowed"
      }
      this.auth.hideLoader();
      this.dataStatus = false;
      this.appc.popToast(msg);
    }
  }
  // ====================================================================================================================

  getAllDataService(from_date, to_date) {
    this.range = [];
    this.dataStatus = true;
    this.showTableEvent = false;
    let diff = moment(this.getAllData.from_date).diff(moment(this.getAllData.to_date), 'months');

    if (this.getAllData.from_date == "" || this.getAllData.from_date == null || this.getAllData.to_date == "" || this.getAllData.to_date == null) {
      let msg = {
        type: "Info",
        body: "Please select date range"
      }
      this.appc.popToast(msg);
    }
    // else if (diff < -2) {
    //   let msg = {
    //     type: "error",
    //     title: "Incorrect Details",
    //     body: "Range should not be more than 2 months"
    //   }
    //   this.appc.popToast(msg);
    // }
    else {
      this.getAllData.institute_id = this.institute_id;
      const url = "/api/v1/biometricAttendance/report";
      this._http.postData(url, this.getAllData).subscribe(
        (data: any) => {
          this.showTableEvent = true;
          if (data != null) {
            this.range = data;
            this.dataStatus = false;
          }
          else {
            this.range = [];
            this.dataStatus = false;
          }
        },
        (error: any) => {
          this.dataStatus = false;
          let msg = {
            type: "error",
            body: error.error.message
          }
          this.appc.popToast(msg);
        }
      )
    }
  }

  popupCtrlChange(event) {
    if (event == 0) {
      this.getAllData.from_date = moment().subtract('months', 1).format('YYYY-MM-DD')
      this.getAllData.to_date = moment().format('YYYY-MM-DD')
      this.getAllDataService(this.getAllData.from_date, this.getAllData.to_date);
      this.showRangeValue = false;
    }
    else if (event == 1) {
      this.getAllData.from_date = moment().subtract('days', 7).format('YYYY-MM-DD')
      this.getAllData.to_date = moment().format('YYYY-MM-DD');
      this.getAllDataService(this.getAllData.from_date, this.getAllData.to_date);
      this.showRangeValue = false;
    }
    else if (event == 2) {
      this.getAllDataService(this.getAllData.from_date, this.getAllData.to_date);
    }
  }

  getPopupEvent(event) {
    if (event == 2) {
      this.showRangeValue = true;
    }
    else {
      this.showRangeValue = false;
    }
  }

  exportToExcel(event) {
    let arr = [];
    this.range.map((ele: any) => {
      let json = {
        "Date": ele.attendance_date,
        "In Time": ele.in_time,
        "Out Time": ele.out_time
      }
      arr.push(json);
    });
    this.excelService.exportAsExcelFile(arr, 'biometric');
  }


}
