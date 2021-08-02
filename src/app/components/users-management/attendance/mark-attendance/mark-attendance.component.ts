import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MessageShowService } from '../../../../services/message-show.service';
import { HttpService } from '../../../../services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { ExcelService } from '../../../../services/excel.service';
import { ExportToPdfService } from '../../../../services/export-to-pdf.service';

@Component({
  selector: 'app-mark-attendance',
  templateUrl: './mark-attendance.component.html',
  styleUrls: ['./mark-attendance.component.scss']
})
export class MarkAttendanceComponent implements OnInit {

  jsonFlag = {
    institute_id: '',
  };
  searchInput: any
  attendanceList: any[] = []
  userType: any


  markAttendanceDetail = {
    name: '',
    phoneNo: '',
    emailId: '',
    attendance_status: '',
    user_id: '',
    user_type: '3',
    teacher_id: '',
    currentDate: moment(new Date()).format('YYYY-MM-DD')
  }
  allMarkAttendanceList: any[] = [];
  updateAttendanceList: any[] = []
  attendance_dto_list: any[] = []
  createAttendanceList: any[] = []
  lastAttendanceUpdatedDate: string = null;

  constructor(private msgService: MessageShowService,
    private httpService: HttpService,
    private router: Router,
    private auth: AuthenticatorService,
    private excelService: ExcelService,
    private pdf: ExportToPdfService,
    private activatedRoute: ActivatedRoute,) {
    this.jsonFlag.institute_id = sessionStorage.getItem('institution_id');
    this.activatedRoute.params.subscribe(
      (res: any) => {
        this.userType = res['user_type'];
      }
    )
  }

  ngOnInit(): void {
    this.getAllmarkAttendance()
  }

  getAllmarkAttendance() {
    this.markAttendanceDetail.currentDate = moment(this.markAttendanceDetail.currentDate).format('YYYY-MM-DD')
    this.auth.showLoader();
    const url1 = '/api/v1/daily/attendance/' + this.jsonFlag.institute_id + /all/ + this.markAttendanceDetail.currentDate + '/' + this.userType;
    this.httpService.getData(url1).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.allMarkAttendanceList = res.result;
        if(this.allMarkAttendanceList.length>0){
        this.attendanceList = res.result;
        console.log("attendance data",this.allMarkAttendanceList)
      if(this.allMarkAttendanceList[0].last_attendance_updated_date != null){
        this.lastAttendanceUpdatedDate = moment(this.allMarkAttendanceList[0].last_attendance_updated_date).format('DD-MM-YYYY');
        }
        if (this.lastAttendanceUpdatedDate == null) {
          for (let i = 0; this.allMarkAttendanceList.length; i++) {
            this.allMarkAttendanceList[i].attendance_status = 'Present'
          }

        }
      }
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.error[0].errorMessage);
      }
    )
  }

  checkFututreDate(event) {
    let today = moment(new Date);
    let selectedDate = moment(this.markAttendanceDetail.currentDate)
    let diff = moment(selectedDate.diff(today))['_i'];
    if (diff > 0) {
      this.msgService.showErrorMessage('info', '', "Future date is not allowed");
      this.markAttendanceDetail.currentDate = moment(new Date).format('YYYY-MM-DD');

    } else {
      this.getAllmarkAttendance();
    }
  }
  makeJSONToUpdate() {
    this.attendance_dto_list = [];
    for (let data of this.allMarkAttendanceList) {
      if (data.attendance_status != null) {
        let obj = {
          user_id: data.user_id,
          teacher_id: data.teacher_id,
          attendance_status: data.attendance_status
        }
        this.attendance_dto_list.push(obj);
      }
    }
  }

  updateMarkAttendance() {
    this.makeJSONToUpdate();
    let obj = {
      attendance_date: moment(this.markAttendanceDetail.currentDate).format('YYYY-MM-DD'),
      user_type: this.userType,
      institute_id: this.jsonFlag.institute_id,
      attendance_dto_list: this.attendance_dto_list
    }
    this.auth.showLoader();
    const url = '/api/v1/daily/attendance/' + this.jsonFlag.institute_id + "/update";
    this.httpService.putData(url, obj).subscribe(
      (res: any) => {
        this.auth.hideLoader();

        this.updateAttendanceList = res.result;
        this.msgService.showErrorMessage('success', '', "Attendance updated successfully");
        this.getAllmarkAttendance()

      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.error[0].errorMessage);
      }
    )

  }

  markAttendaceBtnClick(obj, event, i) {
    this.allMarkAttendanceList[i].attendance_status = event;
  }



  createAttendance() {
    this.makeJSONToUpdate();
    let obj = {
      attendance_date: moment(this.markAttendanceDetail.currentDate).format('YYYY-MM-DD'),
      user_type: this.userType,
      institute_id: this.jsonFlag.institute_id,
      attendance_dto_list: this.attendance_dto_list
    }
    this.auth.showLoader();
    const url = '/api/v1/daily/attendance/' + this.jsonFlag.institute_id + "/create";
    this.httpService.postData(url, obj).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.createAttendanceList = res.result;
        this.msgService.showErrorMessage('success', '', "Attendance created successfully");
        this.getAllmarkAttendance()


      },
      err => {
        this.auth.hideLoader();

        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.error[0].errorMessage);
      }
    )

  }


  downloadToExcel() {
    let temp = []
    this.allMarkAttendanceList.map(e => {
      let obj = {
        name: e.name,
        phoneNo: e.phoneNo,
        emailId: e.emailId,
        attendance_status: e.attendance_status
      }
      temp.push(obj);
    })
    this.excelService.exportAsExcelFile(temp, 'Attendance_Details')

  }
  downloadPdf() {
  let temp = []
    this.allMarkAttendanceList.map((e: any) => {
      let obj = [
        e.name,
        e.phoneNo,
        e.emailId,
        e.attendance_status
      ]

      temp.push(obj)
    })
      let row = []
    row = [['Name', 'Mobaile No', 'Email', 'Attendance-Status']]
    let columns = temp
    this.pdf.exportToPdf(row, columns, 'Attendance_pdf');

  }
  searchDataList() {
    if (this.searchInput == undefined || this.searchInput == null) {
      this.searchInput = "";
    }
    else {
      let searchData = this.attendanceList.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchInput.toLowerCase()))

      );
      this.allMarkAttendanceList = searchData;

    }

  }
  viewUser(user_id) {

    // user_id = this.allMarkAttendanceList.user_id
    this.router.navigate(['/view/manage/attendance/view-attendance/' + user_id])

  }


}


