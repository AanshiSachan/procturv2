import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { stringify } from 'querystring';
import { AuthenticatorService } from '../../../../../services/authenticator.service';
import { HttpService } from '../../../../../services/http.service';
import { MessageShowService } from '../../../../../services/message-show.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  routineData: any = [];
  masterCourse: any = [];
  courseList: any = [];
  maxNoOfClasses: number = 0;
  maxClassArray: any[] = [];
  width:any = '20';
  filterData: any = {
    standard_id: '',
    course_id: ''
  }

  constructor(
    private _httpService: HttpService,
    private auth: AuthenticatorService,
    private messageService: MessageShowService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getStandard();
  }

  getAllRoutineData() {
    this.routineData = [];
    this.maxNoOfClasses = 0;
    this.maxClassArray = [];
    this.auth.showLoader();
    let url = `/api/v1/courseClassSchedule/fetch-class-schdule/${sessionStorage.getItem('institute_id')}/${this.filterData.course_id}`
    this._httpService.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.routineData = res.result;
        this.width = 100/this.routineData.length;
        for (var i = 0; i < this.routineData.length; i++) {
          if (this.routineData[i].schedule_list.length > this.maxNoOfClasses) {
            this.maxNoOfClasses = this.routineData[i].schedule_list.length;
          }
        }

        for (var i = 0; i < this.maxNoOfClasses; i++) {
          this.maxClassArray.push(i)
        }
        console.log(this.maxClassArray);
        console.log(this.routineData);
      },
      err => {
        this.auth.hideLoader();
        this.messageService.showErrorMessage('error', '', err.error.message);
      }
    )
  }

  getData() {
    if (this.filterData.standard_id == '' || this.filterData.course_id == '') {
      this.messageService.showErrorMessage('error', '', 'Please select mandatory fields');
    } else {
      this.getAllRoutineData();
    }
  }

  getStandard() {
    this.auth.showLoader();
    this._httpService.getData('/api/v1/courseMaster/standard-section-list/' + sessionStorage.getItem('institute_id') + '?is_active_not_expire=Y').subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.masterCourse = res.result;
      },
      err => {
        this.auth.hideLoader();
        this.messageService.showErrorMessage('error', '', 'Please check your internet connection or contact at support@proctur.com if the issue persist');
      }
    )
  }

  getCourseList(ev) {
    this.filterData.course_id = "";
    let standard_obj = this.masterCourse.filter(
      (standard) => (ev == standard.standard_id)
    );
    if (standard_obj && standard_obj.length) {
      this.courseList = standard_obj[0].section_list;
    }
  }

  editClassSchedule(obj, schedule_list) {
    console.log(obj);
    let payload = {
      "institute_id":sessionStorage.getItem('institute_id'),
      "course_id": this.filterData.course_id,
      "standard_id": this.filterData.standard_id,
      "batch_id":schedule_list.batch_id,
      "start_time": schedule_list.start_time,
      "end_time": schedule_list.end_time,
      "day_of_week": obj.day_of_week,
      "teacher_id":schedule_list.teacher_id,
      "class_room_id":schedule_list.class_room_name,
      "class_schedule_id": schedule_list.class_schedule_id
    }
    sessionStorage.setItem('classScheduleDetails', JSON.stringify(payload));
    this.router.navigate(['/view/course/create/routine/create']);
  }

  deleteClassSchedule(obj, schedule_list) {
    if(confirm('Are you sure you want to delete schedule ?')) {
    let payload = {
      inst_id: sessionStorage.getItem('institute_id'),
      course_id: this.filterData.course_id,
      batch_id: schedule_list.batch_id,
      start_time: schedule_list.start_time,
      end_time: schedule_list.end_time,
      day_of_week: obj.day_of_week
    }
    this.auth.showLoader();
    this._httpService.deleteData('/api/v1/courseClassSchedule/delete-class-schdule', payload).subscribe(
      (res:any)=>{
        this.auth.hideLoader();
        this.messageService.showErrorMessage('success','','Schedule deleted successfully');
        this.getAllRoutineData();
      },
      (err:any)=>{
        this.auth.hideLoader();
        this.messageService.showErrorMessage('error','', err.error.message);
      }
    )
    }
  }

}
