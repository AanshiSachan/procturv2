import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { MessageShowService } from '../../..';
import { AppComponent } from '../../../app.component';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { HttpService } from '../../../services/http.service';
import { ExcelService } from '../../../services/excel.service';

@Component({
  selector: 'app-attendance-report',
  templateUrl: './attendance-report.component.html',
  styleUrls: ['./attendance-report.component.scss']
})
export class AttendanceReportComponent implements OnInit {

  isProfessional: boolean = false;
  institution_id:any=sessionStorage.getItem('institution_id');
  session_id: any;
  invited_attendance_list: any[] = [];
  guest_attendance_list: any[] = [];
  attendance_list: any[] = [];
  temp_attendance_list: any[] = [];
  session_data: any;
  searchInput: any = '';
  tableSetting: any = {
    keys: [
    { primaryKey: 'display_id', header: 'Id'},
    { primaryKey: 'name', header: 'Name'},
    { primaryKey: 'phone', header: 'Contact No.'},
    { primaryKey: 'attendance_status', header: 'Status'},
    { primaryKey: 'join_time', header: 'Start Time'},
    { primaryKey: 'leave_join', header: 'End Time'},
    { primaryKey: 'duration', header: 'Duration'},
  ]};

  constructor(
    private auth: AuthenticatorService,
    private router: Router,
    private appC: AppComponent,
    private route: ActivatedRoute,
    private http_service: HttpService,
    private msgService: MessageShowService,
    private excelService: ExcelService
  ) { }

  ngOnInit() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )
    this.session_id = this.route.snapshot.paramMap.get('id');
    // this.setDemoData()
    this.getLiveClassAttendanceReport();
  }


  getLiveClassAttendanceReport(){
    let obj = {
      "session_id": this.session_id, // If want data by session Id
      "sort_by": "name", // available parameters: name, duration
      "order": "ASC", // ASC or DESC
      // "user_id":28101, // if want data by user id
      // "attendance_status":"PRESENT", // if want filter by attendance available parameters : “PRESENT” , “ABSENT”, “PARTIALLY_PRESENT”
      // "student": false, // default true set false if do not need student data
      // "teacher": false, // default true set false if do not need teachers data
      // "guest": false // default true set false if do not need guests data
    }
    this.auth.showLoader();

    const url ='/api/v1/meeting_manager/getAttendanceReport';
    this.http_service.postData(url, obj).subscribe(
      (data: any) => {
        console.log(data.result)
        this.auth.hideLoader();
        var res: any = data.result;
        this.invited_attendance_list = res.invited_attendance_list;
        this.guest_attendance_list = res.guest_attendance_list;
        this.guest_attendance_list.forEach(elem=>{
          elem.isInvited = true;
        })
        let arr = this.guest_attendance_list.concat(this.invited_attendance_list);
        this.attendance_list = arr.sort((a, b) => a.name.toLocaleUpperCase() < b.name.toLocaleUpperCase() ? -1 : 1);
        this.temp_attendance_list = this.attendance_list;
        this.session_data = res.statistics;
      },
      (error: any) => {
        this.auth.hideLoader();
        this.appC.popToast({ type: "error", body: error.error.message })
      }
    )
  }

  searchDatabase(){   // quick search
    this.attendance_list = this.temp_attendance_list;
    if (this.searchInput == undefined || this.searchInput == null) {
      this.searchInput = "";
    }
    else {
      let searchData = this.temp_attendance_list.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchInput.toLowerCase()))
      );
      this.attendance_list = searchData;
    }
  }

  ExportAsExcel() {
    let arr = []
    this.attendance_list.map(
      (ele: any) => {
        let json = {}
        this.tableSetting.keys.map((keys) => {
          json[keys.header] = ele[keys.primaryKey]
        })
        arr.push(json);
      }
    )
    this.excelService.exportAsExcelFile(
      arr,
      'attendance_report'
    )
  }

}
