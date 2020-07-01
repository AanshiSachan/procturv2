import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { MessageShowService } from '../../..';
import { AppComponent } from '../../../app.component';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { HttpService } from '../../../services/http.service';

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
  session_data: any;
  searchInput: any = '';

  constructor(
    private auth: AuthenticatorService,
    private router: Router,
    private appC: AppComponent,
    private route: ActivatedRoute,
    private http_service: HttpService,
    private msgService: MessageShowService
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
    this.setDemoData()
    // this.getLiveClassAttendanceReport();
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
        console.log(data)

      },
      (error: any) => {
        this.auth.hideLoader();
        this.appC.popToast({ type: "error", body: error.error.message })
      }
    )
  }


  setDemoData(){
    this.invited_attendance_list =  [{
				"id": 8,
				"user_id": 28,
				"name": "Raghvendra rathode",
				"session_id": 15314,
				"attendance_status": "PARTIALLY_PRESENT",
				"duration": "00:03:05",
				"join_time": "2020-06-30 22:20:53",
				"leave_join": "2020-06-30 22:23:58"
			},
			{
				"id": 0,
				"user_id": 17865,
				"name": "Teacher 3",
				"session_id": 15314,
				"attendance_status": "ABSENT",
				"duration": "05:30:00",
				"join_time": null,
				"leave_join": null
			},
			{
				"id": 0,
				"user_id": 26459,
				"name": "Abhishek Singh new",
				"session_id": 15314,
				"attendance_status": "ABSENT",
				"duration": "05:30:00",
				"join_time": null,
				"leave_join": null
			},
			{
				"id": 0,
				"user_id": 29068,
				"name": "agnita",
				"session_id": 15314,
				"attendance_status": "ABSENT",
				"duration": "05:30:00",
				"join_time": null,
				"leave_join": null
			}
		];

    this.guest_attendance_list = [{
				"id": 8,
				"user_id": 28,
				"name": "Raghvendra rathode",
				"session_id": 15314,
				"attendance_status": "PARTIALLY_PRESENT",
				"duration": "00:03:05",
				"join_time": "2020-06-30 22:20:53",
				"leave_join": "2020-06-30 22:23:58"
			},
			{
				"id": 0,
				"user_id": 17865,
				"name": "Teacher 3",
				"session_id": 15314,
				"attendance_status": "ABSENT",
				"duration": "05:30:00",
				"join_time": null,
				"leave_join": null
			},
			{
				"id": 0,
				"user_id": 26459,
				"name": "Abhishek Singh new",
				"session_id": 15314,
				"attendance_status": "ABSENT",
				"duration": "05:30:00",
				"join_time": null,
				"leave_join": null
			},
			{
				"id": 0,
				"user_id": 29068,
				"name": "agnita",
				"session_id": 15314,
				"attendance_status": "PRESENT",
				"duration": "05:30:00",
        "join_time": "2020-06-30 22:20:53",
				"leave_join": "2020-06-30 22:23:58"
			}
		];

    this.attendance_list = this.invited_attendance_list.concat(this.guest_attendance_list);

    this.session_data = {
      "totale_user": 15,
			"total_present": 10,
			"total_partially_present": 3,
			"total_absent": 2
    }


  }


  searchDatabase(){   // quick search
    // this.leadsList = this.tempLeadlist;
    // if (this.leadSearchInput == undefined || this.leadSearchInput == null) {
    //   this.leadSearchInput = "";
    // }
    // else {
    //   let searchData = this.tempLeadlist.filter(item =>
    //     Object.keys(item).some(
    //       k => item[k] != null && item[k].toString().toLowerCase().includes(this.leadSearchInput.toLowerCase()))
    //   );
    //   this.leadsList = searchData;
    // }
  }

}
