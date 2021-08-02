import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { MessageShowService } from '../../../services/message-show.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import * as moment from 'moment';
import { CoursePlanner } from '../../course-module/course-planner/course-planner.model';
declare var $;

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  editrecord: any = {
    standard_id: '',
    batch_id: '-1',
    course_id: '-1',
    exam_type_id: '-1',
    date: '',
    time_to: '',
    time_from: '',
    class_room_id: '-1'
  };
  masterCourse: any = [];
  courseList: any = [];
  subjectList: any = [];
  fullResponse: any = [];
  ExamTypeData: any = [];
  classRoomData: any = [];
  filterShow: boolean = false;
  hour = ['01:00 AM', '02:00 AM', '03:00 AM', '04:00 AM', '05:00 AM', '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM', '12:00 AM'];
  // Duration filter for course planner data
  filterDateInputs = {
    thisWeek: true,
    lastWeek: false,
    thisMonth: false,
    custom: false
  };
  coursePlannerFilters: CoursePlanner = new CoursePlanner();
  coursePlannerData: any = [];  // saved course planner fetched data
  allData: any = [];  // used for pagination purpose

  // FOR PAGINATION
  pageIndex: number = 1;
  displayBatchSize: number = 20;
  totalCount: number = 0;
  sizeArr: any[] = [20, 50, 100, 150, 200, 500];
  inputElements = {
    standard_id: "-1"
  };
  isEdit: boolean = false;
  deleteData: any = {};
  marks_dist_setting: any = -1;
  times: any[] = ['1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '12 AM'];
  minArr: any[] = ['00', '15', '30', '45'];
  mainStartTime = {
    hour: '12 PM',
    minute: '00',
  }
  mainEndTime = {
    hour: '1 PM',
    minute: '00',
  }
  errorsObj={
    'standard_id': '',
    'batch_id': '',
    'course_id': '',
    'exam_type_id': '',
    'date': '',
    'exam_end_time': '',
    'exam_start_time': '',
    'room_no_id': '',
    'course_exam_date':''
  }

  constructor(
    private auth: AuthenticatorService,
    private messageService: MessageShowService,
    private _httpService: HttpService
  ) { }

  ngOnInit(): void {
    this.getData();
    this.getStandard();
    this.marks_dist_setting = sessionStorage.getItem('marks_dist_setting');
  }

  toggleAddSchedule() {
    this.clearPrevData();
    if (this.marks_dist_setting != 1 && this.marks_dist_setting != 5 && this.marks_dist_setting != 6) {
      this.getExamType();
    }
    this.getRooomDetails();
  }

  getRooomDetails() {
    this.classRoomData = [];
    this._httpService.getData('/api/v1/batchClassRoom/all/' + sessionStorage.getItem('institute_id')).subscribe(
      (res: any) => {
        this.classRoomData = res;
      },
      err => {
        console.log(err);
      }
    )
  }


  getStandard() {
    let url = "/api/v1/courseMaster/master-course-list/" + sessionStorage.getItem("institute_id") + "?is_standard_wise=true&sorted_by=course_name";
    let keys;
    this.auth.showLoader();
    this._httpService.getData(url).subscribe(
      (data: any) => {
        this.masterCourse = [];
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
          this.masterCourse.push(obj);
        }


      },
      (error: any) => {
        this.auth.hideLoader();
        console.log(error);
      }
    )
  }

  updateCourseList(ev) {
    this.courseList = [];
    let master_course_obj = this.masterCourse.filter(
      (standard) => (ev == standard.standard_id)
    );
    if (this.marks_dist_setting == 1 || this.marks_dist_setting == 5 || this.marks_dist_setting == 6) {
      this.getExamType();
    }
    if(master_course_obj && master_course_obj.length) {
    let temp = this.fullResponse[master_course_obj[0].masterCourse];
    for (let i = 0; i < temp.length; i++) {
      this.courseList.push(temp[i]);
    }
  }
  }

  updateSubjectList(event) {
    this.auth.showLoader();
    this.subjectList = [];
    const url = "/api/v1/courseMaster/fetch/courses/" + sessionStorage.getItem('institute_id') + '/' + event;
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

  getExamType() {
    this.ExamTypeData = [];
    let url = `/api/v1/courseExamSchedule/fetch-exam-type/${sessionStorage.getItem('institute_id')}?marks_type=${this.marks_dist_setting}`;
    if (this.marks_dist_setting == 1 || this.marks_dist_setting == 5 || this.marks_dist_setting == 6) {
      url = `/api/v1/courseExamSchedule/fetch-exam-type/${sessionStorage.getItem('institute_id')}?marks_type=${this.marks_dist_setting}&standard_id=${this.editrecord.standard_id}`
    }
    this._httpService.getData(url).subscribe(
      (res: any) => {
        console.log(res);
        this.ExamTypeData = res.result;
      },
      err => {
        console.log(err);
      }
    )
  }

  getDifference(startTime, endTime) {
    let start = moment.utc(startTime, "HH:mm");
    let end = moment.utc(endTime, "HH:mm");
    if (end.isBefore(start))
      end.add(1, 'day');
    let d: any = moment.duration(end.diff(start));
    return d._milliseconds / 60000;
  }

  saveData() {
    if (this.editrecord.standard_id != '-1' && this.editrecord.standard_id != '') {
      if (this.editrecord.exam_type_id != '' && this.editrecord.exam_type_id != '-1') {
        if (this.editrecord.course_id != '' && this.editrecord.course_id != '-1') {
          if (this.editrecord.batch_id != '' && this.editrecord.batch_id != '-1') {
            if (this.editrecord.date != '') {
              if (!this.validateTimeDuration(this.mainStartTime, this.mainEndTime))
                return;
              let exam_type_data = this.ExamTypeData.filter(id => (this.editrecord.exam_type_id == id.exam_type_id));
              if (exam_type_data && exam_type_data.length) {
                let exma_Date = moment(exam_type_data[0].date).format('YYYY-MM-DD');
                let create_date = moment(this.editrecord.date).format('YYYY-MM-DD');
                let today_date = moment().format('YYYY-MM-DD');
                if (moment(exma_Date).valueOf() >= moment(create_date).valueOf()) {
                  this.messageService.showErrorMessage('error', '', 'Exam schedule date must be after exam type date');
                } else if (moment(create_date).valueOf() < moment(today_date).valueOf()) {
                  this.messageService.showErrorMessage('error', '', 'Exam cannot be scheduled before current date');
                } else {
                  //let duration = this.getDifference(this.editrecord.time_from, this.editrecord.time_to);
                  let obj = {
                    "inst_id": sessionStorage.getItem('institute_id'),
                    "course_id": this.editrecord.course_id,
                    "batch_id": this.editrecord.batch_id,
                    "exam_type_id": this.editrecord.exam_type_id,
                    "course_exam_date": moment(this.editrecord.date).format('YYYY-MM-DD'),
                    "exam_start_time": this.createTimeInFormat(this.mainStartTime.hour, this.mainStartTime.minute, ''),
                    "exam_end_time": this.createTimeInFormat(this.mainEndTime.hour, this.mainEndTime.minute, ''),
                    "exam_desc": "", // String
                    "duration": 0,
                    "room_no_id": this.editrecord.class_room_id  // String
                  }
                  obj.duration = this.getDifference(moment(obj.exam_start_time, 'h:mma'), moment(obj.exam_end_time, 'h:mma'));

                  this.isEdit ? this.updateExam(obj) : this.createExam(obj);
                }
              }

            } else {
              this.messageService.showErrorMessage('error', '', 'Please select Date')
            }
          } else {
            this.messageService.showErrorMessage('error', '', 'Please select Subject')
          }
        } else {
          this.messageService.showErrorMessage('error', '', 'Please select Section')
        }
      } else {
        this.messageService.showErrorMessage('error', '', 'Please select Exam Name')
      }
    } else {
      this.messageService.showErrorMessage('error', '', 'Please select Standard')
    }
  }

  createExam(obj) {
    this.auth.showLoader();
    this._httpService.postData('/api/v1/courseExamSchedule/create-exam', obj).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.messageService.showErrorMessage('success', '', 'Exam schedule created successfully');
        $('#editCityArea').modal('hide');
        this.getData();
        this.clearPrevData();
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
  clearPrevData() {
    this.editrecord = {
      standard_id: '',
      batch_id: '-1',
      course_id: '-1',
      exam_type_id: '-1',
      date: '',
      time_to: '',
      time_from: '',
      class_room_id: '-1'
    };
    this.mainStartTime = {
      hour: '12 PM',
      minute: '00',
    }
    this.mainEndTime = {
      hour: '1 PM',
      minute: '00',
    }
    this.errorsObj={
      'standard_id': '',
      'batch_id': '',
      'course_id': '',
      'exam_type_id': '',
      'date': '',
      'exam_end_time': '',
      'exam_start_time': '',
      'room_no_id': '',
      'course_exam_date':''
    }
    this.isEdit = false;
  }

  closePopup() {
    this.editrecord = {
      standard_id: '',
      batch_id: '-1',
      course_id: '-1',
      exam_type_id: '-1',
      date: '',
      time_to: '',
      time_from: '',
      class_room_id: '-1'
    };
    this.isEdit = false;
  }

  updateExam(obj) {
    this._httpService.putData('/api/v1/courseExamSchedule/update-exam/' + this.editrecord.schedule_id, obj).subscribe(
      (res: any) => {
        this.messageService.showErrorMessage('success', '', 'Exam schedule updated successfully');
        $('#editCityArea').modal('hide');
        this.isEdit = true;
        this.getData();
        this.clearPrevData();
      },
      (err: any) => {
        console.log(err);
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

  toggleFilter() {
    this.filterShow = !this.filterShow;
  }

  openCalendar(id) {
    document.getElementById(id).click();
  }

  updateFilterDateRange(e) {
    if (this.filterDateInputs.custom) {
      this.coursePlannerFilters.from_date = moment(e[0]).format("YYYY-MM-DD");
      this.coursePlannerFilters.to_date = moment(e[1]).format("YYYY-MM-DD");
    }
    this.getData();
  }

  updateDateFilter(inputDateFilter, e) {

    this.filterDateInputs.thisWeek = false;
    this.filterDateInputs.lastWeek = false;
    this.filterDateInputs.thisMonth = false;
    this.filterDateInputs.custom = false;

    if (inputDateFilter == 'custom') {   //  Custom
      this.openCalendar('customeDate');
      this.filterDateInputs.custom = true;
      e.currentTarget.checked = true;
    }
    else if (inputDateFilter == 'lastWeek') {     // Last week
      this.coursePlannerFilters.from_date = moment().subtract(1, 'weeks').startOf('isoWeek').format("YYYY-MM-DD");
      this.coursePlannerFilters.to_date = moment().subtract(1, 'weeks').endOf('isoWeek').format("YYYY-MM-DD");
      this.filterDateInputs.lastWeek = true;
      e.currentTarget.checked = true;
      this.getData();
    }
    else if (inputDateFilter == 'thisMonth') {     // This month
      this.coursePlannerFilters.from_date = moment().format("YYYY-MM-01");
      this.coursePlannerFilters.to_date = moment().format("YYYY-MM-") + moment().daysInMonth();
      this.filterDateInputs.thisMonth = true;
      e.currentTarget.checked = true;
      this.getData();
    }
    else if (inputDateFilter == 'thisWeek') {   // This Week
      this.coursePlannerFilters.from_date = moment().isoWeekday("Monday").format("YYYY-MM-DD");
      this.coursePlannerFilters.to_date = moment().weekday(7).format("YYYY-MM-DD");
      this.filterDateInputs.thisWeek = true;
      e.currentTarget.checked = true;
      this.getData();
    }

  }

  getData() {
    this.filterShow = false;
    // this.jsonFlag.showHideColumn = false;
    this.auth.showLoader();
    let obj: any = this.coursePlannerFilters;
    obj.institute_id = sessionStorage.getItem('institute_id');
    obj.from_date = moment(obj.from_date).format("YYYY-MM-DD");
    obj.to_date = moment(obj.to_date).format("YYYY-MM-DD");
    obj.isCancelled = "Y";
    obj.isCompleted = "Y";
    obj.isMarksUpdate = "Y";
    obj.isPending = "Y";
    obj.isUpcoming = "Y";
    obj.standard_id = this.coursePlannerFilters.standard_id;
    obj.master_course_name = '';
    let url = "/api/v1/coursePlanner/category?type=exam";
    this._httpService.postData(url, obj).subscribe(
      res => {
        console.log(res)
        this.auth.hideLoader();
        this.allData = res;
        if (this.allData.length == 0) {
          this.messageService.showErrorMessage('info', '', "No result found");
        }
        else {
          this.totalCount = this.allData.length;
          this.pageIndex = 1;
          this.fectchTableDataByPage(this.pageIndex);
        }
      },
      err => {
        this.coursePlannerData = [];
        this.totalCount = 0;
        this.auth.hideLoader();
        // this.messageService.showErrorMessage('error', '', err.error.message);
      }
    );
  }


  /* Fetch previous set of data from server and update table */
  fetchPrevious() {
    this.pageIndex--;
    this.fectchTableDataByPage(this.pageIndex);
  }

  /* Fetch table data by page index */
  fectchTableDataByPage(index) {
    this.pageIndex = index;
    let startindex = this.displayBatchSize * (index - 1);
    this.coursePlannerData = this.getDataFromDataSource(startindex);
    console.log(this.coursePlannerData);
  }

  getDataFromDataSource(startindex) {
    let t = this.allData.slice(startindex, startindex + this.displayBatchSize);
    return t;
  }

  /* Fetches Data as per the user selected batch size */
  updateTableBatchSize(num) {
    this.pageIndex = 1;
    this.displayBatchSize = parseInt(num);
    this.getData();
  }

  EditExam(obj) {
    this.toggleAddSchedule();
    this.isEdit = true;
    this.editrecord = {
      standard_id: obj.standard_id,
      batch_id: obj.batch_id,
      course_id: obj.course_id,
      exam_type_id: obj.exam_type_id,
      date: obj.date,
      class_room_id: obj.room_no_id,
      schedule_id:obj.schedule_id
    };
    this.updateCourseList(this.editrecord.standard_id);
    this.updateSubjectList(this.editrecord.course_id);
    this.setTime(obj);
    $('#editCityArea').modal('show');
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

  setDeleteSchedule(obj) {
    this.deleteData = obj;
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

}
