import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthenticatorService } from '../../../../../services/authenticator.service';
import { HttpService } from '../../../../../services/http.service';
import { MessageShowService } from '../../../../../services/message-show.service';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit, OnDestroy {
  editrecord: any = {
    standard_id: '',
    batch_id: '',
    course_id: '',
    requested_date: '',
    start_time: '',
    end_time: '',
    class_room_id: '',
    teacher_id: '',
    day_of_week: '',
    institute_id: sessionStorage.getItem('institute_id')
  };
  masterCourse: any = [];
  courseList: any = [];
  subjectList: any = [];
  teacherListDataSource: any = [];
  weekDaysListWithoutWeekend: any = [];
  classRoomData: any = [];
  isEdit: boolean = false;
  times: any[] = ['1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '12 AM'];
  minArr: any[] = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
  mainStartTime = {
    hour: '12 PM',
    minute: '00',
  }
  mainEndTime = {
    hour: '1 PM',
    minute: '00',
  }
  disabledFromDate: any = false;
  fromToday: any = false;
  errorsObj = {
    standard_id: '',
    batch_id: '',
    course_id: '',
    requested_date: '',
    start_time: '',
    end_time: '',
    class_room_id: '',
    teacher_id: '',
    day_of_week: '',
  }
  @ViewChild('createRoutinForm', { static: false }) createRoutinForm: NgForm;

  constructor(
    private auth: AuthenticatorService,
    private messageService: MessageShowService,
    private _httpService: HttpService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getStandard();
    this.getAllWeekDay();
    this.getAllTeacherList();
    this.getRooomDetails();
    this.checkEditData();
  }

  checkEditData() {
    let classScheduleDetails = JSON.parse(sessionStorage.getItem('classScheduleDetails'));
    if (classScheduleDetails != null) {
      this.isEdit = true;
      this.editrecord = classScheduleDetails;
      this.editrecord.subject_id = this.editrecord.batch_id;
      let today_date = moment().format('YYYY-MM-DD');
      if (moment(this.editrecord.requested_date).valueOf() < moment(today_date).valueOf()) {
        this.fromToday = true;
        this.disabledFromDate = true;
      }
      this.setTime(this.editrecord);
    }
  }

  setTime(obj: any) {
    this.mainEndTime = {
      hour: obj.end_time.split(':')[0] + " " + obj.end_time.split(':')[1].split(' ')[1],
      minute: obj.end_time.split(':')[1].split(" ")[0]
    }
    this.mainStartTime = {
      hour: obj.start_time.split(':')[0] + " " + obj.start_time.split(':')[1].split(' ')[1],
      minute: obj.start_time.split(':')[1].split(" ")[0]
    }
  }

  ngOnDestroy() {
    sessionStorage.removeItem('classScheduleDetails');
    sessionStorage.setItem('isFromCoursePlanner', String(false));
    sessionStorage.setItem('coursePlannerFilter', '');
  }

  // All day of the week
  getAllWeekDay() {
    this.auth.showLoader();
    this._httpService.getData('/api/v1/masterData/type/DAY_OF_WEEK').subscribe(
      (res: any) => {
        this.auth.hideLoader();
        for (var i = 0; i < res.length; i++) {
          if (!res[i].is_weekend) {
            this.weekDaysListWithoutWeekend.push(res[i]);
          }
        }
      },
      err => {
        this.auth.hideLoader();
        console.log(err);
      }
    )
  }

  getAllTeacherList() {
    let url = "/api/v1/teachers/teacher-list/" + sessionStorage.getItem('institute_id') + '?active=Y';
    this.auth.showLoader();
    this._httpService.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.teacherListDataSource = res.result;
      },
      err => {
        this.auth.hideLoader();
        console.log(err);
      }
    )
  }

  getStandard() {
    this.auth.showLoader();
    this._httpService.getData('/api/v1/courseMaster/standard-section-list/' + sessionStorage.getItem('institute_id') + '?is_active_not_expire=Y').subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.masterCourse = res.result;
        if (this.isEdit) {
          this.getCourseList(this.editrecord.standard_id);
        }
      },
      err => {
        this.auth.hideLoader();
        this.messageService.showErrorMessage('error', '', 'Please check your internet connection or contact at support@proctur.com if the issue persist');
      }
    )
  }

  getCourseList(ev) {
    console.log(this.masterCourse);
    if (!this.isEdit) {
      this.editrecord.course_id = "";
    } else {
      this.updateSubjectList(this.editrecord.course_id);
    }
    this.editrecord.subject_id = '';
    this.courseList = [];
    let standard_obj = this.masterCourse.filter(
      (standard) => (ev == standard.standard_id)
    );
    if (standard_obj && standard_obj.length) {
      this.courseList = standard_obj[0].section_list;
    }
  }

  updateSubjectList(event) {
    let course_obj = this.courseList.filter(
      (standard) => (event == standard.course_id)
    );
    let setSectionStartDate: any = '';
    if (course_obj && course_obj.length) {
      setSectionStartDate = course_obj[0].start_date;
    }
    let today_date = moment().format('YYYY-MM-DD');
    this.disabledFromDate = true;
    if (moment(setSectionStartDate).valueOf() < moment(today_date).valueOf()) {
      this.disabledFromDate = false;
    }
    this.auth.showLoader();
    this.subjectList = [];
    const url = "/api/v1/courseMaster/fetch/courses/" + sessionStorage.getItem('institute_id') + '/' + this.editrecord.course_id;
    this._httpService.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        //console.log('Subject', res);
        this.subjectList = res.batchesList;
      },
      err => {
        this.messageService.showErrorMessage('error', '', err.error.message);
        this.auth.hideLoader();
        //console.log(err);
      }
    )
  }

  getRooomDetails() {
    this.classRoomData = [];
    this._httpService.getData('/api/v1/batchClassRoom/all/' + sessionStorage.getItem('institute_id')).subscribe(
      (res: any) => {
        this.classRoomData = res;
        if (this.isEdit) {
          let key = this.classRoomData.filter(id => (id.class_room_name == this.editrecord.class_room_id));
          this.editrecord.class_room_id = key[0].class_room_id;
        }
      },
      err => {
        console.log(err);
      }
    )
  }

  validateTimeDuration(startTime, endTime) {
    let start_Time = moment(this.breakTimeIntoHrMin(startTime.hour, startTime.minute), 'h:mma');
    let end_Time = moment(this.breakTimeIntoHrMin(endTime.hour, endTime.minute), 'h:mma');
    if (!(start_Time.isBefore(end_Time))) {
      this.messageService.showErrorMessage('info', '', "Please enter correct start and end time");
      return false;
    }
    return true;
  }

  breakTimeIntoHrMin(time, minute) {
    let hrMeri = time.split(' ');
    return hrMeri[0] + ":" + minute + hrMeri[1]
  }

  createTimeInFormat(hrMeri, minute, format) {
    let time = hrMeri.split(' ');
    if (format == "comp") {
      let t = time[0] + ":" + minute + time[1];
      return t;
    } else {
      let t = time[0] + ":" + minute + " " + time[1];
      return t;
    }
  }

  getDifference(startTime, endTime) {
    let start = moment.utc(startTime, "HH:mm");
    let end = moment.utc(endTime, "HH:mm");
    if (end.isBefore(start))
      end.add(1, 'day');
    let d: any = moment.duration(end.diff(start));
    return d._milliseconds / 60000;
  }

  saveRoutineData() {
    if (this.createRoutinForm.valid) {
      if (!this.validateTimeDuration(this.mainStartTime, this.mainEndTime))
        return;
      this.editrecord.requested_date = null;
      if (this.fromToday) {
        this.editrecord.requested_date = moment().format('YYYY-MM-DD');
      }
      let obj = {
        "institute_id": sessionStorage.getItem('institute_id'),
        "course_id": this.editrecord.course_id,
        "batch_id": this.editrecord.batch_id,
        "start_time": this.createTimeInFormat(this.mainStartTime.hour, this.mainStartTime.minute, ''),
        "end_time": this.createTimeInFormat(this.mainEndTime.hour, this.mainEndTime.minute, ''),
        "day_of_week": this.editrecord.day_of_week,
        "teacher_id": this.editrecord.teacher_id,
        "class_room_id": this.editrecord.class_room_id,
        "duration": 0,
        "requested_date": this.editrecord.requested_date
      }
      obj.duration = this.getDifference(moment(obj.start_time, 'h:mma'), moment(obj.end_time, 'h:mma'));
      this.isEdit ? this.updateData(obj) : this.createData(obj);
    } else {
      this.messageService.showErrorMessage('error', '', 'Please select required fields');
    }
  }

  createData(obj) {
    this.auth.showLoader();
    this._httpService.postData('/api//v1/courseClassSchedule/create-class-schdule', obj).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.messageService.showErrorMessage('success', '', 'schedule created successfully');
        this.backToHome();
      },
      (err: any) => {
        this.auth.hideLoader();
        let count = 0;
        if (err.error && err.error.error && err.error.error.length) {
          for (let data of err.error.error) {
            for (const key of Object.keys(this.errorsObj)) {
              if (data.onField == `${key}`) {
                count++;
                this.errorsObj[`${key}`] = data.errorMessage;
              }
            }
          }
        }
        if (count == 0) {
          this.messageService.showErrorMessage('error', '', err.error.message);
        }
      }
    )
  }

  updateData(obj) {
    this.auth.showLoader();
    this._httpService.putData('/api/v1/courseClassSchedule/update-class-schdule/' + this.editrecord.class_schedule_id, obj).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.messageService.showErrorMessage('success', '', 'schedule updated successfully');
        this.backToHome();
      },
      (err: any) => {
        this.auth.hideLoader();
        let count = 0;
        if(err.error && err.error.error && err.error.error.length) {
        for(let data of err.error.error) {
          for(const key of Object.keys(this.errorsObj)) {
            if(data.onField == `${key}`) {
              count++;
              this.errorsObj[`${key}`] = data.errorMessage;
            }
          }
        }
      }
      if(count == 0) {
        this.messageService.showErrorMessage('error','', err.error.message);
      }
      }
    )
  }

  backToHome() {
    let url = (sessionStorage.getItem('isFromCoursePlanner') == 'true') ? '/view/course/coursePlanner/class' : '/view/course/create/routine/list';
    this.router.navigate([url]);
  }

}
