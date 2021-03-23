import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MessageShowService } from '../../../../services/message-show.service';
import { HttpService } from '../../../../services/http.service';
import { Router } from '@angular/router';
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
  lastAttendanceUpdatedDate: string = "";

  constructor(private msgService: MessageShowService,
    private httpService: HttpService,
    private router: Router,
    private auth: AuthenticatorService, private excelService: ExcelService, private pdf: ExportToPdfService,) {
    this.jsonFlag.institute_id = sessionStorage.getItem('institution_id');


  }

  ngOnInit(): void {
    this.getAllmarkAttendance()


  }

  getAllmarkAttendance() {
    this.auth.showLoader();
    const url1 = '/api/v1/daily/attendance/' + this.jsonFlag.institute_id + /all/ + this.markAttendanceDetail.currentDate + '/3';
    this.httpService.getData(url1).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        debugger
        this.allMarkAttendanceList = res.result;
        this.lastAttendanceUpdatedDate = this.allMarkAttendanceList[0].last_attendance_updated_date
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

  checkFututreDate(event) {
    alert(this.markAttendanceDetail.currentDate)
    let today = moment(new Date);
    let selectedDate = moment(this.markAttendanceDetail.currentDate)
    let diff = moment(selectedDate.diff(today))['_i'];
    if (diff > 0) {
      this.msgService.showErrorMessage('info', '', "Future date is not allowed");
      this.markAttendanceDetail.currentDate = moment(new Date).format('YYYY-MM-DD');

    }
  }


  makeJSONToUpdate() {
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
      user_type: this.markAttendanceDetail.user_type,
      institute_id: this.jsonFlag.institute_id,
      attendance_dto_list: this.attendance_dto_list
    }
    console.log(JSON.stringify(obj));
    this.auth.showLoader();
    const url = '/api/v1/daily/attendance/' + this.jsonFlag.institute_id + "/update";
    this.httpService.putData(url, obj).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.updateAttendanceList = res.result;
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )

  }

  markAttendaceBtnClick(obj, event, i) {
    this.allMarkAttendanceList[i].attendance_status = event;
  }



  createAttendance() {
    this.makeJSONToUpdate();
    let obj = {
      attendance_date: this.markAttendanceDetail.currentDate,
      user_type: this.markAttendanceDetail.user_type,
      institute_id: this.jsonFlag.institute_id,
      attendance_dto_list: this.attendance_dto_list
    }
    console.log(JSON.stringify(obj));
    this.auth.showLoader();

    const url = '/api/v1/daily/attendance/' + this.jsonFlag.institute_id + "/create";
    this.httpService.postData(url, obj).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.createAttendanceList = res.result;
        console.log("ASHA create Atttendance", this.createAttendanceList)
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )

  }


  downloadToExcel() {
    let temp: any[] = []
    temp = this.allMarkAttendanceList.map(e => {
      let obj: any = {
        name: e.name,
        phoneNo: e.phoneNo,
        emailId: e.emailId,
        attendance_status: e.attendance_status
      }
      return obj;
    })
    this.excelService.exportAsExcelFile(temp, 'Attendance_Details')

  }
  downloadPdf() {
    let temp = []
    temp = this.allMarkAttendanceList.map(e => {
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
  // previous(){
  //   let today = moment(new Date);
  //   let selectedDate = moment(this.markAttendanceDetail.currentDate)


  // }
}

